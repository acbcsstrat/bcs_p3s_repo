LoginController.$inject = ['$state', '$http', '$scope', 'AuthorisationService']

export default function LoginController($state, $http, $scope, AuthorisationService) {

    var vm = this;

    vm.login = login;

    (function initController() {
        // reset login status
        console.log('init controller')
        AuthorisationService.ClearCredentials();
    })();
    console.log('say what')
    function login() {
        console.log('login invoke')
        vm.dataLoading = true;
        console.log('vm.username : ', vm.username)
        console.log('vm.password : ', vm.password)
        AuthorisationService.Login(vm.username, vm.password, function (response) {
            console.log('response : ', response)
            if (response.success) {
                AuthorisationService.SetCredentials(vm.username, vm.password);
                $state.go('dashboard');
            } else {
                vm.dataLoading = false;
            }
        });
    };

}