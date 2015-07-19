var log = Alloy.Globals.log;
var tag = '[ABOUT-US]';
var args = arguments[0] || {};

function render() {
  var api = require('api');
  api.services(function(opts){
    var services = opts.response.content;
    _.each(services,function(service){
      $.services.add(Alloy.createController('service', service).getView());
    });
  });
}

render();
