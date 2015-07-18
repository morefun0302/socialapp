var log = Alloy.Globals.log;var tag = '[ANDROID-EXIT-HANDLER]';

var androidexit = (function() {

    var EXIT_PROMPT_THRESHOLD = 1000; // ms
    var HUMAN_MINIMUM_THRESHOLD = 100; // makes sure that this is not triggered twice by Android OS.
    var lastRequest = 0;

    function exit(callback) {
        var now = new Date().getTime();

        if (lastRequest === 0) {
            lastRequest = now - 2 * EXIT_PROMPT_THRESHOLD;
        }

        var timePassed = (now - lastRequest);
        log.write('Time Passed: ' + timePassed + ', lastRequest: ' + lastRequest, tag);

        if (timePassed > EXIT_PROMPT_THRESHOLD && OS_ANDROID) {
            lastRequest = now;
            var toast = Titanium.UI.createNotification({
                duration: Titanium.UI.NOTIFICATION_DURATION_SHORT,
                message: L('pressAgainToExit')
            });
            toast.show();
            return false;
        } else if (timePassed < HUMAN_MINIMUM_THRESHOLD) {
            return;
        } else {
            callback();
        }
    }

    return {
        exit: exit
    };

}());

module.exports = androidexit;
