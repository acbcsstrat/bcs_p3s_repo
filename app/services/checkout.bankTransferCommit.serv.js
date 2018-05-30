angular.module('ppApp').factory('bankTransferCommitService', bankTransferCommitService);

bankTransferCommitService.$inject = ['$http', '$q', '$state'];

export default function bankTransferCommitService($http, $q, $state){

	var factory = {
		commitTransfer: commitTransfer
	};

	return factory;

	function commitTransfer(order) {
		var deferred = $q.defer();
		$http.post(ppdomain+'rest-committed-banktransfer/', order)
		.then(
			function(response){
				$state.go('bank-transfer-success', {orderObj: response.data});
			},
			function(errResponse){
			});
			
			return deferred.promise;

	};
}