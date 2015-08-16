var User 		= require('../models/user.js'),
	UserObject  = require('../models/object.js'),
	configUtil 	= require('../utils/configUtil.js'),
	logger 		= require('../utils/logUtil.js'),
	util 		= require('../utils/util.js');

module.exports.forgotPassword = function(req, res, transporter) {
	var username = req.params.user;
	var user = new User();
	newOne = Math.random().toString(36).substring(6);
	var newHash = user.generateHash(newOne);
	
	User.update({'local.username': username},{'local.password': newHash}, function(err, numAffected) {
		if(err) {
			logger.error(username, 'was trying to reset his / her password:\n' + err);
			res.send(err);
		}
		if(numAffected.n == 1) {
			User.findOne({'local.username': username}, function (err, results){
				if(err) {
					logger.error(username, 'was trying to reset his / her password:\n' + err);
					res.send(err);
				}
				else {
					var mailOptions = configUtil.get('forgottenPasswordEmail');
					mailOptions.to = results._doc.local.email;
					mailOptions.text = util.fillUp(mailOptions.text, {'username': username, 'newPassword': newOne});
					transporter.sendMail(mailOptions, function(err, info){
					    if(err){
					        logger.error(username, 'was trying to reset his / her password:\n' + err);
					        res.json({message: 'ko: mailer issue'});
					    }
					    else{
					    	res.json({ message: 'ok' });
					        logger.info(username, 'just reset his / her password. An email was sent to him / her.');
					    }
					});
				}
			});
		} else {
			logger.error(username, 'was trying to reset his / her password but several accounts had this username. This is abnormal.');
			res.json({message: 'ko'});
		}
		
	});
}

module.exports.getProfile = function(req, res) {
	var username = req.params.user;
	if(!req.isAuthenticated()) {
		res.statusCode = 401;
		res.json({message: 'ko'});
		logger.internalWarning('Just received an unauthenticated getProfile request. Redirecting.');
	}
	else {
		User.findById(req._passport.session.user, function (err, doc){
			if(err) {
				logger.error(username, 'was trying to get his / her profile:\n' + err);
			}
			else {
				res.json({username: doc._doc.local.username, email: doc._doc.local.email});
				logger.info(username, 'got his / her profile.');
			}
		});
	}
}

module.exports.changeEmail = function(req, res) {
	var username = req.params.user;
	if(!req.isAuthenticated()) {
		res.statusCode = 401;
		res.json({message: 'ko'});
		logger.internalWarning('Just received an unauthenticated changeEmail request. Redirecting.');
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
								logger.error(username, 'was trying to change his / her email:\n' + err);
								res.send(err);
							}
							if(numAffected.n == 1) {
								res.json({ message: 'ok' });
								logger.info(username, 'changed his / her email.');
							} else {
								res.json({message: 'ko'});
								logger.error(username, 'was trying to change his / her email but several accounts had this username. This is abnormal.');
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
		logger.internalWarning('Just received an unauthenticated changePassword request. Redirecting.');
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
								logger.error(username, 'was trying to change his / her password:\n' + err);
								res.send(err);
							}
							if(numAffected.n == 1) {
								res.json({ message: 'ok' });
								logger.info(username, 'changed his / her password.');
							} else {
								res.json({message: 'ko'});
								logger.error(username, 'was trying to change his / her password but several accounts had this username. This is abnormal.');
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
		logger.internalWarning('Just received an unauthenticated deleteAccount request. Redirecting.');
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
							logger.error(username, 'was trying to delete his / her account:\n' + err);
							res.send(err);
						}
						else {
							logger.info(username, 'triggered the deletion of all his / her objects while deleting his / her account.');
							User.remove({_id: req._passport.session.user}, function(err, product) {
								if(err) {
									logger.error(username, 'was trying to delete his / her account:\n' + err);
									res.send(err);
								}
								else {
									logger.info(username, 'just deleted his / her account.');
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