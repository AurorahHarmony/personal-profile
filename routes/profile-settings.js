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

	router.get('/image', (req, res) => {
		const response = {
			title: 'Profile Image',
			body: [{ type: 'html', html: 'This page lets ya change your profile image~!' }],
			buttons: [{ class: 'is-success', text: 'Save', method: 'PUT', route: '/image' }]
		};
		res.send(response);
	});

	return router;
};
