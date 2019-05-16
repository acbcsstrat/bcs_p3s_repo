angular.module('ppApp').factory('coreService', coreService);

coreService.$inject = ['$q', '$timeout', 'fxService', '$http'];

function coreService($q, $timeout, fxService, $http) {

    var REST_SERVICE_URI = ppdomain+'partner-details/'; 

    var factory = {
        ppContact: ppContact,
        openAppGuide: openAppGuide,
        appGuideOpen: false
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

    function openAppGuide() {
        return factory.appGuideOpen = !factory.appGuideOpen;
    }

    return factory;

}
