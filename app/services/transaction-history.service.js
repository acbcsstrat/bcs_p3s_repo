export default angular.module('services.transaction-history', []).factory('TransactionHistoryService', TransactionHistoryService).name;

TransactionHistoryService.$inject = ['$http', '$q'];

function TransactionHistoryService($http, $q) {

	var REST_SERVICE_URI = ppdomain+'rest-historic-transactions/';

	var factory = {
		fetchTransactionHistory: fetchTransactionHistory, 
		actionProgress: actionProgress
	};

	return factory;

	function fetchTransactionHistory() {

		var deferred = $q.defer();
		$http.get(REST_SERVICE_URI)
		.then(
			function(response){
                response.data.map(function(el){
                    el.serviceUIs = [];
                    el.serviceUIs = el.serviceUIs.concat(el.renewalUIs, el.grantUIs, el.epctUIs)
                    return el;
   
                })
                deferred.resolve(response.data);
			},
			function(errResponse){
				deferred.resolve(errResponse);
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