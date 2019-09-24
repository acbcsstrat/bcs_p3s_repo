angular.module('ppApp').factory('costAnalysisService', costAnalysisService);

costAnalysisService.$inject = ['$http', '$q'];

function costAnalysisService($http, $q) {

    var factory = {
        fetchCa: fetchCa
    }

    function fetchCa(patentID, services) {

        var array = [];
        var deferred = $q.defer();

        services.forEach(function(data){
            if(data.serviceType == 'epct') {
                array.push($http.get(ppdomain+'rest-form1200-cost-analysis/'+patentID))

            }
            if(data.serviceType == 'renewal') {
                array.push($http.get(ppdomain+'rest-cost-analysis/'+patentID))
            }
        })

        return $q.all(array).then(function(data){
            return data;
        })

        // return 
    }

    return factory;

}