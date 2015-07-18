exports.BORDER = {
    LEFT:'left',
    RIGHT:'right',
    TOP:'top',
    DOWN:'bottom'
};

var Border = (function(){
    
    var WIDTH = '2dp';
    var self = this;
    
    function createView(color) {
        return Ti.UI.createView({
            backgroundColor: color || Alloy.CFG.colors.text_color
        });
    }
    
    function createVertical(color){
        var view = createView(color);
        view.setWidth(WIDTH);
        return view;
    }
    
    
    function createHorizontal(color){
        var view = createView(color);
        view.setHeight(WIDTH);
        return view;
    }
    
    this.left = function(color){
        var border = createVertical(color);
        border.setLeft(0);
        return border;
    };
    
    this.right = function(color){
        var border = createVertical(color);
        border.setRight(0);
        return border;
    };
    
    this.top = function(color){
        var border = createHorizontal(color);
        border.setTop(0);
        return border;
    };
    
    this.bottom = function(color){
        var border = createHorizontal(color);
        border.setBottom(0);
        return border;
    };
    
    return {
        add: function(view, borders, color) {
            for (var i = 0 ; i < borders.length ; i++){
                var border = self[borders[i]](color);
                view.add(border);
            }
        }
    };
    
}());
exports.addBorder = Border.add;