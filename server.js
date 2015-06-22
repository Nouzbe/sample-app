var express 			= require('express'),
	app 				= express(),
	bodyParser 			= require('body-parser'),
	mongoose			= require('mongoose'),
	meetupController 	= require('./server/controllers/meetup-controller');

mongoose.connect('mongodb://localhost:27017/mean-demo');

app.use(bodyParser());

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/client/views/index.html');
});

app.use('/js', express.static(__dirname + '/client/js'));

app.post('/api/meetups', meetupController.create);
app.get('/api/meetups', meetupController.list);

app.listen(3000, function() {
	console.log('I\'m listening.')
})