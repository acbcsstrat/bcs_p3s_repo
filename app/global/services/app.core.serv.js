export default angular.module('services.core-service', []).factory('CoreService', CoreService).name;

CoreService.$inject = ['$q', '$timeout', '$http'];

function CoreService($q, $timeout, $http) {

    var REST_SERVICE_URI = ppdomain+'partner-details/'; 

    var factory = {
        getMessages: getMessages,
        supressMessages: supressMessages,        
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

    function getMessages() {
        var deferred = $q.defer();
        $http.get(ppdomain+'login-messages/')
        .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while fetching messages');
                deferred.reject(errResponse);
            }
        );

        return deferred.promise;
    };



    function supressMessages(id) {
        var deferred = $q.defer();
        $http.post(ppdomain+'suppress-login-messages/' , id)
        .then(
            function(response){
                deferred.resolve(response);
            }, 
            function(errResponse){
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    };    

    function openAppGuide() {
        return factory.appGuideOpen = !factory.appGuideOpen;
    }

    return factory;

}
