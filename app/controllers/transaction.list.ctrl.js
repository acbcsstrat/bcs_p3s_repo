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
  		$state.go('transactions.modal.transaction-item', {}, {notify: false})
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
					if(o.patentUI) {				
						o.appAndType = o.patentUI.ep_ApplicationNumber + ' (' + o.newType +')';
					} else {
						o.patentUI = {};
						o.patentUI.clientRef = o.clientRef;
						o.patentUI.ep_ApplicationNumber = o.patentApplicationNumber;
						o.appAndType = o.patentUI.ep_ApplicationNumber  + ' (' + o.newType +')';
					}					
				})
				return data;
			})
			vm.transactionsLoaded = true;

		}
	)

  	$scope.$on('$destroy', function(){
  		$timeout.cancel(loadTimeout)
  	})

}