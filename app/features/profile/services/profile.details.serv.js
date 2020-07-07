export default angular.module('services.user-service', []).factory('ProfileService', ProfileService).name

ProfileService.$inject = ['$http', '$q']; 

function ProfileService($http, $q) {

    var REST_SERVICE_URI = ppdomain+'rest-user/'; //variable declared before function are initiated

    var factory = {
        fetchUser: fetchUser,
        updateUser: updateUser,
        listUsers: listUsers

    };

    return factory;

    function fetchUser() {
    
        var deferred = $q.defer();
         $http.get(REST_SERVICE_URI)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while fetching user');
                deferred.reject(errResponse);
            }
        );

        return deferred.promise;
    };

    var config = {headers:  {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };

    function updateUser(user) {

        var deferred = $q.defer();
        $http.put(REST_SERVICE_URI, user, config)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    };

    function listUsers() {

        var deferred = $q.defer();

        $http.get(ppdomain+'rest-users/')
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    };

}
