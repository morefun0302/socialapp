var log = Alloy.Globals.log;
var tag = '[ACCOUNT-STATE-RESOLVER]';

var resolver = (function(){

  function resolve() {
      var nav = Alloy.Globals.nav;
      var account = Alloy.Globals.account;

      if (account.isLoggedIn()) {
        if (account.isOwner()) {
            nav.setFirstView({
              controller:'owner'
            });
        } else {
          nav.setFirstView({
            controller:'employee'
          });
        }
      } else {
        nav.setFirstView({
          controller:'welcome'
        });
      }
  }

  return {
    resolve: resolve
  };

}());
module.exports = resolver;
