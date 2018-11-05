
// require('angular-moment');
// var ngModule = angular.module('ngApp',['angularMoment']);
// ngModule.constant('moment', require('moment-timezone'));

angular.module('ppApp', ['ui.router', 'ngIdle', 'ngAnimate', 'ui.bootstrap', 'ngCart', 'ngMaterial', 'slickCarousel', 'angularMoment', 'LocalStorageModule', 'nvd3']);

angular.module('ppApp').run(startUpRun)

<<<<<<< HEAD
startUpRun.$inject = ['Idle', 'userService', '$rootScope', 'moment', '$timeout'];

function startUpRun(Idle, userService, $rootScope, moment, $timeout) {
=======
startUpRun.$inject = ['Idle', 'userService', '$rootScope', '$timeout'];

function startUpRun(Idle, userService, $rootScope, $timeout) {
>>>>>>> origin/fe-branch-v2.2

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

<<<<<<< HEAD
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

=======
>>>>>>> origin/fe-branch-v2.2
    Idle.watch();

};