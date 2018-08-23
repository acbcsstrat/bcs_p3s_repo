angular.module('ppApp').service('renewalRestService', renewalRestService);

renewalRestService.$inject = ['$http'];

function renewalRestService($http) {

    var factory = {
        fetchHistory: fetchHistory
    }

    function fetchHistory(id) {

        var deferred = $q.defer();
        
        $http.get(ppdomain+'rest-renewal-history/'+id)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while fetching renewal history');
                deferred.reject(errResponse);
            }
        );

        return deferred.promise;

    };

    return factory;

}