var log = Alloy.Globals.log;
var tag = '[TABBED-PANE]';
var opts = arguments[0] || {};

var tabsOnTop,
    tabs,
    tabFont,
    tabColor,
    tabInactiveColor,
    tabSpacing,
    tabStripColor,
    tabStripEnabled,
    liveParametersListener,
    savedIndexName,
    displayInitially,
    tabFont,
    tabIconFont,
    tabHeight,
    tabStripHeight,
    tabIconHeight,
    currentTab,
    tabLabels = [];

function setup() {
    if (tabsOnTop) {
        $.tabContainer.setTop(0);
        $.content.setTop(tabStripHeight);
        $.content.setBottom(0);
    } else {
        $.content.setTop(0);
        $.content.setBottom(tabStripHeight);
        $.tabContainer.setBottom(0);
    }
    $.tabContainer.setHeight(tabHeight);
    addTabs();
}

function init() {
    $.tabContainer.removeAllChildren();
    $.content.removeAllChildren();

    tabsOnTop = opts.tabsOnTop === true;
    tabLabels = [];
    tabs = opts.tabs || [];
    tabFont = opts.tabFont || {
        fontSize: '12dp'
    };
    tabColor = opts.tabColor || Alloy.CFG.colors.text_color;
    tabInactiveColor = opts.tabInactiveColor || Alloy.CFG.colors.colorc;
    tabSpacing = opts.tabSpacing || '5dp';
    tabStripEnabled = opts.tabStripEnabled === true;
    tabStripColor = opts.tabStripColor || Alloy.CFG.colors.colorb;
    savedIndexName = opts.savedIndexName || 'com.foodtec.tabgroup.index';
    displayInitially = opts.displayInitially === true;
    tabFont = opts.tabFont || {
        fontSize: '13dp',
        fontWeight: 'bold'
    };
    tabIconFont = opts.tabIconFont || {
        fontFamily: 'customerapp',
        fontSize: '12dp'
    };
    tabHeight = opts.tabHeight || '30dp';
    tabStripHeight = opts.tabStripHeight || '20dp';
    tabIconHeight = opts.tabIconHeight || '14dp';

    setup();
    if (displayInitially) {
        display();
    }
}

function getTabStrip() {
    var strip = Ti.UI.createView({
        height: tabStripHeight,
        backgroundColor: tabStripColor
    });
    if (tabsOnTop) {
        strip.setTop(0);
    } else {
        strip.setBottom(0);
    }
    return strip;
}

function swapContent(proxy) {
    if (currentTab === proxy.target) {
        return;
    }

    proxy.freeze();
    var target = proxy.target;
    var args = proxy.args;

    log.write('Tab clicked: ' + target, tag);
    for (var i = 0 ; i < tabLabels.length ; i++) {
        tabLabels[i].deActivate();
    }

    if (liveParametersListener) {
        args = liveParametersListener.onTargetInitialization(target, args);
    }

    var controller = Alloy.createController(target, args);

    var lastTabContent = _.first($.content.children);
    $.content.add(controller.getView());
    if (lastTabContent) {
        $.content.remove(lastTabContent);
    }
    currentTab = proxy.target;
    saveIndex(proxy.index);
    proxy.unfreeze();
}

function addTabs() {
    $.tabContainer.removeAllChildren();

    if (tabStripEnabled) {
        $.tabContainer.add(getTabStrip());
    }

    var _tabs = Ti.UI.createView({
        layout: 'horizontal',
        width: Ti.UI.SIZE
    });

    for (var i = 0; i < tabs.length; i++) {

        var index = i;

        var tab = Widget.createController('tab', {
            onTop: tabsOnTop,
            target: tabs[i].target,
            args: tabs[i].args,
            title: tabs[i].name,
            callback: swapContent,
            tabColor: tabColor,
            inactiveColor: tabInactiveColor,
            tabSpacing: tabSpacing,
            index: index,
            font: tabFont,
            iconFont: tabIconFont,
            tabStripHeight: tabStripHeight,
            tabIconHeight: tabIconHeight
        });

        tabLabels.push(tab);
        _tabs.add(tab.getView());

    }

    $.tabContainer.add(_tabs);
}

function display(index) {
    var i;
    i = index ? index : loadIndex();
    tabLabels[i].activate();
}

function loadIndex() {
    return Ti.App.Properties.getInt(savedIndexName, 0);
}

function saveIndex(index) {
    Ti.App.Properties.setInt(savedIndexName, index);
}

init();

exports.display = display;
exports.setLiveParamsListener = function(listener) {
    liveParametersListener = listener;
};
