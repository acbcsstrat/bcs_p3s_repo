app.factory('userService', function($http, $q) {

    var factory = {};

		//var REST_SERVICE_URI = '../../p3sweb/assets/json/patents.json';
		var REST_SERVICE_URI = 'http://localhost:8080/p3sweb/rest-user/';

        factory.fetchUser = function() {
        
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
        }

        
        factory.updateUser = function(user) {

            console.log(user)

            var deferred = $q.defer();
            $http.put(REST_SERVICE_URI, user)
                .then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function(errResponse){
                    console.error('Error while updating user');
                    deferred.reject(errResponse);
                }
            );
            return deferred.promise;
        }


    return factory;

});

