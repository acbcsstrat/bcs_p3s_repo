angular.module('ppApp').controller('userProfileCtrl', userProfileCtrl);

userProfileCtrl.$inject = ['userService', '$rootScope', '$scope', '$timeout', '$uibModal', 'timezoneService']

function userProfileCtrl(userService, $rootScope, $scope, $timeout, $uibModal, timezoneService) {

    var vm = this;

    $rootScope.page = 'Profile';

    $scope.newPassword = '';
    vm.updateTimezone = updateTimezone;
    vm.confirmUpdate = confirmUpdate;    

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

    function confirmUpdate(user, p) {
        user = vm.user;
       
        $timeout(function() {
            userService.updateUser(user)
            .then(
                function(response){

                     var modalInstance = $uibModal.open({
                        templateUrl: 'app/templates/modals/modal.successfully-updated-profile.tpl.htm',
                        appendTo: undefined,
                        controller: ['$uibModalInstance', '$scope', function($uibModalInstance, $scope) {

                            if (p !== '') {
                                user.newPassword = p;
                            }

                            $scope.dismissModal = function() {
                                $uibModalInstance.close();
                            };

                        }]
                    })
                },
                function(errResponse){
                    console.log(errResponse)
                }
            
            )
        }, 200);
       
    };
}