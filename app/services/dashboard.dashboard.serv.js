angular.module('ppApp').factory('dashboardService', dashboardService);

dashboardService.$inject = ['$http', '$q']

export default function dashboardService($http, $q) {

    var factory = {
        getMessages: getMessages,
        fetchCostAnalysis: fetchCostAnalysis
    };

    return factory;

    function getMessages() {
        var deferred = $q.defer();
        $http.get(ppdomain+'login-messages/')
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
         $http.get(ppdomain+'rest-cost-analysis/'+id)
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
        //     $http.post(ppdomain+'suppress-login-messages/' , id)
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