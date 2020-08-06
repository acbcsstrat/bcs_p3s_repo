ResestPasswordController.$inject = ['$state', '$rootScope','$http', '$scope', '$cookies', 'AuthorisationService']

export default function ResestPasswordController($state, $rootScope, $http, $scope, $cookies, AuthorisationService) {

	var vm = this;

	vm.submitEmail = submitEmail;

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