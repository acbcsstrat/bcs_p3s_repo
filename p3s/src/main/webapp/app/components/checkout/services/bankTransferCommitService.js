app.factory('bankTransferCommitService', ['$http', '$q', '$state' ,function($http, $q, $state){

	var factory = {}

		factory.commitTransfer = function(order) {
		console.log("Inside service")
			var deferred = $q.defer()
			console.log("before POST in commitservice.js")
			$http.post('http://localhost:8080/p3sweb/rest-committed-banktransfer/', order)
			.then(
				function(response){
					console.log("Inside success response")
					console.log(response)
					$state.go('bank-transfer-success', {orderObj: response.data})
				},
				function(errResponse){
					console.log(errResponse)
				})
				
				return deferred.promise;

		}
	return factory;

}])