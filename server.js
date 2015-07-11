var express 			= require('express'),
	app 				= express(),
	bodyParser 			= require('body-parser'),
	cookieParser 		= require('cookie-parser'),
	mongoose			= require('mongoose'),
	passport 			= require('passport'),
	flash 				= require('connect-flash'),
	session 			= require('express-session'),
	objectController 	= require('./server/controllers/object-controller');

// connect to the db
mongoose.connect('mongodb://localhost:27017/mean-demo');

app.use(cookieParser());
// http bodies parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
//required for passport
app.use(session({
	secret: 'bamtechnologies',
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
require('./server/passport')(passport);

// the client app has access to the client directory
app.use(express.static(__dirname+'/client'));

// REST interface
// user objects
app.post('/api/object', objectController.create);
app.get('/api/object/:user', objectController.list);
app.put('/api/object/:id', objectController.publish)
app.delete('/api/object/:id', objectController.delete);
// public objects
app.get('/api/public/object', objectController.listPublic);
// users
app.post('/api/register', passport.authenticate('local-signup', {
	successRedirect : '/client/views/index.html',
	failureRedirect : '/client/views/index.html'
}));
app.post('/api/login', passport.authenticate('local-login', {
	successRedirect : '/client/views/index.html',
	failureRedirect : '/client/views/index.html'
}));
app.get('/api/isloggedin', function(req, res) {
	res.send(req.isAuthenticated() ? req.user : '0');
});
app.get('/api/logout', function (req, res){
  req.session.destroy(function (err) {
    res.redirect('/');
  });
});

// If the url is not part of the REST API, Express delivers index.html and from there on ngRoute is the boss
app.get('*', function (req, res) {
	res.header('Message', req.flash('message'));
	res.sendFile(__dirname + '/client/views/index.html');
});

// let's start the server app for real
app.listen(3000, function() {
	console.log('I\'m listening.')
})

