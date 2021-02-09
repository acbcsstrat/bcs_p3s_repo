import zxcvbn from 'zxcvbn';

ProfileController.$inject = ['$state', '$rootScope', '$scope', '$timeout', '$uibModal', '$http', 'UploadAvatarService', 'ProfileService', 'TimezoneService',]

export default function ProfileController($state, $rootScope, $scope, $timeout, $uibModal, $http, UploadAvatarService, ProfileService, TimezoneService) {

    var vm = this;

    $scope.newPassword = '';
    vm.updateTimezone = updateTimezone;
    vm.updateUser = updateUser;
    vm.openAvatarModal = openAvatarModal;
    vm.passwordUpdate = passwordUpdate;

    function init() {

        TimezoneService.fetchUsaTimeZones()
        .then(
            function(response){
                vm.ustimezones = response;
            }
        )
            
        ProfileService.fetchUser()
        .then(
            function(response){
                vm.user = response;
            }
        )

        ProfileService.listUsers()
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
                console.error('Error listing users. Error: ', errResponse);
            }
        );
       
    }; //init end

    init();

    function passwordUpdate(password) {

        if(password) {
            vm.confirmPasswordReq = true;
            if(vm.formData.password.length < 8){ //https://stackoverflow.com/questions/56314220/angularjs-minlength-validation-stop-characters-counter
                $scope.userProfileForm.password.$setValidity('minlength', false);
            } else{
                $scope.userProfileForm.password.$setValidity('minlength', true);
            }

            if(vm.formData.password.length > 20){
                $scope.userProfileForm.password.$setValidity('maxlength', false);
            } else{
                $scope.userProfileForm.password.$setValidity('maxlength', true);
            }

            vm.passwordStrength = zxcvbn(password);
        } else {
            vm.confirmPasswordReq = false;
        }
        
    }

    function openAvatarModal() {
        var modalInstance = $uibModal.open({
            template: require('html-loader!../html/modals/modal.upload-avatar-pic.tpl.htm'),
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
                    UploadAvatarService.uploadAvatar(formData) 
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
    } //open avatar end

    function updateTimezone(item) {
       vm.user.business.timezone = item;
    }   

    function updateUser(user, p) {

        user = vm.user;

        if (p !== '' || p !== undefined) {
            user.newPassword = p;
        }

        ProfileService.updateUser(user)
        .then(
            function(response){  

                var modalInstance = $uibModal.open({
                    template: require('html-loader!../html/modals/modal.update-profile-success.tpl.htm'),
                    appendTo: undefined,
                    controller: ['$uibModalInstance', '$scope', function($uibModalInstance, $scope) {

                        $scope.dismissModal = function() {
                            $uibModalInstance.close();
                        };

                    }]
                })
            },
            function(errResponse){
                console.error('Error updating user. Error : ', errResponse)
                var modalInstance = $uibModal.open({
                    template: require('html-loader!../html/modals/modal.update-profile-error.tpl.htm'),
                    appendTo: undefined,
                    controller: ['$uibModalInstance', '$scope', function($uibModalInstance, $scope) {

                        $scope.dismissModal = function() {
                            $uibModalInstance.close();
                        };

                    }]
                })                
            }
        
        )

    }; //update user end
}