export default angular.module('services.search-patent-service', []).factory('SearchPatentService', SearchPatentService).name;

SearchPatentService.$inject = ['$http', '$q']; 

function SearchPatentService($http, $q) {

    var REST_SEARCH_PATENT_SERVICE_URI = ppdomain+'rest-search-patents/';

    var factory = {
        findPatent: findPatent
    };

    return factory;

    function findPatent(patentNo) {

        var deferred= $q.defer();
        
        var patentItem = REST_SEARCH_PATENT_SERVICE_URI + patentNo;
        
        $http.get(patentItem)
            .then(
                function(response){
                deferred.resolve(response);
            }, function(errResponse) {
                switch(errResponse.status) {
                    case 400:
                        errResponse.data = 'We\'ve not been able to find that patent in the European Patent Register. Please enter an application number such as EP18123456.2';
                    break;
                    case 404:
                        errResponse.data = 'We’ve not been able to find Patent Application '+patentNo+' in the European Patent Register. Please check the number you’re entering and try again.';
                    break;
                    case 204:
                        errResponse.data = 'It looks like we\'ve already added Patent Application '+patentNo+' in to the system. You should be able to find it in the List Patents page using the search boxes.';
                    break;
                    default:
                        errResponse.data = null;
                }
                deferred.reject(errResponse);

                // console.error('$Http Error 'errResponse.status': Unable to fetch  information from EPO')
            }
        )


        return deferred.promise;

    };
}