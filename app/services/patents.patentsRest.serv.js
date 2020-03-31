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

    var actionsArray = [];

    function fetchAllPatents() {

        var deferred = $q.defer();
         $http.get(ppdomain+'rest-patents-portfolio/')
            .then(
            function (response) {

                var generateId = function(service) {
                    var number = '';
                    for (var i = 0; i < service.length; i++) {
                        number += service.charCodeAt(i).toString();
                    }
                    return parseInt(number.substring(2, 9)); //skip decimal
                }

                response.data.map(function(patent){
                    return patent.p3sServices.map(function(property){
                        
                        if(property.serviceType === 'postvalidation') {
                            property.serviceType = '----';
                            property.serviceStatusUI = 'N/A';

                        }
                        if(property.serviceType == 'postgrant') {
                            property.serviceType = '----';
                        }

                        property.actionID = patent.patentID + generateId(property.serviceType); //generate unique id based on patent id and service type (get char codes)
                        if(property.currentStageColour) {
                            property.cssCurrent = organiseColourService.getCurrColour(property.currentStageColour, 'text')
                        }
                        if(property.nextStageColour) {
                            property.cssNext = organiseColourService.getCurrColour(property.nextStageColour, 'text')
                        }
                        return property;
                    })
                })

                actionsArray = response.data.map(function(patent){
                    return patent.p3sServices.map(function(action){
                        var obj = {};
                        obj.patentID = patent.patentID;
                        obj.serviceType = action.serviceType;
                        obj.actionID = action.actionID
                        return obj;
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

                if(actionsArray === undefined || typeof actionsArray === 'undefined') {
                    deferred.reject(response.data);
                }
                if(actionsArray.length) {
                     
                    var merged = [].concat.apply([], actionsArray); //dont use flat() method because of IE. This is alternative
                    response.data.p3sServicesWithFees.map(function(property){
                        property.serviceType = property.serviceType == 'postvalidation' ? 'N/A' : property.serviceType;
                        property.serviceStatus = property.serviceType == 'postvalidation' ? 'validated' : property.serviceStatus;
                        var item = merged.filter(function(action){
                            return action.serviceType === property.serviceType && id == action.patentID;
                        }).map(function(filtered){
                            return filtered.actionID
                        })

                        property.actionID = item[0];

                        if(property.currentStageColour) {
                            property.cssCurrent = organiseColourService.getCurrColour(property.currentStageColour, 'text');
                        }
                        if(property.nextStageColour) {
                            property.cssNext = organiseColourService.getCurrColour(property.nextStageColour, 'text');
                        }
                        return property;
                    
                    })

                     deferred.resolve(response.data);
                }

               
            },
            function(errResponse){
                console.error('Error: Unable to fetch patent. Error Response:', errResponse)
                deferred.reject(errResponse);
            }
        );

        return deferred.promise;
    };    

    function updatePatent(patent, id) {
        //quick fix for resolving issues with converting circule structure to JSON(loop) 
        patent.p3sServicesWithFees.map(function(action){
            action.form1200FeeUI = null;
            action.grantFeeUI = null;
            action.validationFeeUI = null;
            action.renewalFeeUI = null;
        })
   
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

