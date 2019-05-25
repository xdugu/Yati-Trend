//The functions below allow us to store arrays in local storage to be used later
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}


var app = angular.module('myApp', ['ngSanitize','slickCarousel']);
app.controller('Categories', function($scope, $http, $timeout, $location) {
	$scope.products=[];
	//Language stuff
	$scope.backbone = {lang:null};
	$scope.backbone.lang= localStorage.getObj("shopping").contact.lang;//for choosing of language	
	$scope.currency = localStorage.getObj("shopping").currency;
	$scope.categoryOptions = {
		 availableOptions: [
			  {name: 'All',value:''}
			],
    selectedOption:  {name: 'All',value:''} //This sets the default value of the select in the ui
    };
	$scope.slickConfig = {
		dots: false,
		infinite: false,
		slidesToShow: 2,
		slidesToScroll: 1,
		autoplay: false,
		arrows:false,
		responsive: [
		{
			breakpoint: 900, // mobile and tablet breakpoint
			settings: {
				slidesToShow: 1
			}
		}
		]	
	};
	
	
	/////////////////////////////////
	let category = Common_getUrlParam("category=")
	$http.get('https://api.yati-trend.com/v1/Request/Category?category='+ category).then(function(res){
		$scope.categoryData = res.data.data;
		
		$('#category-name').append($scope.categoryData[0].CategoryName[$scope.backbone.lang]);

			
		for(let i=0; i< $scope.categoryData.length;i++){
		let product = {description:"",price:"",imgSrc:"",href:"",imgPref:""};

			product.description = $scope.categoryData[i].Description[$scope.backbone.lang];
			product.price = $scope.categoryData[i].Price;
			product.imgSrc = $scope.categoryData[i].Image.src;
			product.imgPref = $scope.categoryData[i].Image.imagePref;
			product.href = 'ProductPage.html?itemId=' +  $scope.categoryData[i].ItemId;
			product.subCategoryName = $scope.categoryData[i].SubCategoryName;
			$scope.products.push(product);
			
			//building select list to filter results
			let matchFound=false;
			for(let j=0;j<$scope.categoryOptions.availableOptions;j++){
				if($scope.categoryData[i].SubCategoryName[$scope.backbone.lang] == $scope.categoryOptions.availableOptions[j].name){
					matchFound=true;
					break;
				}
					
			}
			if(!matchFound){
				let val = $scope.categoryData[i].SubCategoryName[$scope.backbone.lang];
				$scope.categoryOptions.availableOptions.push({name: val, value: val});
			}         
		}
		
		
		
		$timeout(function (){		
			if($scope.products[0].imgPref=="width")
			{
				$('.shop_img').css({width:"100%",height:"auto"});
				
			}
		
		}, 100);
	});
	

});