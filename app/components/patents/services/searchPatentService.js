angular.module('ppApp').factory('searchPatentService', searchPatentService);

searchPatentService.$inject = ['$http', '$q']; 

function searchPatentService($http, $q) {

    var REST_SEARCH_PATENT_SERVICE_URI = domain+'rest-search-patents/';

    var factory = {
        findPatent: findPatent
    };

    return factory;

    function findPatent(patentNo) {

        var deferred= $q.defer();
        
        var patentItem = REST_SEARCH_PATENT_SERVICE_URI + patentNo;
        
        $http.get(patentItem)
            .then(function(response){
                deferred.resolve(response);
            }, function(errResponse) {
                deferred.reject(errResponse);
            }
        );

        return deferred.promise;

    };
}