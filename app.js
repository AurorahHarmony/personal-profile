//Require libraries
require('dotenv').config();
const express = require('express');

//Express configuration
const app = express();

app.get('/', (req, res) => {
	res.send('Hello World');
});

//Open listening port for server requests
app.listen(process.env.PORT, err => {
	console.log(`Server has started on port ${process.env.PORT}`);
});
