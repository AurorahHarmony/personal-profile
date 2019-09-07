//Require libraries
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bCrypt = require('bcrypt');
const session = require('express-session');
const flash = require('req-flash');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const LocalStrategy = require('passport-local').Strategy;
// const findOrCreate = require('mongoose-findorcreate');

//Express configuration
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(
	bodyParser.urlencoded({
		extended: true
	})
);
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false
	})
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//Connect to Mongo
mongoose.connect(process.env.MONGO, { useNewUrlParser: true });

//Mongoose Schemas
const userSchema = new mongoose.Schema({
	username: String,
	email: String,
	password: String,
	name: String,
	gender: String
});
userSchema.plugin(passportLocalMongoose);
// userSchema.plugin(findOrCreate);

//Mongoose Models
const User = new mongoose.model('User', userSchema);

//Passport Strategies
passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});

//--Register Strategy--
passport.use(
	'register',
	new LocalStrategy(
		{
			passReqToCallback: true
		},
		function(req, username, password, done) {
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

//--Login Strategy--
passport.use(
	'login',
	new LocalStrategy(
		{
			passReqToCallback: true
		},
		function(req, username, password, done) {
			User.findOne({ username: username }, function(err, user) {
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
//Global Constants
const serverPort = process.env.PORT || 3000;

//Routes
const routes = require('./routes/index')(passport);
app.use('/', routes);

//Open listening port for server requests
app.listen(serverPort, err => {
	console.log(`Server has started on port ${serverPort}`);
});
