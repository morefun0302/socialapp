Math.toRadians = function(degrees) {
  return degrees * Math.PI / 180;
};
var Q = require('core/q');

Alloy.Globals.log = require('log');
Alloy.Globals.facebook = require('facebook');
Alloy.Globals.EventDispatcher = Alloy.Models.instance('EventDispatcher');
Alloy.Globals.account = require('account');

var boot = require('bootstrap');
boot.start();
