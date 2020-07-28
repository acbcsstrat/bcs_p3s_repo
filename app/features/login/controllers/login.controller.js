LoginController.$inject = ['$state', '$http', '$scope', 'AuthorisationService']

export default function LoginController($state, $http, $scope, AuthorisationService) {

    var vm = this;

    vm.login = login;

    (function initController() {
        // reset login status
        console.log('init controller')
        AuthorisationService.ClearCredentials();
    })();
    function login(data) {
        console.log('data : ', data)
        vm.dataLoading = true;
        AuthorisationService.Login(data, function (response) {
            console.log('responseeeee : ', response)
            if (response.success) {
                // AuthorisationService.SetCredentials(vm.username, vm.password);
                $state.go('dashboard');
            } else {
                vm.dataLoading = false;
            }
        });
    };

}