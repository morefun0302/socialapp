var log = Alloy.Globals.log;
var tag = '[ACCOUNT]';

function base64_encode(data) {
  var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
    ac = 0,
    enc = '',
    tmp_arr = [];

  if (!data) {
    return data;
  }

  do { // pack three octets into four hexets
    o1 = data.charCodeAt(i++);
    o2 = data.charCodeAt(i++);
    o3 = data.charCodeAt(i++);

    bits = o1 << 16 | o2 << 8 | o3;

    h1 = bits >> 18 & 0x3f;
    h2 = bits >> 12 & 0x3f;
    h3 = bits >> 6 & 0x3f;
    h4 = bits & 0x3f;

    tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
  } while (i < data.length);

  enc = tmp_arr.join('');

  var r = data.length % 3;

  return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
}

var account = (function(){

  this.data = null;

  var init = function(data) {
    this.data = data;
    log.write('Initialized account',tag);
    log.write(JSON.stringify(this.data,null,'\t'),tag);
  }.bind(this);

  var getCompanyWorkingFor = function() {
    return this.data.worksFor;
  }.bind(this);

  var isEmployee = function() {
    return getCompanyWorkingFor() !== null && ! isOwner();
  }.bind(this);

  var isOwner = function() {
    var flag = false;
    var traits = this.data.traits;
    _.each(traits,function(trait){
      if (trait.type === 'ACCOUNT_MANAGER' || trait.type === 'VIEW_REPORTS') {
        flag = true;
      }
    });
    return flag;
  }.bind(this);

  var isLoggedIn = function(){
    return this.data !== null;
  }.bind(this);

  var get = function(field){
    return this.data[field];
  }.bind(this);

  var getAccountHeader = function() {
    return base64_encode(get('email')+':'+get('token'));
  }.bind(this);

  return {
    init: init,
    get:get,
    isLoggedIn: isLoggedIn,
    getCompanyWorkingFor:getCompanyWorkingFor,
    isEmployee:isEmployee,
    isOwner:isOwner,
    getAccountHeader:getAccountHeader
  };

}());
module.exports = account;
