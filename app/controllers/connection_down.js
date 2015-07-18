var args = arguments[0] || {};
var specific_message = args.msg;
var bootstrap = require('bootstrap');

$.connection_label.setText(L('connection_down') + '\n' + specific_message);

function try_again() {
    bootstrap.start();
}
