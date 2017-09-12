app.component('currentTransaction', {
	bindings: { transaction: '<' },
	templateUrl: 'p3sweb/app/components/transactions/views/current-transaction-item.htm',
	controller: ['currentTransactionsService', 'currentTransactionTabService', function(currentTransactionsService, currentTransactionTabService) {

		var vm = this;

	    vm.$onChanges = function(changeObj){

	    	vm.transStatus = ['Initiated', 'Pending', 'Rec. Funds', 'Funds Sent', 'EPO Rec.', 'EPO Ins.', 'Completed'];

	    	vm.patents = [];

	 		vm.transaction.renewalUIs.forEach(function(value, index, array){
	 			vm.patents.push(value)			
		 	})
    	}

    	vm.$onInit =  function() {
    		console.log(vm.transaction)
    	}
	}]
});