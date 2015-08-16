var UserObject 	= require('../models/object.js'),
	logger 		= require('../utils/logUtil.js');

module.exports.create = function(req, res) {
	var user = req.params.user;
	var object = new UserObject(req.body);
	if(!req.isAuthenticated()) {
		res.statusCode = 401;
		logger.internalWarning('Just received an unauthenticated createObject request. Redirecting.');
	}
	else {
		object.save(function (err, result){
			if(err) {
				logger.error(user, 'was trying to create an object:\n' + object + '\n' + err);
			}
			else {
				res.json(result);
				logger.info(user, 'created an object:\n' + result);
			}
		});
	}
}

module.exports.list = function(req, res) {
	var user = req.params.user;
	if(!req.isAuthenticated()) {
		res.statusCode = 401;
		logger.internalWarning('Just received an unauthenticated listPersonalObjects request. Redirecting.');
	}
	else {
		UserObject.find({user_name: user}, function (err, results){
		if(err) {
			logger.error(user, 'was trying to get his / her personal objects:\n' + err);
		}
		else {
			res.json(results);
			var idList = [];
			for(var result in results) {
				idList.push(results[result]._id);
			}
			logger.info(user, 'got his / her ' + idList.length + ' personal objects: [' + idList + ']'); 
		}
	});
	}
}

module.exports.listPublic = function(req, res) {
	var user = req.params.user;
	if(!req.isAuthenticated()) {
		res.statusCode = 401;
		logger.internalWarning('Just received an unauthenticated listPublicObjects request. Redirecting.');
	}
	else {
		UserObject.find({pub: true}, function (err, results){
			if(err) {
				logger.erro(user, 'was trying to get the public objects:\n' + err);
			}
			else {
				res.json(results);
				var idList = [];
				for(var result in results) {
					idList.push(results[result]._id);
				}
				logger.info(user, 'got the ' + idList.length + ' public objects: [' + idList + ']');
			}
		});
	}
}

module.exports.delete = function(req, res) {
	var user = req.params.user;
	var objectId = req.params.objectId;
	if(!req.isAuthenticated()) {
		res.statusCode = 401;
		logger.internalWarning('Just received an unauthenticated deleteObject request. Redirecting.');
	}
	else {
		UserObject.remove({_id: objectId}, function( err, object){
			if(err) {
				logger.error(user, 'was trying to delete ' + objectId);
			}
			res.json({ message: 'Succesfully deleted !' });
			logger.info(user, 'deleted ' + objectId);
		});
	}
}

module.exports.publish = function(req, res) {
	var user = req.params.user;
	var objectId = req.params.objectId;
	if(!req.isAuthenticated()) {
		res.statusCode = 401;
		logger.internalWarning('Just received an unauthenticated publishObject request. Redirecting.');
	}
	else {
		UserObject.update({_id: objectId},{pub: true}, function(err, numAffected) {
			if(err) {
				logger.error(user, 'was trying to publish ' + objectId);
			}
			else {
				res.json({ message: 'Succesfully updated '.concat(numAffected.toString()).concat(' object(s).')});
				logger.info(user, 'published ' + objectId);
			}
		});
	}
}