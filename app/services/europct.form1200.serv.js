angular.module('ppApp').service('form1200Service', form1200Service);

form1200Service.$inject = ['$http', '$q'];

function form1200Service($http, $q) {

    var factory = {
        fetchQuestions: fetchQuestions,
        submitForm1200: submitForm1200
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

    function submitForm1200(data) {
        console.log(data)
        var deferred = $q.defer();

       $http.post(ppdomain+'rest-form1200/', data)
       .then(
            function(response){
                console.log(response)
                deferred.resolve(response.data)
            },
            function(errResponse){
                console.log(errResponse)
                deferred.reject(errResponse.data)
            }
        )

        return deferred.promise;

    }

    return factory;

}