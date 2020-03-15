angular.module('ppApp').controller('transactionsCtrl', transactionsCtrl);

transactionsCtrl.$inject = ['transactionService', '$scope', '$q', '$state', '$timeout'];

function transactionsCtrl(transactionService, $scope, $q, $state, $timeout) {

	var vm = this;

   	vm.rowSelect = rowSelect;
   	vm.select = select;
   	vm.selectedSortType = 'p3S_TransRef';
   	vm.transactions = null;
   	var transStatusArray = ['Initiated', 'Awaiting Funds', 'Funds Received', 'Funds Sent', 'EPO Received', 'EPO Instructed', 'Completed'];

    var loadTimeout = $timeout(function() {
      	vm.transactionsLoaded = true;
    }, 300);   	

    function select(i) {
        vm.selected = i;
    }

  	function rowSelect(event, transaction){
  		$state.go('transactions.modal.transaction-item', {transId: transaction.id})
  	};

  	$scope.transactionProgress = function(status) { //assigned to scope for child scope to access
		var index = transStatusArray.indexOf(status);
		var pecentage = Math.round(((index+1) * 100) / 7);
		return pecentage;
  	}

	$scope.promise = $q.all([transactionService.fetchCurrentTransactions(), transactionService.fetchTransactionHistory()])
	$scope.promise.then(
		function(response){
			vm.transactions = response[0].concat(response[1]);
			vm.transactions.map(function(data){
				data.transTypeUI = data.historic === true ? 'Historic' : 'Current';
				data.actionProgress = $scope.transactionProgress(data.latestTransStatus);
				data.serviceUIs.map(function(o, i){
					if(o.patentUI !== undefined) {
						o.appAndType = o.patentUI.ep_ApplicationNumber + ' (' + o.newType +')';	
					} else {
						o.appAndType = o.patentApplicationNumber + ' (' + o.newType +')';	
					}
					
					return o;	
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