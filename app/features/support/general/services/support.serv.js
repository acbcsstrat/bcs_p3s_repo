export default angular.module('services.support-service', []).factory('SupportService', SupportService).name;

SupportService.$inject = ['$q', '$http'];

function SupportService($q, $http) {

    var factory = {
        requestNonSpecificSupport: requestNonSpecificSupport,
        requestSpecificSupport: requestSpecificSupport,
        requestSpecificPatents: requestSpecificPatents
    }

    function requestSpecificPatents(cat) {
        console.log('cat : ', cat)
        var deferred = $q.defer();

        $http.get(ppdomain+'rest-patent-enquiry/'+ cat)
        .then(
            function(response){
                deferred.resolve(response.data)
            },
            function(errResponse){
                deferred.reject(errResponse.data)
            }
        )        

    }
    
    function requestNonSpecificSupport(data, config) {

        var deferred = $q.defer();

        $http.post(ppdomain+'rest-non-case-specific-form/', data, config)
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


    function requestSpecificSupport(data, config) {

        var deferred = $q.defer();

        $http.post(ppdomain+'rest-case-specific-form/', data, config)
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