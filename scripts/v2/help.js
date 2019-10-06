
var app = angular.module('myApp', []);
app.controller('Help', function($scope) {
	$scope.content={showInfo:false, info:""};
	let myPath = window.location.href; 
	if(myPath.search('privacy-policy')>=0)
	{
		$scope.content.showInfo=true;
		$scope.content.info='privacy-policy';
	}
	else if(myPath.search('general-terms')>=0)
	{
		$scope.content.showInfo=true;
		$scope.content.info='general-terms';
	}
	
});













