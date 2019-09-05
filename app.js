//Require libraries
require('dotenv').config();
const express = require('express');

//Express configuration
const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.send('Hello World');
});

app
	.route('/login')
	.get((req, res) => {
		res.render('login');
	})
	.post((req, res) => {
		res.redirect('/login');
	});

//Open listening port for server requests
app.listen(process.env.PORT, err => {
	console.log(`Server has started on port ${process.env.PORT}`);
});
