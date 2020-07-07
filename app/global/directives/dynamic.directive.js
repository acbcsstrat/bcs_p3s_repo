dynamic.$inject = ['$compile'];

function dynamic($compile) {
    return {
        restrict: 'A',
        replace: true,
        link: function (scope, ele, attrs) {
          scope.$watch(attrs.dynamic, function(html) {
            ele.html(html);
            $compile(ele.contents())(scope);
          });
        }
    }
}
 
export default angular.module('directives.dynamic', [])
    .directive('dynamic', dynamic)
    .name;