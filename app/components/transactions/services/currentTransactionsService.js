angular.module('ppApp').factory('currentTransactionsService', ['$http', '$q', function($http, $q) {

	var factory = {};

		var REST_SERVICE_URI = domain+'rest-current-transactions/';

		factory.fetchCurrentTransactions = function() {

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

		factory.renewalProgress = function(currTransStatus) {

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

	return factory;

}]);