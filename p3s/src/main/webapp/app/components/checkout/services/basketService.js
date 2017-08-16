app.factory('basketService', ['$http', '$q', function($http, $q){

	var factory = {};

	var appUrl = domain;
	var REST_SERVICE_URI = appUrl +'rest-basket/1,2';

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