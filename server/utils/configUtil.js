var configuration 	= {},
	util 		= require('./util.js');

module.exports.get = function(key) {
	if(configuration.hasOwnProperty(key)) {
		return configuration[key];
	}
	else {
		if(util.isEmpty(configuration)) {
			console.log(new Date + ' | INTERNAL ERROR | The configuration is not loaded.');
		} 
		else {
			console.log(configuration.length);
			console.log(new Date + ' | INTERNAL ERROR | The key : \'' + key + '\' should exist in the configuration but does not.');
		}
		return '';
	}
}

module.exports.loadConfig = function() {
	configuration = require('../../configuration.json');
	console.log(new Date + ' | INTERNAL SUCCESS | Configuration succesfully loaded.');
}