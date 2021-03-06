var express 			= require('express'),
	app 				= express(),
	bodyParser 			= require('body-parser'),
	cookieParser 		= require('cookie-parser'),
	mongoose			= require('mongoose'),
	passport 			= require('passport'),
	flash 				= require('connect-flash'),
	session 			= require('express-session'),
	nodemailer 			= require('nodemailer'),
	objectService	 	= require('./server/services/objectService'),
	profileService 		= require('./server/services/profileService'),
	configUtil    		= require('./server/utils/configUtil'),
	logger				= require('./server/utils/logUtil');

// load the configuration
configUtil.loadConfig();

// connect to the db
mongoose.connect(configUtil.get('db'));

app.use(cookieParser());
// http bodies parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
// passport configuration (sign up / login)
app.use(session(configUtil.get('passport')));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
require('./server/passport')(passport);

// mailer setup
var transporter = nodemailer.createTransport(configUtil.get('mailer'));

// giving the client visibility over the client directory
app.use(express.static(__dirname+'/client'));

// REST interface
// passport
app.post('/api/register', passport.authenticate('local-signup', {
	successRedirect : '/client/views/index.html',
	failureRedirect : '/client/views/index.html'
}));
app.post('/api/login', passport.authenticate('local-login', {
	successRedirect : '/client/views/index.html',
	failureRedirect : '/client/views/index.html'
}));
app.get('/api/isloggedin', function(req, res) {
	if(req.isAuthenticated()) {
		res.send(req.user);
	}
	else {
		logger.internalWarning('Just received an unauthenticated request. Redirecting.');
		res.send('0');
	}
});
app.get('/api/logout/:user', function (req, res){
	logger.info(req.params.user, 'just logged out.');
  	req.session.destroy(function (err) {
    res.redirect('/');
  });
});
// objects
app.post('/api/object/:user', objectService.create);
app.get('/api/object/:user', objectService.list);
app.get('/api/object/publish/:user/:objectId', objectService.publish);
app.delete('/api/object/:user/:objectId', objectService.delete);
app.get('/api/public/object/:user', objectService.listPublic);

// profiles
app.get('/api/forgotPassword/:user', function(req, res) {
	profileService.forgotPassword(req, res, transporter);
});
app.get('/api/profile/:user', profileService.getProfile);
app.put('/api/profile/changeemail/:user', profileService.changeEmail);
app.put('/api/profile/changepassword/:user', profileService.changePassword);
app.post('/api/profile/deleteAccount/:user', profileService.deleteAccount);

// If the url is not part of the REST API, Express delivers index.html and from there on ngRoute is the boss
app.get('*', function (req, res) {
	res.header('Message', req.flash('message'));
	res.sendFile(__dirname + '/client/views/index.html');
});

// Once set up, the server should listen to the given port.
app.listen(configUtil.get('port'), function() {
	logger.internalInfo('Your node server just started up. It is currently listening on port ' + configUtil.get('port') + '.');
	// reloading the configuration frequently
	setInterval(function() {
		configUtil.loadConfig();
	}, 5*60*1000);
})

