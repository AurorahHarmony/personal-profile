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

const initPassport = require('./passport/init');
initPassport(passport);

//Global Constants
const serverPort = process.env.PORT || 3000;

//Routes
const routes = require('./routes/index')(passport);
app.use('/', routes);

//Open listening port for server requests
app.listen(serverPort, err => {
	console.log(`Server has started on port ${serverPort}`);
});
