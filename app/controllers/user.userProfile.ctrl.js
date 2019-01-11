angular.module('ppApp').controller('userProfileCtrl', userProfileCtrl);

userProfileCtrl.$inject = ['userService', '$rootScope', '$scope', '$timeout', '$uibModal', 'timezoneService']

function userProfileCtrl(userService, $rootScope, $scope, $timeout, $uibModal, timezoneService) {

    var vm = this;

    vm.pageTitle = 'Profile';

    $scope.newPassword = '';
    vm.updateTimezone = updateTimezone;
    vm.updateUser = updateUser;    

    vm.$onInit = function() {

        timezoneService.fetchUsaTimeZones()
        .then(
            function(response){
                vm.ustimezones = response;
            },
            function(errResponse){

            }
        )
            
        userService.fetchUser()
        .then(
            function(response){
                vm.user = response;
            },
            function(errResponse){

            }
        )

        userService.listUsers()
        .then(
            function(response){
                
                for (var i=0; i < response.length; i++) {
                    response[i].index = i + 1;
                }

                vm.companyUsers = response;

                var userCol = (response.length / 2) + 1;
                var newArr = [];

                function chunk(arr, size) {
                    for (var i=0; i < arr.length; i+=size) {
                        newArr.push(arr.slice(i, i+size));
                    }
                    return newArr;
                }

                vm.chunkedData = {
                    chunk: chunk(vm.companyUsers, userCol)
                }

            },
            function(errResponse){
                console.log(errResponse);
            }
        );
       
    };

    function updateTimezone(item) {
       vm.user.business.timezone = item;
    }   

    function updateUser(user, p) {

        user = vm.user;

        if (p !== '' || undefined) {
            user.newPassword = p;
        }

        userService.updateUser(user)
        .then(
            function(response){  
                var modalInstance = $uibModal.open({
                    templateUrl: 'app/templates/modals/modal.update-profile-success.tpl.htm',
                    appendTo: undefined,
                    controllerAs: '$ctrl',
                    controller: ['$uibModalInstance', '$scope', function($uibModalInstance, $scope) {

                        this.dismissModal = function() {
                            $uibModalInstance.close();
                        };

                    }]
                })
            },
            function(errResponse){
                console.log(errResponse)
            }
        
        )

    };
}