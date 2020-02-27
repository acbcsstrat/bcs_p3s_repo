angular.module('ppApp').controller('transactionssCtrl', transactionssCtrl);

transactionssCtrl.$inject = ['$rootScope', '$scope', '$timeout', '$state', 'currentTransactions', 'currentTransactionsService'];

function transactionssCtrl($rootScope, $scope, $timeout, $state, currentTransactions, currentTransactionsService) {

	var vm = this;

	vm.patentAppData = { defaultSelect: null };
  	vm.clientRefData = { defaultSelect: null };
   	vm.sortType = sortType; // set the default sort type
  	vm.sortReverse  = false;  // set the default sort order
   	vm.transactionListFilter = transactionListFilter;
   	vm.noClientRef = noClientRef;
   	vm.displayTrans = displayTrans;
   	vm.rowSelect = rowSelect;
   	vm.select = select;
   	vm.selectedSortType = 'p3S_TransRef';

    function select(i) {
        vm.selected = i;
    }   	

    function init() {

		currentTransactions.forEach(function(data){
			data.serviceUIs.map(function(o, i){ 
				o.appAndType = o.patentUI.ep_ApplicationNumber + ' (' + o.newType +')';
				if(o.patentUI.clientRef == '') {
					o.patentUI.clientRef = '[No Client Reference Provided]'
				}
			})
			// }
		})    

		currentTransactions.map(function(o, i){
			o.actionProgress = currentTransactionsService.actionProgress(o.latestTransStatus);
		})

   	}

   	init();

	function transactionListFilter(item, index) {

		var timestamp = new Date().getTime();

	    vm.tableData.forEach(function(_ , idx) {
	         if (index != idx) {
	             _.selectedUi = null;
	         };
	    });

        $scope.filter = { 
    		selected: item,
    		stamp: timestamp
    	};

	}; 

	function noClientRef() {
		return true;
	}

	function displayTrans() {
		$state.go('transactions');
	};		

  	function rowSelect(event, transaction){
  		transactionListFilter(transaction, index)
  		$state.go('transactions.modal.patent', {patentId: patent.patentID, form1200generate: 1, prepareGrant: 0}, {notify: false})
  	};

  	$scope.$on('$destroy', function(){
  		$timeout.cancel(loadTimeout)
  	})
	
}