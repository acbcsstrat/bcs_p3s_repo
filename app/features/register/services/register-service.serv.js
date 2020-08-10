export default angular.module('services.register-service', []).factory('RegisterService', RegisterService).name;

RegisterService.$inject = ['$http', '$q']

function RegisterService($http, $q) {

    var service = {};

    service.SearchCompany = SearchCompany;
    service.Create = Create;

    return service;

    function Create(formData, type) {

    	var url;
        var deferred = $q.defer();

        var newFormData = new FormData();

        Object.keys(formData).forEach(function(o, k){
            newFormData.append(o, formData[o])
        })

        if(type == 'subsequent') {
        	url = '../register/rest-subsequent-user-step2/';
        } else {
        	url = '../register/rest-user/';
        }


        var req = {
             method: 'POST',
             url: url,
             headers: {
               'Content-Type': undefined
             },
             data: newFormData
        }


        $http(req)
        .then(
            function(response){
                deferred.resolve(response)
            },
            function(errResponse){
                console.error('Error creating account. Error details:  ', errResponse)
                deferred.reject(errResponse)
            }
        )

        return deferred.promise;

    }

    function SearchCompany(params) {

        var deferred = $q.defer();

        var req = {
            method: 'POST',
            url: '../register/rest-subsequent-user-step1/',
            headers: {
               'Content-Type': undefined
            },
            params: params
            
        }

        $http(req)
        .then(
            function(response){
                deferred.resolve(response.data);
                
            },
            function(errResponse){
                console.error('Error fetch company details. Error : ', errResponse)
                deferred.reject(errResponse)
            }
        )




        return deferred.promise

    }

}