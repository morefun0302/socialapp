var period,
    interval,
    start,
    finish,
    step,
    onIteration,
    onKill;

function init(opts) {
    period = opts.period || 100;
    step = opts.step || 1;
    start = opts.start || 0;
    finish = opts.finish || 0;
    onIteration = opts.onIteration || function() {};
    onKill = opts.onKill || function() {};

    begin();
}

function begin() {
    interval = setInterval(function() {
        start += step;

        if (finish - start < step)
            start = finish;

        if (start >= finish) {
            onIteration(start);
            stop();
        } else
            onIteration(start);
    }, period);
}

function stop() {
    clearInterval(interval);
    onKill();
}

exports.doTick = init;
