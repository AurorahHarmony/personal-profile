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
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

//Passport Configuration
const passport = require('passport');
const session = require('express-session');

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

//Initalize flasher so that it can be stored in session data
const flash = require('req-flash');
app.use(flash());

//Initialize Passport
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
