angular.module('ppApp').directive('validateSearch', function(){

    var regExp = /^([0-9])+\.([0-9])$/;

    return {

        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {

            function myValidation(value) {
                console.log(value)
                if (regExp.test(value)) {
                    ctrl.$setValidity('validName', true);
                } else {
                    ctrl.$setValidity('validName', false);
                }
                return value;
            }
            ctrl.$parsers.push(myValidation);
        }

    };

})