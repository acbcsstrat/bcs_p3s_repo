angular.module('ppApp').factory('timezoneService', timezoneService);

timezoneService.$inject = ['$http', '$q'];

function timezoneService($http, $q){

	var factory = {
		fetchUsaTimeZones: fetchUsaTimeZones
	};

 	function fetchUsaTimeZones() {
		var deferred = $q.defer();
		$http.get('/p3sweb/public/ustimezones.json')
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
}