var args = arguments[0] || {};
var ui = require('ui');
var log = Alloy.Globals.log;
var tag = '[TEXT-FIELD]';

var borderColor = Alloy.CFG.colors.form_textfield_border;

var width = args.width || Ti.UI.FILL;
var height = args.height || '50dp';
var name = args.name;
var hint = args.hint;
var keyboard = args.keyboard;
var mask = args.mask;
var passwordMask = args.passwordMask;
var maxLength = args.maxLength;
var displayLength = args.displayLength;
var validator = args.validator;
var required = (args.required === true);
var textAlign = args.textAlign || Ti.UI.TEXT_ALIGNEMNT_LEFT;
var textHintColor = args.textHintColor || Alloy.CFG.colors.form_textfield_border;

var _validator;
var changeListeners;

function init() {

    changeListeners = [];

    $.container.setWidth(width);
    $.container.setHeight(height);
    $.container.name = name;

    $.field.borderStyle = null;
    $.field.setHintText(hint);
    $.field.setHintTextColor(textHintColor);
    $.field.setPasswordMask(passwordMask);
    $.field.color = Alloy.CFG.colors.form_textfield_color;
    $.field.maxLength = maxLength;
    $.field.setTextAlign(textAlign);

    setFocus();
    setBorder(borderColor);
    setKeyboard();
    setMask();
    setValidator();
}

function setFocus() {
    if (OS_ANDROID) {
        $.field.addEventListener('focus', function() {
            setBorder(Alloy.CFG.colors.warning);
        });

        $.field.addEventListener('blur', function() {
            setBorder(borderColor);
        });
    }

}

function setValidator() {
    if (validator) {
        var validators = require('validators');
        _validator = validators[validator];
    }
}

function setCustomValidator(input) {
    if (input && input.validate && typeof input.validate == "function" && input.invalidMsg) {
        _validator = input;
    } else {
        log.write('Attempting to set an invalid custom validator, oh the irony!', tag);
    }
}

function setMask() {
    if (mask && OS_IOS) {
        var Mask = require('mask');
        $.field.mask = mask;
        Mask.setUp($.field);
    }
}

function setKeyboard() {
    $.field.keyboardType = keyboard;
    if (OS_IOS && isNumpad()) {
        var returnButton = Ti.UI.createButton({
            systemButton : Titanium.UI.iPhone.SystemButton.DONE
        });
        returnButton.addEventListener('click', function() {
            $.field.blur();
        });
        $.field.keyboardToolbar = [returnButton];
    }
}

function isNumpad() {
    return keyboard === Ti.UI.KEYBOARD_NUMBERS_PUNCTUATION ||
            keyboard === Ti.UI.KEYBOARD_DECIMAL_PAD ||
            keyboard === Ti.UI.KEYBOARD_PHONE_PAD ||
            keyboard === Ti.UI.KEYBOARD_NUMBER_PAD;
}

function setBorder(color) {
    ui.addBorder($.container, [ui.BORDER.LEFT, ui.BORDER.TOP], color);
}

function resetValidation() {
    for (var i = 0 ; i < changeListeners.length ; i++) {
        if (changeListeners[i]) {
            $.field.removeEventListener('change', changeListeners[i]);
        }
    }
    setBorder(borderColor);
}

function setValid() {
    setBorder(Alloy.CFG.colors.positive);
}

function setInvalid() {
    setBorder(Alloy.CFG.colors.negative);
}

function addListener(func, skip) {
    if (!skip) changeListeners.push(func);
    $.field.addEventListener('change', func);
}

function setRequired(bool) {
    required = bool;
    $.field.setHintText(hint + (bool ? ' *' : ''));
}

exports.setValidator = setCustomValidator;
exports.getValidator = function() { return _validator; };

exports.name = name;
exports.maxLength = maxLength;
exports.displayLength = displayLength;
exports.isRequired = function() {return required;};

exports.setPhone = function(text) {
    var Mask = require('mask');
    var toSet = OS_IOS ? Mask.phone(text) : text;
    $.field.setValue(toSet);
};
exports.setValue = function(val) { $.field.setValue(val); };
exports.getValue = function() { return $.field.getValue().trim(); };
exports.getUnmaskedValue = function() { return $.field.getUnmaskedValue(); };

exports.setValid = setValid;

exports.setInvalid = setInvalid;

exports.resetValidation = resetValidation;

exports.addListener = addListener;

exports.markAsRequired = setRequired;
exports.setTextAlign = function(val) { $.field.setTextAlign(val); };

exports.addClickListener = function(listener) {
    $.field.addEventListener('click', listener.onClick);
};

init();
