angular.module('ppApp').factory('currentTransactionsService', currentTransactionsService);

currentTransactionsService.$inject = ['$http', '$q'];

export default function currentTransactionsService($http, $q) {

	var REST_SERVICE_URI = ppdomain+'rest-current-transactions/';

	var factory = {
		fetchCurrentTransactions:fetchCurrentTransactions,
		renewalProgress: renewalProgress
	};

	return factory;

	function fetchCurrentTransactions() {

		var deferred = $q.defer();
		$http.get(REST_SERVICE_URI)
		.then(
			function(response){
				deferred.resolve(response.data);
			},
			function(errResponse){
				deferred.resolve(errResponse);
			}
		);

		return deferred.promise;

	};

	function renewalProgress(currTransStatus) {

		var renewalProgress = 0;
		
		switch(currTransStatus) {
    		case 'Initiated':
    			renewalProgress = 14;
    		break;
    		case 'Awaiting Funds':
    			renewalProgress = 28;
			break;
    		case 'Funds Received':
    			renewalProgress = 42;
			break;	
    		case 'Funds Sent':
    			renewalProgress = 56;
			break;	
    		case 'EPO Received':
    			renewalProgress = 70;
			break;	
    		case 'EPO Instructed':
    			renewalProgress = 84;
			break;
    		case 'Completed':
    			renewalProgress = 100;
			break;	       					    			    			    			

		}

		return renewalProgress;

	};

}