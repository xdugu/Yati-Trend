//The functions below allow us to store arrays in local storage to be used later
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}


var app = angular.module('myApp', []);
app.controller('Test', function($scope, $http, $timeout, $location) {
	
	$scope.places =[];
	$http.get("/convertcsv.json").then(function(resp){
		$scope.places = resp.data;
	});

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

    $scope.ignoreAccents = function(item) {               
        if (!$scope.search) return true;       
		
		keys = Object.values(item);//expecting an object so will loop through the properties
		for (const key of keys) {
			var text = removeAccents(key.toLowerCase())
			var search = removeAccents($scope.search.toLowerCase());
			if(text.indexOf(search) > -1)
				return true;
		}
        
        return false;
    };

	$scope.his = function(){
		history.pushState(null,'','?hater=you&bater=3');
		
	}
	


});














