app.factory('fxService', function($q, $http) {
	
	var factory = {};

		factory.fetchFxWeek = function() {

			var deferred = $q.defer()

			$http.get('http://localhost:8080/p3sweb/rest-fxrates/week')
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


		factory.fetchFxMonth = function() {

			var deferred = $q.defer()

			$http.get('http://localhost:8080/p3sweb/rest-fxrates/month')
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

	return factory;

})