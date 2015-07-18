//Provides an interface with the Marketing server.
var log = Alloy.Globals.log;
var config = Alloy.Globals.Config;
var net = require('net');
var EventDispatcher = Alloy.Globals.EventDispatcher;
var surveyEndpoint = "/ws/survey/";
var questionnaireEndpoint = "/ws/questionnaire/answer";

var tag = '[HTTP]';

/**
 * Required params:
 *
 * url: The part of the url after the server url
 * method: GET or POST
 *
 * optional: timeout, onSucess, onError, onInternetDown, onServerDown, headers
 *
 * @param {Object} opts
 */
function createClient(opts) {
    var server = config.getServer();

    //extract arguments
    var timeout = Number(opts.timeout) || 5000;

    var onSuccess = opts.onSuccess || onLoadDefault;
    var onError = opts.onError || onErrorDefault;
    var onInternetDown = opts.onInternetDown || onInternetDownDefault;
    var onServerDown = opts.onServerDown || onServerDownDefault;

    var skipAuthorizationCheck = opts.skipAuthorizationCheck;
    var skipOutput = opts.skipOutput;

    var url = opts.url;
    var method = opts.method;
    var validatesSecureCertificate = Alloy.CFG.env != 'test';

    if (!url || !method)
        throw Error('Trying to create an HTTP client without specifying a URL or an HTTP method');

    var xhr = Ti.Network.createHTTPClient({
        onload: function() {
            var status = this.status;
            logResult(false, status);

            var response =
                (status == net.HttpStatus.NOT_MODIFIED) ? {} :
                getResponse(this, skipOutput);

            var eTag = this.getResponseHeader('ETag');

            onSuccess(status, response, eTag);
        },
        onerror: function() {
            var status = this.status;
            var response = this.responseText;
            var meta;
            logResult(true, status);

            if (!net.isOnline()) {
                onInternetDown(status, response);
                return;
            }

            if (!skipAuthorizationCheck && status == net.HttpStatus.UNAUTHORIZED) {
                log.write('User is found to be unauthorized. Deleting their data.', tag);
                var auth = require('auth');
                auth.deauthorize(true);
            }

            if (status == net.HttpStatus.TIMEOUT ||
                status == net.HttpStatus.SERVICE_UNAVAILABLE ||
                status == 0) {
                onServerDown(status, response);
                return;
            }

            if (status == net.HttpStatus.NOT_MODIFIED) {
                var response = {};
                var eTag = this.getResponseHeader('ETag');
                onSuccess(status, response, eTag);
                return;
            }

            try {
                meta = JSON.parse(response).meta;
            } catch (e) {
                log.write('Response was not parsable.', tag);
            }

            onError(status, response, meta);
        },
        timeout: timeout
    });
    xhr.autoRedirect = true;
    xhr.validatesSecureCertificate = validatesSecureCertificate;

    var serverURL = opts.serverUrl || server;
    xhr.open(method, serverURL + url);
    log.write('Opening client for ' + method + ' ' + (serverURL + url), tag);

    var headers = _.defaults(opts.headers || {}, getDefaultHeaders());
    for(var name in headers) {
        log.info('Header: ' + name + ' : ' + headers[name], tag);
        xhr.setRequestHeader(name, headers[name]);
    }

    return xhr;
}

function getGiftserverURL() {
    return config.getGiftServerUrl();
}

function getResponse(client, skipOutput) {
    var response;
    try {
        var parsed = JSON.parse(client.responseText);
        response = JSON.stringify(parsed.response || parsed);
        if (!skipOutput) {
            var outputText = JSON.stringify(parsed, null, '\t');
            log.verbose('Response:\n'+outputText, tag);
        }
    } catch (e) {
        response = client.getResponseData();
    }

    return response;
}

function getDefaultHeaders() {
    var user = require('user');
    var authid = (user.get() && user.get().authid) ? user.get().authid : "";
    var apiKey = config.getMarketingApiClientKey();
    var headers = {
        "merchant-id": config.getMerchant(),
        "auth-id": authid,
        "X-FTS-Api-key": apiKey
    };
    return headers;
}

function onLoadDefault(status, response, headers) {
    logResult(false, status);
    log.write(JSON.stringify(headers), tag);
}

function onErrorDefault(status, response) {
    var ui = require('ui');
    logResult(true, status);
    ui.msg(L('warning'), L('generic_error'), triggerUnexpectedResponse);
}

function onInternetDownDefault(status, response) {
    var ui = require('ui');
    logResult(true, status);
    ui.msg(L('warning'), L('internet_error'), triggerUnexpectedResponse);
}

function onServerDownDefault(status, response) {
    var ui = require('ui');
    logResult(true, status);
    ui.msg(L('warning'), L('server_error'), triggerUnexpectedResponse);
}

function triggerUnexpectedResponse() {
    EventDispatcher.trigger(EventDispatcher.get('Events').UNEXPECTED_API_RESPONSE);
}

