var mongoose = require('mongoose');

module.exports = mongoose.model('Object', {
	name: String,
	user_name: String,
	pub: Boolean
});