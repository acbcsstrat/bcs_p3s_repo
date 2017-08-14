app.component('transactionHistoryItem', {
	bindings: {
		transactionHistoryItem: '<'
	},
	templateUrl: 'p3sweb/app/components/transactions/views/transaction-history-item.htm',
	controller: ['transactionHistoryTabService', function(transactionHistoryTabService){

		var vm = this;

	  	vm.tabs = transactionHistoryTabService.tabs;
		vm.currentTab = transactionHistoryTabService.currentTab;

	    vm.onClickTab = function(currentTab) {
	        transactionHistoryTabService.onClickTab(currentTab);
	        vm.currentTab = transactionHistoryTabService.currentTab;
	    };

	    vm.isActiveTab = function(tabUrl) {
	        return tabUrl == transactionHistoryTabService.currentTab;
	    }

	    vm.$onChanges = function(changeObj){

	    	var currentItem = changeObj.transactionHistoryItem.currentValue;
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