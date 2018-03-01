app.factory('bankTransferCommitService', ['$http', '$q', '$state' ,function($http, $q, $state){

	var factory = {};

		factory.commitTransfer = function(order) {
			var deferred = $q.defer();
			$http.post(domain+'rest-committed-banktransfer/', order)
			.then(
				function(response){
					$state.go('bank-transfer-success', {orderObj: response.data});
				},
				function(errResponse){
				});
				
				return deferred.promise;

		};
  
	return factory;

}]);