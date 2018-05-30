angular.module('ppApp').factory('coreService', coreService);

coreService.$inject = ['$q', '$timeout', 'fxService', '$http'];

export default function coreService($q, $timeout, fxService, $http) {

    var REST_SERVICE_URI = ppdomain+'partner-details/'; 

    var factory = {
        ppContact: ppContact
    };

    function ppContact() {
        var deferred = $q.defer();
        $http.get(REST_SERVICE_URI)
        .then(
            function(response){
                deferred.resolve(response.data)
            },
            function(errResponse){
                deferred.resolve(errResponse)
            }
        );
        return deferred.promise;
    }
    return factory;

}
