var log = Alloy.Globals.log;
var tag = '[UTILS]';
var navigation = require('navigation');

exports.getExternalStorage = function() {
	return OS_ANDROID ? Ti.Filesystem.getExternalStorageDirectory() : Ti.Filesystem.getApplicationDataDirectory();
};

function readFile(file) {
	if (!file.exists()) {
		return null;
	}

	var stream = file.open(Ti.Filesystem.MODE_READ);
	var buffer = Ti.createBuffer({
		length : 2048
	});

	var read = 0;
	var size,
	    contents = "";
	while (( size = stream.read(buffer)) > -1) {
		var tmp = buffer.toString().substr(0, size);
		read += size;
		contents += tmp;
		buffer.clear();
	}

	stream.close();
	log.write(read + " vs " + contents.length, tag);
	return contents;
};

exports.loadFile = function(file) {
	var data = readFile(file);
	return data;
};