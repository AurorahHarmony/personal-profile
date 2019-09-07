const express = require('express');
const router = express.Router();

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

	//--Register--
	router.get('/register', (req, res) => {
		res.render('register', { pageName: `${websiteName} Register`, warning: req.flash('warning') });
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
	router
		.route('/profile')
		.get(isAuthenticated, (req, res) => {
			res.render('profile', { pageName: `${websiteName} Settings`, username: req.user.username });
		})
		.post((req, res) => {});

	router.get('/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	});

	return router;
};
