import OrganiseColourService from '../../../global/services/app.organiseColour.serv.js'

export default angular.module('services.patents-rest-service', [OrganiseColourService]).factory('PatentsRestService', PatentsRestService).name

PatentsRestService.$inject = ['$http', '$q', 'OrganiseColourService'];

function PatentsRestService($http, $q, OrganiseColourService) {

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
        console.log('get patent')
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
                        property.actionID = patent.patentID + generateId(property.serviceType); //generate unique id based on patent id and service type (get char codes)
                        if(property.currentStageColour) {
                            property.cssCurrent = OrganiseColourService.getCurrColour(property.currentStageColour, 'text')
                        }
                        if(property.nextStageColour) {
                            property.cssNext = OrganiseColourService.getCurrColour(property.nextStageColour, 'text')
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
            console.log('return')
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
                        var item = merged.filter(function(action){
                            return action.serviceType === property.serviceType && id == action.patentID;
                        }).map(function(filtered){
                            return filtered.actionID
                        })

                        property.actionID = item[0];

                        if(property.currentStageColour) {
                            property.cssCurrent = OrganiseColourService.getCurrColour(property.currentStageColour, 'text');
                        }
                        if(property.nextStageColour) {
                            property.cssNext = OrganiseColourService.getCurrColour(property.nextStageColour, 'text');
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
            action.grantFeeUI = null;
            action.validationFeeUI = null;
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

