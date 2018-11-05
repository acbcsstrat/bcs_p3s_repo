angular.module('ppApp').service('portfolioService', portfolioService);

portfolioService.$inject = ['$http', '$q'];

function portfolioService($http, $q) {

    var factory = {
        fetchPatents: fetchPatents,
        manualProcessing: manualProcessing
    }

    return factory;

    function fetchPatents() {

        var deferred = $q.defer();

        $http.get('assets/dev_json/patents.json')
        .then(
            function(response){
                deferred.resolve(response.data)
            },
            function(errResponse){
                deferred.reject(response.data)
            }
        )

        return deferred.promise;

    }    

    function manualProcessing() { //need to add patent to system, and notify pure ideas

        var deferred = $q.defer();

        deferred.resolve('response')
        
        return deferred.promise


    }

}