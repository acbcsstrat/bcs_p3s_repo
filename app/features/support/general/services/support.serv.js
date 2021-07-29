export default angular.module('services.support-service', []).factory('SupportService', SupportService).name;

SupportService.$inject = ['$q', '$http'];

function SupportService($q, $http) {

    var factory = {
        requestSupport: requestSupport
    }

    function requestSupport(data, config) {

        var deferred = $q.defer()

        $http.post(ppdomain+'rest-support-form/', data, config)
        .then(
            function(response){
                console.log('service response', response)
                deferred.resolve(response.data)
            },
            function(errResponse){
                console.log('service errResponse', errResponse)
                deferred.reject(errResponse.data)
            }
        )

        return deferred.promise;
    }        

    return factory;

}