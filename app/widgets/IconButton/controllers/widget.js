var args = arguments[0] || {};

var text, icon, color, font, iconFont;

function init() {
    text = L(args.textid) || '';
    icon = args.icon || '';
    color = args.color || Alloy.CFG.colors.text_color;
    font = args.font || {
        fontSize : '18dp'
    };
    iconFont = createFont(args.iconFont) || {
        fontFamily : 'customerapp',
        fontSize : '24dp'
    };
}

function apply() {
    $.lblText.setText(text);
    $.lblText.setColor(color);
    $.lblText.setFont(font);

    $.lblIcon.setText(icon);
    $.lblIcon.setColor(color);
    $.lblIcon.setFont(iconFont);
}

function createFont(iconFont) {
    if (iconFont) {
        iconFont.fontFamily = 'customerapp';
        return iconFont;
    }
}

init();
apply();

exports.setIcon = function(newIcon) {
    icon = newIcon;
    apply();
};

exports.setText = function(newText) {
    text = newText;
    apply();
};
