//The functions below allow us to store arrays in local storage to be used later
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}
products =  null;
			
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
	
	$scope.backbone = {lang:null};
	$scope.backbone.lang= $scope.shopping.contact.lang;//for choosing of language
	$scope.basketId = localStorage.getObj("basketId");
	$scope.changeLanguage = Common_changeLanguage;
	$scope.itemInfo;
	$scope.variantOptions = {
		 availableOptions: [
			  {name: 'Please choose a size',value:'default', disable:false}
			],
    selectedOption:  {name: 'Please choose a size',value:'default', disable:false} //This sets the default value of the select in the ui
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
		loadProduct(res);
	});
	  
	$scope.checkBasket = function(){//called when customer presses the "Add to Basket" button
			
		  if($scope.itemInfo.Variants.hasVariants){
			  if($scope.variantOptions.selectedOption.value=='default'){
				 $scope.showPrompt = true;
				 return;
			  }
		  }
		  $scope.showPrompt = false;	
		  runButtonAnimation();
			/*
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
				}
			}); */

	 }
	 
 
	 
	function loadProduct(res)
	{
		$scope.itemInfo = res.data.data;
		
		$scope.product.description = $scope.itemInfo.Description[$scope.backbone.lang];


		
		$scope.product.price = $scope.itemInfo.Price;
		
		$scope.product.imgSrc = $scope.itemInfo.Image.src;
		
		$scope.product.imgPref = $scope.itemInfo.Image.imagePref;
		
		$scope.product.category = $scope.itemInfo.Category;
		let numOfImg = $scope.itemInfo.Image.numberOfImages;
		/*
		$scope.product.firstInfo = $scope.itemInfo.additionalInfo.FirstInfo.en;
		$scope.product.addInfo = $scope.itemInfo.additionalInfo.AdditionalInfo.en;
		$scope.product.prodInfo = $scope.itemInfo.additionalInfo.ProductInfo.en;
		*/
		if($scope.itemInfo.Variants.hasVariants){
			for(let i=0;i<$scope.itemInfo.Variants.variantList.length;i++){
					val=$scope.itemInfo.Variants.variantList[i].variant;
				if($scope.itemInfo.Variants.variantList[i].quantity<=0){				
					 $scope.variantOptions.availableOptions.push({name:val+" (Out Of stock)", value: val, disable: true});
				}
				else{
					 $scope.variantOptions.availableOptions.push({name:val , value: val, disable:false});
				}
						
			}
		}


		if(!isNaN(numOfImg))
			$scope.product.numOfImg = numOfImg;
		else
			$scope.product.numOfImg = 1;
////////////////////////////////////////////////////////////
			
	}
});
















