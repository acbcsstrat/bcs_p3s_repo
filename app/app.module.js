angular.module('ppApp', ['ui.router', 'ngIdle', 'ngAnimate', 'ui.bootstrap', 'ngCart', 'ngMaterial', 'ui.carousel', 'ngTouch', 'angular-carousel', 'angularMoment', 'LocalStorageModule', 'nvd3', 'ngCookies']);

angular.module('ppApp').run(startUpRun)

startUpRun.$inject = ['Idle', 'userService', '$rootScope', '$timeout'];

function startUpRun(Idle, userService, $rootScope, $timeout) {

    userService.fetchUser()
    .then(
        function(response){
            $rootScope.user = response;
        },
        function(errResponse){
            console.log(errResponse)
        }
    )

    Idle.watch();

};