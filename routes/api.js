const express = require('express');
const router = express.Router();

//request authentication check
const isAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) return next();
	res.redirect('/login');
};

//Routes
module.exports = passport => {
	router.get('/modal', (req, res) => {
		const response = {
			title: 'Modal Test Response (/api/modal)',
			body: [{ type: 'html', html: '<b>THIS</b> is a response in nothing but html.' }, { type: 'input', input: { type: 'text', defaultText: 'And this is a text box' } }],
			buttons: [{ class: 'is-danger', text: 'Buttons' }, { class: 'is-warning', text: 'can' }, { class: 'is-info', text: 'be' }, { class: 'is-success', text: 'coloured' }, { class: 'is-primary', text: 'Or Have A Link!' }]
		};
		res.send(response);
	});

	return router;
};
