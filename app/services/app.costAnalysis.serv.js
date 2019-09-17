angular.module('ppApp').factory('costAnalysisService', costAnalysisService);

costAnalysisService.$inject = ['$http', '$q'];

function costAnalysisService($http, $q) {

    var factory = {
        fetchCa: fetchCa
    }

    function fetchCa(patent) {

        var array = [];
        var deferred = $q.defer();
        patent.serviceList.forEach(function(data){
            if(data.serviceType == 'Form1200') {
                array.push($http.get(ppdomain+'rest-form1200-cost-analysis/'+patent.id))

            }
            if(data.serviceType == 'Renewal') {
                array.push($http.get(ppdomain+'rest-cost-analysis/'+patent.id))
            }
        })

        return $q.all(array).then(function(data){
            return data;
        })

        // return 
    }

    return factory;

}