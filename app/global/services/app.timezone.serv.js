export default angular.module('services.timezone-service', []).factory('TimezoneService', TimezoneService).name;

TimezoneService.$inject = ['$http', '$q'];

function TimezoneService($http, $q){

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