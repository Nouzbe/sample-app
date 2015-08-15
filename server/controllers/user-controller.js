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
		if(err) {
			res.send(err);
		}
		if(numAffected.n == 1) {
			User.findOne({'local.username': username}, function (err, results){
				if(err) {
					console.log(new Date + ' | ERROR | ' + username + ' | was trying to reset his / her password:\n' + err);
					res.send(err);
				}
				var mailOptions = {
				    from: '<yourMailerAdress>',
				    to: results._doc.local.email,
				    subject: 'Your new sample-app credentials',
				    text: 'Hi ' + username + ',\n\nWe wanted to tell you that your password has been succesfully reset. You can now login using the following:\n' + newOne + '\n\nCheers !\n\nThe sample-app team.',
				};
				transporter.sendMail(mailOptions, function(err, info){
				    if(err){
				        console.log(new Date + ' | ERROR | ' + username + ' | was trying to reset his / her password:\n' + err);
				        res.json({message: 'ko: mailer issue'});
				    }
				    else{
				    	res.json({ message: 'ok' });
				        console.log(new Date + ' | SUCCESS | ' + username + ' | just reset his / her password. An email was just sent to him / her.');
				    }
				});
			});
		} else {
			console.log(new Date + ' | ERROR | ' + username + ' | was trying to reset his / her password:\n' + err);
			res.json({message: 'ko'});
		}
		
	});
}

module.exports.getProfile = function(req, res) {
	var username = req.params.user;
	if(!req.isAuthenticated()) {
		res.statusCode = 401;
		res.json({message: 'ko'});
		console.log(new Date + ' | WARNING | ' + username + ' | tried to get his / her profile without being authenticated. Redirecting.');
	}
	else {
		User.findById(req._passport.session.user, function (err, doc){
			if(err) {
				console.log(new Date + ' | ERROR | ' + username + ' | was trying to get his / her profile:\n' + err);
			}
			else {
				res.json({username: doc._doc.local.username, email: doc._doc.local.email});
				console.log(new Date + ' | SUCCESS | ' + username + ' | got his / her profile.');
			}
		});
	}
}

module.exports.changeEmail = function(req, res) {
	var username = req.params.user;
	if(!req.isAuthenticated()) {
		res.statusCode = 401;
		res.json({message: 'ko'});
		console.log(new Date + ' | WARNING | ' + username + ' | tried to change his / her email without being authenticated. Redirecting.');
	}
	else {
		var givenPassword = req.body.password;
		var newEmail = req.body.email;
		User.findById(req._passport.session.user, function(err, results) {
				if(err) {
					res.send(err);
				}
				else {
					username = results._doc.local.username;
					var user = new User();
					user.local.password =  results._doc.local.password;
					if(user.validPassword(givenPassword)) {
						User.update({'local.username': username},{'local.email': newEmail}, function(err, numAffected) {
							if(err){
								console.log(new Date + ' | ERROR | ' + username + ' | was trying to change his / her email:\n' + err);
								res.send(err);
							}
							if(numAffected.n == 1) {
								res.json({ message: 'ok' });
								console.log(new Date + ' | SUCCESS | ' + username + ' | changed his / her email.');
							} else {
								res.json({message: 'ko'});
								console.log(new Date + ' | ERROR | ' + username + ' | was trying to change his / her email but several accounts had this username. This is abnormal.');
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
	var username = req.params.user;
	if(!req.isAuthenticated()) {
		res.statusCode = 401;
		res.json({message: 'ko: you are not authenticated.'});
		console.log(new Date + ' | WARNING | ' + username + ' | tried to change his / her email without being authenticated. Redirecting.');
	}
	else {
		var givenPassword = req.body.password;
	 	var newHash = new User().generateHash(req.body.newPassword); 
		User.findById(req._passport.session.user, function(err, results) {
				if(err)
					res.send(err);
				else {
					username = results._doc.local.username;
					var user = new User();
					user.local.password =  results._doc.local.password;
					if(user.validPassword(givenPassword)) {
						User.update({'local.username': username},{'local.password': newHash}, function(err, numAffected) {
							if(err){
								console.log(new Date + ' | ERROR | ' + username + ' | was trying to change his / her password:\n' + err);
								res.send(err);
							}
							if(numAffected.n == 1) {
								res.json({ message: 'ok' });
								console.log(new Date + ' | SUCCESS | ' + username + ' | changed his / her password.');
							} else {
								res.json({message: 'ko'});
								console.log(new Date + ' | ERROR | ' + username + ' | was trying to change his / her password but several accounts had this username. This is abnormal.');
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
	var username = req.params.user;
	if(!req.isAuthenticated()) {
		res.statusCode = 401;
		res.json({message: 'ko: you are not authenticated.'});
		console.log(new Date + ' | WARNING | ' + username + ' | tried to delete his / her account without being authenticated. Redirecting.');
	}
	else {
		var givenPassword = req.body.password;
		User.findById(req._passport.session.user, function(err, results) {
			if(err) {
				res.send(err)
			}
			else {
				username = results._doc.local.username;
				var user = new User();
				user.local.password =  results._doc.local.password;
				if(user.validPassword(givenPassword)) {
					UserObject.remove({user_name: username}, function(err, product) {
						if(err) {
							console.log(new Date + ' | ERROR | ' + username + ' | was trying to delete his / her account:\n' + err);
							res.send(err);
						}
						else {
							console.log(new Date + ' | SUCCESS | ' + username + ' | triggered the deletion of all his / her objects while deleting his / her account.');
							User.remove({_id: req._passport.session.user}, function(err, product) {
								if(err) {
									console.log(new Date + ' | ERROR | ' + username + ' | was trying to delete his / her account:\n' + err);
									res.send(err);
								}
								else {
									console.log(new Date + ' | SUCCESS | ' + username + ' | just deleted his / her account.');
								}
							})
						}
					})
					res.json({message: 'ok'});
				} else {
					res.json({message: 'ko: wrong password.'});
				}
			}
		});
	}
}