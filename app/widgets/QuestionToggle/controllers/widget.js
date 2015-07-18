var args = arguments[0] || {};
var log = Alloy.Globals.log;
var tag = '[QUESTION]';
var question, answers;

function init() {
    question = args.question || '';
    answers = args.answers || ['Yes', 'No'];

    $.questionText.setText(question);
    $.switchView.setValue(true);
    $.answer.setText(answers[0]);

    $.switchView.addEventListener('change', change);
}

function toggle() {
    if (OS_IOS)
        $.switchView.setValue(!$.switchView.value);
}

function change() {
    var answer = $.switchView.value ? answers[0] : answers[1];
    $.answer.setText(answer);
}

exports.getValue = function() {
    return $.switchView.value;
};

exports.getDTOValue = function() {
    return $.switchView.value ? 'true' : 'false';
};

init();
