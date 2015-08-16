var configuration 	= {},
	logger			= require('./logUtil.js'),
	util 			= require('./util.js');

module.exports.get = function(key) {
	if(configuration.hasOwnProperty(key)) {
		return configuration[key];
	}
	else {
		if(util.isEmpty(configuration)) {
			logger.internalError('The configuration is not loaded.');
		} 
		else {
			logger.internalError('The key : \'' + key + '\' should exist in the configuration but does not.');
		}
		return '';
	}
}

module.exports.loadConfig = function() {
	configuration = require('../../configuration.json');
	logger.internalInfo('Configuration succesfully loaded.');
}