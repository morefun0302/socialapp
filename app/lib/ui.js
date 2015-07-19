var log = Alloy.Globals.log;
var EventDispatcher = Alloy.Globals.EventDispatcher;
exports.msg = function(title, message, callback) {
    var dialog = Ti.UI.createAlertDialog({
        title: title,
        message: message
    });
    if (callback)
        dialog.addEventListener('click', callback);
    dialog.show();
};

exports.getLoader = function(msg) {
    var win = Ti.UI.createWindow();
    win.setBackgroundColor(Alloy.CFG.colors.loader_back);

    var label = Ti.UI.createLabel();
    label.text = msg || 'Please wait...';
    label.color = Alloy.CFG.colors.loader_text;
    win.add(label);

    win.kill = function() {
        win.addEventListener('focus', function() {
            win.close();
        });
        try {
            win.close();
        } catch (e) {
            log.write('Trying to close a loader window before it being initialized.');
        }
    };

    EventDispatcher.on(EventDispatcher.get('Events').UNEXPECTED_API_RESPONSE, function() {
        win.kill();
    });

    return win;
};

exports.getSmallLoader = function() {
	return Alloy.createWidget('com.caffeinalab.titanium.loader', {
		message : L('please_wait'),
		cancelable : false,
		useImages : false
	});
};

exports.getButtonBig = function(opts) {

    var lbl = Ti.UI.createLabel({
        text: opts.text || '',
        color: opts.color || Alloy.CFG.colors.text_color,
        font: opts.font || {
            fontSize: '20dp'
        },
        width: Ti.UI.SIZE
    });

    var verticalAligner = Ti.UI.createView({
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE
    });

    var btn = Ti.UI.createView({
        width: opts.width || '50%',
        height: opts.height || '60dp'
    });

    verticalAligner.add(lbl);
    btn.add(verticalAligner);

    if (opts.border)
        for (var i = 0; i < opts.border.length; i++)
            Border.add(btn, opts.border, opts.color);

    return btn;
};

exports.BORDER = {
    LEFT: 'left',
    RIGHT: 'right',
    TOP: 'top',
    DOWN: 'bottom'
};

var Border = (function() {
    var self = this;

    function createView(color) {
        return Ti.UI.createView({
            backgroundColor: color || Alloy.CFG.colors.text_color
        });
    }

    function createVertical(color, width) {
        var view = createView(color);
        view.setWidth(width);
        return view;
    }

    function createHorizontal(color, width) {
        var view = createView(color);
        view.setHeight(width);
        return view;
    }

    this.left = function(color, width) {
        var border = createVertical(color, width);
        border.setLeft(0);
        return border;
    };

    this.right = function(color, width) {
        var border = createVertical(color, width);
        border.setRight(0);
        return border;
    };

    this.top = function(color, width) {
        var border = createHorizontal(color, width);
        border.setTop(0);
        return border;
    };

    this.bottom = function(color, width) {
        var border = createHorizontal(color, width);
        border.setBottom(0);
        return border;
    };

    return {
        add: function(view, borders, color, width) {
            for (var i = 0; i < borders.length; i++) {
                var _width = width || '2dp';
                var border = self[borders[i]](color, _width);
                view.add(border);
            }
        }
    };

}());
exports.addBorder = Border.add;

function carousel(path, createView) {
    var dir = Ti.Filesystem.getFile(Ti.Filesystem.getResourcesDirectory() + path);
    var files = dir.getDirectoryListing();
    var views = [];

    for (var i = 0; i < files.length; i++) {
        var img = path + '/' + files[i].toString();
        var view = createView(img);
        views.push(view);
    }

    return Ti.UI.createScrollableView({
        views: views
    });
}
exports.createCarousel = carousel;

exports.confirm = function(opts) {
    var view = Alloy.createController('confirmationdialog', opts).getView();
    view.show();
};
