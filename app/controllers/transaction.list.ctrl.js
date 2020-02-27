angular.module('ppApp').controller('transactionsCtrl', transactionsCtrl);

transactionsCtrl.$inject = ['transactionService', '$scope', '$q', '$state'];

function transactionsCtrl(transactionService, $scope, $q, $state) {

	var vm = this;

   	vm.rowSelect = rowSelect;
   	vm.select = select;
   	vm.selectedSortType = 'p3S_TransRef';

    function select(i) {
        vm.selected = i;
    }   	

  	function rowSelect(event, transaction){
  		$state.go('transactions.modal.transaction-item', {}, {notify: false})
  	};


	$q.all([transactionService.fetchCurrentTransactions(), transactionService.fetchTransactionHistory()])
	.then(
		function(response){
			console.log(response)
			vm.transactions = response[0].concat(response[1]);
			vm.transactions.map(function(data){
				data.transTypeUI = data.historic === true ? 'Historic' : 'Current';
				data.actionProgress = currentTransactionsService.actionProgress(o.latestTransStatus);
				return data;
			})
			vm.transactionsLoaded = true;

		}
	)


}