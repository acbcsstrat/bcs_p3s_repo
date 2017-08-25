app.factory('basketService', ['$http', '$q', function($http, $q){

	var factory = {};

		var REST_SERVICE_URI = 'http://localhost:8080/p3sweb/rest-basket/';

		factory.fetchBasketPatents = function(ids) {

			var deferred = $q.defer();

			$http.post(REST_SERVICE_URI, ids)
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