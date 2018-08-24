angular.module('ppApp').service('euroPctService', euroPctService);

euroPctService.$inject = ['$q', '$http'];

function euroPctService($q, $http) {

    var factory = {
        deleteApplication: deleteApplication,
        editApplication: editApplication,
        updateNotifications: updateNotifications
    }

    function updateNotifications(id) {

        var deferred = $q.defer()

        $http.put(ppdomain+'rest-epct-notifications/'+id)
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

    function deleteApplication(id) {
            
        var deferred = $q.defer()

        $http.delete(ppdomain+'rest-start-form1200/'+id)
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

    function editApplication(id) {
            
        var deferred = $q.defer()

        $http.put(ppdomain+'rest-start-form1200/'+id)
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