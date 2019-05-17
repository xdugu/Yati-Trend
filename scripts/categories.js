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
			"<image>images/shop/men/shirt_men_01</image>" +
			"<price><huf>5200</huf></price>" +		 
			"<sizes>S,M,L</sizes>" +
			"<categories>shirt</categories></item> </shirts>" +
			"<shorts><item id=\"SHORT-MEN-01\"><description><en>Stylish african shorts</en><hu>Szep Ghanai nadrag</hu></description>" +
			"<image>images/shop/men/short_men_01</image><price><huf>11800</huf></price><sizes>S,M,L</sizes><categories>short</categories></item></shorts></mens>" +
			"</clothes>";

var app = angular.module('myApp', []);
app.controller('Categories', function($scope, $http, $timeout, $location) {
	$scope.products=[];
	$http.get('/res/products.xml').then(function(library){
		fillTemplate(library.data);
	});
	
	
	function fillTemplate(library){
		let myPath = window.location.href; //we willuse the path name later to determine the language
		let path= getProductPath();
		parser = new DOMParser();
		library = parser.parseFromString(library,"text/xml");
		let nodes = library.evaluate(path, library, null, XPathResult.ANY_TYPE, null);
		let tags =  nodes.iterateNext();
		while(tags){
			let product = {description:"",price:"",imgSrc:"",href:""};
			product.href = 'ProductPage.html?id=' + tags.id;
			
		let specificItem = Common_getItemInner(library,"//item[@id='"+ tags.id +"']/description/en");
		if(specificItem==null)
			return;
		if($location.absUrl().search('/en/')>0)
		{
			product.description = specificItem;
		}
		else product.description = Common_getItemInner(library,"//item[@id='"+tags.id+"']/description/hu");
		
		product.price = Common_getItemInner(library,"//item[@id='"+ tags.id+"']/price/huf");
		
		product.imgSrc = Common_getItemInner(library,"//item[@id='"+ tags.id +"']/image");
		
			$scope.products.push(product);
			tags = nodes.iterateNext();
		}
		
		$timeout(function (){		
			$('.category-image').slick({
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
		  });
		}, 100);
	}


});

//this function is called to get the search string rquired for xpath xml query and will also set the header
//depending on the language
function getProductPath()
{
	let pathname = window.location.href;
	
	if(pathname.search("w_dresses")>0){
		if(pathname.search("/en")>0)
			$('#category-name').append('Dresses');
		else 
			$('#category-name').append('Ruhák');
		return "clothes/womens/dresses/item";
	}
	if(pathname.search("w_tops")>0){
		if(pathname.search("/en")>0)
			$('#category-name').append('Dresses');
		else 
			$('#category-name').append('Ruhák')
		return "clothes/womens/tops/item";
	}
	if(pathname.search("w_skirts")>0){
		if(pathname.search("/en")>0)
			$('#category-name').append('Skirts');
		else 
			$('#category-name').append('Szoknyák')
		return "clothes/womens/skirts/item";
	}
	if(pathname.search("w_blouses")>0){
		if(pathname.search("/en")>0)
			$('#category-name').append('Blouses');
		else 
			$('#category-name').append('Blúzok')
		return "clothes/womens/blouses/item";
	}
	if(pathname.search("w_trousers")>0){
		if(pathname.search("/en")>0)
			$('#category-name').append('Trousers');
		else 
			$('#category-name').append('Nadrágok')
		return "clothes/womens/trousers/item";
	}
	if(pathname.search("w_jumpsuits")>0){
		if(pathname.search("/en")>0)
			$('#category-name').append('Jumpsuits');
		else 
			$('#category-name').append('Overálok')
		return "clothes/womens/jumpsuits/item";
	}
	
	if(pathname.search("m_shirts")>0){
		if(pathname.search("/en")>0)
			$('#category-name').append('Shirts');
		else 
			$('#category-name').append('Ingek')
		return "clothes/mens/shirts/item";
	}
	if(pathname.search("m_shorts")>0){
		if(pathname.search("/en")>0)
			$('#category-name').append('Shorts');
		else 
			$('category-name').append('Nadragak')
		return "clothes/mens/shorts/item";
	}
	if(pathname.search("m_trousers")>0){
		if(pathname.search("/en")>0)
			$('#category-name').append('Trousers');
		else 
			$('#category-name').append('Nadrágak')
		return "clothes/mens/trousers/item";
	}
	if(pathname.search("m_t-shirts")>0){
		if(pathname.search("/en")>0)
			$('#category-name').append('T-Shirts');
		else 
			$('#category-name').append('Polok')
		return "clothes/mens/t-shirts/item";
	}
	if(pathname.search("m_all")>0){
		if(pathname.search("/en")>0)
			$('#category-name').append('Mens');
		else 
			$('#category-name').append('Férfi')
		return "clothes/mens//item";
	}
	
	
}

















