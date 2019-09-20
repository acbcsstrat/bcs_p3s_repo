import fxService from '../../app/services/app.fx.serv.js';

export default angular.module('services.core-service', [fxService]).factory('coreService', coreService).name;

coreService.$inject = ['$q', '$timeout', 'fxService', '$http'];

function coreService($q, $timeout, fxService, $http) {

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
