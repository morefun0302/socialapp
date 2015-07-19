var log = Alloy.Globals.log;
var tag = '[PORTOFOLIO]';
var args = arguments[0] || {};
var ui = require('ui');

var entries;
var index = 0;

function render() {
  log.write('potofolio',tag);
  var api = require('api');
  api.portofolio(function(opts){
    if (opts.success) {
      entries = opts.response.content;
      showPhoto();
      $.container.addEventListener('swipe', swiped);
    } else {
      log.write('Failed to load portofolio',tag);
        ui.msg(L('error'), L('try_again'));
    }
  });
}

function swiped(opts) {
  log.write('Swipped to: ' + opts.direction,tag);
  if (opts.direction === 'left') {
    index = Math.min(index + 1, entries.length-1);
    showPhoto();
  } else if (opts.direction === 'right') {
    index = Math.max(index-1, 0);
    showPhoto();
  }
}

function showPhoto() {
  log.write('Showing photo: ' + index,tag);
  $.photo.setImage(entries[index].image);
  $.description.setText(entries[index].description);
}

render();
