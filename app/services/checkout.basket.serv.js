angular.module('ppApp').factory('basketService', basketService);

basketService.$inject = ['$http', '$q'];

export default function basketService($http, $q){

	var factory = {};

		var REST_SERVICE_URI = ppdomain+'rest-basket/';
		
		factory.fetchBasketPatents = function(ids) {

			var deferred = $q.defer();

			$http.post(REST_SERVICE_URI, ids)
			.then(
				function(response){
					deferred.resolve(response.data);
				},
				function(errResponse){
					deferred.reject(errResponse);
				}
			);

			return deferred.promise;
			
		};

	return factory;

}