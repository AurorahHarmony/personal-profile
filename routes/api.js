const express = require('express');
const router = express.Router();

//request authentication check
const isAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) return next();
	res.redirect('/login');
};

//Routes
module.exports = passport => {
	router.get('/test', (req, res) => {
		res.send('The website is working!');
	});

	return router;
};
