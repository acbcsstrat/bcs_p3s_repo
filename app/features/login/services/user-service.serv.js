export default angular.module('services.user-service').factory('UserService', UserService).name;

UserService.$inject = ['$http', '$q', '$timeout', '$filter'];

function UserService($http, $q, $timeout, $filter) {

        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        // service.Update = Update;
        // service.Delete = Delete;
        service.SearchCompany = SearchCompany;

        return service;

        function GetAll() {
            var deferred = $q.defer();
            deferred.resolve(getUsers());
            return deferred.promise;
        }

        function GetById(id) {
            var deferred = $q.defer();
            var filtered = $filter('filter')(getUsers(), { id: id });
            var user = filtered.length ? filtered[0] : null;
            deferred.resolve(user);
            return deferred.promise;
        }

        function GetByUsername(data) {
            console.log(data)
            var config = { headers: {'Content-Type': undefined} };
            var formData = new FormData();
            formData.append('j_username', data.j_username.$modelValue)
            formData.append('j_password', data.j_password.$modelValue)
           for (var pair of formData.entries()) {
                console.log(pair[0]+ ', ' + pair[1]); 
            }
            var deferred = $q.defer();
            $http.post('../resources/j_spring_security_check',  formData, config)
            .then(
                function(response){
                    console.log('response : ', response)
                    deferred.resolve(response);
                },
                function(errResponse){
                    console.log('errResponse : ', errResponse)
                    deferred.reject(errResponse)
                }
            )

            return deferred.promise;
        }

        function Create(formData) {

            var deferred = $q.defer();

            var newFormData = new FormData();

            Object.keys(formData).forEach(function(o, k){
                newFormData.append(o, formData[o])
            })
            console.log(newFormData)
            for (var pair of newFormData.entries()) {
                console.log(pair[0]+ ', ' + pair[1]); 
            }
            var req = {
                 method: 'POST',
                 url: '../register/rest-user/',
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
                    deferred.reject(errResponse)
                }
            )

            return deferred.promise;

            // $http({
            //     type: 'POST',
            //     url: 
            //     data: JSON.stringify(data),
            //     contentType: "application/json",
            //     success: function(response) {
            //         $('#initialRegistration, #register-intro,  divQn').addClass('d-none');  
            //         $('#register-success').delay(520).removeClass('d-none');               
            //     },
            //     error:function(errResponse) {
            //         $('#initialRegistration,  #register-intro, divQn').addClass('d-none');  
            //         $('#register-failure').delay(520).removeClass('d-none');                          
            //     }
            // });

            // $timeout(function () {
            //     GetByUsername(user.username)
            //         .then(function (duplicateUser) {
            //             console.log('duplicateUser: ', duplicateUser)
            //             if (duplicateUser !== null) {
            //                 deferred.resolve({ success: false});
            //             } else {
            //                 var users = getUsers();

            //                 // assign id
            //                 var lastUser = users[users.length - 1] || { id: 0 };
            //                 user.id = lastUser.id + 1;

            //                 // save to local storage
            //                 users.push(user);
            //                 setUsers(users);

            //                 deferred.resolve({ success: true });
            //             }
            //         });
            // }, 1000);


        }
        // private functions

        function getUsers() {
            // console.log(localStorage.users)
            if(!localStorage.users){
                localStorage.users = JSON.stringify([]);
            }

            return JSON.parse(localStorage.users);
        }

        function setUsers(users) {
            localStorage.users = JSON.stringify(users);
        }

        function SearchCompany(pin, number) {
            console.log(pin, number)
            var deferred = $q.defer();

            // simulate api call with $timeout
            $timeout(function () {
                if(pin == 1) {
                    deferred.resolve({ success: true, message: {
                        businessName: 'Zion Tech',
                        phoneNumber: '02031417035',
                        timezone: 'EST',
                        street: 'Meer Street',
                        city: 'STRATFORD-UPON-AVON',
                        zip: '34567',
                        billingStreet: 'Meer Street',
                        billingCity: 'STRATFORD-UPON-AVON',
                        billingState: 'WRTY',
                        billingZip: '34567',
                        usstate: 'WRTY'

                    }})
                } else {
                    deferred.reject({ success: false, message: 'Pin "' + pin + '" is bad' })
                }
                

            }, 1000);


            return deferred.promise

        }
    
}