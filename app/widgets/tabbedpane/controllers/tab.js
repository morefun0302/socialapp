var opts = arguments[0] || {};

var target = opts.target;
var args = opts.args;
var onTop = opts.onTop;
var title = opts.title;
var callback = opts.callback;
var tabColor = opts.tabColor;
var inactiveColor = opts.inactiveColor;
var tabSpacing = opts.tabSpacing;
var index = opts.index;
var font = opts.font;
var iconFont = opts.iconFont;
var tabStripHeight = opts.tabStripHeight;
var tabIconHeight = opts.tabIconHeight;

var uiEnabled = true;

function init() {
    $.title.setFont(font);
    $.icon.setFont(iconFont);
    $.title.setText(title);

    $.container.setLeft(tabSpacing);
    $.container.setRight(tabSpacing);
    $.titleContainer.setHeight(tabStripHeight);
    $.iconContainer.setHeight(tabIconHeight);

    if (onTop) {
        $.titleContainer.setTop(0);
        $.iconContainer.setBottom(0);
        $.container.setTop(0);
    } else {
        $.iconContainer.setTop(0);
        $.titleContainer.setBottom(0);
    }

    setInactive();
}

function setActive() {
    callback(proxy);
    $.title.setColor(tabColor);
    $.icon.setVisible(true);
}

function setInactive() {
    $.title.setColor(inactiveColor);
    $.icon.setVisible(false);
}

function tab_Click() {
    if (uiEnabled) {
        setActive();
    }
}

function freeze() {
    uiEnabled = false;
}

function unfreeze() {
    uiEnabled = true;
}

var proxy = {
    target: target,
    args: args,
    freeze: freeze,
    unfreeze: unfreeze,
    index: index
};

init();

exports.activate = setActive;
exports.deActivate = setInactive;
exports.getProxy = function() { return proxy; };
