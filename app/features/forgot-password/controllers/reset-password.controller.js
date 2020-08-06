import zxcvbn from 'zxcvbn';

ResestPasswordController.$inject = ['$state', '$rootScope','$http', '$scope', '$cookies', 'AuthorisationService']

export default function ResestPasswordController($state, $rootScope, $http, $scope, $cookies, AuthorisationService) {

	var vm = this;

	vm.submitEmail = submitEmail;

	vm.formData = {};
    vm.recap = {};
    vm.recap.publicKey = '6LezdHEUAAAAABvniybP4wWGWWztRMQXT5r0_WMs';
    vm.passwordUpdate = passwordUpdate
  
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

		var params = {
			password: password
		}

		AuthorisationService.ResetPassword(params)
		.then(
			function(response){

			},
			function(errResponse){

			}
		)


	}


}