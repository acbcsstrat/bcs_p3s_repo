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

        function GetByUsername(username) {
            var deferred = $q.defer();
            var filtered = $filter('filter')(getUsers(), { username: username });
            var user = filtered.length ? filtered[0] : null;
            deferred.resolve(user);
            return deferred.promise;
        }

        function Create(user) {
            var deferred = $q.defer();

            // simulate api call with $timeout
            $timeout(function () {
                GetByUsername(user.username)
                    .then(function (duplicateUser) {
                        if (duplicateUser !== null) {
                            deferred.reject({ success: false, message: 'Username "' + user.username + '" is already taken' });
                        } else {
                            var users = getUsers();

                            // assign id
                            var lastUser = users[users.length - 1] || { id: 0 };
                            user.id = lastUser.id + 1;

                            // save to local storage
                            users.push(user);
                            setUsers(users);

                            deferred.resolve({ success: true });
                        }
                    });
            }, 1000);

            return deferred.promise;
        }

        // function Update(user) {
        //     var deferred = $q.defer();

        //     var users = getUsers();
        //     for (var i = 0; i < users.length; i++) {
        //         if (users[i].id === user.id) {
        //             users[i] = user;
        //             break;
        //         }
        //     }
        //     setUsers(users);
        //     deferred.resolve();

        //     return deferred.promise;
        // }

        // function Delete(id) {
        //     var deferred = $q.defer();

        //     var users = getUsers();
        //     for (var i = 0; i < users.length; i++) {
        //         var user = users[i];
        //         if (user.id === id) {
        //             users.splice(i, 1);
        //             break;
        //         }
        //     }
        //     setUsers(users);
        //     deferred.resolve();

        //     return deferred.promise;
        // }

        // private functions

        function getUsers() {
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