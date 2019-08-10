//This script is mainly called by the "Shopping" pages like Shop, basket and order confirmation

//The functions below allow us to store arrays in local storage to be used later
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}


var paypalObject, totalAsString;

var app = angular.module('myApp', []);
app.run(function() {
// Trigger input event on change to fix auto-complete
$('input, select').on('change',function() { $(this).trigger('input'); });
});
app.controller('Review', function($scope, $http, $timeout) {
	$scope.shopping = localStorage.getObj("shopping");
	$scope.basketId = localStorage.getObj("basketId");
	$scope.order={};
	$scope.temp = {comments:""};
	$scope.sourceUrl = ""
	
	$scope.backbone =  {showPaypalReceipt:false, showBank:false, showConfirmed:false, showPayLater:false};
	//////////////////////////////////////////////
	$scope.currency = $scope.shopping.currency;
	 $http({
				method: 'POST',
				crossDomain : true,
				url: 'https://api.yati-trend.com/v1/Request/Basket/GetBasket',
				data: JSON.stringify({basketId:$scope.basketId, includeCost: true, country:$scope.shopping.contact.country, currency: $scope.currency}),
				headers: {'Content-Type': 'application/json'}
			}).then(function(res){
				if(res.data.Result=="OK"){
					let temp = res.data.data;
					$scope.order = temp.Item;
					$(".basket-num").html( temp.Item.Items.length);
				}
			});
	
	///////////////////////////////////////////////
	$scope.updatePaymentMethod = function(method){
			localStorage.removeItem("shopping");
			localStorage.removeItem("basketId");
			$scope.createOrderCode();
			$scope.shopping['comments']=$scope.temp.comments;
			$scope.shopping['basketId']= $scope.basketId;
			$scope.shopping['requestType']="SubmitOrder";
			if(typeof(method)== "string")
				$scope.shopping.paymentMethod = method;
			else{
				$scope.shopping.paymentMethod = "paypal";
				$scope.shopping.paypalDetail = method.data;
			}
			$http({
				method: 'POST',
				crossDomain : true,
				url: 'https://api.yati-trend.com/v1/Request/SubmitOrder',
				data: JSON.stringify($scope.shopping),
				headers: {'Content-Type': 'application/json'}
			});
		
	}
	
	$scope.createOrderCode = function (){
		let currDate = new Date();
		let str = currDate.getFullYear() + Common_pad(currDate.getMonth()+1) + Common_pad(currDate.getDate()) + $scope.shopping.contact.firstName;
		let pos = str.search(" ");//We will take only the first or last name as part of the reference
		if(pos>0){
			str = str.substring(0,pos);
		}
		$scope.shopping.orderCode = str;
	}
	
	$scope.backButtonPressed = function (){
		if( $scope.backbone.showConfirmed==true || $scope.backbone.showPaypalReceipt==true )
		{
			window.location.href = 'index.html';
		}
		else
		{
			$scope.backbone.showBank=false;
			$scope.backbone.showPayLater=false;
		}
			
	}
	
	$scope.confirmOrder = function(){
		
		
	}
	var script = document.createElement("script");
	paypalIdTest = "ARepdsMSrfrrl7TM-WgW3OuVO1UXOTUGzCcfIn1kHc8kZ4dS35xA5MY13sPDYtrqDdL34lukvDkrr4gk";
	paypalIdLive = "ARPzjpvRIiwqLcKb-idrLmOUOyinmWbEJnVk-xZJkNrB7ebehE7DXRPI60-xvvoBI1EI2Z_OLTWanD_k";
	script.src = "https://www.paypal.com/sdk/js?client-id=" + paypalIdTest + "&currency="+ $scope.currency;
	
	script.onload = function(){
	paypal.Buttons({

		createOrder: function(data, actions) {
		
		  return actions.order.create({
			payer:{
				email_address:  $scope.shopping.contact.email,
				phone: {
					phone_number:{
						national_number: $scope.shopping.contact.number.toString()
						}
				}
			},
			purchase_units: [{
			  amount: {
				value:  $scope.order.Costs[$scope.shopping.deliveryMethod].total.toString(),
				currency_code: $scope.currency,		
				breakdown: {
				  item_total: {
					  value: $scope.order.Costs[$scope.shopping.deliveryMethod].subTotal.toString(),
					  currency_code: $scope.currency
				  },
				  discount: {
					  value: $scope.order.Costs[$scope.shopping.deliveryMethod].discount.toString(),
					  currency_code: $scope.currency
				  },
				  shipping: {
					  value: $scope.order.Costs[$scope.shopping.deliveryMethod].delivery.toString(),
					  currency_code: $scope.currency
				  }
				}
			  },
			  description: 'Yati-Trend Shop',
			  custom_id: $scope.basketId,
			  //invoice_number: '12345', Insert a unique invoice number
			  payment_options: {
				allowed_payment_method: 'INSTANT_FUNDING_SOURCE'
			  },
			  soft_descriptor: 'Yati-Trend',
			  items: createPayPalObject($scope.currency, $scope.order.Items, $scope.shopping.contact.lang),
			  shipping:{
				name:{full_name: $scope.shopping.contact.firstName},
				address: {
				  address_line_1: $scope.shopping.contact.address1,
				  address_line_2: $scope.shopping.contact.address2,
				  admin_area_2: $scope.shopping.contact.city,
				  country_code: $scope.shopping.contact.countryCode,
				  postal_code: $scope.shopping.contact.postCode,
				}
			  }
				
			  
			}]
		  });
		},
		onApprove: function(data, actions) {
		  // Capture the funds from the transaction
		  return actions.order.capture().then(function(details) {
			// Show a success message to your buyer
			$scope.updatePaymentMethod({data: details});
			$scope.backbone.showPaypalReceipt=true;
			$scope.$apply();
		  });
		}}).render('#paypal-button');
	}
	document.head.appendChild(script);
  
});

function createPayPalObject(currency,obj,lang)
{
	myContainer = [];
	for(let i=0; i<obj.length; i++)
	{
		let itemName =  obj[i].Description[lang];
		let wholeId = obj[i].ItemId;
		if(obj[i].Variants.hasVariants){
			wholeId +=","+obj[i].Variants.chosenVariant;
			itemName+="," + obj[i].Variants.chosenVariant;
		}
		let price ={value:"",currency_code:currency};

		price.value = obj[i].Price[currency.toLowerCase()].toString();

		
		myContainer.push({name:itemName,sku:wholeId,unit_amount:price,quantity:obj[i].Quantity.toString(), currency:currency, category:'PHYSICAL_GOODS'});		
	}
	
	return myContainer;
	
}


	
	






