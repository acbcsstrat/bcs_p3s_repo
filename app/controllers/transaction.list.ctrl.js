angular.module('ppApp').controller('transactionsCtrl', transactionsCtrl);

transactionsCtrl.$inject = ['transactionService', '$scope', '$q', '$state', '$timeout'];

function transactionsCtrl(transactionService, $scope, $q, $state, $timeout) {

	var vm = this;

   	vm.rowSelect = rowSelect;
   	vm.select = select;
   	vm.selectedSortType = 'p3S_TransRef';

    var loadTimeout = $timeout(function() {
      	vm.transactionsLoaded = true;
    }, 300);   	

    function select(i) {
        vm.selected = i;
    }

  	function rowSelect(event, transaction){
  		console.log(event, transaction)
  		$state.go('transactions.modal.transaction-item', {transHref: transaction.id}, {notify: false})
  	};

	$q.all([transactionService.fetchCurrentTransactions(), transactionService.fetchTransactionHistory()])
	.then(
		function(response){
			vm.transactions = response[0].concat(response[1]);
			vm.transactions.map(function(data){
				data.transTypeUI = data.historic === true ? 'Historic' : 'Current';
				data.actionProgress = currentTransactionsService.actionProgress(o.latestTransStatus);
				data.serviceUIs.map(function(o, i){
					o.appAndType = o.patentUI.ep_ApplicationNumber || o.patentApplicationNumber + ' (' + o.newType +')';		
				})
				return data;
			})
			vm.transactionsLoaded = true;
			console.log(transactions)

		}
	)

  	$scope.$on('$destroy', function(){
  		$timeout.cancel(loadTimeout)
  	})

}