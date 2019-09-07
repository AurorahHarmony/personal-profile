const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bCrypt = require('bcrypt');

module.exports = passport => {
	passport.use(
		'register',
		new LocalStrategy(
			{
				passReqToCallback: true
			},
			(req, username, password, done) => {
				findOrCreateUser = () => {
					User.findOne({ username: username }, (err, user) => {
						if (err) {
							console.log('Error in SignUp: ' + err);
							return done(err);
						}
						if (user) {
							return done(null, false, req.flash('warning', 'User Already Exists'));
						} else {
							const newUser = new User({
								username: username,
								email: req.body.email,
								password: createHash(password)
							});

							newUser.save(err => {
								if (err) {
									console.log('Error in Saving user: ' + err);
									throw err;
								}
								return done(null, newUser);
							});
						}
					});
				};

				process.nextTick(findOrCreateUser);
			}
		)
	);

	const createHash = password => {
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	};
};
