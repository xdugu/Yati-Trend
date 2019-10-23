

angular.module('myApp').directive('myCostStr', function() {
  return {
	restrict: 'A',
    link: function($scope,elem, attr) {
		function calc(myCost)
		{
			//let myCost=parseInt(attr.myCostStr);
			costSign = Math.abs(myCost)/myCost;
			myCost= Math.abs(myCost);
			if(myCost==null || isNaN(myCost))
			{
				return '';
			}
			
			if($scope.currency=="EUR"){
				if(myCost==0)
					myCost = "€0";
				else
					myCost = "€" + Number.parseFloat(costSign * myCost).toFixed(2);
				myCost+= " EUR";
				
			}
			else {
				if(myCost<1000)
				{
					myCost=myCost.toString();
				}
				else
				{
					let partBeforePoint = Math.trunc(myCost/1000);
					let partAfterPoint = myCost - partBeforePoint * 1000;
					if(partAfterPoint<10)
					myCost= (costSign * partBeforePoint).toString() +'.00'+ partAfterPoint.toString();
					else if(partAfterPoint<100)
						myCost= (costSign * partBeforePoint).toString() +'.0'+ partAfterPoint.toString();
					else
						myCost= (costSign * partBeforePoint).toString() +'.'+ partAfterPoint.toString();
				}
				myCost+=" Ft";
			}
		  return myCost;	
		}
		$scope.$watch(attr.myCostStr, function(value) {
				elem.text(calc(value));
		});
    }
  };
});

angular.module('myApp').filter('accentsfilter',function(){
	function removeAccents(value) {
		return value
            .replace(/á/g, 'a')            
            .replace(/é/g, 'e')
            .replace(/í/g, 'i')
            .replace(/ó/g, 'o')
			.replace(/ö/g, 'o')
			.replace(/ő/g, 'o')
			.replace(/ű/g, 'u')
            .replace(/ú/g, 'u')
			.replace(/ü/g, 'u')
    }

    return function(items, filter) {               
        if (!filter) return items;       
		var finalArr=[];
		
		items.forEach(function(item){			
			keys = Object.values(item);//expecting an object so will loop through the properties
			for (const key of keys) {
				var text = removeAccents(key.toLowerCase())
				filter = removeAccents(filter.toLowerCase());
				if(text.indexOf(filter) > -1){
					finalArr.push(item);
					break;
				}
			}
		});
		
		return finalArr;
    };
	
});
//directive to help keep images of items at the same height
angular.module('myApp').directive('myImageSizer', function($interval) {
  return {
	restrict: 'A',
    link: function($scope,elem, attr) {
	    let lastSize = 0;
		let promise = $interval(function(){
			indexOfShortestImage=0;
			shortestHeight=2000;
			images = $(elem).find('img');
			for(let i=0;i< images.length; i++){
				if(!images[i].complete)
					return;
				if(images[i].height<shortestHeight && images[i].src.indexOf('loading')<0)
				{
					shortestHeight = images[i].height;
					indexOfShortestImage = i;
				}
			}
			if(shortestHeight != lastSize && shortestHeight!=2000){
				//check if image has changed size and that also all the images are not just loading gifs
				$(elem).children('div').css({'height': shortestHeight.toString() + 'px'});

			 lastSize = shortestHeight;
			}

		},1000);
    }
  };
});
angular.module('myApp').directive('myImageSizerv2', function($interval) {
  return {
	restrict: 'A',
    link: function($scope,elem, attr) {
	    let lastSize = 0;
		let promise = $interval(function(){
			indexOfShortestImage=0;
			shortestHeight=2000;
			images = $(elem).find('img');
			for(let i=0;i< images.length; i++){
				if(!images[i].complete)
					return;
				if(images[i].height<shortestHeight && images[i].src.indexOf('loading')<0)
				{
					shortestHeight = images[i].height;
					indexOfShortestImage = i;
				}
			}
			if(shortestHeight != lastSize && shortestHeight!=2000){
				//check if image has changed size and that also all the images are not just loading gifs
			//$(elem).find('img').css({'height': shortestHeight.toString() + 'px'});
			for(let i =0; i <images.length; i++){
				let diff = shortestHeight - images[i].height;
				$(images[i]).parent().css({'height':  shortestHeight.toString() + 'px', 'overflow-y': 'hidden'})
			}
			 //$(elem).find('img').css({'margin-bottom':  '100px'});
			 lastSize = shortestHeight;
			}

		},1000);
    }
  };
});

//function to deal with newletter sign up
angular.module('myApp').directive('myNewsletter', function($http) {
    return {
        restrict: 'A',
        link: function($scope, element, attrs) {
			
            $scope.submitEmail= function(email) {
				data={"email": email};
                 $http({
				method: 'POST',
				crossDomain : true,
				url: 'https://api.yati-trend.com/v1/Request/AddNewsletter1',
				data: JSON.stringify(data),
				headers: {'Content-Type': 'application/json'}
			}).then(function(res){
					$scope.showThanks = true;
				
			}).catch(function(err){
				$scope.showError = true;
			}); 
            }
        }
    }
});

angular
    .module('myApp')
    .directive('lazyLoad', lazyLoad)

function lazyLoad(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
			//at the moment, looking at intersection for just one image of group
			const img = angular.element(element)[0];
			img.src = "/images/loading.gif";
			let options = {
				root: null,
				rootMargin: '30% 10% 80% 10%', //setting margin to prempt loading
				threshold: 0
			}
            const observer = new IntersectionObserver(loadImg, options);           
            observer.observe(img)

            function loadImg(changes){
                changes.forEach(change => {
                    if(change.intersectionRatio > 0){
						if(!change.target.src.includes(attrs.lazyLoad)){
							change.target.src = attrs.lazyLoad;
						}
                    }
                })
            }    

        }
    }
}
