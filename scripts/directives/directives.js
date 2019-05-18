

angular.module('myApp').directive('myCostStr', function() {
  return {
	restrict: 'A',
    link: function($scope,elem, attr) {
		function calc(myCost)
		{
			//let myCost=parseInt(attr.myCostStr);
			if(myCost==null)
			{
				return '';
			}
			
			if($scope.currency=="EUR"){
				myCost = "€" + Number.parseFloat(myCost).toFixed(2);
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
					myCost= partBeforePoint.toString() +'.00'+ partAfterPoint.toString();
					else if(partAfterPoint<100)
						myCost= partBeforePoint.toString() +'.0'+ partAfterPoint.toString();
					else
						myCost= partBeforePoint.toString() +'.'+ partAfterPoint.toString();
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
