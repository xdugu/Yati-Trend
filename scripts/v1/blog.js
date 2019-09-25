//The functions below allow us to store arrays in local storage to be used later
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

var scope;

var app = angular.module('myApp', ['ngSanitize']);



app.controller('BlogList', function($scope, $http, $timeout, $location, $window) {
	$scope.products=[];
	$scope.urlParams = Common_parseUrlParam();
	//Language stuff
	$scope.backbone = {lang:null,loading:true};
	$scope.backbone.lang= localStorage.getObj("shopping").contact.lang;//for choosing of language	
	$scope.blogList = [];

	

	
	/////////////////////////////////
	$http.get('https://api.yati-trend.com/v1/Request/Blog/GetBlogList').then(function(res){
			
	    $scope.blogList = res.data.data;
		
	});
	

});

app.controller('BlogView', function($scope, $http, $timeout, $location, $window) {
	$scope.products=[];
	$scope.urlParams = Common_parseUrlParam();
	//Language stuff
	$scope.backbone = {lang:null,loading:true};
	$scope.backbone.lang= localStorage.getObj("shopping").contact.lang;//for choosing of language	
	$scope.blogList = [];

	

	

});



