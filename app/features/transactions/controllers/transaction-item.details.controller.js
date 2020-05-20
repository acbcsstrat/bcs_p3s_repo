TransactionDetailsController.$inject = ['$scope', '$state', '$timeout', 'transactionItem' ];

export default function TransactionDetailsController($scope, $state, $timeout, transactionItem) {


	var vm = this;
	var transStatusArray = ['Initiated', 'Awaiting Funds', 'Funds Received', 'Funds Sent', 'EPO Received', 'EPO Instructed', 'Completed'];
	var transStatusValidationArray = ['Initiated', 'Awaiting Funds', 'Processing Funds', 'Processing', 'Completed'];		
	
	$scope.promise.then(function(){
		vm.transactionItem = transactionItem;
	    var isValidation = transactionItem.serviceUIs.some(function(item){
	        return item.newType == 'Validation' ? true : false;
	    })
	    vm.transactionItem.serviceUIs.map(function(item, index){
			item.transItemStatus = transItemStatus(isValidation, transactionItem.latestTransStatus, vm.transactionItem.hasFailed);
	    })
	})
	

    function transItemStatus(val, status, failed) {

    	if(failed) {
    		return 'Failed'
    	} else {
	    	
	    	var index;
	    	if(val === true) {
	    		index = transStatusValidationArray.indexOf(status);
		    	if(index < 3) {
		    		return 'Payment in progress'
		    	} else {
		    		return status;
		    	}    		
	    	} else {
	    		index = transStatusArray.indexOf(status);
		    	if(index < 5) {
		    		return 'Payment in progress'
		    	} else {
		    		return status;
		    	}        		
	    	}

    	}

    }

}