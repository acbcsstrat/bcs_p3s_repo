angular.module('ppApp').factory('bankTransferCommitService', bankTransferCommitService);

bankTransferCommitService.$inject = ['$http', '$q', '$state'];

function bankTransferCommitService($http, $q, $state){

	var factory = {
		commitTransfer: commitTransfer
	};

	return factory;

	function commitTransfer(order) {

		var commitOrder = {}
		commitOrder.totalCostUSD = order.totalCostUSD;
		commitOrder.billingDetails = order.billingDetails;
		commitOrder.patent_ids = (function(){
			return order.orderedPatentUIs.map(function(el) {
				console.log(el.id)
				return el.id;
			})
		}())

		var deferred = $q.defer();
		$http.post(ppdomain+'rest-committed-banktransfer/', commitOrder)
		.then(
			function(response){
				deferred.resolve(response.data)
			},
			function(errResponse){
				deferred.reject(response.data)
			});
			
			return deferred.promise;

	};
}