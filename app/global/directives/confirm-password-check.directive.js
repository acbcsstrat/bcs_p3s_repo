function confrimPwTo() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=confrimPwTo"
        },
        link: function(scope, element, attributes, ngModel) {

            ngModel.$validators.confrimPwTo = function(modelValue) {
                if(!modelValue) {
                    return true;
                }
                return modelValue == scope.otherModelValue;
            };
 
            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
}

export default angular.module('directives.confirm-pw-to', [])
    .directive('confrimPwTo', confrimPwTo)
    .name;