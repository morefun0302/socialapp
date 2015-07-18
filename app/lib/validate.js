var log = Alloy.Globals.log;
var tag = '[VALIDATION]';
var ui = require('ui');

function isValid(field) {
    if (field.getValidator() != null) {
        return field.getValidator().validate(field);
    } else {
        return field.isRequired() && field.getValue();
    }
}

function markFieldAsValid(field, isValid) {
    if (isValid && field.setValid) {
        field.setValid();
    } else {
        field.setInvalid();
    }
}

function validateFields(fields) {
    for (var i = 0 ; i < fields.length ; i++) {
        fields[i].resetValidation();

        if (fields[i].isRequired() && !fields[i].getValue()) {
            var text = fields[i].name + ' cannot be empty.';

            ui.msg(L('warning'), text);
            markFieldAsValid(fields[i], false);

            fields[i].addListener(function(txt) {
                markFieldAsValid(fields[i], isValid(fields[i]));
            });

            return false;
        }

        if (!isValid(fields[i])) {
            var text = 'Please enter a valid ' + fields[i].name;

            if (fields[i].getValidator() && fields[i].getValidator().getInvalidMsg)
                text = fields[i].getValidator().getInvalidMsg(fields[i]);

            ui.msg(L('warning'), text);
            markFieldAsValid(fields[i], false);

            fields[i].addListener(function() {
                markFieldAsValid(fields[i], isValid(fields[i]));
            });

            return false;
        }
    }
    return true;
}

exports.form = validateFields;
