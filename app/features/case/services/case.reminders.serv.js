export default angular.module('services.reminders-service', []).factory('RemindersService', RemindersService).name;

RemindersService.$inject = ['$q', '$http'];

function RemindersService($q, $http) {

    var factory = {
        updateNotifications: updateNotifications
    }

    function updateNotifications(id, list, url) {

        var deferred = $q.defer()

        $http.put(ppdomain+url+id, list)
        .then(
            function(response){
                deferred.resolve(response.data)
            },
            function(errResponse){
                deferred.reject(errResponse.data)
            }
        )

        return deferred.promise;
    }        

    return factory;

}