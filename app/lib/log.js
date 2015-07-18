function getTimestamp() {
    var dateutil = require('dateutil');
    return dateutil.getCurrentTimeFormatted();
}

function writeToLog(text, level) {
	var _level = level || 'info'; 
	Ti.API[_level](text);
}

exports.write = function(text, tag) {
    var txt = tag ? tag + ' ' + text : '[LOG] ' + text;
    writeToLog(txt);
};

exports.verbose = function(text, tag) {
    var txt = tag ? tag + ' ' + text : '[VERBOSE] ' + text;
    writeToLog(txt, 'debug');
};