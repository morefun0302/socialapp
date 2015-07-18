exports.email = {
    validate: function(field) {
        var patt = /^[a-zA-Z0-9\\.\\_\\-\\+]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return patt.test(field.getValue());
    },
    getInvalidMsg: function() {
        return L('email_validation');
    }
};

exports.password = {
    validate: function(field) {
        var text = field.getValue();
        return text && text.length >= 5 && text.length <= 30;
    },
    getInvalidMsg: function() {
        return L('password_validation');
    }
};

exports.maxLength = {
    validate: function(field) {
        return (field.maxLength && field.getValue().length == field.maxLength) || !field.getValue();
    },
    getInvalidMsg: function(field) {
        return L('max_length_validation').replace("{name}", field.name).replace("{digits}", field.maxLength);
    }
};

exports.samePassword = {
    validate: function(field) {
        return field.getValue() == field.toMatch.getValue();
    },
    getInvalidMsg: function(field) {
        return field.name + L('same_password_validation') + field.toMatch.name;
    }
};

exports.digitsOnly = {
    validate: function(field) {
        var value = field.getValue();
        var regex = /^[0-9]+$/;
        var isValid = regex.test(value);
        return	isValid = isValid && value.length == field.maxLength || !field.getValue();
    },
    getInvalidMsg: function(field) {
        return L('digits_only_validation').replace("{name}", field.name).replace("{digits}", field.maxLength);
    }
};

exports.dollars = {
    validate: function(field) {
        var value = field.getValue();
        var x = parseFloat(value);
        return !isNaN(value) && (x | 0) === x && value > 0;
    },
    getInvalidMsg: function() {
        return L('positive_integer');
    }
};
