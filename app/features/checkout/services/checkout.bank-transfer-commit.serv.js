export default angular.module('services.banktransfercommit-service', []).factory('BankTransferCommitService', BankTransferCommitService).name;

BankTransferCommitService.$inject = ['$http', '$q', '$state'];

function BankTransferCommitService($http, $q, $state){

	var factory = {
		commitTransfer: commitTransfer
	};

	return factory;

	function commitTransfer(order) {

		var deferred = $q.defer();
		$http.post(ppdomain+'rest-committed-banktransfer/', order)
		.then(
			function(response){
				deferred.resolve(response.data)
			},
			function(errResponse){
				console.error('Error commmitting transacton. Error: ', errResponse)
				deferred.reject(response.data)
			});
			
			return deferred.promise;

	};
}