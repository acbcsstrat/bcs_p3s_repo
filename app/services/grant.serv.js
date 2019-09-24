angular.module('ppApp').factory('grantService', grantService);

grantService.$inject = ['$http', '$q', '$timeout'];

function grantService($http, $q, $timeout){

    var factory = {
        submitGrant: submitGrant,
        inhibitGrant: inhibitGrant,
        unhibitGrant: unhibitGrant
    }

    function unhibitGrant(id) {

        var deferred = $q.defer();

        $http.delete(ppdomain+'rest-inhibit-grant/'+id)
        .then(
            function(response){
                deferred.resolve(response.data)
            },
            function(errResponse){
                console.error('Error: Unable to reset grant order');
                deferred.reject(errResponse.data)
            }
        )

        return deferred.promise;

    }

    function inhibitGrant(id) {

        var deferred = $q.defer();

        $http.get(ppdomain+'rest-inhibit-grant/'+id)
        .then(
            function(response){
                deferred.resolve(response.data)
            },
            function(errResponse){
                console.error('Error: Unable create grant order')
                deferred.reject(errResponse.data)
            }
        )

        return deferred.promise;
    }

    function submitGrant(data) {

        var deferred = $q.defer();

       $http.post(ppdomain+'rest-grant/', data)
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