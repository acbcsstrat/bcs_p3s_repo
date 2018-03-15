var app = angular.module('myApp', ['ui.router', 'chart.js', 'ngIdle', 'ngAnimate', 'ui.bootstrap', 'ngCart', 'ngCookies', 'ngMaterial', 'slickCarousel', 'angularMoment', 'ngTable', 'LocalStorageModule', 'nvd3']);

app.run(['Idle', 'userService', '$rootScope', 'amMoment', '$timeout', function(Idle, userService, $rootScope, amMoment, $timeout, $uibModal) {

    $rootScope.page = '';

    $rootScope.color = 'green';

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

app.controller('mainNavCtrl', ['$scope', '$mdSidenav', 'ngCart', '$timeout', function($scope, $mdSidenav, ngCart,  $timeout){
 	$scope.toggleLeft = buildToggler('left');
    $scope.toggleRight = buildToggler('right');

    function buildToggler(componentId) {
      return function() {
        $mdSidenav(componentId).toggle();
      };
    } 
}]);

app.directive('menuToggle', [ '$timeout', function($timeout){
    return {
        scope: {
            section: '=',
            context: '='
        },
        templateUrl: 'p3sweb/app/components/app/views/main-nav-li.htm',
        link: function($scope, $element) {
            var controller = $scope.context

            $scope.isOpen = function() {
                 return controller.isOpen($scope.section);
            };
            $scope.toggle = function() {
                controller.toggleOpen($scope.section);
            };
        }
    };
}])

app.directive('menuLink', [ '$timeout', function($timeout){
    return {
        scope: {
            section: '='
        },
        templateUrl: 'p3sweb/app/components/app/views/main-nav-li-item.htm',
        link: function ($scope, $element) {
            var controller = $element.parent().controller();
            $scope.focusSection = function () {
                // set flag to be used later when
                // $locationChangeSuccess calls openPage()
                controller.autoFocusContent = true;
            };
        }
    };
}])
	