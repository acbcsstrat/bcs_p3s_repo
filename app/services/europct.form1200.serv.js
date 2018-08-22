angular.module('ppApp').service('form1200Service', form1200Service);

form1200Service.$inject = ['$http', '$q'];

function form1200Service($http, $q) {

    var factory = {
        fetchPatent: fetchPatent
    }

    function fetchPatent(id) {
            
        var deferred = $q.defer()

        $http.get(ppdomain+'rest-start-form1200/'+id)
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