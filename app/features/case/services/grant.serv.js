angular.module('ppApp').factory('grantService', grantService);

grantService.$inject = ['$http', '$q', '$timeout'];

function grantService($http, $q, $timeout){

    var factory = {
        submitGrant: submitGrant,
        inhibitGrant: inhibitGrant,
        unhibitGrant: unhibitGrant,
        setQuestions: setQuestions,
        getQuestions: getQuestions,
        deleteGrant: deleteGrant,
        representativeCheck: representativeCheck
    }


    function unhibitGrant(id) {

        var deferred = $q.defer();

        $http.delete(ppdomain+'rest-inhibit-grant/'+id)
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

    function deleteGrant(id) {

        var deferred = $q.defer();

        $http.delete(ppdomain+'rest-grant/'+id)
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
                deferred.reject(errResponse.data)
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