function persist(name, data) {
    var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, name);
    file.write(data);
}

function loadLocal(name) {
    var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, name);
    var data = file.read();
    return data;
}

function localExists(name) {
    var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, name);
    return file.exists();
}

function getFile(name) {
    return Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, name);
}

exports.save = persist;
exports.exists = localExists;
exports.load = loadLocal;
exports.get = getFile;
