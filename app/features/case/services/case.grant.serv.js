export default angular.module('services.grant-service', []).factory('GrantService', GrantService).name;

GrantService.$inject = ['$http', '$q', '$timeout', 'ngCart'];

function GrantService($http, $q, $timeout, ngCart){

    var factory = {
        submitGrant: submitGrant,
        inhibitGrant: inhibitGrant,
        unhibitGrant: unhibitGrant,
        setQuestions: setQuestions,
        getQuestions: getQuestions,
        deleteGrant: deleteGrant,
        representativeCheck: representativeCheck
    }


    function unhibitGrant(patent) { //for manual processing items

        $http.delete(ppdomain+'rest-inhibit-grant/'+patent.patentID)
        .then(
            function(response){
                deferred.resolve(response.data)
            },
            function(errResponse){
                console.error('Error: Unable to reset grant order. Error response:', errResponse);
                deferred.reject(errResponse.data)
            }
        )

        return deferred.promise;

    }

    function inhibitGrant(id) {

        var deferred = $q.defer();

        $http.get(ppdomain+'rest-inhibit-grant/'+id)
        .then(
            function(response){
                deferred.resolve(response.data)
            },
            function(errResponse){
                console.error('Error: Unable create grant order. Error response:', errResponse);
                deferred.reject(errResponse.data)
            }
        )

        return deferred.promise;
    }

    function deleteGrant(patent) {

        var deferred = $q.defer();

        var actionIds = patent.p3sServicesWithFees.map(function(r){
            return r.actionID;
        })

        var cartItems = ngCart.getItems().map(function(r){
            return parseInt(r._id);
        })

        var found = actionIds.find(function(r) {
            return cartItems.indexOf(r) >= 0;
        })      

        if(found) {
            ngCart.removeItemById(found, true)
        }        

        $http.delete(ppdomain+'rest-grant/'+patent.patentID)
        .then(
            function(response){
                deferred.resolve(response.data)
            },
            function(errResponse){
                console.error('Error: Unable to reset grant order. Error response:', errResponse);
                deferred.reject(errResponse.data)
            }
        )

        return deferred.promise;

    }

    function submitGrant(data, config) {

        var deferred = $q.defer();

       $http.post(ppdomain+'rest-grant/', data, config)
       .then(
            function(response){
                deferred.resolve(response.data)
            },
            function(errResponse){
                console.error('Error: Unable to submit grant data. Error response:', errResponse);
                deferred.reject(errResponse)
            }
        )

        return deferred.promise;

    }

    function setQuestions(data){

        factory.questions = data;

    }

    function getQuestions() {
        return factory.questions;
    }    

    function representativeCheck(id) {
        
        var deferred = $q.defer();

        $http.get(ppdomain+'rest-start-grant/'+id)
        .then(
            function(response){
                deferred.resolve(response.data)
            },
            function(errResponse){
                console.error('Error: Unable to fetch conditional boolean value to display first question')
                deferred.reject(response.data)
            }
        )

        return deferred.promise

    }

    return factory;

}