var nodemailer 	= require('nodemailer'),
	User 		= require('../models/user.js'),
	UserObject  = require('../models/object.js');

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
		var userId = req.params.userId;
		var givenPassword = req.body.password;
		var newEmail = req.body.email;
		User.findById( userId, function(err, results) {
				if(err)
					res.send(err);
				else {
					var username = results._doc.local.username;
					var user = new User();
					user.local.password =  results._doc.local.password;
					if(user.validPassword(givenPassword)) {
						User.update({'local.username': username},{'local.email': newEmail}, function(err, numAffected) {
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
		res.json({message: 'ko: you are not authenticated.'});
	}
	else {
		var userId = req.params.userId;
		var givenPassword = req.body.password;
	 	var newHash = new User().generateHash(req.body.newPassword); 
		User.findById( userId, function(err, results) {
				if(err)
					res.send(err);
				else {
					var username = results._doc.local.username;
					var user = new User();
					user.local.password =  results._doc.local.password;
					if(user.validPassword(givenPassword)) {
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
		res.json({message: 'ko: you are not authenticated.'});
	}
	else {
		var userId = req.params.userId;
		var givenPassword = req.body.password;
		User.findById( userId, function(err, results) {
			if(err)
				res.send(err)
			var username = results._doc.local.username;
			var user = new User();
			user.local.password =  results._doc.local.password;
			if(user.validPassword(givenPassword)) {
				UserObject.remove({user_name: username}, function(err, product) {
					if(err) 
						res.send(err);
					console.log('Just deleted ' + username + '\'s ' + product.result.n + ' objects.');
					User.remove({_id: userId}, function(err, product) {
						if(err) 
							res.send(err);
							console.log('Just deleted ' + username + '\'s account.');
					})
				})
				res.json({message: 'ok'});
			} else {
				res.json({message: 'ko: wrong password.'});
			}
		});
	}
}