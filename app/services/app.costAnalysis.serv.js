angular.module('ppApp').factory('costAnalysisService', costAnalysisService);

costAnalysisService.$inject = ['$http', '$q'];

function costAnalysisService($http, $q) {

    var factory = {
        fetchEuroPctCa:  fetchEuroPctCa,
        fetchRenewalCa: fetchRenewalCa
    }

    function fetchEuroPctCa(id) {

        var deferred = $q.defer();
        $http.get(ppdomain+'rest-form1200-cost-analysis/'+id)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                deferred.reject(errResponse);
            }
        );

        return deferred.promise;

    };

    function fetchRenewalCa(id) {

        var deferred = $q.defer();
        $http.get(ppdomain+'rest-cost-analysis/'+id)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                deferred.reject(errResponse);
            }
        );

        return deferred.promise;

    };    

    return factory;

}