var args = arguments[0] || {};
var log = Alloy.Globals.log;

function init() {
    $.dialog.setTitle(args.title);
    $.dialog.setMessage(args.message);
    $.dialog.setButtonNames(args.buttonNames || ['OK', 'Cancel']);
}

function doConfirmation(e) {
    if (e.index == 0) args.onConfirmed();
    else args.onCanceled();
}

init();
