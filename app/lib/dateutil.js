exports.getCurrentTimeFormatted = function() {
    return moment().format("MM/DD/YYYY HH:mm:ss");
};

exports.getShortDate = function(date) {
    return moment(date).format("MM/DD/YYYY");
};
