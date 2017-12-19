app.factory('searchPatentService', ['$http', '$q', function($http, $q) {

    var factory = {};

        var REST_SEARCH_PATENT_SERVICE_URI = domain+'rest-search-patents/';

        factory.findPatent = function(patentNo) {
            var deferred= $q.defer();
            
            var patentItem = REST_SEARCH_PATENT_SERVICE_URI + patentNo;
            
            $http.get(patentItem)
                .then(function(response){
                	deferred.resolve(response)
                }, function(errResponse) {
                    console.log('add patent error');
                    deferred.reject(errResponse)
                }
            );
            return deferred.promise;
        }

    return factory;

}])