function logResult(isError, status) {
    var prefix = isError ? 'API ERROR ' : 'API SUCCESS ';
    log.write(prefix + 'Status: ' + status, tag);
}

exports.printError = function(response, msg) {
    var meta;
    var ui = require('ui');
    try {
        meta = JSON.parse(response).meta;
        var err = msg || meta.info || meta.error;
        ui.msg(L('warning'), err);
    } catch (e) {
        ui.msg(L('warning'), L('generic_error'));
    }
};

exports.getStores = function(onSuccess, onError, onInternetDown, onServerDown) {
    var hash = Ti.App.Properties.getString(Alloy.CFG.constants.eTag) || '"0"';
    createClient({
        method:"GET",
        url:"/rest/v2/merchants/stores",
        onSuccess: onSuccess,
        onError: onError,
        onInternetDown: onInternetDown,
        onServerDown: onServerDown,
        headers: getDefaultHeaders()
    }).send();
};

exports.login = function(opts) {
    createClient({
        method: "POST",
        url:"/rest/v2/auth/login",
        onSuccess:opts.onSuccess,
        onError:opts.onError,
        skipAuthorizationCheck:true
    }).send(opts.data);

};

exports.getStoreStatus = function(opts) {
    createClient({
        method: "GET",
        serverUrl: opts.storeUrl,
        url:'/ws/store/status',
        onSuccess:opts.onSuccess,
        onError:opts.onError,
        onInternetDown:opts.onError,
        onServerDown:opts.onError
    }).send();
};

exports.getLoyaltyPlan = function(opts) {
    createClient({
        method:"GET",
        url:"/rest/v2/loyalty/details",
        onSuccess:opts.onSuccess,
        onError:opts.onError,
        onInternetDown: opts.onInternetDown,
        onServerDown: opts.onServerDown
    }).send();
};

exports.getLoyaltyCustomerInfo = function(opts) {
    createClient({
        method: "GET",
        url: '/rest/v2/loyalty/customer/info',
        skipAuthorizationCheck:true,
        onSuccess: opts.onSuccess,
        onError: opts.onError,
        onInternetDown:opts.onError,
        onServerDown:opts.onError
    }).send();
};

exports.getLoyaltyCustomerPointsHistory = function(opts) {
    createClient({
        method: "GET",
        url: '/rest/v2/loyalty/customer/history',
        onSuccess: opts.onSuccess,
        onError: opts.onError
    }).send();
};

exports.getLoyaltyCustomerCoupons = function(opts) {
    createClient({
        method:"GET",
        url:'/rest/v2/loyalty/customer/coupons',
        skipAuthorizationCheck:true,
        onSuccess: opts.onSuccess,
        onError: opts.onError,
        onInternetDown:opts.onError,
        onServerDown:opts.onError
    }).send();
};

exports.register = function(opts) {
    createClient({
        method:"POST",
        url:"/rest/v2/register",
        onSuccess:opts.onSuccess,
        onError:opts.onError
    }).send(opts.data);
};

exports.remindPassword = function(opts) {
    createClient({
        method:"POST",
        url:"/rest/v2/forgot/send",
        onSuccess:opts.onSuccess,
        onError:opts.onError
    }).send(opts.data);
};

exports.resetPassword = function(opts) {
    createClient({
        method:"POST",
        url:"/rest/v2/forgot/reset",
        onSuccess:opts.onSuccess,
        onError:opts.onError
    }).send(opts.data);
};

exports.loginFb = function(opts) {
    createClient({
        method:"POST",
        url:"/rest/v2/auth/loginWithFacebook",
        onSuccess:opts.onSuccess,
        onError:opts.onError
    }).send(opts.data);
};

exports.scanLoyalty = function(opts) {
    createClient({
        method:"GET",
        url:"/rest/v2/loyalty/barcode/" + net.encode(opts.plan) + "/" + net.encode(opts.email),
        onSuccess:opts.onSuccess,
        onError:opts.onError
    }).send();
};

exports.scanCoupon = function(opts) {
    createClient({
        method:"GET",
        url:"/rest/v2/loyalty/coupons/barcode/" + net.encode(opts.code),
        onSuccess:opts.onSuccess,
        onError:opts.onError
    }).send();
};

exports.emailLogs = function(opts) {
    createClient({
        method:"POST",
        url:"/internal/emails",
        onSuccess:opts.onSuccess,
        onError:opts.onError,
        skipAuthorizationCheck:true,
        headers:{
            "Accept":"application/json",
            "Content-Type":"application/json"
        }
    }).send(JSON.stringify(opts.data));
};

exports.signup = function(opts) {
    createClient({
        method:"POST",
        url:"/internal/customer/signup",
        onSuccess:opts.onSuccess,
        onError:opts.onError,
        headers:{
            "Accept":"application/json",
            "Content-Type":"application/json"
        }
    }).send(JSON.stringify(opts.data));
};

