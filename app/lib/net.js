exports.isOnline = function() {
    return Titanium.Network.getOnline();
};

exports.HttpStatus = {
    UNAUTHORIZED:401,
    TIMEOUT: 408,
    SERVICE_UNAVAILABLE: 503,
    NOT_MODIFIED: 304,
    STORE_NOT_FOUND: 1009,
    GIFTCARD_ALREADY_REGISTERED: 1019
};

exports.Method = {
    GET: "GET",
    POST: "POST"
};

exports.encode = function(str) {
    return Ti.Network.encodeURIComponent(str);
};
