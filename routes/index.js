const express = require('express');
const router = express.Router();
const md5 = require('md5');

//Page template Constants
const websiteName = 'Profiler:';

//Import Mongoose Models
const User = require('../models/user');

//request authentication check
const isAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) return next();
	res.redirect('/login');
};

//Routes
module.exports = passport => {
	//--Home--
	router.get('/', (req, res) => {
		res.render('home', { pageName: `${websiteName} Let Yourself be Known` });
	});

	//--Profile Settings--
	router.get('/profile', isAuthenticated, (req, res) => {
		res.render('profile', {
			pageName: `${websiteName} Settings`,
			username: req.user.username,
			profileImage: `http://www.gravatar.com/avatar/${md5(req.user.email)}?s=400&d=identicon`
		});
	});
	router.delete('/profile', (req, res) => {
		if (req.query.deleteConfirmed === 'true') {
			let deadId = req.user.id;
			let deadName = req.user.username;
			User.deleteOne({ _id: req.user.id }, err => {
				if (!err) {
					req.flash('deadId', deadId);
					req.flash('deadName', deadName);
					res.send({ redirect: `/deleted` });
				}
			});
		} else {
			const response = {
				title: 'Delete Profile',
				body: [{ type: 'html', html: 'Are you sure you wish to delete your account? This <b>CANNOT</b> be undone.' }],
				buttons: [{ class: 'is-danger', text: 'DELETE MY ACCOUNT', method: 'DELETE', route: '/profile?deleteConfirmed=true' }]
			};
			res.send(response);
		}
	});

	//--Register--
	router.get('/register', (req, res) => {
		if (!req.isAuthenticated()) {
			res.render('register', { pageName: `${websiteName} Register`, warning: req.flash('warning') });
		} else {
			res.redirect('/profile');
		}
	});

	router.post(
		'/register',
		passport.authenticate('register', {
			successRedirect: '/profile',
			failureRedirect: '/register',
			failureFlash: true
		})
	);
	//--Login--
	router
		.route('/login')
		.get((req, res) => {
			if (!req.isAuthenticated()) {
				res.render('login', { pageName: `${websiteName} Login`, warning: req.flash('warning') });
			} else {
				res.redirect('/profile');
			}
		})
		.post(
			passport.authenticate('login', {
				successRedirect: '/profile',
				failureRedirect: '/login',
				failureFlash: true
			})
		);

	router.get('/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	});

	router.get('/deleted', (req, res) => {
		let deadId = req.flash('deadId');
		if (!Array.isArray(deadId) || deadId.length) {
			res.render('infoPage.ejs', { pageName: `${websiteName} Account Deleted`, title: `Account: <b>${deadId}</b>`, body: `with the username <b>${req.flash('deadName')}</b> has been deleted successfully` });
		} else {
			res.redirect('/');
		}
	});

	return router;
};
