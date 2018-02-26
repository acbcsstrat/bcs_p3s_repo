app.factory('timezoneService', ['$http', '$q', function($http, $q){

	var factory = {};

	factory.fetchUsaTimeZones = function() {

		var deferred = $q.defer();

		$http.get('/p3sweb/assets/json/ustimezones.json')
		.then(
			function(response){
				deferred.resolve(response.data.ustimezones)
			},
			function(errResponse){
				deferred.resolve(errResponse)
			}
		);

		return deferred.promise;
	}

	return factory;

}])