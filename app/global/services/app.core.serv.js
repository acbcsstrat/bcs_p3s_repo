export default angular.module('services.core-service', []).factory('CoreService', CoreService).name;

CoreService.$inject = ['$q', '$timeout', '$http'];

function CoreService($q, $timeout, $http) {


    var factory = {     
        ppContact: ppContact,
        openAppGuide: openAppGuide,
        appGuideOpen: false,
        checkCases: checkCases
    };

    function ppContact() {
        var deferred = $q.defer();
        $http.get(ppdomain+'partner-details/')
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

    function checkCases() {
        var deferred = $q.defer();
        $http.get(ppdomain+'haveGotAnyPatents/')
        .then(
            function(response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error : ', errResponse);
                deferred.resolve(errResponse);
            }
        )
        return deferred.promise;
    }

    return factory;

}
