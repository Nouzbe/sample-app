var UserObject = require('../models/object.js');

module.exports.create = function(req, res) {
	var object = new UserObject(req.body);
	console.log('Create : ' + object);
	object.save(function (err, result){
		res.json(result);
	});
}

module.exports.list = function(req, res) {
	if(!req.isAuthenticated())
		res.statusCode = 401;
	else
	console.log('Getting ' + req.params.user + '\'s objects');
	UserObject.find({user_name: req.params.user}, function (err, results){
		res.json(results);
	});
}

module.exports.listPublic = function(req, res) {
	UserObject.find({pub: true}, function (err, results){
		res.json(results);
	});
}

module.exports.delete = function(req, res) {
	console.log('Delete : ' + req.params.id);
	UserObject.remove({
		_id: req.params.id
	}, function( err, object){
		if(err)
			res.send(err);
		res.json({ message: 'Succesfully deleted !' });
	});
}

// an http GET would have been enough but here's a PUT example 
module.exports.publish = function(req, res) {
	console.log('Publish : ' + req.params.id);
	var object = new UserObject(req.body);
	UserObject.update({_id: object._id},{pub: object.pub}, function(err, numAffected) {
		if(err)
			res.send(err);
		res.json({ message: 'Succesfully updated '.concat(numAffected.toString()).concat(' object(s).')});
	});
}