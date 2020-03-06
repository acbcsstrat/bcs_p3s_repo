angular.module('ppApp').factory('transactionService', transactionService);

transactionService.$inject = ['$http', '$q'];

function transactionService($http, $q) {

	var REST_SERVICE_URI_CURRENT = ppdomain+'rest-current-transactions/';
	var REST_SERVICE_URI_HISTORY = ppdomain+'rest-historic-transactions/';

	var factory = {
		fetchCurrentTransactions:fetchCurrentTransactions,
		fetchTransactionHistory: fetchTransactionHistory,
		fetchAllTransactions: fetchAllTransactions,
		actionProgress: actionProgress
	};

	return factory;

	function fetchAllTransactions() {


		console.log(this)

		var deferred = $q.defer();

		$q.all([this.fetchCurrentTransactions(), this.fetchTransactionHistory()])
		.then(
			function(response){
				deferred.resolve(response[0].concat(response[1]));
			},
			function(errResponse) {
				console.log('Error fetching all transactions. Error: ', errResponse);
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

	function fetchTransactionHistory() {

		var deferred = $q.defer();
		$http.get(REST_SERVICE_URI_HISTORY)
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
                    el.serviceUIs = el.serviceUIs.concat(el.renewalUIs, el.grantUIs, el.epctUIs)
                    return el;
   
                })
                deferred.resolve(response.data);
			},
			function(errResponse){
				console.error('Error: unable to fetch transacrtion history: Error msg: ', errResponse)
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