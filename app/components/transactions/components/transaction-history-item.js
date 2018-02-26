app.component('transactionHistoryItem', {
	bindings: {
		transactionHistoryItem: '<'
	},
	templateUrl: 'p3sweb/app/components/transactions/views/transaction-history-item.htm',
	controller: ['transactionHistoryService', function(transactionHistoryService){

		var vm = this;



	    vm.$onChanges = function(changeObj){

	    	console.log(vm.transactionHistoryItem)

	    	var currTransStatus = vm.transactionHistoryItem.latestTransStatus;	

			vm.transStatus = [
				{
					status: 'Initiated', 
					active: false, 
					complete: false,
					tip: 'You\'ve checked out your basket on the Patent Place, and we\'re now doing our work in the background.  We\'re now send the request over to our payment partners Moneycorp, requesting that they book the currency exchange, and to expect a payment from you.',
					position: 'top-left'
				}, 
				{
					status: 'Awaiting Funds', 
					active: false, 
					complete: false,
					tip: 'MoneyCorp have booked the currency exchange, and are now waiting for your payment.  They\'ll expect the funds by the date and time specified, and for it to have the correct reference on it so that the payment can be matched to the transation.',
					position: 'top-left'
				}, 
				{
					status: 'Funds Received', 
					active: false, 
					complete: false,
					tip: 'MoneyCorp have received your payment and they\'re now completing the foreign exchange.  This happens the day after your funds were expected by MoneyCorp.',
					position: 'top-left'
				},
				{
					status: 'Funds Sent', 
					active: false, 
					complete: false,
					tip: 'MoneyCorp have completed the currency exchange and the Euros have been sent to the European Patent Office.',
					position: 'top-right'
				},
				{
					status: 'EPO Received', 
					active: false, 
					complete: false,
					tip: 'We\'ve have had confirmation that the funds have been received by the EPO.',
					position: 'top-right'
				}, 
				{
					status: 'EPO Instructed', 
					active: false, 
					complete: false,
					tip: 'Everything is in place, and we’ve instructed the EPO to renew the patent.',
					position: 'top-right'
				},
				{
					status: 'Completed', 
					active: false, 
					complete: false,
					tip: 'We\'ve had confirmation that your patent has been successfully renewed by the EPO.  You can download copies of the renewal certificate and the invoice from the Transaction history tab under the Transactions menu.',
					position: 'top-right'
				}
			];

			vm.checkProgress = function() {

				var statusIndex;
				
				vm.transStatus.forEach(function(data, index){
					if(data.status == currTransStatus) {
						statusIndex = index;
					}
				});

				for(var i=0; i <= statusIndex; i++){
					if(vm.transactionHistoryItem.hasFailed) {
						vm.transStatus[i].complete = true;
						if(currTransStatus == vm.transStatus[i].status) {
							vm.transStatus[i].failed = true;
							vm.transStatus[i].complete = false;
							vm.transStatus[i].active = true;
						}
					} else {
						vm.transStatus[i].complete = true;						
					}
				}
			};

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

	 			vm.patents.push(value);

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
		 	});
    	};
	}]
});