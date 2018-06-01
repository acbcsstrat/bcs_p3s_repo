angular.module('ppApp').factory('patentsRestService', patentsRestService);

patentsRestService.$inject = ['$http', '$q'];

function patentsRestService($http, $q) {

    var REST_SERVICE_URI = ppdomain+'rest-patents/'; 

    var factory = {
        fetchAllPatents: fetchAllPatents,
        updatePatent: updatePatent,
        savePatent: savePatent,
        fetchCostAnalysis: fetchCostAnalysis,
        deletePatent: deletePatent,
        fetchRenewalHistory: fetchRenewalHistory

    };

    return factory;

    function fetchAllPatents() {
    
        var deferred = $q.defer();
         $http.get(REST_SERVICE_URI)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while fetching patents');
                deferred.reject(errResponse);
            }
        );

        return deferred.promise;
    };

    function updatePatent(patent, id) {
        
        var deferred = $q.defer();
        $http.put(REST_SERVICE_URI+id, patent)
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

    function savePatent(patent) {
        var deferred= $q.defer();
        $http.post(REST_SERVICE_URI, patent)
            .then(function(response){
                deferred.resolve(response.data);
            }, function(errResponse) {
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    };

    function fetchCostAnalysis(id) {

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

    function deletePatent(id) {
        var deferred = $q.defer();
        $http.delete(REST_SERVICE_URI+id)
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

    function fetchRenewalHistory(id) {

        var deferred = $q.defer();
        $http.get(ppdomain+'rest-renewal-history/'+id)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while fetching renewal history');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    };
}

