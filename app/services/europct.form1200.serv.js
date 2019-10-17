angular.module('ppApp').service('form1200Service', form1200Service);

form1200Service.$inject = ['$http', '$q'];

function form1200Service($http, $q) {

    var factory = {
        fetchQuestions: fetchQuestions,
        submitForm1200: submitForm1200,
        setQuestions: setQuestions,
        questions: '',
        getQuestions: getQuestions,
        inhibitForm1200: inhibitForm1200
    }

    function inhibitForm1200(id, reason) {

        var deferred = $q.defer();

        $http.get(ppdomain+'rest-reject-form1200/'+id, reason)
        .then(
            function(response){
                console.log(response)
                deferred.resolve(response.data)
            },
            function(errResponse){
                console.error('Error: Unable to inhibit form1200. Error response:', errResponse);
                deferred.reject(errResponse.data)
            }
        )

        return deferred.promise;

    }

    function fetchQuestions(id) {

        var deferred = $q.defer();

        $http.get(ppdomain+'rest-start-form1200/'+id)
        .then(
            function(response){
                deferred.resolve(response.data)
            },
            function(errResponse){
                console.error('Error: Unable to fetch questions. Error response:', errResponse);
                deferred.reject(errResponse.data)
            }
        )

        return deferred.promise;
    }

    function submitForm1200(data) {

        var deferred = $q.defer();

        $http.post(ppdomain+'rest-form1200/', data)
        .then(
            function(response){
                deferred.resolve(response.data)
            },
            function(errResponse){
                console.error('Error: Unable to submit form1200. Error response:', errResponse);
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