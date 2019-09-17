angular.module('ppApp').factory('costAnalysisService', costAnalysisService);

costAnalysisService.$inject = ['$http', '$q'];

function costAnalysisService($http, $q) {

    var factory = {
        fetchCa: fetchCa
    }

    function fetchCa(patent) {

        var array = [];
        var deferred = $q.defer();

        patent.p3sServicesWithFees.forEach(function(data){
            if(data.serviceType == 'epct') {
                array.push($http.get(ppdomain+'rest-form1200-cost-analysis/'+patent.patentID))

            }
            if(data.serviceType == 'renewal') {
                array.push($http.get(ppdomain+'rest-cost-analysis/'+patent.patentID))
            }
        })

        return $q.all(array).then(function(data){
            return data;
        })

        // return 
    }

    return factory;

}