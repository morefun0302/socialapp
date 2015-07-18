var client = (function(){

    var log = Alloy.Globals.log;
    var net = require('net');
    var tag = '[HTTP CLIENT]';

    function getResponse(status, responseText) {
    	log.write( "Received response : " + status, tag);
    	try {
    		var response = JSON.parse(responseText);
            log.verbose(JSON.stringify(response, null, '\t'),tag);
    	}
    	catch (ex) {
    		response = {};
    	}
    	return response;
    }

    function createClient(opts){
        var _timeout = Number(opts.timeout) || 10000;
        var _url = opts.url;
        var _method = opts.method;
        var _data = opts.data;
        var _headers = opts.headers || {};

        var _callback = opts.callback;

        var xhr = Ti.Network.createHTTPClient({
            onload: function(){
                var status = this.status;
                var text = this.responseText;
                var response = getResponse(status, text);
                _callback( {
                    success:true,
                    status: status,
                    clearText: text,
                    response: response,
                    isOnline: true,
                    isServerDown: false,
                    isUnauthorized: false
                } );
            },
            onerror: function(){
                var status = this.status;
                var responseText = this.responseText;
                var response = getResponse(status, responseText);
                var     isOnline = net.isOnline(),
                        isServerDown = (status == net.HttpStatus.TIMEOUT ||
                            status == net.HttpStatus.SERVICE_UNAVAILABLE ||
                            status == 0),
                        isUnauthorized = (status == net.HttpStatus.UNAUTHORIZED);

                _callback({
                    success:false,
                    status: status,
                    clearText: responseText,
                    response: response,
                    isOnline: isOnline,
                    isServerDown: isServerDown,
                    isUnauthorized: isUnauthorized
                });
            },
            timeout: _timeout
        });

        xhr.open(_method, _url);
        log.write('Opening client for ' + _method + ' ' + (_url), tag);

        for(var name in _headers) {
            log.info('Header: ' + name + ' : ' + _headers[name], tag);
            xhr.setRequestHeader(name, _headers[name]);
        }
        xhr.setAutoRedirect(true);
        xhr.setValidatesSecureCertificate(false);

        if (_data) {
            xhr.send(_data);
        } else {
            xhr.send();
        }
    }

    return {
        instance: createClient
    };
}());
module.exports = client;
