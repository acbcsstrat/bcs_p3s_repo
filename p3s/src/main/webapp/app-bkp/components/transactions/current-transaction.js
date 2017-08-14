app.component('currentTransaction', {
	bindings: { transaction: '<' },
	templateUrl: 'p3sweb/app/components/transactions/views/current-transaction-item.htm',
	controller: ['currentTransactionsService', 'currentTransactionTabService', function(currentTransactionsService, currentTransactionTabService) {

		var vm = this;

		vm.tabs = transactionTabService.tabs;
		vm.currentTab = transactionTabService.currentTab;

	    vm.onClickTab = function(currentTab) {
	        transactionTabService.onClickTab(currentTab);
	        vm.currentTab = transactionTabService.currentTab;
	    };

	    vm.isActiveTab = function(tabUrl) {
	        return tabUrl == transactionTabService.currentTab;
	    }

	    vm.selectedTransaction = vm.transactionItem;

	}]

});