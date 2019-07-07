  
var app = angular.module('myApp', []);
app.controller('HomePage', function($http,$scope,$timeout) {
	$scope.contentSeen = true;
	
	$scope.rowUp = function(){
		
		if($scope.contentSeen){
			$("#text").css({"max-height": "0px"});
			$("#actual_arrow").text("expand_more");
			$scope.contentSeen = false;
			
			
		}else{
			$("#text").css({"max-height": "1000px"});
			$("#actual_arrow").text("expand_less");
			
			$scope.contentSeen = true;
		}
		
	}
	
	$timeout(function(){
	
	$("#text").css({"max-height": "1000px"});
	$("#arrow").css({"visibility": "visible"});
		
	},5000);

});



	