export default angular.module('services.fx-service', []).factory('FxService', FxService).name;

FxService.$inject = ['$q', '$http'];

function FxService($q, $http) {
	
	var factory = {
		fetchFxWeek: fetchFxWeek,
		fetchFxMonth: fetchFxMonth,
		fetchFx: fetchFx
	};

	return factory;	

	function fetchFx() {

		var deferred = $q.defer()

		$http.get(ppdomain+'rest-fxrate/')
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

	function fetchFxWeek() {

		var deferred = $q.defer()

		$http.get(ppdomain+'rest-fxrates/week')
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


	function fetchFxMonth() {
		console.log('fetch what')
		var deferred = $q.defer()

		$http.get(ppdomain+'rest-fxrates/month')
		.then(
			function(response){
				console.log('fetch response', response)
				deferred.resolve(response.data)
			},
			function(errResponse){
				deferred.reject(errResponse.data)
			}
		)
		return deferred.promise;
	}
}