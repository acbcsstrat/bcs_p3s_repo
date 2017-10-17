app.factory('patentsRestService', function($http, $q) {

    var factory = {};

        var REST_SERVICE_URI = domain+'rest-patents/';

        factory.fetchAllPatents = function() {
        
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
        }

        factory.updatePatent = function(patent, id) {
            
            var deferred = $q.defer();
            $http.put(REST_SERVICE_URI+id, patent)
                .then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function(errResponse){
                    console.error('Error while updating patent');
                    deferred.reject(errResponse);
                }
            );
            return deferred.promise;
        }

        factory.savePatent = function(patent) {
            var deferred= $q.defer();
            console.log(REST_SERVICE_URI, patent)
            $http.post(REST_SERVICE_URI, patent)
                .then(function(response){
                    deferred.resolve(response.data)
                }, function(errResponse) {
                    console.log('save patent error');
                    deferred.reject(errResponse)
                }
            );
            return deferred.promise;
        }

        factory.fetchCostAnalysis = function(id) {
            var deferred = $q.defer();
            $http.get(domain+'rest-cost-analysis/'+id)
                .then(
                function (response) {
                    // console.log(response.data)
                    deferred.resolve(response.data);
                },
                function(errResponse){
                    console.error('Error while fetching graph data');
                    deferred.reject(errResponse);
                }
            );

            return deferred.promise;
        }

        factory.deletePatent = function(id) {
            console.log(id)
            var deferred = $q.defer();
            $http.delete(REST_SERVICE_URI+id)
                .then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function(errResponse){
                    console.error('Error while deleting User');
                    deferred.reject(errResponse);
                }
            );
            return deferred.promise;
        }

        factory.fetchRenewalHistory = function(id) {

            var deferred = $q.defer();
            $http.get(domain+'rest-renewal-history/'+id)
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
        }



        
    return factory;

});

