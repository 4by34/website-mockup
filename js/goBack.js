var referrer = document.referrer;

var refPage = referrer.split("/").pop();

if (!refPage) {refPage = "index.html";}

jQuery("#goBack a").attr("href", "./" + refPage);