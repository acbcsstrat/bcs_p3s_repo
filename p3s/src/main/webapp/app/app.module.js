angular.module('ppApp', ['ui.router', 'ngIdle', 'ngAnimate', 'ui.bootstrap', 'ngCart', 'ngMaterial', 'slickCarousel', 'angularMoment', 'LocalStorageModule', 'nvd3']);

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