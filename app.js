//Require libraries
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
// const bCrypt = require('bcrypt');
// const LocalStrategy = require('passport-local').Strategy;
// const findOrCreate = require('mongoose-findorcreate');

//Connect to MongoDB
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true });

//Express configuration
const app = express();

app.set('view engine', 'ejs');
app.use('/src', express.static('public/src'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Passport Configuration
const passport = require('passport');
const session = require('express-session');

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

//Initalize flasher so that it can be stored in session data
const flash = require('connect-flash');
app.use(flash());

//Initialize Passport
const initPassport = require('./passport/init');
initPassport(passport);

//Global Constants
const serverPort = process.env.PORT || 3000;

//Routes
const routes = require('./routes/index')(passport);
app.use('/', routes);
const api = require('./routes/api')(passport);
app.use('/api', api);

app.get('/test', (req, res) => {
	req.flash('testMessage', 'theres a small issue my dude.');
	req.flash('moreInfo', ['some other text ye', 'blep']);
	res.redirect('/test2');
});

app.get('/test2', (req, res) => {
	res.send(req.flash());
});

//Server Error Handling
app.use((req, res, next) => {
	return res.status(404).send('Could not find the specified url. 404');
});

app.use(function(err, req, res, next) {
	return res.status(500).send('Server Error. 500');
});

//Open listening port for server requests
app.listen(serverPort, err => {
	console.log(`Server has started on port ${serverPort}`);
});
