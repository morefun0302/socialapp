
function doLogin() {
	var fblogin = require('fblogin');
	fblogin.login({
		callback: function(){
			log.write('After fb login.');
		}
	});	
}
