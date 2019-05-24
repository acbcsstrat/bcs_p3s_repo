angular.module('ppApp').service('notificationService', notificationService);

notificationService.$inject = ['$q', '$http'];

function notificationService($q, $http) {

    var factory = {
        updateNotifications: updateNotifications
    }

    function updateNotifications(id, list, url) {
        console.log(ppdomain+url)
        var deferred = $q.defer()

        $http.put(ppdomain+url+id, list)
        .then(
            function(response){
                deferred.resolve(response.data)
            },
            function(errResponse){
                deferred.reject(errResponse.data)
            }
        )

        return deferred.promise;
    }        

    return factory;

}