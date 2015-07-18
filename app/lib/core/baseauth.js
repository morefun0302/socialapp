function getCredentialsHeader(username, password){
    var toHash = username+':'+password;
    return 'Basic ' + Ti.Utils.base64encode(toHash);
}

exports.getCredentialsHeader = getCredentialsHeader;
