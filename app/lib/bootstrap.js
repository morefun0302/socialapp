var log = Alloy.Globals.log;
var tag = '[BOOT]';

var EventDispatcher = Alloy.Globals.EventDispatcher;

function couldNotBoot(msg) {
    var controller = Alloy.createController('connection_down', {msg: msg});
    controller.getView().open();
}

function start() {
    log.write('start', tag);
    var index = Alloy.createController('index');
    index.getView().open();
    EventDispatcher.trigger(EventDispatcher.get('Events').BOOT);
}

exports.start = start;
