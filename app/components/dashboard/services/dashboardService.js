angular.module('ppApp').factory('dashboardService', dashboardService);

dashboardService.$inject = ['$http', '$q']

function dashboardService($http, $q) {

    var factory = {
        getMessages: getMessages,
        fetchCostAnalysis: fetchCostAnalysis
    };

    return factory;

    function getMessages() {
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
    };

    function fetchCostAnalysis(id) {
        
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
        
    };

        // function supressMessages(id) {
        //     var deferred = $q.defer();
        //     $http.post(domain+'suppress-login-messages/' , id)
        //     .then(
        //         function(response){
        //             deferred.resolve(response);
        //         }, 
        //         function(errResponse){
        //             deferred.reject(errResponse);
        //         }
        //     );
        //     return deferred.promise;
        // };

};