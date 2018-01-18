app.factory('dashboardService', ['$http', '$q', function($http, $q){

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

        factory.supressMessages = function(id) {
            var deferred = $q.defer();
            //var ids = JSON.stringify(id)
            //console.log(ids)
            console.log(id)
            $http.post(domain+'suppress-login-messages/' , id)
            .then(
                function(response){
                    deferred.resolve(response)
                }, 
                function(errResponse){
                    deferred.reject(response)
                }
            )
            return deferred.promise;
        }

	return factory;

}])
