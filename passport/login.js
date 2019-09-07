const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bCrypt = require('bcrypt');

module.exports = passport => {
	passport.use(
		'login',
		new LocalStrategy(
			{
				passReqToCallback: true
			},
			(req, username, password, done) => {
				User.findOne({ username: username }, (err, user) => {
					if (err) return done(err);
					if (!user) {
						return done(null, false, req.flash('warning', 'User Not found.'));
					}
					if (!isValidPassword(user, password)) {
						return done(null, false, req.flash('warning', 'Invalid Password'));
					}

					return done(null, user);
				});
			}
		)
	);

	const isValidPassword = (user, password) => {
		return bCrypt.compareSync(password, user.password);
	};
};
