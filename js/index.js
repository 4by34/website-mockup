window.onscroll = function() {fixedNav()};

var navOffset = jQuery(".activateStick").offset().top;

function fixedNav() {
	if (window.pageYOffset > navOffset) {
		jQuery(".activateStick").addClass("fixed-top");
		jQuery(".pageHeader").addClass("stickyBody");
		jQuery(".navbar-brand").addClass("showLogo");
		jQuery(".navbar-brand").removeClass("hideLogo");
		jQuery(".mainBody").css("margin-top", "72px");
	} else {
		jQuery(".activateStick").removeClass("fixed-top");
		jQuery(".pageHeader").removeClass("stickyBody");
		jQuery(".navbar-brand").addClass("hideLogo");
		jQuery(".navbar-brand").removeClass("showLogo");
		jQuery(".mainBody").css("margin-top", "0");
	}
}

jQuery(document).ready(function() {

	function show_banner() {
		jQuery("#banner").removeClass("hideLogo");
		jQuery("#banner").addClass("showLogoSlow");
	};

	window.setTimeout( show_banner, 900 );
});

