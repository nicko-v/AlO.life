var express = require('express');

var app = express();

app.use(express.static('app/public'));
app.get('/s/(\\w+)?', function(req, res) {
	res.sendFile(__dirname + '/app/public/index.html');
});

app.listen(8080);

console.log('Server started.');