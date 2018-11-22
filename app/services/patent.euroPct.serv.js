angular.module('ppApp').service('euroPctService', euroPctService);

euroPctService.$inject = ['$q', '$http'];

function euroPctService($q, $http) {

    var factory = {
        generateForm1200: generateForm1200,
        deleteApplication: deleteApplication,
        editApplication: editApplication,
        updateNotifications: updateNotifications
    }

    function generateForm1200(data) {

        var deferred = $q.defer();

        $http.post(ppdomain+'rest-form1200/'+data)
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

    function updateNotifications(id, list) {

        var deferred = $q.defer()

        $http.put(ppdomain+'rest-epct-notifications/'+id, list)
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