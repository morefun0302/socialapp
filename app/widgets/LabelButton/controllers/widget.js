var args = arguments[0] || {};
var ui = require('ui');
var customData = args.customData || {};
exports.customData = customData;

function init() {
    $.btnLabel.setText(args.title || '');
    $.btnLabel.setTextAlign(args.textAlign || $.btnLabel.textAlign);
    $.btnLabel.setColor(args.color);
    $.area.setWidth(args.width || Ti.UI.FILL);
    $.area.setHeight(args.height || Ti.UI.FILL);
    ui.addBorder($.area, [ui.BORDER.DOWN], Alloy.CFG.colors.text_color, '1dp');
}

function onClick(event) {
    if (args.action) {
        args.action({
            source: $
        });
    }
}

init();

exports.doAction = onClick;
