var log = Alloy.Globals.log;
var tag = '[INDEX]';
var _navgiation;

$.appFrame.addEventListener('open', function(){
	if (OS_ANDROID) {
		if (! $.appFrame.activity) {
			log.write('Cannot hide action bar.',tag);
		} else {
			var actionBar = $.appFrame.activity.actionBar;
			if (actionBar) {
				actionBar.hide();
			}
		}
	}
});

var EventDispatcher = Alloy.Globals.EventDispatcher;
EventDispatcher.on(EventDispatcher.get('Events').BOOT, init);

function init() {
    var menu = Alloy.createController("menu");
    var main = Alloy.createController("home");

    $.menu.add(menu.getView());
    $.main.add(main.getView());

    var Navigation = require('navigation');
    _navgiation = Navigation({
        display: $.display,
        menu: $.menu,
        main: $.main,
        container: main.getPlaceholder(),
        backButton: main.getBackButton(),
        menuButton: main.getMenuButton()
    });
    Alloy.Globals.nav = _navgiation;

    $.appFrame.addEventListener('androidback', back);
    EventDispatcher.on(EventDispatcher.get('Events').APP_EXIT, exit);
}

function back() {
    Alloy.Globals.nav.goBack();
}

function exit() {
    Alloy.Globals.androidexit.exit(function() {
        $.appFrame.close();
    });
}
