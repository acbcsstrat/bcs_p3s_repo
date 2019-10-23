angular.module('ppApp').factory('patentsRestService', patentsRestService);

patentsRestService.$inject = ['$http', '$q', 'organiseColourService'];

function patentsRestService($http, $q, organiseColourService) {

    var REST_SERVICE_URI = ppdomain+'rest-patents/'; 

    var factory = {
        fetchAllPatents: fetchAllPatents,
        updatePatent: updatePatent,
        savePatent: savePatent,
        deletePatent: deletePatent,
        fetchPatentItem: fetchPatentItem
    };

    return factory;

    function fetchAllPatents() {
    
        var deferred = $q.defer();
         $http.get(ppdomain+'rest-patents-portfolio/')
            .then(
            function (response) {
                response.data.map(function(patent){
                    return patent.p3sServices.map(function(property){
                        if(property.currentStageColour) {
                            property.cssCurrent = organiseColourService.getCurrColour(property.currentStageColour, 'text')
                        }
                        if(property.nextStageColour) {
                            property.cssNext = organiseColourService.getCurrColour(property.nextStageColour, 'text')
                        }
                        return property
                    })
                })
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error: Unable to fetch all patents. Error Response:', errResponse)
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
                response.data.p3sServicesWithFees.map(function(property){
                        if(property.currentStageColour) {
                            property.cssCurrent = organiseColourService.getCurrColour(property.currentStageColour, 'text')
                        }
                        if(property.nextStageColour) {
                            property.cssNext = organiseColourService.getCurrColour(property.nextStageColour, 'text')
                        }
                        return property
                
                })                
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error: Unable to fetch patent. Error Response:', errResponse)
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
                console.error('Error: Unable to update patent. Error Response:', errResponse)
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    };

    function savePatent(patent) {
        var deferred= $q.defer();
        $http.post(ppdomain+'rest-patents/', patent)
            .then(function(response){
                deferred.resolve(response.data);
            }, function(errResponse) {
                console.error('Error: Unable to save patent. Error Response:', errResponse)
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
                console.error('Error: Unable to delete patent. Error Response:', errResponse)
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    };


}

