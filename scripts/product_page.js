//The functions below allow us to store arrays in local storage to be used later
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}
products =  "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"+
			"<clothes><mens><shirts>" +
			"<item id=\"SHIRT-MEN-01\">" +
			"<description> <en>Stylish african shirts</en> <hu>Szep Ghanai nadrag</hu></description>" +
			"<image>../images/shop/men/shirt_men_01</image>" +
			"<price><huf>5200</huf></price>" +		 
			"<sizes>S,M,L</sizes>" +
			"<accessories><accessory>SHORT-MEN-01</accessory><accessory>SHORT-MEN-01</accessory></accessories>"+
			"<categories>shirt</categories></item> </shirts>" +
			"<shorts><item id=\"SHORT-MEN-01\"><description><en>Stylish african shorts</en><hu>Szep Ghanai nadrag</hu></description>" +
			"<image>../images/shop/men/short_men_01</image><price><huf>11800</huf></price><sizes>S,M,L</sizes><categories>short</categories></item></shorts></mens>" +
			"</clothes>";
			
var currentProductId;

 function runButtonAnimation(){
	$('#added-prompt').css({'opacity':0.6});
	$('#added-prompt').animate({'opacity':1},2000,'swing',function(){
			 $('#added-prompt').animate({'opacity':0},1000,'linear');
		 });
 }
 
 function handleSizeChange(){
	if($('#product_size').val()!='default')
		 $('#show_size_prompt').hide();	 
 }
 
 

var app = angular.module('myApp', []);
app.controller('Accordions', function() {
	
});

app.controller('ProductDisplay',function($scope, $timeout,$http,$location,$window){
	$scope.product={description:"",price:"",imgSrc:null,id:""};
	$scope.accessories = [];

	$http.get('/res/products.xml').then(function(library){
		loadProduct(library.data);
	});
	//loadProduct(products);
	 $('#show_size_prompt').hide(); 
	 $('#product_size').change(handleSizeChange);
	  
	$scope.checkBasket = function(){
		 if($('#product_size').val()!='default')
		 {
			 $('#show_size_prompt').hide();			 
			 runButtonAnimation();
			 Shop_addToBasket($scope.product.id, $('#product_size').val(), 1);
		 }
		 else
		 {
			$('#show_size_prompt').show();	 
		 }
	 }
	 
 
	 
	function loadProduct(library)
	{
		let productId = Common_getUrlParam('id=');
		$scope.product.id = productId;
		parser = new DOMParser();
		let database = parser.parseFromString(library,"text/xml");			
		let myPath = window.location.href; //we will use the path name later to determine the language
		//let tags=Common_getItemById(database, window.location.href);
		let specificItem = Common_getItemInner(database,"//item[@id='"+ productId +"']/description/en");
		if(specificItem==null)
			return;
		if($location.absUrl().search('/en/')>0)
		{
			$scope.product.description = specificItem;
		}
		else $scope.product.description = Common_getItemInner(database,"//item[@id='"+ productId +"']/description/hu");
		
		$scope.product.price = Common_getItemInner(database,"//item[@id='"+ productId +"']/price/huf");
		
		$scope.product.imgSrc = Common_getItemInner(database,"//item[@id='"+ productId +"']/image");
		
			
			let list= database.evaluate("//item[@id='"+productId+"']/accessories/accessory", database, null, XPathResult.ANY_TYPE, null);
			let miniTag=list.iterateNext();
			while(miniTag){
				let accessoryList = {id:"",imgSrc:"",href:""};
				accessoryList.id = miniTag.innerHTML;
				accessoryList.href =  'ProductPage.html?id=' + accessoryList.id;
				accessoryList.imgSrc =  Common_getItemInner(database, "//item[@id='"+accessoryList.id+"']/image");
				$scope.accessories.push(accessoryList);
				miniTag=list.iterateNext();
			}
		
		$timeout( function(){
			$('#img_stage').slick({
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
			  });
			}
			,100);  
	}
});
















