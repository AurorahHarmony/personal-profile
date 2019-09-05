//Require libraries
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
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

passport.use(
	'register',
	new LocalStrategy(
		{
			passReqToCallback: true
		},
		function(req, username, password, done) {
			findOrCreateUser = () => {
				// find a user in Mongo with provided username
				User.findOne({ username: username }, (err, user) => {
					// In case of any error return
					if (err) {
						console.log('Error in SignUp: ' + err);
						return done(err);
					}
					// already exists
					if (user) {
						console.log('User already exists');
						return done(null, false);
					} else {
						const newUser = new User({
							username: username,
							email: req.body.email,
							password: password,
							name: req.body.name
						});

						newUser.save(err => {
							if (err) {
								console.log('Error in Saving user: ' + err);
								throw err;
							}
							console.log('User Registration succesful');
							return done(null, newUser);
						});
					}
				});
			};

			// Delay the execution of findOrCreateUser and execute
			// the method in the next tick of the event loop
			process.nextTick(findOrCreateUser);
		}
	)
);

//Global Constants
const serverPort = process.env.PORT || 3001;
const websiteName = 'Profiler:';

//Routes
//--Home--
app.get('/', (req, res) => {
	res.render('home');
});

//--Register--
app.get('/register', (req, res) => {
	res.render('register', { pageName: `${websiteName} Register` });
});

app.post(
	'/register',
	passport.authenticate('register', {
		successRedirect: '/profile',
		failureRedirect: '/register',
		failureFlash: true
	})
);
//--Login--
app
	.route('/login')
	.get((req, res) => {
		res.render('login', { pageName: `${websiteName} Login` });
	})
	.post((req, res) => {
		// res.redirect('/login');
		res.send(req.body);
	});

//--Profile Settings--
app
	.route('/profile')
	.get((req, res) => {
		if (req.isAuthenticated()) {
			User.findById(req.user.id, (err, foundUser) => {
				if (err) {
					console.log(err);
				} else {
					if (foundUser) {
						res.render('profile', { username: foundUser.username });
					}
				}
			});
		} else {
			res.redirect('/register');
		}
	})
	.post((req, res) => {});

app.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/register');
});

//Open listening port for server requests
app.listen(serverPort, err => {
	console.log(`Server has started on port ${serverPort}`);
});
