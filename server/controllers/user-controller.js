var nodemailer 	= require('nodemailer'),
	User 		= require('../models/user.js');

// mailer setup
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: '<yourMailerAdress>',
        pass: '<yourMailerPassword>'
    }
});

module.exports.forgotPassword = function(req, res) {
	var username = req.params.user;
	var user = new User();
	newOne = Math.random().toString(36).substring(6);
	var newHash = user.generateHash(newOne);
	
	User.update({'local.username': username},{'local.password': newHash}, function(err, numAffected) {
		if(err)
			res.send(err);
		if(numAffected.n == 1) {
			User.findOne({'local.username': username}, function (err, results){
				if(err)
					res.send(err);
				var mailOptions = {
				    from: '<yourMailerAdress>',
				    to: results._doc.local.email,
				    subject: 'Your new sample-app credentials',
				    text: 'Hi ' + username + ',\n\nWe wanted to tell you that your password has been succesfully reset. You can now login using the following:\n' + newOne + '\n\nCheers !\n\nThe sample-app team.',
				};
				transporter.sendMail(mailOptions, function(error, info){
				    if(error){
				        console.log(error);
				    }else{
				        console.log('Message sent: ' + info.response);
				    }
				});
			});
		res.json({ message: 'ok' });
		} else {
			console.log('An error occured during ' + username + '\'s password reset.');
			res.json({message: 'ko'});
		}
		
	});
}

module.exports.getProfile = function(req, res) {
	if(!req.isAuthenticated()) {
		res.statusCode = 401;
		res.json({message: 'ko'});
	}
	else {
		User.findById(req._passport.session.user, function (err, doc){
			res.json({username: doc._doc.local.username, email: doc._doc.local.email});
		});
	}
}

module.exports.changeEmail = function(req, res) {
	if(!req.isAuthenticated()) {
		res.statusCode = 401;
		res.json({message: 'ko'});
	}
	else {
		var username = req.params.user;
		var password = req.body.password;
		var email = req.body.email;
		User.findOne({'local.username': username}, function (err, results){
				if(err)
					res.send(err);
				else {
					var user = new User();
					user.local.username = results._doc.local.username;
					user.local.email =  results._doc.local.email;
					user.local.password =  results._doc.local.password;
					if(user.validPassword(password)) {
						User.update({'local.username': username},{'local.email': email}, function(err, numAffected) {
							if(err)
								res.send(err);
							if(numAffected.n == 1) {
								res.json({ message: 'ok' });
							} else {
								console.log('An error occured during ' + username + '\'s email update.');
								res.json({message: 'ko'});
							}
						});
					} else {
						res.json({message: 'ko: wrong password.'});
					}
				}
			});
	}
}

module.exports.changePassword = function(req, res) {
	if(!req.isAuthenticated()) {
		res.statusCode = 401;
		res.json({message: 'ko: this action requires a session.'});
	}
	else {
		var username = req.params.user;
		var password = req.body.password;
	 	var newHash = new User().generateHash(req.body.newPassword); 
		User.findOne({'local.username': username}, function (err, results){
				if(err)
					res.send(err);
				else {
					var user = new User();
					user.local.username = results._doc.local.username;
					user.local.email =  results._doc.local.email;
					user.local.password =  results._doc.local.password;
					if(user.validPassword(password)) {
						User.update({'local.username': username},{'local.password': newHash}, function(err, numAffected) {
							if(err)
								res.send(err);
							if(numAffected.n == 1) {
								res.json({ message: 'ok' });
							} else {
								console.log('An error occured during ' + username + '\'s password update.');
								res.json({message: 'ko'});
							}
						});
					} else {
						res.json({message: 'ko: wrong password.'});
					}
				}
			});
	}
}

module.exports.deleteAccount = function(req, res) {
	if(!req.isAuthenticated()) {
		res.statusCode = 401;
		res.json({message: 'ko'});
	}
	else {
	}
}