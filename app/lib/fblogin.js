var ui = require('ui');
var nav = Alloy.Globals.nav;

var log = Alloy.Globals.log;
var tag = '[FACEBOOK]';
var facebook;

var _data;
var loader = ui.getLoader();

function doLogin(opts) {
    init(opts);
    beginLogin();
}
exports.login = doLogin;

function init(opts) {
    facebook = Alloy.Globals.facebook;
    facebook.permissions = Alloy.CFG.facebook.permissions;
    facebook.addEventListener('login', getEmail);
    facebook.initialize(1000);
}

function beginLogin() {
    if (facebook.loggedIn) {
        getEmail();
    } else {
        facebook.authorize();
    }
}

function getEmail() {
    facebook.requestWithGraphPath('me', {}, 'GET', function(e) {
        if (e.success) {
            var result = JSON.parse(e.result);
            var email = result.email;
            gotEmail(email);
            facebook.removeEventListener('login', getEmail);
        } else if (e.error) {
            facebook.logout();
            errorGettingUserInfo(e);
            facebook.removeEventListener('login', getEmail);
        } else {
            facebook.logout();
            facebook.removeEventListener('login', getEmail);
        }
    });
}

function errorGettingUserInfo(e) {
    log.write('Error getting facebook: ' + JSON.stringify(e), tag);
}

function gotEmail(email) {
    _data = {
        email: email,
        token: facebook.accessToken
    };
    log.write('Facebook data: ' + JSON.stringify(_data),tag);
}
