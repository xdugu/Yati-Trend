//The functions below allow us to store arrays in local storage to be used later
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

 
 


var app = angular.module('myApp', []);


app.controller('Unsubscribe',function($scope, $timeout,$http,$location,$window){


	$scope.urlParams = Common_parseUrlParam();
	$scope.unsubscribeSuccess = false;
	$scope.unsubscribeFail = false;
	if($scope.urlParams.hasOwnProperty('email'))
		$scope.email = $scope.urlParams.email;
	else
		$scope.email = '';
	
	

	  
	$scope.sendUnsubscribe = function(){//called when customer presses the "Unsubscribe" button with a valid email address
		    
			 $http({
				method: 'POST',
				crossDomain : true,
				url: 'https://api.yati-trend.com/v1/Request/NewsletterUnsubscribe',
				data: JSON.stringify({email: $scope.email}),
				headers: {'Content-Type': 'application/json'}
			}).then(function(res){
				if(res.data.Result=="OK"){
					$scope.unsubscribeSuccess = true;
				}
				else $scope.unsubscribeFail = true;
			}).catch(function(err){
				$scope.unsubscribeFail = true;
			});

	 }
	 
 
});
















