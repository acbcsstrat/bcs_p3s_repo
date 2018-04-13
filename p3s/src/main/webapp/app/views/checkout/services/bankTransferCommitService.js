angular.module('ppApp').factory('bankTransferCommitService', bankTransferCommitService);

bankTransferCommitService.$inject = ['$http', '$q', '$state'];

function bankTransferCommitService($http, $q, $state){

	var factory = {
		commitTransfer: commitTransfer
	};

	return factory;

	function commitTransfer(order) {
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
}