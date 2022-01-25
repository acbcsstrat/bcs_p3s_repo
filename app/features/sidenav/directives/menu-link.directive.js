export default angular.module('directives.sidenav.menuLink', []).directive('menuLink', menuLink).name;

function menuLink() {
    return {
        scope: {
            section: '='
        },
        template: require('html-loader!../html/sidenav-li-item.tpl.htm').default,
        link: function ($scope, $element) {
            var controller = $element.parent().controller();
            // $scope.focusSection = function () {
            //     // set flag to be used later when
            //     // $locationChangeSuccess calls openPage()
            //     controller.autoFocusContent = true;
            // };
        }
    };
};

