app.factory('patentsService', function($http, $q) {

    var factory = {};

        //var REST_SERVICE_URI = '../../p3sweb/assets/json/patents.json';
        var REST_SERVICE_URI = 'http://localhost:8080/p3sweb/rest-patents/';

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
            $http.post(REST_SERVICE_URI, patent)
                .then(function(response){
                    deferred.resolve(true)
                }, function(errResponse) {
                    console.log('save patent error');
                    deferred.reject(errResponse)
                }
            );
            return deferred.promise;
        }

        factory.fetchGraphData = function() {
        
            var deferred = $q.defer();
            $http.get('http://localhost:8080/p3sweb/rest-cost-analysis/'+id)
                .then(
                function (response) {
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

        factory.fetchRenewalHistory = function() {

            var deferred = $q.defer();
            $http.get('../../p3sweb/assets/json/renewal-history.json')
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

