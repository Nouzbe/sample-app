module.exports.login = function(req, res) {
	var object = new UserObject(req.body);
	console.log('Create : ' + object);
	object.save(function (err, result){
		res.json(result);
	});
}

