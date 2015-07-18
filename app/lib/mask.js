var Mask = (function() {

    var self = this;

    function apply(field, maskFunction) {
        var masked = maskFunction(field.value);
        if (OS_IOS) {
            field.setValue(masked);
            field.setSelection(field.value.length, field.value.length);
        } else {
            field.maskedValue = masked;
        }
    }

    this.phone = {
        apply: function(v) {
            v = v.replace(/\D/g, "");
            v = v.replace(/^(\d{3})(\d{1,3})/, "$1-$2");
            v = v.replace(/([^\d{4}])(\d{3})(\d{1,4})/, "$1$2-$3");
            return v.slice(0, 12);
        },
        unmask: function(v) {
            return v.replace(/-/g, '');
        }
    };

    this.card =  {
        apply:  function(v) {
            v = v.replace(/\D/g, "");
            v = v.replace(/^(\d{4})(\d{1,4})/, "$1-$2");
            v = v.replace(/([^\d{5}])(\d{4})(\d{1,4})/, "$1$2-$3");
            return v.slice(0, 14);
        },
        unmask: function(v) {
            return v.replace(/-/g, '');
        }
    };

    this.lastFour =  {
        apply : function(v) {
            var patt = /^\d{8}/;
            var mask = "********"; // 8
            return v.replace(patt, mask);
        },
        unmask : function(v) {
            return v; // It wasn't very effective.
        }
    };

    return {
        setUp : function(field) {
            field.addEventListener('change', function() {
                apply(field, self[field.mask].apply);
            });
            field.getUnmaskedValue = function() {
                return self[field.mask].unmask(field.value);
            };
            if (OS_ANDROID) {
                setInterval(function() {
                    try {
                        field.setValue(field.maskedValue || field.value);
                        field.setSelection(field.getValue().length, field.getValue().length);
                    } catch (e) { Ti.API.warn('An outdated interval is trying to edit a field.');}
                }, 100);
            }
        },
        lastFour: self.lastFour.apply,
        phone: self.phone.apply
    };
}());

module.exports = Mask;
