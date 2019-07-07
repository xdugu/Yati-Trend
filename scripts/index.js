  
var app = angular.module('myApp', []);
app.controller('HomePage', function($http,$scope) {
	document.getElementById("background_img").style.opacity="0.9";
	$("#text").css({"max-height": "1000px"});

});



	