var express 			= require('express'),
	app 				= express(),
	bodyParser 			= require('body-parser'),
	mongoose			= require('mongoose'),
	meetupController 	= require('./server/controllers/meetup-controller');

// connect to the db
mongoose.connect('mongodb://localhost:27017/mean-demo');

// instantiate bodyParser (that we use to parse http bodies)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// the client app has access to the client directory
app.use(express.static(__dirname+'/client'));

// REST interface
app.post('/api/meetups', meetupController.create);
app.get('/api/meetups', meetupController.list);
app.delete('/api/meetup/:id', meetupController.delete);

// If the url is not part of the REST API, Express delivers index.html and from there on ngRoute is the boss
app.get('*', function (req, res) {
	res.sendFile(__dirname + '/client/views/index.html');
});

// let's start the server app for real
app.listen(3000, function() {
	console.log('I\'m listening.')
})

