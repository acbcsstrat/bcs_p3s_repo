app.factory('dashboardService', function($http, $q){

	var factory = {};

		 factory.getMessages = function() {
        
            var deferred = $q.defer();
             $http.get(domain+'login-messages/')
                .then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function(errResponse){
                    console.error('Error while fetching messages');
                    deferred.reject(errResponse);
                }
            );

            return deferred.promise;
        }

        factory.fetchCostAnalysis = function(id) {
            
            var deferred = $q.defer();
             $http.get(domain+'rest-cost-analysis/'+id)
                .then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function(errResponse){
                    console.error('Error while fetching cost analysis');
                    deferred.reject(errResponse);
                }
            );

            return deferred.promise;
        }        

	return factory;

})
