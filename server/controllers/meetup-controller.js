var Meetup = require('../models/meetup.js');

module.exports.create = function(req, res) {
	var meetup = new Meetup(req.body);
	console.log('Create : ' + meetup);
	meetup.save(function (err, result){
		res.json(result);
	});
}

module.exports.list = function(req, res) {
	Meetup.find({}, function (err, results){
		res.json(results);
	});
}

module.exports.delete = function(req, res) {
	console.log('Delete : ' + req.params.id);
	Meetup.remove({
		_id: req.params.id
	}, function( err, meetup){
		if(err)
			res.send(err);
		res.json({ message: 'Succesfully deleted !' });
	});
}