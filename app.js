//Require libraries
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');

//Express configuration
const app = express();

app.use(express.static('public'));
app.use(
	bodyParser.urlencoded({
		extended: true
	})
);
app.set('view engine', 'ejs');

//Global Constants
const serverPort = process.env.PORT || 3000;
const websiteName = 'Profiler:';
//Routes
app.get('/', (req, res) => {
	res.send('Hello World');
});

app
	.route('/login')
	.get((req, res) => {
		res.render('login', { pageName: `${websiteName} Login` });
	})
	.post((req, res) => {
		console.log(req.body);
		res.redirect('/login');
	});

//Open listening port for server requests
app.listen(serverPort, err => {
	console.log(`Server has started on port ${serverPort}`);
});
