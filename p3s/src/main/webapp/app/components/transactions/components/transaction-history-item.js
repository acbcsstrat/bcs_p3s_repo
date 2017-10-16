app.component('transactionHistoryItem', {
	bindings: {
		transactionHistoryItem: '<'
	},
	templateUrl: 'p3sweb/app/components/transactions/views/transaction-history-item.htm',
	controller: ['transactionHistoryService', function(transactionHistoryService){

		var vm = this;

	    vm.$onChanges = function(changeObj){

	    	var currTransStatus = vm.transactionHistoryItem.latestTransStatus;	

			vm.transStatus = [
				{status: 'Initiated', active: false, complete: false}, 
				{status: 'Awaiting Funds', active: false, complete: false}, 
				{status: 'Funds Received', active: false, complete: false},
				{status: 'Funds Sent', active: false, complete: false},
				{status: 'EPO Received', active: false, complete: false}, 
				{status: 'EPO Instructed', active: false, complete: false},
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
					if(vm.transactionHistoryItem.hasFailed) {
						vm.transStatus[i].complete = true;
						if(currTransStatus == vm.transStatus[i].status) {
							vm.transStatus[i].failed = true;
							vm.transStatus[i].complete = false;
							vm.transStatus[i].active = true;
						}
					} else {
						vm.transStatus[i].active = true;
						vm.transStatus[i].complete = true;						
					}
				}
			}

			console.log(vm.transStatus)

			if(vm.transactionHistoryItem.hasFailed) {
				vm.hasFailed = true;
			} 

			switch(currTransStatus) {
	    		case 'Initiated':
	    			vm.transactionProgress = 0;
	    		break;
	    		case 'Awaiting Funds':
	    			if(vm.transactionHistoryItem.hasFailed) {
	    				vm.transactionProgress = 17.28;
	    			} else {
	    				vm.transactionProgress = 34.56;
	    			}
	    		break;
	    		case 'Funds Received':
	    			if(vm.transactionHistoryItem.hasFailed) {
	    				vm.transactionProgress = 34.56;
	    			} else {
	    				vm.transactionProgress = 51.84;
	    			}	    		
	    		break;
	    		case 'Funds Sent':
	    			if(vm.transactionHistoryItem.hasFailed) {
	    				vm.transactionProgress = 51.84;
	    			} else {
	    				vm.transactionProgress = 69.12;
	    			}	 	    		
	    		break;
	    		case 'EPO Received':
	    			if(vm.transactionHistoryItem.hasFailed) {
	    				vm.transactionProgress = 69.12;
	    			} else {
	    				vm.transactionProgress = 86.4;
	    			}		    		
	    		break;
	    		case 'EPO Instructed':
	    			if(vm.transactionHistoryItem.hasFailed) {
	    				vm.transactionProgress = 86.4;
	    			} else {
	    				vm.transactionProgress = 100;
	    			}		
	    		break;
	    		case 'Completed':
	    			vm.transactionProgress = 100;	    			    			    			    			    		
	    	}
			


			

	    	

	    	vm.renewalProgress = transactionHistoryService.renewalProgress(currTransStatus);		

	    	vm.patents = [];

	 		vm.transactionHistoryItem.renewalUIs.forEach(function(value, index, array){

	 			vm.patents.push(value)



				switch(value.renewalStatus) {
		    		case 'Payment in progress':
		    			vm.patentProgress = 33;
		    		break;
		    		case 'EPO Instructed':
		    			vm.patentProgress = 66;
		    		break;
		    		case 'Renewal In Place':
		    			vm.patentProgress = 100;
		    		break;
		    		case 'Show price':
		    			vm.patentProgress = 100;
		    		break;
		    		case 'Too late to renew':
		    			vm.patentProgress = 100;
		    		break;
		    		case 'No renewal needed':
		    			vm.patentProgress = 100;		

		    	}	
		 	})
    	}

	   


	}]
});