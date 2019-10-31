angular.module('ppApp').controller('userProfileCtrl', userProfileCtrl);

userProfileCtrl.$inject = ['$state', 'userService', '$rootScope', '$scope', '$timeout', '$uibModal', 'timezoneService', '$http', 'uploadAvatarServ']

function userProfileCtrl($state, userService, $rootScope, $scope, $timeout, $uibModal, timezoneService, $http, uploadAvatarServ) {

    var vm = this;

    vm.pageTitle = 'Profile';

    $scope.newPassword = '';
    vm.updateTimezone = updateTimezone;
    vm.updateUser = updateUser;
    vm.openAvatarModal = openAvatarModal;

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

    function openAvatarModal() {
        var modalInstance = $uibModal.open({
            templateUrl: 'app/templates/modals/modal.upload-avatar-pic.tpl.htm',
            appendTo: undefined,
            controller: ['$uibModalInstance', '$scope', function($uibModalInstance, $scope){

                $scope.uploadImg = true;
                $scope.avatarImgUploaded = false;

                $scope.dismissModal = function() {
                    $uibModalInstance.close()
                }

                $scope.cropped = {
                    source: ''
                }

                $scope.imgSelected = false;

                function dataURItoBlob(dataURI) { //In computer science Base64 is a group of binary-to-text encoding schemes that represent binary data in an ASCII string format 
                    var binary = atob(dataURI.split(',')[1]);
                    var array = [];
                    for(var i = 0; i < binary.length; i++) {
                        array.push(binary.charCodeAt(i));
                    }
                    return new Blob([new Uint8Array(array)], {type: 'image/jpeg '});
                }

                $scope.uploadAvatar = function() {

                    var blob = dataURItoBlob($scope.cropped.image);
                    var formData = new FormData();
                    formData.append('image', blob);
                    uploadAvatarServ.uploadAvatar(formData) 
                    .then(
                        function(response){
                            $scope.avatarImgUploaded = true;
                            $rootScope.$emit('refreshAvatar',function(){
                            })
                            $state.reload();
                        },
                        function(errResponse){
                            console.error('Error : unable to upload new image')
                        }
                    )
                         
                }

            }]
        })
    }

    function updateTimezone(item) {
       vm.user.business.timezone = item;
    }   

    function updateUser(user, p) {

        user = vm.user;

        if (p !== '' || p !== undefined) {
            user.newPassword = p;
        }

        userService.updateUser(user)
        .then(
            function(response){  
                var modalInstance = $uibModal.open({
                    templateUrl: 'app/templates/modals/modal.update-profile-success.tpl.htm',
                    appendTo: undefined,
                    controller: ['$uibModalInstance', '$scope', function($uibModalInstance, $scope) {

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

    };

}