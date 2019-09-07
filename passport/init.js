const login = require('./login');
const register = require('./register');
const User = require('../models/user');

module.exports = passport => {
	passport.serializeUser((user, done) => {
		console.log('serializing user: ');
		console.log(user);
		done(null, user._id);
	});

	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
			console.log('deserializing user:', user);
			done(err, user);
		});
	});

	login(passport);
	register(passport);
};
