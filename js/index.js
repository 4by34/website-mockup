jQuery(window).resize(function() {
  location.reload();
});

jQuery(document).ready(function() {

  window.onscroll = function() {fixedNav()};

  var navbar = document.getElementById("indexNav");

  var sticky = navbar.offsetTop;

  function fixedNav() {
    if (window.pageYOffset > sticky) {
      navbar.classList.add("fixed-top");
      jQuery(".navbar-brand").addClass("showLogo");
      jQuery(".navbar-brand").removeClass("hideLogo");
      jQuery(".mainBody").css("margin-top", "58px");
    } else {
      navbar.classList.remove("fixed-top");
      jQuery(".navbar-brand").removeClass("showLogo");
      jQuery(".navbar-brand").addClass("hideLogo");
      jQuery(".mainBody").css("margin-top", "0");
    }
  }

});

