angular.module('ppApp').factory('dashboardService', dashboardService);

dashboardService.$inject = ['$http', '$q']

function dashboardService($http, $q) {

    var factory = {
        getMessages: getMessages,
        supressMessages: supressMessages
    };

    return factory;

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

};