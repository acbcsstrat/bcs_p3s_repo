angular.module('ppApp').factory('uploadAvatarServ', uploadAvatarServ);

uploadAvatarServ.$inject = ['$http', '$q'];

function uploadAvatarServ($http, $q) {

    var factory = {
        uploadAvatar: uploadAvatar
    }

    return factory


    function uploadAvatar(data) { 

        var deferred = $q.defer()

        var config = { headers: {'Content-Type': undefined} };

        $http.post('../p3sweb/upload-avatar/', data, config)
        .then(
            function(response){
                deferred.resolve(response.data)
            },
            function(errResponse){
                 deferred.reject(response.data)
            }
        )

        return deferred.promise;

    };
};
