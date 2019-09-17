angular.module('ppApp').factory('uploadAvatarServ', uploadAvatarServ);

uploadAvatarServ.$inject = ['$http'];

function uploadAvatarServ($http) {
    return function (file, data, callback) { 
        $http({
            url: file,
            method: "POST",
            data: data,
            headers: {'Content-Type': undefined}
        }).then(function (response) {
            callback(response)
        });
    };
};
