exports.fadeBetweenViews = function(fadeOutView, fadeInView, duration) {
    var deferred = Q.defer();

    fadeOutView.visible = true;
    fadeOutView.setTouchEnabled(false);
    fadeOutView.animate({
        duration: duration,
        opacity: 0
    }, function() {
        fadeOutView.setTouchEnabled(true);
        fadeOutView.visible = false;//visible will make touchEnabled false by default
    });

    fadeInView.visible = true;
    fadeInView.setTouchEnabled(false);
    fadeInView.animate({
        duration: duration,
        opacity: 255
    }, function() {
        fadeInView.setTouchEnabled(true);
        deferred.resolve();
    });

    return deferred.promise;
};

exports.slideToLeft = function(view, duration) {
    var deferred = Q.defer();
    view.animate({
        left: '0%',
        right: '0%',
        duration:duration
    }, function() {
        deferred.resolve();
    });
    return deferred.promise;
};

var slideToRight = function(params) {
    var deferred = Q.defer();
    var percent = params.percent || 100;
    params.view.animate({
        left: percent + '%',
        right: '-' + percent + '%',
        duration: params.duration
    },
    function() {
        deferred.resolve();
    });

    return deferred.promise;
};

exports.slideToRight = slideToRight;
