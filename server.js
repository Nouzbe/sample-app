var express 			= require('express'),
	app 				= express(),
	bodyParser 			= require('body-parser'),
	cookieParser 		= require('cookie-parser'),
	mongoose			= require('mongoose'),
	config 				= require('./configuration/configuration.js'),
	passport 			= require('passport'),
	flash				= require('connect-flash'),
	session 			= require('express-session'),
	meetupController 	= require('./server/controllers/meetup-controller');

// connect to the db
mongoose.connect(config.db);

app.use(cookieParser());
// http bodies parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
//required for passport
app.use(session({secret: 'bamtechnologies'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
require('./configuration/passport')(passport);

// the client app has access to the client directory
app.use(express.static(__dirname+'/client'));

// REST interface
// meetups
app.post('/api/meetups', meetupController.create);
app.get('/api/meetups', meetupController.list);
app.delete('/api/meetup/:id', meetupController.delete);
// users
app.post('/api/register', passport.authenticate('local-signup', {
	successRedirect : '/client/views/index.html',
	failureRedirect : '/client/views/index.html'
}));
app.post('/api/login', passport.authenticate('local-login', {
	successRedirect : '/client/views/index.html',
	failureRedirect : '/client/views/index.html'
}));

// If the url is not part of the REST API, Express delivers index.html and from there on ngRoute is the boss
app.get('*', function (req, res) {
	res.sendFile(__dirname + '/client/views/index.html');
});

// let's start the server app for real
app.listen(3000, function() {
	console.log('I\'m listening.')
})

