module.exports.isEmpty = function(obj) {
	if (obj == null) return true;
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }
    return true;
}

module.exports.fillUp = function(string, dict) {
	var ret = string;
	if(dict != null) {
		for(key in dict) {
			ret = ret.replace('{' + key + '}', dict[key]);
		}
	}
	return ret;
}