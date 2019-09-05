const express = require('express');

const app = express();

app.get('/', (req, res) => {
	res.send('Hello World');
});

app.listen(3000, err => {
	console.log('Server has started on port 3000');
});
