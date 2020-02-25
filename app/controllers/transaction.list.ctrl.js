angular.module('ppApp').controller('transactionsCtrl', transactionsCtrl);

transactionsCtrl.$inject = ['currentTransactionsService', 'transactionHistoryService', '$scope', '$q'];

function transactionsCtrl(currentTransactionsService, transactionHistoryService, $scope, $q) {

	var vm = this;

	$q.all([currentTransactionsService.fetchCurrentTransactions(), transactionHistoryService.fetchTransactionHistory()])
	.then(
		function(response){
			vm.transactions = response[0].concat(response[1]);
			vm.transactions.map(function(data){
				data.transTypeUI = data.historic === true ? 'Historic' : 'Current';
				return data;
			})
			vm.transactionsLoaded = true;
			console.log(vm.transactions)
		}
	)

}