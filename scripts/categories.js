//The functions below allow us to store arrays in local storage to be used later
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

var scope;

var app = angular.module('myApp', ['ngSanitize','slickCarousel']);

app.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode({ enabled: true, requireBase: false, rewriteLinks: false });
}]);

app.controller('Categories', function($scope, $http, $timeout, $location,$window) {
	$scope.products=[];
	$scope.urlParams = Common_parseUrlParam();
	//Language stuff
	$scope.backbone = {lang:null};
	$scope.backbone.lang= localStorage.getObj("shopping").contact.lang;//for choosing of language	
	$scope.currency = localStorage.getObj("shopping").currency;
	$scope.categoryOptions = {
		 availableOptions: [
			  {hu: 'Mind', en:'All', value:''}
			],
    selectedOption:   {hu: 'Mind', en:'All', value:''} //This sets the default value of the select in the ui
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
	//Called when different subCategory chosen. To keep consistency when going back to category, I need to change the href
	$scope.changeSubCat = function (){
		$window.history.pushState(null,'', "?category="+ $scope.urlParams.category +"&subCategory="+ $scope.categoryOptions.selectedOption.value);
	}
	
	$scope.myFilter = function (product) { 
    return (product.subCategoryName[$scope.backbone.lang]== $scope.categoryOptions.selectedOption.value) || $scope.categoryOptions.selectedOption.value=='' ; 
	};
	//We need to monitor a change in the url so we can update the subcategories correctly
	$scope.$on('$locationChangeStart', function (event, newLoc, oldLoc) { 
		$scope.urlParams = Common_parseUrlParam();
	   for(let j=0; j<$scope.categoryOptions.availableOptions.length; j++){
				if($scope.categoryOptions.availableOptions[j].value ==  $scope.urlParams.subCategory){
					$scope.categoryOptions.selectedOption = $scope.categoryOptions.availableOptions[j];
					break;
				}
			}
	 });
	
	/////////////////////////////////
	$http.get('https://api.yati-trend.com/v1/Request/Category?category='+ $scope.urlParams.category).then(function(res){
		$scope.categoryData = res.data.data;
		
		$('#category-name').append($scope.categoryData[0].CategoryName[$scope.backbone.lang]);

			
		for(let i=0; i< $scope.categoryData.length;i++){
		let product = {description:"",price:"",imgSrc:"",href:"",imgPref:""};

			product.description = $scope.categoryData[i].Description[$scope.backbone.lang];
			product.price = $scope.categoryData[i].Price;
			product.imgSrc = $scope.categoryData[i].Image.src;
			product.imgPref = $scope.categoryData[i].Image.imgPref;
			product.numberOfImages = $scope.categoryData[i].Image.numberOfImages;
			if($scope.categoryData[i].Image.numberOfImages<=1){
				$scope.slickConfig.slidesToShow = 1;
			}
			product.href = 'ProductPage.html?itemId=' +  $scope.categoryData[i].ItemId;
			product.subCategoryName = $scope.categoryData[i].SubCategoryName;
			$scope.products.push(product);
			
			//building select list to filter results
			let matchFound=false;
			//Since we will probably have more than one item with the same sub-category, we have to make sure that we don't
			//repeat the same subcategory
			for(let j=0;j<$scope.categoryOptions.availableOptions.length;j++){
				if($scope.categoryData[i].SubCategory == $scope.categoryOptions.availableOptions[j].value){
					matchFound=true;
					break;
				}
					
			}
			//if we don't find a match, we add its subcategory to the list
			if(!matchFound){
				opt = {value: $scope.categoryData[i].SubCategory};
				opt[$scope.backbone.lang] = $scope.categoryData[i].SubCategoryName[$scope.backbone.lang];
				$scope.categoryOptions.availableOptions.push(opt);
			}
			
					
		}
		//we will check the url to check if a sub category has already been specified to choose this instead of the default for all
		for(let j=0; j<$scope.categoryOptions.availableOptions.length; j++){
				if($scope.categoryOptions.availableOptions[j].value ==  $scope.urlParams.subCategory){
					$scope.categoryOptions.selectedOption = $scope.categoryOptions.availableOptions[j];
					break;
				}
			}
		$timeout(function(){
		if($scope.products[0].imgPref=="height")
		{
					$('.shop_img').css({width:"auto",height:"100%"});
					
		}	
		},2000);
	
		
	});
	

});



