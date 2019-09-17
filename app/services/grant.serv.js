angular.module('ppApp').factory('grantService', grantService);

grantService.$inject = ['$http', '$q', '$timeout'];

function grantService($http, $q, $timeout){

    var factory = {
        fetchQuestions: fetchQuestions,
        submitGrant: submitGrant,
        setQuestions: setQuestions,
        questions: '',
        getQuestions: getQuestions
    }

    function fetchQuestions(id) {
            
        var deferred = $q.defer();

        $http.get(ppdomain+'rest-start-form1200/'+id)
        .then(
            function(response){
                deferred.resolve(response.data)
            },
            function(errResponse){
                deferred.reject(errResponse.data)
            }
        )

        return deferred.promise;
    }

    function submitGrant(data) {
        var deferred = $q.defer();

       $http.post(ppdomain+'rest-form1200/', data)
       .then(
            function(response){
                deferred.resolve(response.data)
            },
            function(errResponse){
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

    return factory;

}