exports.getGiftcards = function(opts) {
    createClient({
        method:"GET",
        url:"/rest/v2/giftcards/list",
        onSuccess:opts.onSuccess,
        onError:opts.onError,
        skipOutput:true
    }).send();
};

exports.getGiftcard = function(opts) {
    createClient({
        method: "POST",
        serverUrl: getGiftserverURL(),
        url:'/rest/giftcard/info' + (opts.secure ? '/secure' : ''),
        onSuccess:opts.onSuccess,
        onError:opts.onError,
        onInternetDown:opts.onError,
        onServerDown:opts.onError,
        skipOutput:true,
        skipAuthorizationCheck:true,
        headers:{
            "X-FTS-client-api-key":config.getGiftServerApiKey(),
            "X-FTS-hashed-message":opts.hashedData,
            "Content-Type":"application/json",
            "Accept":"application/json"
        }
    }).send(opts.data);
};

exports.registerCard = function(opts) {
    createClient({
        method:"POST",
        url:"/rest/v2/giftcards/register",
        onSuccess:opts.onSuccess,
        onError:function(status, response, meta) {
            if (meta && meta.code == net.HttpStatus.GIFTCARD_ALREADY_REGISTERED)
                opts.onSuccess();
            else
                opts.onError(status, response, meta);
        },
        skipAuthorizationCheck:true,
        headers:{
            "Content-Type":"application/x-www-form-urlencoded",
            "Accept":"application/json"
        }
    }).send(opts.data);
};

exports.giftcardBarcode = function(opts) {
    createClient({
        method:"POST",
        url:"/rest/v2/giftcards/barcode",
        onSuccess:opts.onSuccess,
        onError:opts.onError,
        skipAuthorizationCheck:true,
    }).send(opts.data);
};

exports.giftcardsTransactions = function(opts) {
    createClient({
        method:"POST",
        url:"/rest/v2/giftcards/transactions",
        onSuccess:opts.onSuccess,
        onError:opts.onError,
        skipAuthorizationCheck:true,
    }).send(opts.data);
};

exports.setFavoriteStore = function(opts) {
    createClient({
        method:"PUT",
        url:"/rest/v2/customer/update",
        onSuccess: opts.onSuccess,
        onError: opts.onError,
        headers:{
            "Content-Type":"application/json",
            "Accept":"application/json"
        }
    }).send(JSON.stringify(opts.data));
};

exports.getAllBadges = function(opts) {
    createClient({
        method:"GET",
        url:"/internal/loyalty/badges",
        onSuccess:opts.onSuccess,
        onError:opts.onError,
        onInternetDown: opts.onInternetDown,
        onServerDown: opts.onServerDown,
        headers:{
            "Content-Type":"application/json",
            "Accept":"application/json"
        }
    }).send();
};

exports.getSingleBadge = function(opts) {
    createClient({
        method:"GET",
        url:"/internal/loyalty/badges/" + net.encode(opts.badge),
        onSuccess: opts.onSuccess,
        onError: opts.onError,
        onInternetDown: opts.onError,
        onServerDown: opts.onError,
        headers:{
            "Content-Type":"application/json",
            "Accept":"application/json"
        }
    }).send();
};

exports.getCustomerBadgeInfo = function(opts) {
    createClient({
        method:"GET",
        url:"/internal/customers/" +
            net.encode(opts.identifier) +
            "/loyalty/badges/" +
            net.encode(opts.badge),
        onSuccess: opts.onSuccess,
        onError: opts.onError,
        onInternetDown: opts.onError,
        onServerDown: opts.onError,
        headers:{
            "Content-Type":"application/json",
            "Accept":"application/json"
        }
    }).send();
};

exports.getMyCard = function(opts) {
    createClient({
        method:'GET',
        url:'/rest/v2/giftcards/myCard',
        onSuccess:opts.onSuccess,
        onError:opts.onError,
        onInternetDown: opts.onError,
        onServerDown: opts.onError,
        skipOutput:true
    }).send();
};

exports.surveyRest = function(opts) {
	var url = surveyEndpoint + opts.surveyNum;

	createClient({
		method : opts.method || 'GET',
		serverUrl: opts.customerURL,
		url : url,
		onSuccess : function(status, response) {
			opts.onSuccess(status, response, opts.method || 'GET');
		},
		onError : opts.onError,
		onInternetDown : opts.onError,
		onServerDown : opts.onError,
		headers:{
            "Content-Type":"application/json"
       }
	}).send();
};


exports.answerSurvey = function(opts) {
	var url = questionnaireEndpoint;

	createClient({
		method : 'POST',
		serverUrl : opts.customerURL,
		url : url,
		onSuccess : function(status, response) {
			opts.onSuccess(status, response, opts.method || 'POST');
		},
		onError : opts.onError,
		onInternetDown : opts.onError,
		onServerDown : opts.onError,
		headers : {
			"Content-Type" : "application/json"
		},
		timeout: 60000 
	}).send(opts.questionnaireJSON);
};



