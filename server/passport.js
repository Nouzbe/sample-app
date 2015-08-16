var LocalStrategy 	= require('passport-local').Strategy,
	logger 			= require('../server/utils/logUtil.js'),
	User 			= require('../server/models/user.js');

module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	passport.use('local-signup', new LocalStrategy({
		usernameField : 'username',
		passwordField : 'password',
		passReqToCallback : true
	},
	function(req, username, password, done) {
		process.nextTick(function() {
			User.findOne({'local.username' : username}, function(err, user) {
				if(err) {
					logger.error(username, 'tried to sign up: \n' + err);
					return done(err);
				}
				if(user) {
					return done(null, false, req.flash('message', 'Username is already taken.'));
				} else {
					var newUser = new User();
					newUser.local.username = req.body.username;
					newUser.local.email = req.body.email;
					newUser.local.password = newUser.generateHash(req.body.password);

					newUser.save(function(err) {
						if(err) {
							logger.error(username, 'tried to sign up: \n' + err);
							return done(err);
						}
						logger.info(username, 'just signed up.');
						return done(null, newUser, req.flash('message', 'ok'));
					});
				}
			});
		});
	}));

	passport.use('local-login', new LocalStrategy({
		usernameField : 'username',
		passwordField : 'password',
		passReqToCallback : true
	},
	function(req, username, password, done) {
		User.findOne({'local.username': username}, function(err, user) {
			if(err) {
				logger.error(username, 'tried to log in: \n' + err);
				return done(err);
			}
			if(!user) {
				return done(null, false, req.flash('message', 'Username is unknown.'));
			}
			if(!user.validPassword(password)) {
				return done(null, false, req.flash('message', 'Wrong password.'));
			}
			logger.info(username, 'just logged in.');
			return done(null, user, req.flash('message', 'ok'));
		});
	}));
};