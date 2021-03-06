
var scrollingElement = (document.scrollingElement || document.body);


var app = angular.module('myApp', ['ngAnimate']);
app.run(function() {
// Trigger input event on change to fix auto-complete
$('input, select').on('change',function() { $(this).trigger('input'); });
});
app.controller('Checkout',  function($scope, $http, $timeout) {
	$scope.order = localStorage.getObj("shopping");
	$scope.user=$scope.order.contact;
	$scope.places =[];
	$scope.showFoxpost=true;
	//since angular uses a different way to display and hide, we set the modals to display block
	// but in actual fact, they are still hidden
	$('.w3-modal').css({display: "block"});
	$http.get("/foxpostdb.json").then(function(resp){
		$scope.places = resp.data;
	});
	
	$scope.proceedToPayment= function (){
		$scope.order.contact = $scope.user;
		localStorage.setObj("shopping", $scope.order);
		window.location.href = 'review.html';
	}
	
	$scope.foxpostChosenLoc = function(place){
		$scope.user.address1 = "Foxpost "+ place.Name;
		$scope.user.address2 = place.Address;
		$scope.user.city = place.City;
		$scope.user.postCode = place.PostCode;
		$scope.showFoxpost =false;
		
	}
	if($scope.order.deliveryMethod!='FoxpostPickup' || $scope.order.contact.country!='Hungary'){
		$scope.showFoxpost = false;
		
	}

	$scope.$watch('agreed',function(newValue, oldValue) {
        if (newValue !== oldValue) {
            if(newValue==true){
				$timeout(function(){// I needed to add a delay to cause the document to scroll properly
					var scrollingElement = (document.scrollingElement || document.body);
					 $(scrollingElement).animate({
						  scrollTop: document.body.scrollHeight
					   }, 2000);
				},100);
			}
        }
    });
});


	
	





