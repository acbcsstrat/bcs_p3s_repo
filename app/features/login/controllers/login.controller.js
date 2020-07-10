LoginController.$inject = ['$http', '$scope', 'AuthorisationService']

export default function LoginController($http, $scope, AuthorisationService) {

	var vm = this;

	vm.authorise = authorise;

	function authorise() {
		
		AuthorisationService.go('dashboard')

	}

}