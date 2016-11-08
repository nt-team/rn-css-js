var toCamelCase = require('to-camel-case');

var type = function (object) {
	return {}.toString.call(object).match(/\[object (.*?)\]/)[1].toLowerCase();
};

var propertiesThatMustBeStrings = ["font-weight", "fontWeight"];

module.exports = function (keys) {
	keys.forEach(function (key, index, arr) {
		var value = key.value;
		if (type(key.value) == 'string') {
			if (value == "true" || value == "false") {
				arr[index].value = value == "true";
			} else {
				value = key.value.replace(/px|em/g, '');
				if (_isNumeric(value) && propertiesThatMustBeStrings.indexOf(arr[index].key) === -1) {
					arr[index].value = parseFloat(value);
				}
			}
		}
		else if (type(key.value) == 'object') {
			for (var prop in key.value) {
				if (type(key.value[prop]) == 'string') {
					value = key.value[prop].replace(/px|em/g, '');
					if (_isNumeric(value)) {
						arr[index].value[prop] = parseInt(value);
					}
				}
			}
		}
		arr[index].key = toCamelCase(arr[index].key);
	});
};


function _isNumeric(num) {
	return !isNaN(num)
}
