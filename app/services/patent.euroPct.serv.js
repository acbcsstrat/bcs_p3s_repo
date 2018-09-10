angular.module('ppApp').service('euroPctService', euroPctService);

euroPctService.$inject = ['$q', '$http'];

function euroPctService($q, $http) {

    var factory = {
        fetchForm1200: fetchForm1200
    }

    function fetchForm1200() {
        
        var deferred = $q.defer();

        $http.get('assets/dev_json/patents.json')
        .then(
            function(response){
                deferred.resolve(response.data);
            },
            function(errResponse) {
                deferred.reject(errResponse.data);
            }
        )

        return deferred.promise

    }

    return factory;

}