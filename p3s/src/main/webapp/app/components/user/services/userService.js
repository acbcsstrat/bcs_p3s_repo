app.factory('userService', function($http, $q) {

    var factory = {};

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

        var config = {headers:  {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        
        factory.updateUser = function(user) {

            console.log(user)

            var deferred = $q.defer();
            $http.put(REST_SERVICE_URI, user, config)
                .then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function(errResponse){
                    console.log(errResponse)
                    deferred.reject(errResponse);
                }
            );
            return deferred.promise;
        }

    return factory;

});

