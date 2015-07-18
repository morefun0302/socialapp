function menu_toggle() {
    Alloy.Globals.nav.toggle();
}

function menu_back() {
    Alloy.Globals.nav.goBack();
}

$.topBar.add();

var EventDispatcher = Alloy.Globals.EventDispatcher;
EventDispatcher.trigger(EventDispatcher.get('Events').PAGE_OPENED, {
    controller: 'welcome'
});

exports.getBackButton = function() { return $.backButton; };
exports.getMenuButton = function() { return $.menuButton; };
exports.getPlaceholder = function() { return $.main_view; };
exports.hideLogo = function() { logo.setVisible(false); };
