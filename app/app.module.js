var app = angular.module('myApp', ['ui.router', 'chart.js', 'ngIdle', 'ngAnimate', 'ui.bootstrap', 'ngCart', 'ngCookies', 'ngMaterial', 'slickCarousel', 'angularMoment', 'ngTable', 'LocalStorageModule', 'nvd3']);

app.run(['Idle', 'userService', '$rootScope', 'amMoment', '$timeout', function(Idle, userService, $rootScope, amMoment, $timeout, $uibModal) {

    $rootScope.page = '';

    userService.fetchUser()
    .then(
        function(response){
            $rootScope.user = response;
        },
        function(errResponse){
            console.log(errResponse)
        }
    )

    function timeZoneClocks() {

        var utc = moment.tz("Etc/UTC").format('HH:mm MM/DD/YYYY');
        var est = moment.tz("America/New_York").format('HH:mm MM/DD/YYYY');
    
        var t = $timeout(function() {
            $rootScope.utcTime = utc;
            $rootScope.estTime =  est;
            timeZoneClocks()
        }, 500);
    }

   timeZoneClocks()

   Idle.watch();

}]);