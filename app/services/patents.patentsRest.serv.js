angular.module('ppApp').factory('patentsRestService', patentsRestService);

patentsRestService.$inject = ['$http', '$q'];

function patentsRestService($http, $q) {

    var REST_SERVICE_URI = ppdomain+'rest-patents/'; 

    var factory = {
        fetchAllPatents: fetchAllPatents,
        updatePatent: updatePatent,
        savePatent: savePatent,
        deletePatent: deletePatent,
        fetchCostAnalysis: fetchCostAnalysis,
        fetchPatentItem: fetchPatentItem
    };

    return factory;

    function fetchAllPatents() {
    
        var deferred = $q.defer();
         $http.get(ppdomain+'rest-patents-portfolio/')
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.log(errResponse)
                console.error('Error while fetching patents');
                deferred.reject(errResponse);
            }
        );

        return deferred.promise;
    };

    function fetchPatentItem(id) {
    
        var deferred = $q.defer();
         $http.get(ppdomain+'rest-patent/'+ id)
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
        $http.post(ppdomain+'rest-patents/', patent)
            .then(function(response){
                console.log(response)
                deferred.resolve(response.data);
            }, function(errResponse) {
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

    function fetchCostAnalysis(id) {
        
        var deferred = $q.defer();
         $http.get(ppdomain+'rest-cost-analysis/'+id)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while fetching cost analysis');
                deferred.reject(errResponse);
            }
        );

        return deferred.promise;
        
    };

}

