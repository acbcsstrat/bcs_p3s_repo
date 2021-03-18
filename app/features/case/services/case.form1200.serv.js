export default angular.module('services.form1200-service', []).service('Form1200Service', Form1200Service).name;

Form1200Service.$inject = ['$http', '$q', 'Upload', 'ngCart'];

function Form1200Service($http, $q, Upload, ngCart) {

    var factory = {
        fetchQuestions: fetchQuestions,
        submitForm1200: submitForm1200,
        setQuestions: setQuestions,
        questions: '',
        getQuestions: getQuestions,
        inhibitForm1200: inhibitForm1200,
        generateForm1200: generateForm1200,
        deleteApplication: deleteApplication,
        editApplication: editApplication,
        updateNotifications: updateNotifications        
    }

    function inhibitForm1200(id, reason) {

        var deferred = $q.defer();

        var config = {
            params: {patent_id: id, failure_reason: reason}
        }

        $http.get(ppdomain+'rest-reject-form1200/', config)
        .then(
            function(response){
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

    function submitForm1200(data, config) {

        var deferred = $q.defer();

        $http.post(ppdomain+'rest-form1200/', data, config)
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

    function generateForm1200(data) {

        var deferred = $q.defer();

        $http.post(ppdomain+'rest-form1200/'+data)
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

    function updateNotifications(id, list) {

        var deferred = $q.defer()

        $http.put(ppdomain+'rest-epct-notifications/'+id, list)
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

    function deleteApplication(patent) {
            
        var deferred = $q.defer()

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

        $http.delete(ppdomain+'rest-form1200/'+patent.patentID)
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

    function editApplication(id) {
            
        var deferred = $q.defer()  

        $http.put(ppdomain+'rest-form1200/'+id)
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

    return factory;

}