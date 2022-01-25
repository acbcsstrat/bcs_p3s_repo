zxPasswordMeter.$inject = ['$compile'];

function zxPasswordMeter($compile) {
    return {
        scope: {
          value: "@",
          max: "@?"
        },
        template: require("html-loader!./html/password-meter.tpl.htm").default,
        link: function(scope) {

          scope.type = 'danger';
          scope.max = (!scope.max) ? 100 : scope.max;

          scope.$watch('value', function(newValue) {

            var strenghPercent = newValue / scope.max;
            
            if (strenghPercent === 0) {
              scope.text = 'No Score';
            } else if (strenghPercent <= 0.25) {
              scope.type = 'danger';
              scope.text = 'Weak';
            } else if (strenghPercent <= 0.50) {
              scope.type = 'warning';
              scope.text = 'Moderate';
            } else if (strenghPercent <= 0.75) {
              scope.type = 'warning';
              scope.text = 'Strong';
            } else {
              scope.type = 'success';
              scope.text = 'Perfect';
            }

          });
        }
      }
}
 
export default angular.module('directives.zxPasswordMeter', [])
    .directive('zxPasswordMeter', zxPasswordMeter)
    .name;
