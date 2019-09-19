//This script is mainly called by the "Shopping" pages like Shop, basket and order confirmation

//The functions below allow us to store arrays in local storage to be used later
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}


var app = angular.module('myApp',[]);
app.controller('Basket', function($scope, $http) {
	$scope.basketId = localStorage.getObj("basketId");
	$scope.shopping= localStorage.getObj("shopping");
	$scope.currency = $scope.shopping.currency;
	$scope.backbone = {loading:true};
	$scope.discounts = {code:'',showError:false,showSuccess: false};
	
	if($scope.basketId==null || $scope.basketId=="" || $scope.basketId.length<2){
		$scope.backbone.loading = false;
		$scope.order=null;
		return;
	}
	
	$scope.$watch('shopping.deliveryMethod', function(value) {
       localStorage.setObj("shopping",$scope.shopping);
	});
		
	 $http({
				method: 'POST',
				crossDomain : true,
				url: 'https://api.yati-trend.com/v1/Request/Basket/GetBasket',
				data: JSON.stringify({basketId:$scope.basketId,includeCost: true, country:$scope.shopping.contact.country, currency:$scope.currency }),
				headers: {'Content-Type': 'application/json'}
			}).then(function(res){
				if(res.data.Result=="OK"){
					let temp = res.data.data;
					$scope.order = temp.Item;
					Shop_updateBasketSize(temp.Item.Items.length);
					$scope.backbone.loading = false;
				}
			}).catch(function(err){
				Shop_updateBasketSize(0);//Probably the basket could not be found
				//localStorage.setObj("basketId","");
				$scope.order=null;
				$scope.backbone.loading = false;
			});
	

	
	$scope.changeQuantity= function (index, direction){
		if($scope.order.Items[index].Quantity + direction>=1){
			Shop_updateBasketSize($scope.order.Items[index].Quantity + direction);
		$http({
				method: 'POST',
				crossDomain : true,
				url: 'https://api.yati-trend.com/v1/Request/Basket/ChangeQuantity',
				data: JSON.stringify({basketId:$scope.basketId, index: index, increment: direction, country:$scope.shopping.contact.country,currency:$scope.currency}),
				headers: {'Content-Type': 'application/json'}
			}).then(function(res){
				if(res.data.Result=="OK"){
					$scope.order = res.data.data;
				}
			});
			ga('send', 'event', 'Basket', 'QuantityChange', $scope.order[index].ItemId, $scope.order.Items[index].Quantity + direction);
		}
	}
	
	$scope.removeItem = function(index)
	{
		
		$http({
				method: 'POST',
				crossDomain : true,
				url: 'https://api.yati-trend.com/v1/Request/Basket/RemoveItem',
				data: JSON.stringify({basketId:$scope.basketId, index: index, country:$scope.shopping.contact.country, currency:$scope.currency}),
				headers: {'Content-Type': 'application/json'}
			}).then(function(res){
				if(res.data.Result=="OK"){
					$scope.order = res.data.data;
					Shop_updateBasketSize(res.data.data.Items.length);
				}
			});
		ga('send', 'event', 'Basket', 'RemovedItem', $scope.order.Items[index].ItemId);
		$scope.order.Items.splice(index,1);//pre splice the removed item to make the ui seem more responsive
	}
	
	$scope.updateDeliveryCost = function()//called when customer chooses/changes the Country to post 
	{
		if($scope.shopping.contact.country=='default')//dont need to request for a price if we don't know the country
			return;
		$http({
				method: 'POST',
				crossDomain : true,
				url: 'https://api.yati-trend.com/v1/Request/Basket/GetBasket',
				data: JSON.stringify({basketId:$scope.basketId, includeCost: true, country:$scope.shopping.contact.country, currency:$scope.currency}),
				headers: {'Content-Type': 'application/json'}
			}).then(function(res){
				if(res.data.Result=="OK"){
					let temp = res.data.data;
					$scope.order = temp.Item;
					if($scope.shopping.contact.country=='Hungary'){
						$scope.shopping.deliveryMethod="FoxpostDelivery";
					}
					Shop_updateBasketSize( temp.Item.Items.length);
					$scope.shopping.contact.countryCode = Shop_getCountryCode($scope.shopping.contact.country);
					localStorage.setObj("shopping",$scope.shopping);
				}
			});
	}
	
	$scope.applyDiscount = function(code){
		$http({
				method: 'POST',
				crossDomain : true,
				url: 'https://api.yati-trend.com/v1/Request/ValidateDiscount',
				data: JSON.stringify({basketId:$scope.basketId,discountCode: code, country:$scope.shopping.contact.country, currency:$scope.currency }),
				headers: {'Content-Type': 'application/json'}
			}).then(function(res){
					$scope.order = res.data.data;
					$scope.discounts.showSuccess=true;
			      ga('send', 'event', 'Basket', 'DiscountUsed', code);		
			}).catch(function(err){
				$scope.discounts.code='';
				$scope.discounts.showError=true;
			   ga('send', 'event', 'Basket', 'DiscountFailed', code);
			});
			
	}
	
	
	
});






