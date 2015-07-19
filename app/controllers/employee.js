var log = Alloy.Globals.log;
var tag = '[EMPLOYEE]';
var args = arguments[0] || {};
var ui = require('ui');

function render() {
  var account = Alloy.Globals.account;
  $.name.setText(account.get('name'));
  $.company.setText(account.get('worksFor').name);
}

render();

function autoLike() {
  var autolike = require('autolike');
  autolike.init('kaikalamonroe');
  autolike.likePosts(function(opts){
    if (opts.success) {
      log.write('Num of posts liked on facebook: ' + opts.totalLikes,tag);
      autolike.track(function(opts){
        if (opts.success) {
          ui.msg(L('thank'), L('support'));
        } else {
          log.write('Could not coplete auto like successfully.',tag);
          ui.msg(L('error'), L('try_again'));
        }
      });
    } else {
      log.write('Could not coplete auto like successfully.',tag);
      ui.msg(L('error'), L('try_again'));
    }
  });
}
