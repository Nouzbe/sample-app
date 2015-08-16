var fileSystem = require('fs');

var createLogLine = function(severity, user, message) {
	if(user != null) {
		return new Date + ' | ' + severity + ' | ' + user + ' | ' + message;
	}
	else {
		return new Date + ' | ' + severity + ' | ' + message;
	}
}

var log = function(severity, user, message) {
	var logLine = createLogLine(severity, user, message);
	var date = new Date();
	var currentHour = date.getDate() + '-' + (date.getMonth() + 1).toString() + '-' + date.getFullYear() + '-' + date.getHours();
	fileSystem.appendFile('./server/logs/sample-app-' + currentHour + '.log', logLine + '\n', function(err) {
		if(err) {
			console.log(new Date + ' | INTERNAL ERROR | Impossible to retrieve log file:\n' + err);
		}
	})
	console.log(logLine);
}

module.exports.internalInfo = function(message) {
	log('INTERNAL INFO', null, message);
}

module.exports.internalWarning = function(message) {
	log('INTERNAL WARNING', null, message);
}

module.exports.internalError = function(message) {
	log('INTERNAL ERROR', null, message);
}

module.exports.info = function(user, message) {
	log('INFO', user, message);
}

module.exports.warning = function(user, message) {
	log('WARNING', user, message);
}

module.exports.error = function(user, message) {
	log('ERROR', user, message);
}