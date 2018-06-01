angular.module('ppApp').factory('fxService', fxService);

fxService.$inject = ['$q', '$http'];

function fxService($q, $http) {
	
	var factory = {
		fetchFxWeek: fetchFxWeek,
		fetchFxMonth: fetchFxMonth
	};

	return factory;	

	function fetchFxWeek() {

		var deferred = $q.defer()

		$http.get(ppdomain+'rest-fxrates/week')
		.then(
			function(response){
				deferred.resolve(response.data)
			},
			function(errResponse){
				deferred.reject(response.data)
			}
		)
		return deferred.promise;
	}


	function fetchFxMonth() {

		var deferred = $q.defer()

		$http.get(ppdomain+'rest-fxrates/month')
		.then(
			function(response){
				deferred.resolve(response.data)
			},
			function(errResponse){
				deferred.reject(errResponse.data)
			}
		)
		return deferred.promise;
	}
}