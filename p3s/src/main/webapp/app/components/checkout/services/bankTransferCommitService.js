app.factory('bankTransferCommitService', ['$http', '$q', '$state' ,function($http, $q, $state){

	var factory = {}

		factory.commitTransfer = function(order) {
			var deferred = $q.defer()
			$http.post('http://localhost:8080/p3sweb/rest-committed-banktransfer/', order)
			.then(
				function(response){
					$state.go('bank-transfer-success', {orderObj: response.data})
				},
				function(errResponse){
					console.log(errResponse)
				})
				
				return deferred.promise;

		}
	return factory;

}])