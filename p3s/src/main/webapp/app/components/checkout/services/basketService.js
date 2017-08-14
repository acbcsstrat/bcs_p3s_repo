app.factory('basketService', ['$http', '$q', function($http, $q){

	var factory = {};

		var REST_SERVICE_URI = 'http://localhost:8080/p3sweb/rest-basket/1,2';

		factory.fetchBasketItems = function() {

			var deferred = $q.defer();

			$http.get(REST_SERVICE_URI)
			.then(
				function(response){
					deferred.resolve(response.data)
				},
				function(errResponse){
					deferred.reject(errResponse)
				}
			)

			return deferred.promise;
			
		}

	return factory;

}])