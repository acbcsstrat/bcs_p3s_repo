import zxcvbn from 'zxcvbn';

ResestPasswordController.$inject = ['$state', '$rootScope','$http', '$scope', '$cookies', '$uibModal', 'AuthorisationService', 'Idle']

export default function ResestPasswordController($state, $rootScope, $http, $scope, $cookies, $uibModal, AuthorisationService, Idle) {

	var vm = this;

	vm.submitEmail = submitEmail;

	vm.formData = {};
    vm.recap = {};
    vm.recap.publicKey = '6LezdHEUAAAAABvniybP4wWGWWztRMQXT5r0_WMs';
    vm.passwordUpdate = passwordUpdate;

    function init() {
        Idle.unwatch()
    }

    init();    
  
    function passwordUpdate(password) {

        if(password !== undefined) {
            if(vm.formData.password.length < 8){ //https://stackoverflow.com/questions/56314220/angularjs-minlength-validation-stop-characters-counter
                $scope.resetPasswordForm.password.$setValidity('minlength', false);
            } else{
                $scope.resetPasswordForm.password.$setValidity('minlength', true);
            }

            if(vm.formData.password.length > 20){
                $scope.resetPasswordForm.password.$setValidity('maxlength', false);
            } else{
                $scope.resetPasswordForm.password.$setValidity('maxlength', true);
            }

            vm.passwordStrength = zxcvbn(password);
        }
        
    }	

	function submitEmail(password) {
        vm.dataLoading = true;
		var params = {
			password: password
		}

		AuthorisationService.ResetPassword(params)
		.then(
			function(response){
                vm.dataLoading = false;
                var modalInstance = $uibModal.open({
                    template: require('html-loader!../html/modals/modal.reset-password-success.tpl.htm').default,
                    appendTo: undefined,
                    controllerAs: '$ctrl',
                    controller: ['$uibModalInstance', '$location', '$anchorScroll', function($uibModalInstance, $location, $anchorScroll) {

                       
                        this.dismissModal = function () {
                            $uibModalInstance.close();
                        };


                    }]
                })
                $state.go('login'); 
			},
			function(errResponse){
                vm.dataLoading = false;
                $state.go($state.current, {}, {reload: true});
                var modalInstance = $uibModal.open({
                    template: require('html-loader!../html/modals/modal.reset-password-error.tpl.htm').default,
                    appendTo: undefined,
                    controllerAs: '$ctrl',
                    controller: ['$uibModalInstance', '$location', '$anchorScroll', function($uibModalInstance, $location, $anchorScroll) {

                       
                        this.dismissModal = function () {
                            $uibModalInstance.close();
                        };


                    }]
                })                
			}
		)


	}


}