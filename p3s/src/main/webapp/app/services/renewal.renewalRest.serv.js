angular.module('ppApp').service('renewalRestService', renewalRestService);

renewalRestService.$inject = ['$http', '$q'];

function renewalRestService($http, $q) {

    var factory = {
        updateNotifications: updateNotifications,
        fetchHistory: fetchHistory
    }

    function fetchHistory(id) {

        var deferred = $q.defer();
        console.log(id)
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

    function updateNotifications(id) {

        var deferred = $q.defer();

        $http.get(ppdomain+'rest-renewal-notifications/'+id)
        .then(
            function(response){
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while updating notifications');
                deferred.reject(errResponse.data);
            }
        )

        return deferred.promise;

    }

    return factory;

}