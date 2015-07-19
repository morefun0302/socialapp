var log = Alloy.Globals.log;
var tag = '[AUTO-LIKE]';

var autolike = (function(){

  this.pageid = null;
  this.callback = undefined;

  var init = function(pageid){
    this.pageid = pageid;
  }.bind(this);


  var likePosts = function(callback) {
    this.callback = callback;
    var facebook = Alloy.Globals.facebook;
    facebook.requestWithGraphPath(this.pageid+'/feed', {}, 'GET', function(opts){
      if (opts.success) {
        var posts = JSON.parse(opts.result).data;
        consumePosts(posts);
      } else {
        callback({
          success:false
        });
      }
    });
  }.bind(this);

  var consumePosts = function(posts) {
    var facebook = Alloy.Globals.facebook;
    var totalPosts = posts.length;
    var totalConsumed = 0;

    _.each(posts,function(post){
      facebook.requestWithGraphPath(post.id+'/likes', {}, 'POST', function(opts){
        totalConsumed++;
        checkTotals();
      });
    });

    function checkTotals() {
      if (totalConsumed === totalPosts) {
        this.callback({
          success:true,
          totalLikes: totalPosts
        });
      }
    }
  }.bind(this);

  var track = function(callback) {
    var account = Alloy.Globals.account;
    var userid = account.getAccountHeader();
    var companyid = account.get('worksFor').publicId;

    var api = require('api');
    api.autolike({
      userid:userid,
      companyid:companyid,
      callback: callback
    });
  }.bind(this);

  return {
    init:init,
    likePosts: likePosts,
    track:track
  };

}());

module.exports = autolike;
