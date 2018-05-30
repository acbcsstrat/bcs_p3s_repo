angular.module('ppApp').directive('menuToggle', [ '$timeout', function($timeout){
    return {
        scope: {
            section: '=',
            context: '='
        },
        templateUrl: 'p3sweb/app/views/app/views/main-nav-li.htm',
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

.directive('menuLink', [ '$timeout', function($timeout){
    return {
        scope: {
            section: '='
        },
        templateUrl: 'p3sweb/app/views/app/views/main-nav-li-item.htm',
        link: function ($scope, $element) {
            var controller = $element.parent().controller();
            $scope.focusSection = function () {
                // set flag to be used later when
                // $locationChangeSuccess calls openPage()
                controller.autoFocusContent = true;
            };
        }
    };
}]);