//The functions below allow us to store arrays in local storage to be used later
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}
products =  null;

outOfStock = {en:"(Out Of Stock)",hu: "(Nincs raktáron)"};
			
var currentProductId;

 function runButtonAnimation(){
	$('#added-prompt').css({'opacity':0.6});
	$('#added-prompt').animate({'opacity':1},2000,'swing',function(){
			 $('#added-prompt').animate({'opacity':0},1000,'linear');
		 });
 }
 
 


var app = angular.module('myApp', ['ngAnimate','ngSanitize','slickCarousel']);
app.controller('Accordions', function() {
	
});


app.controller('ProductDisplay',function($scope, $timeout,$http,$location,$window){
	$scope.product={description:"", dimension:"", price:"",pattern:0,imgSrc:null,id:"",numOfImg:0,
					hasVariants:false,patternIsItem:false,firstInfo:"",addInfo:"",prodInfo:"",category:"",imgPref:""};
	$scope.shopping = localStorage.getObj("shopping");
	$scope.currency = $scope.shopping.currency;
	$scope.patterns=[];
	$scope.accessories = [];
	$scope.showVariant2Error = false;
	$scope.showPrompt = false;
	
	$scope.backbone = {lang:null, loading:true};
	$scope.backbone.lang= $scope.shopping.contact.lang;//for choosing of language
	$scope.basketId = localStorage.getObj("basketId");
	$scope.changeLanguage = Common_changeLanguage;
	$scope.itemInfo;
	$scope.variantOptions = {
		 availableOptions: [
			  {en: 'Please choose a size', hu: 'Kérjük, válassz méretet', value:'default', disable:false}
			],
    selectedOption:  {en: 'Please choose a size',hu: 'Kérjük, válassz méretet',value:'default', disable:false} //This sets the default value of the select in the ui
    };
	$scope.slickConfig={
				dots: true,
				infinite: true,
				slidesToShow: 2,
				slidesToScroll: 1,
				autoplay: false,
				responsive: [
				{
					breakpoint: 480, // mobile breakpoint
					settings: {
						slidesToShow: 1
					}
				}
				]	
			  };
	
	
	$scope.product.id = Common_getUrlParam('itemId=');
	
	$http.get('https://api.yati-trend.com/v1/Request/ItemData?itemId='+ $scope.product.id ).then(function(res){
		$scope.backbone.loading = false;
		loadProduct(res);
	});
	  
	$scope.checkBasket = function(){//called when customer presses the "Add to Basket" button
		  let data = {itemId: $scope.product.id, basketId:$scope.basketId};		 
		  if($scope.itemInfo.Variants.hasVariants){
			  if($scope.variantOptions.selectedOption.value=='default'){
				 $scope.showPrompt = true;
				 return;
			  }
			  else
				  data.chosenVariant = $scope.variantOptions.selectedOption.value;
		  }			
			 $http({
				method: 'POST',
				crossDomain : true,
				url: 'https://api.yati-trend.com/v1/Request/Basket/AddToBasket',
				data: JSON.stringify(data),
				headers: {'Content-Type': 'application/json'}
			}).then(function(res){
				if(res.data.Result=="OK"){
					$scope.basketId = res.data.data.basketId;
					localStorage.setObj("basketId", $scope.basketId);
					Shop_updateBasketSize(res.data.data.basketNum);
					runButtonAnimation();
					$scope.showPrompt = false;	
				}
			}); 
		fbq('track', 'AddToCart', {content_ids: [$scope.product.id], content_type: "product", contents: [{'id': $scope.product.id, 'quantity': 1}]});
		ga('send', 'event', 'Basket', 'AddToBasket');

	 }
	 
 
	 
	function loadProduct(res)
	{
		$scope.itemInfo = res.data.data;

		if($scope.itemInfo.Variants.hasVariants){
			for(let i=0;i<$scope.itemInfo.Variants.variantList.length;i++){
					val=$scope.itemInfo.Variants.variantList[i].variant;
				if($scope.itemInfo.Variants.variantList[i].quantity<=0){
					 itm = {value: val, disable: true};
					 itm[$scope.backbone.lang] = val+" " + outOfStock[$scope.backbone.lang],
					 $scope.variantOptions.availableOptions.push(itm);
				}
				else{
					 itm = {value: val, disable: false};
					 itm[$scope.backbone.lang] = val;
					 $scope.variantOptions.availableOptions.push(itm);
				}
						
			}
		}
////////////////////////////////////////////////////////////
			
	}
});
















