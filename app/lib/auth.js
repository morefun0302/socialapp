var log = Alloy.Globals.log;
var user = require('user');

var tag = '[AUTH]';
var DEAUTHORIZED = Alloy.CFG.constants.deauthorized;

function getOutdatedSession() {
    return true == Ti.App.Properties.getBool(DEAUTHORIZED);
}

function setOutdatedSession() {
    return Ti.App.Properties.setBool(DEAUTHORIZED, true);
}

function resetSession() {
    Ti.App.Properties.setBool(DEAUTHORIZED, false);
}

exports.authenticate = function(args) {
    var opts = args || {};
    var nav = Alloy.Globals.nav;
    if (user.isLoggedIn()) {
        log.write('User is allready logged in.', tag);
        opts.onAuthenticated(user.get());
    } else {
        var loginArgs = opts.onAuthenticated ?
            {callback: opts.onAuthenticated} : {};
        nav.setView({
            controller:'login',
            arguments:loginArgs,
            group:nav.GROUPS.LOGIN
        });
    }
};

exports.resetSession = resetSession;
exports.deauthorize = function(warn) {
    user.kill();
    var ui = require('ui');
    if (warn && !getOutdatedSession()) {
        setOutdatedSession();
        ui.msg('Unauthorized', 'It seems your credentials are no longer up to date.', goHome);
    } else {
        goHome();
    }

    function goHome() {
        Alloy.Globals.nav.reset();
        Alloy.Globals.nav.setView({
            controller:'welcome'
        });
    }
};
