export default angular.module('services.TransactionService', []).factory('TransactionService', TransactionService).name;

TransactionService.$inject = ['$http', '$q'];

function TransactionService($http, $q) {

	var REST_SERVICE_URI_CURRENT = ppdomain+'rest-current-transactions/';
	// var REST_SERVICE_URI_HISTORY = ppdomain+'rest-historic-transactions/';

	var factory = {
		fetchCurrentTransactions:fetchCurrentTransactions,
		// fetchTransactionHistory: fetchTransactionHistory,
		// fetchAllTransactions: fetchAllTransactions
		fetchAllTransactions: fetchAllTransactions,
		actionProgress: actionProgress
	};

	return factory;

  	function transactionProgress(val, status) { //assigned to scope for child scope to access
	    var transStatusArray = ['Initiated', 'Awaiting Funds', 'Funds Received', 'Funds Sent', 'EPO Received', 'EPO Instructed', 'Completed'];
	    var transStatusValidationArray = ['Initiated', 'Awaiting Funds', 'Processing Funds', 'Processing', 'Completed'];
  		var arrayType;
  		if(val == true) {
  			arrayType = transStatusValidationArray;
  		} else {
  			arrayType = transStatusArray;
  		}
		var index = arrayType.indexOf(status);
		var length = arrayType.length;
		var percentage = Math.round(((index+1) * 100) / length);
		return percentage;
  	}


	function fetchAllTransactions() {

		var deferred = $q.defer();

		$http.get(ppdomain+'rest-all-transactions/')
		.then(
			function(response){
				// console.log('success response: ', response)
				response.data.map(function(data){	
					// console.log(data)
      	
                	if(data.renewalV4UIs.length) {
	                	data.renewalV4UIs.map(function(o){ 
	                		o.newType = 'Renewal';
	                	})
                	}
                	if(data.grantUIs.length) {
	                	data.grantUIs.map(function(o){ 
	                		o.newType = 'Grant';
	                	})
                	}
                	if(data.epctUIs.length) {
	                	data.epctUIs.map(function(o){ 
	                		o.newType = 'Euro-PCT';
	                	})
                	}
                	if(data.validationUIs.length) {
	                	data.validationUIs.map(function(o){ 
	                		o.newType = 'Validation';
	                	})
                	}                	
                    data.serviceUIs = [];
                    data.serviceUIs = data.serviceUIs.concat(data.renewalV4UIs, data.grantUIs, data.epctUIs, data.validationUIs)

					data.transTypeUI = data.historic === true ? 'Historic' : 'Current';
	                var isValidation = data.serviceUIs.some(function(item){
	                    return item.newType == 'Validation' ? true : false;
	                })

	                if(isValidation === true) {
	                	var valStatus = data.serviceUIs[0].validationStatus;
	                    if((data.latestTransStatus === 'Funds Sent' && valStatus == 'Payment in progress' )|| (valStatus == 'Payment in progress' && data.latestTransStatus === 'EPO Received') || (valStatus == 'PA instructed' && data.latestTransStatus === 'EPO Received') ) {
	                        data.latestTransStatus = 'Processing Funds';
	                    }
	                    if((valStatus !== 'Payment in progress' && data.latestTransStatus === 'EPO Received') || data.latestTransStatus === 'Associates Instructed') {
	                        data.latestTransStatus = 'Processing';
	                    }
	                }
					data.actionProgress = transactionProgress(isValidation, data.latestTransStatus);

					data.serviceUIs.map(function(o, i){ 
						o.appAndType = o.patentApplicationNumber + ' (' + o.newType +')';	
						if(o.clientRef == '') {
							o.clientRef = '[No Client Reference Provided]'
						}
						return o;
					})
					return data;		
				})
				deferred.resolve(response.data);
			},
			function(errResponse){
				console.error('Error fetching all transactions. Error: ', errResponse);
				deferred.reject(errResponse);
			}
		)

		return deferred.promise;

	}


	function fetchCurrentTransactions() {

		var deferred = $q.defer();
		$http.get(REST_SERVICE_URI_CURRENT)
		.then(
			function(response){
                response.data.map(function(el){
                	if(el.renewalUIs.length) {
	                	el.renewalUIs.map(function(o){ 
	                		o.newType = 'Renewal';
	                	})
                	}
                	if(el.grantUIs.length) {
	                	el.grantUIs.map(function(o){ 
	                		o.newType = 'Grant';
	                	})
                	}
                	if(el.epctUIs.length) {
	                	el.epctUIs.map(function(o){ 
	                		o.newType = 'Euro-PCT';
	                	})
                	}
                	if(el.validationUIs.length) {
	                	el.validationUIs.map(function(o){ 
	                		o.newType = 'Validation';
	                	})
                	}                	
                    el.serviceUIs = [];
                    el.serviceUIs = el.serviceUIs.concat(el.renewalUIs, el.grantUIs, el.epctUIs, el.validationUIs)
                    return el;
   
                })
				deferred.resolve(response.data);
			},
			function(errResponse){
				console.error('Error: unable to fetch current transactions: Error msg: ', errResponse)
				deferred.reject(errResponse);
			}
		);

		return deferred.promise;

	};

	function actionProgress(currTransStatus) {

		var progress = 0;
		
		switch(currTransStatus) {
    		case 'Initiated':
    			progress = 14;
    		break;
    		case 'Awaiting Funds':
    			progress = 28;
			break;
    		case 'Funds Received':
    			progress = 42;
			break;	
    		case 'Funds Sent':
    			progress = 56;
			break;	
    		case 'EPO Received':
    			progress = 70;
			break;	
    		case 'EPO Instructed':
    			progress = 84;
			break;
    		case 'Completed':
    			progress = 100;
			break;	       					    			    			    			

		}

		return progress;

	};

}