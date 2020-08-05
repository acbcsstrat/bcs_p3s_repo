ForgotPasswordController.$inject = ['$state', '$rootScope','$http', '$scope', '$cookies', 'AuthorisationService']

export default function ForgotPasswordController($state, $rootScope, $http, $scope, $cookies, AuthorisationService) {

	var vm = this;


	vm.submitEmail = submitEmail;

	function submitEmail(emailAddress) {

		var params = {
			emailAddress: emailAddress
		}

		AuthorisationService.SubmitForgottenEmail(params)
		.then(
			function(response){

			},
			function(errResponse){

			}
		)


	}


}