app.component('currentTransaction', {
	bindings: { transaction: '<' },
	templateUrl: 'p3sweb/app/components/transactions/views/current-transaction-item.htm',
	controller: ['currentTransactionsService', 'currentTransactionTabService', function(currentTransactionsService, currentTransactionTabService) {

		var vm = this;

		vm.tabs = currentTransactionTabService.tabs;
		vm.currentTab = currentTransactionTabService.currentTab;

	    vm.onClickTab = function(currentTab) {
	        currentTransactionTabService.onClickTab(currentTab);
	        vm.currentTab = currentTransactionTabService.currentTab;
	    };

	    vm.isActiveTab = function(tabUrl) {
	        return tabUrl == currentTransactionTabService.currentTab;
	    }

	    vm.$onChanges = function(changeObj){

	    	var currentItem = changeObj.transaction.currentValue;
	    	console.log(currentItem)
    	 	vm.patent = currentItem.renewalUIs;
    	 	vm.transactionItemRef = currentItem.p3S_TransRef;
    	 	vm.transactionPdf = currentItem.invoiceUrl;
    	 	vm.transactionTotal = currentItem.transAmount_USD;
    	 	// vm.transactionDate = currentItem.transStartDate;

    	 	var init = function() {
    	 		vm.transactionDate = new Date(currentItem.transStartDate)
    	 	}
    	 	
    	 	init();

	   		vm.transactionItem = [];

	 		vm.patent.forEach(function(value, index, array){

	 			itemArray = []
	 			itemArray.push(value);

	 			itemArray.forEach(function(value, index, array){

	 				itemObj = {};
	 				itemObj.fee = value.fee;
	 				itemObj.patent = value.patentUI;
	 				
	 				vm.transactionItem.push(itemObj)

	 			})
		 	})		 	

    	}

	}]

});