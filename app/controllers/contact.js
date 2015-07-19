var log = Alloy.Globals.log;
var tag = '[CONTACT]';
var args = arguments[0] || {};

function render() {
  $.email.setText(L('contact_email') + ' ' + Alloy.CFG.settings.email);
  $.phone.setText(L('contact_phone') + ' ' + Alloy.CFG.settings.phone);
}

render();
