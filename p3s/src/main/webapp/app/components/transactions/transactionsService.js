app.factory('transactionsService', function($http, $q) {

    var factory = {};

	//var REST_SERVICE_URI = '../../p3sweb/assets/json/patents.json';
	var REST_SERVICE_URI_ROOT = 'http://localhost:8080/p3sweb/';

    factory.fetchAllCurrentTransactions = function() {
    
        var deferred = $q.defer();
        $http.get(REST_SERVICE_URI_ROOT+'rest-current-transactions/')
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


	//var REST_SERVICE_URI = '../../p3sweb/assets/json/patents.json';
	var REST_SERVICE_URI_ROOT = 'http://localhost:8080/p3sweb/';

    factory.fetchAllHistoricTransactions = function() {
    
        var deferred = $q.defer();
        $http.get(REST_SERVICE_URI_ROOT+'rest-historic-transactions/')
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


    return factory;

});

