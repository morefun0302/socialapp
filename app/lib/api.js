var log = Alloy.Globals.log;
var tag = '[API]';
var client = require('core/client');

var api = (function(){

  function getDefaultHeaders() {
      return {
        'Accept':'application/json',
        'Content-Type':'application/json'
      };
  }

  function getAccountsController() {
    return Alloy.CFG.settings.server + '/accounts';
  }

  function getCompaniesController() {
    return Alloy.CFG.settings.server + '/companies';
  }

  function getAdminController() {
    return Alloy.CFG.settings.server + '/admin';
  }

  return {
      login: function(opts) {
        client.instance({
          url: getAccountsController() + '/loginWithFacebook',
          method: 'POST',
          headers: getDefaultHeaders(),
          data: opts.data,
          callback: opts.callback
        });
      },
      autolike: function(opts){
        client.instance({
          url:getCompaniesController()+'/'+opts.companyid+'/autoLikes',
          method:'POST',
          headers: {
            'Accept':'application/json',
            'Content-Type':'application/json',
            'inyourcity-user-id':opts.userid
          },
          callback:opts.callback
        });
      },
      portofolio: function(callback){
        client.instance({
          url: getAdminController() + '/portofolio',
          method:'GET',
          headers:getDefaultHeaders(),
          callback:callback
        });
      },
      services: function(callback){
        client.instance({
          url: getAdminController() + '/services',
          method:'GET',
          headers:getDefaultHeaders(),
          callback:callback
        });
      }
  };
}());

module.exports = api;
