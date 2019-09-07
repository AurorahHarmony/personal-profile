const express = require('express');
const route = express.Router();

//Import Mongoose Models
const User = require('../models/user');

const websiteName = 'Profiler:';

module.exports = passport => {
	//--Home--
	route.get('/', (req, res) => {
		res.render('home');
	});

	//--Register--
	route.get('/register', (req, res) => {
		res.render('register', { pageName: `${websiteName} Register`, warning: req.flash('warning') });
	});

	route.post(
		'/register',
		passport.authenticate('register', {
			successRedirect: '/profile',
			failureRedirect: '/register',
			failureFlash: true
		})
	);
	//--Login--
	route
		.route('/login')
		.get((req, res) => {
			res.render('login', { pageName: `${websiteName} Login`, warning: req.flash('warning') });
		})
		.post(
			passport.authenticate('login', {
				successRedirect: '/profile',
				failureRedirect: '/login',
				failureFlash: true
			})
		);

	//--Profile Settings--
	route
		.route('/profile')
		.get((req, res) => {
			if (req.isAuthenticated()) {
				User.findById(req.user.id, (err, foundUser) => {
					if (err) {
						console.log(err);
					} else {
						if (foundUser) {
							res.render('profile', { pageName: `${websiteName} Settings`, username: foundUser.username });
						}
					}
				});
			} else {
				res.redirect('/login');
			}
		})
		.post((req, res) => {});

	route.get('/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	});

	return route;
};
