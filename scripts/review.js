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
app.controller('Review', function($scope, $http) {
	$scope.order = localStorage.getObj("order");
	$scope.backbone =  {showPaypalReceipt:false, showBank:false, showConfirmed:false, showPayLater:false};
	paypalObject=createPayPalObject($scope);
	
	$scope.backButtonPressed = function (){
		if($scope.backbone.showPaypalReceipt==true || $scope.backbone.showConfirmed==true)
		{
			window.location.href = 'index.html';
			Shop_finishedShopping();
			localStorage.removeItem("user");			
		}
		else
		{
			$scope.backbone.showBank=false;
			$scope.backbone.showPayLater=false;
		}
			
	}

 paypal.Button.render({
				// Configure environment
				env: 'sandbox',
				client: {
				  sandbox: 'ASI3d7KzALQpAbEV15c_bf07VmOIm0sYmPDSgnHM-BVlOfDRmNVOPkJswGmzawaQTPt4xpxdZ6jFEpLe',
				  production: 'demo_production_client_id'
				},
				style: {
				  size: 'large',
				  color: 'blue',
				  shape: 'rect',
				},
				// Set up a payment
				// Set up a payment
payment: function(data, actions) {
  return actions.payment.create({
    transactions: [{
      amount: {
        total:  $scope.order.total.toString(),
        currency: 'HUF',		
		details: {
          subtotal: $scope.order.subTotal.toString(),
		  shipping: $scope.order.delivery.toString()
        }
      },
      description: 'The payment transaction description.',
      custom: '90048630024435',
      //invoice_number: '12345', Insert a unique invoice number
      payment_options: {
        allowed_payment_method: 'INSTANT_FUNDING_SOURCE'
      },
      soft_descriptor: 'ECHI5786786',
      item_list: {
        items: paypalObject,
        shipping_address: {
          recipient_name: $scope.order.contact.firstName,
          line1: $scope.order.contact.address1,
          line2: $scope.order.contact.address2,
          city: $scope.order.contact.city,
          country_code: 'HU',
          postal_code: $scope.order.contact.postCode,
          phone: $scope.order.contact.number,
        }
      }
    }],
    note_to_payer: 'Contact us at order@yati-trend.com for any questions on your order.'
  });
},
				// Execute the payment
				onAuthorize: function(data, actions) {
				  return actions.payment.execute().then(function() {
					// Show a confirmation message to the buyer
					//window.alert('Thank you for your purchase!');
					$scope.backbone.showPaypalReceipt=true;
					$scope.$apply();
				  });
				}
			  }, '#paypal-button');
			  

});
	
	
function createPayPalObject(obj)
{
	myContainer = [];
	for(let i=0; i<obj.order.items.length; i++)
	{
		let itemName = obj.order.items[i].name;
		myContainer.push({name: itemName,sku:obj.order.items[i].id,price:obj.order.items[i].price.toString(),
			quantity:obj.order.items[i].quantity.toString(), currency:'HUF'});		
	}
	
	return myContainer;
	
}





