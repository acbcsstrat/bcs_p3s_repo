angular.module('ppApp').directive('validateNumbers', function(){

    var regExp = /^[0-9]*$/;

    return {

        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {

            function myValidation(value) {
                if (regExp.test(value)) {
                    ctrl.$setValidity('validNumber', true);
                } else {
                    ctrl.$setValidity('validNumber', false);
                }
                return value;
            }
            ctrl.$parsers.push(myValidation);
        }

    };

})
