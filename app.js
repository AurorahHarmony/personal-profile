//Require libraries
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//Express configuration
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(
	bodyParser.urlencoded({
		extended: true
	})
);

//Connect to Mongo
mongoose.connect(process.env.MONGO, { useNewUrlParser: true });

//Mongoose Schema
const userSchema = new mongoose.Schema({
	username: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true }
});

//Mongoose Model
const User = new mongoose.model('User', userSchema);

//Global Constants
const serverPort = process.env.PORT || 3000;
const websiteName = 'Profiler:';
//Routes
app.get('/', (req, res) => {
	res.render('home');
});

//--Register--
app.route('/register')
	.get((req, res) => {
		res.render('register', { pageName: `${websiteName} Register` });
	})
	.post((req, res) => {
		const user = new User({
			username: req.body.username,
			email: req.body.email,
			password: req.body.password
		});
		user.save((err) => {
			if (err) {
				console.log(err);
				res.sendStatus(500);
				return;
			}
			res.sendStatus(200);

		})
	});
//--Login--
app
	.route('/login')
	.get((req, res) => {
		res.render('login', { pageName: `${websiteName} Login` });
	})
	.post((req, res) => {
		console.log(req.body);
		// res.redirect('/login');
		res.send(req.body);
	});

//Open listening port for server requests
app.listen(serverPort, err => {
	console.log(`Server has started on port ${serverPort}`);
});
