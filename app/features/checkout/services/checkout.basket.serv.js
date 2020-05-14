export default angular.module('services.basket-service', []).factory('BasketService', BasketService).name;

BasketService.$inject = ['$http', '$q'];

function BasketService($http, $q){

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