var log = Alloy.Globals.log;
var tag = '[WELCOME]';
var ui = require('ui');
var api = require('api');

function redirectMaybe() {
	var resolver = require('accountstateresolver');
	resolver.resolve();
}

function doLogin() {
	var fblogin = require('fblogin');
	var loader = ui.getSmallLoader();
	loader.show();
	fblogin.login(function(opts){
		if (opts.success) {
			var fbtoken = opts.data.fbtoken;
			api.login({
				data:opts.data,
				callback: function(opts) {
					loader.hide();
					if (opts.success) {
						var data = opts.response.content;
						data.fbtoken = fbtoken;
						Alloy.Globals.account.init(data);
						redirectMaybe();
					}
				}
			});
		} else {
			loader.hide();
			error();
		}

	});
}

function error() {
	ui.msg(L('error'), L('try_again'));
}
