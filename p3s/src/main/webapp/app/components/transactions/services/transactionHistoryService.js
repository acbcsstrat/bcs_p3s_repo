app.factory('transactionHistoryService', function($http, $q) {

	var factory = {};

	var appUrl = domain;
	var REST_SERVICE_URI = appUrl +'rest-historic-transactions/';

		factory.fetchTransactionHistory = function() {

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