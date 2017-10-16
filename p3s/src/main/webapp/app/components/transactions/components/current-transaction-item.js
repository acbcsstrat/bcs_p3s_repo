app.component('currentTransaction', {
	bindings: { transaction: '<' },
	templateUrl: 'p3sweb/app/components/transactions/views/current-transaction-item.htm',
	controller: ['currentTransactionsService', 'currentTransactionTabService', function(currentTransactionsService, currentTransactionTabService) {

		var vm = this;

	    vm.$onChanges = function(changeObj){

	    	var currTransStatus = vm.transaction.latestTransStatus;	
	    	console.log(currTransStatus)
			vm.transStatus = [
				{status: 'Initiated', active: false, complete: false}, 
				{status: 'Awaiting Funds', active: false, complete: false}, 
				{status: 'Funds Received', active: false, complete: false},
				{status: 'Funds Sent', active: false, complete: false},
				{status: 'EPO Received', active: false, complete: false}, 
				{status: 'EPO Instructed', active: false, complete: false, complete: false},
				{status: 'Completed', active: false, complete: false}
			];

			vm.checkProgress = function() {
				var statusIndex;
				vm.transStatus.forEach(function(data, index){
					if(data.status == currTransStatus) {
						statusIndex = index;
					}
				})

				for(i=0; i <= statusIndex; i++){
					vm.transStatus[i].complete = true;
					if(currTransStatus == vm.transStatus[i].status) { 
						vm.transStatus[i].active = true;
						vm.transStatus[i].complete = false;
					}
				}

				console.log(vm.transStatus)
			}

			switch(currTransStatus) {
	    		case 'Initiated':
	    			vm.transactionProgress = 0;
	    		break;
	    		case 'Awaiting Funds':
    				vm.transactionProgress = 17.28;
	    		break;
	    		case 'Funds Received':
    				vm.transactionProgress = 34.56;	
	    		break;
	    		case 'Funds Sent':
    				vm.transactionProgress = 51.84;	
	    		break;
	    		case 'EPO Received':
    				vm.transactionProgress = 69.12;
	    		break;
	    		case 'EPO Instructed':
    				vm.transactionProgress = 86.4;
	    		break;
	    		case 'Completed':
	    			vm.transactionProgress = 100;	    			    			    			    			    		
	    	}

	    	vm.renewalProgress = currentTransactionsService.renewalProgress(currTransStatus);		

	    	vm.patents = [];

	 		vm.transaction.renewalUIs.forEach(function(value, index, array){
	 			vm.patents.push(value)			
		 	})

		 	console.log(vm.patents)
    	}
	}]
});