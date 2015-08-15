var UserObject = require('../models/object.js');

module.exports.create = function(req, res) {
	var user = req.params.user;
	var object = new UserObject(req.body);
	if(!req.isAuthenticated()) {
		res.statusCode = 401;
		console.log(new Date + ' | WARNING | ' + user + ' | tried to create an object without being authenticated. Redirecting.');
	}
	else {
		console.log('Create : ' + object);
		object.save(function (err, result){
			if(err) {
				console.log(new Date + ' | ERROR | ' + user + ' | was trying to create an object:\n' + object + '\n' + err);
			}
			else {
				res.json(result);
				console.log(new Date + ' | SUCCESS | ' + user + ' | created an object:\n' + result);
			}
		});
	}
}

module.exports.list = function(req, res) {
	var user = req.params.user;
	if(!req.isAuthenticated()) {
		res.statusCode = 401;
		console.log(new Date + ' | WARNING | ' + user + ' | tried to get his / her personal objects without being authenticated. Redirecting.');
	}
	else {
		UserObject.find({user_name: user}, function (err, results){
		if(err) {
			console.log(new Date + ' | ERROR | ' + user + ' | was trying to get his / her personal objects:\n' + err);
		}
		else {
			res.json(results);
			var idList = [];
			for(var result in results) {
				idList.push(results[result]._id);
			}
			console.log(new Date + ' | SUCCESS | ' + user + ' | got his / her ' + idList.length + ' personal objects: [' + idList + ']'); 
		}
	});
	}
}

module.exports.listPublic = function(req, res) {
	var user = req.params.user;
	if(!req.isAuthenticated()) {
		res.statusCode = 401;
		console.log(new Date + ' | WARNING | ' + user + ' | tried to get the public objects without being authenticated. Redirecting.');
	}
	else {
		UserObject.find({pub: true}, function (err, results){
			if(err) {
				console.log(new Date + ' | ERROR | ' + user + ' | was trying to get the public objects:\n' + err);
			}
			else {
				res.json(results);
				var idList = [];
				for(var result in results) {
					idList.push(results[result]._id);
				}
				console.log(new Date + ' | SUCCESS | ' + user + ' | got the ' + idList.length + ' public objects: [' + idList + ']');
			}
		});
	}
}

module.exports.delete = function(req, res) {
	var user = req.params.user;
	var objectId = req.params.objectId;
	if(!req.isAuthenticated()) {
		res.statusCode = 401;
		console.log(new Date + ' | WARNING | ' + user + ' | tried to delete an object without being authenticated. Redirecting.');
	}
	else {
		UserObject.remove({_id: objectId}, function( err, object){
			if(err) {
				console.log(new Date + ' | ERROR | ' + user + ' | was trying to delete ' + objectId);
			}
			res.json({ message: 'Succesfully deleted !' });
			console.log(new Date + ' | SUCCESS | ' + user + ' | deleted ' + objectId);
		});
	}
}

module.exports.publish = function(req, res) {
	var user = req.params.user;
	var objectId = req.params.objectId;
	if(!req.isAuthenticated()) {
		res.statusCode = 401;
		console.log(new Date + ' | WARNING | ' + user + ' | tried to publish an object without being authenticated. Redirecting.');
	}
	else {
		UserObject.update({_id: objectId},{pub: true}, function(err, numAffected) {
			if(err) {
				console.log(new Date + ' | ERROR | ' + user + ' | was trying to publish ' + objectId);
			}
			else {
				res.json({ message: 'Succesfully updated '.concat(numAffected.toString()).concat(' object(s).')});
				console.log(new Date + ' | SUCCESS | ' + user + ' | published ' + objectId);
			}
		});
	}
}