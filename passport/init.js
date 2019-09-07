const login = require('./login');
const register = require('./register');
const User = require('../models/user');

module.exports = passport => {
	passport.serializeUser((user, done) => {
		done(null, user._id);
	});

	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
			done(err, user);
		});
	});

	login(passport);
	register(passport);
};
