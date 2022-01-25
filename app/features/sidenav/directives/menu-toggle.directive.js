import angular from 'angular';

export default angular.module('directives.sidenav.menutoggle', []).directive('menuToggle', menuToggle).name;

function menuToggle() {

    return {
        scope: {
            section: '=',
            context: '='
        },
        template: require('html-loader!../html/sidenav-nav-li.tpl.htm').default,
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

}




