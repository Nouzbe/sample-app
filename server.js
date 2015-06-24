var express 			= require('express'),
	app 				= express(),
	bodyParser 			= require('body-parser'),
	mongoose			= require('mongoose'),
	meetupController 	= require('./server/controllers/meetup-controller');

mongoose.connect('mongodb://localhost:27017/mean-demo');

app.use(bodyParser());

app.use(express.static(__dirname+'/client'));

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/client/views/index.html');
});

app.post('/api/meetups', meetupController.create);
app.get('/api/meetups', meetupController.list);

app.listen(3000, function() {
	console.log('I\'m listening.')
})

