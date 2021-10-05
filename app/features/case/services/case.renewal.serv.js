export default angular.module('services.renewal-service', []).service('RenewalHistoryService', RenewalHistoryService).name;

RenewalHistoryService.$inject = ['$http', '$q'];

function RenewalHistoryService($http, $q) {

    var factory = {
        fetchHistory: fetchHistory
    }

    function fetchHistory(id) {

        var deferred = $q.defer();

        $http.get(ppdomain+'rest-renewal-history/'+id)
        .then(
            function(response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while fetching renewal history');
                deferred.reject(errResponse.data);
            }
        );

        return deferred.promise;

    };

    return factory;

}