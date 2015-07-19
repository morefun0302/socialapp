function goHome() {
  var resolver = require('accountstateresolver');
	resolver.resolve();
}

function goPortofolio() {
  goToController('portofolio');
}

function goAboutUs() {
  goToController('aboutus');
}

function goContact() {
  goToController('contact');
}

function goToController(controller) {
  var nav = Alloy.Globals.nav;
  nav.setFirstView({
    controller: controller
  });
}
