app.component('currentTransaction', {
	bindings: { transaction: '<' },
	templateUrl: 'p3sweb/app/components/transactions/views/current-transaction-item.htm',
	controller: ['currentTransactionsService', 'currentTransactionTabService', function(currentTransactionsService, currentTransactionTabService) {

		var vm = this;

	    vm.$onChanges = function(changeObj){

	    	console.log(vm.transaction)

	    	var currTransStatus = vm.transaction.latestTransStatus;
	    	vm.transStatuses = ['Initiated', 'Pending', 'Rec. Funds', 'Funds Sent', 'EPO Rec.', 'EPO Ins.', 'Completed']

	    	vm.renewalProgress = currentTransactionsService.renewalProgress(currTransStatus);		
	    
	    	vm.patents = [];

	 		vm.transaction.renewalUIs.forEach(function(value, index, array){
	 			vm.patents.push(value)			
		 	})

		 	console.log(vm.patents)
    	}

	}]
});