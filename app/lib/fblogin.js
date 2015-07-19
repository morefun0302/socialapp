var log = Alloy.Globals.log;
var tag = '[FACEBOOK]';
var facebook;

var _callback;

function doLogin(callback) {
  _callback = callback;
  facebook = Alloy.Globals.facebook;
  facebook.permissions = Alloy.CFG.facebook.permissions;
  facebook.addEventListener('login', getEmail);
  facebook.initialize(1000);
  facebook.authorize();
}

function getEmail() {
    facebook.requestWithGraphPath('me', {}, 'GET', function(opts) {
        facebook.removeEventListener('login', getEmail);
        if (opts.success) {
            var result = JSON.parse(opts.result);
            _callback({
              success:true,
              data:{
                email: result.email,
                name: result.name,
                fbtoken: facebook.accessToken
              }
            });
        } else {
          facebook.logout();
          fbError(opts.error);
        }
    });
}

function fbError(err) {
  log.write('Facebook error ' + err ? err : '',tag);
  _callback({
    success:false,
    data:null
  });
}

exports.login = doLogin;
