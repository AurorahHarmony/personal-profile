const express = require('express');
const router = express.Router();

//request authentication check
const isAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) return next();
	res.redirect('/login');
};

//Routes
module.exports = passport => {
	//Dashboard
	router.get('/dashboard', (req, res) => {
		res.setHeader('type', 'html');
		res.render('partials/dashboard/dash');
	});
	//Account Settings
	router.get('/account-settings', (req, res) => {
		res.setHeader('type', 'html');
		res.render('partials/dashboard/account-settings');
	});

	return router;
};
