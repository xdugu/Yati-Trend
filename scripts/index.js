  
var app = angular.module('myApp', ['slickCarousel']);
app.controller('HomePage', function($http,$scope) {

$scope.slickConfig={
				dots: false,
				arrows:false,
				infinite: true,
				slidesToShow: 1,
				slidesToScroll: 1,
				autoplay: true,
				autoplaySpeed: 3500,
				pauseOnHover: false,
				pauseOnFocus:false,
				speed:2000,
				fade:true,
				swipe : false,
				lazyLoad: 'ondemand',
				responsive: [
				{
					breakpoint: 480, // mobile breakpoint
					settings: {
						slidesToShow: 1,
					}
				}
				]		
			  };

});



	