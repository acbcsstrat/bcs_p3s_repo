angular.module('ppApp').factory('costAnalysisService', costAnalysisService);

costAnalysisService.$inject = ['$http', '$q'];

function costAnalysisService($http, $q) {

    var factory = {
        fetchCa: fetchCa
    }

    function fetchCa(patentID, services) {

        var array = [];
        var deferred = $q.defer();

        services.forEach(function(data){ //for multiple services for single patent
            if(data.serviceType == 'epct') {
                array.push($http.get(ppdomain+'rest-form1200-cost-analysis/'+patentID))

            }
            if(data.serviceType == 'renewal') {
                array.push($http.get(ppdomain+'rest-cost-analysis/'+patentID))
            }
        })

        return $q.all(array)
        .then(
            function(response){
                deferred.resolve(response);
            },
            function(errResponse){
                console.error('Error: Unable to fetch cost analysis')
                deferred.reject(errResponse)
            }
        )

        return deferred.promise;

        // return 
    }

    return factory;

}