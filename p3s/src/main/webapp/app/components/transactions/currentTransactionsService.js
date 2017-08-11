app.factory('currentTransactionsService', function($http, $q) {

	var factory = {};

		var REST_SERVICE_URI = 'http://localhost:8080/p3sweb/rest-current-transactions/';

		factory.fetchCurrentTransactions = function() {

			var deferred = $q.defer();
			$http.get(REST_SERVICE_URI)
			.then(
				function(response){
					deferred.resolve(response.data)
				},
				function(errResponse){
					deferred.resolve(errResponse)
				}
			)

			return deferred.promise;

		}

	return factory;

})