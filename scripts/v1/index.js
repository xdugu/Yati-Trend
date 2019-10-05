  
var app = angular.module('myApp', ['slickCarousel']);
app.controller('HomePage', function($http, $scope) {

$scope.blogList = [];
/////////////////////////////////
	$http.get('https://api.yati-trend.com/v1/Request/Blog/GetBlogList').then(function(res){
		let tBlogList = res.data.data;
		for( let i=0; i< tBlogList.length; i++){
			if(tBlogList[i].published)
			{
				$scope.blogList.push(tBlogList[i]);
				if($scope.blogList.length >= 3){
					break;
				}
			}
		}
		
	});

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



	