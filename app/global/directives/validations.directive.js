function validateNumbers(){

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

}

function validateCompanyName() {

    var regExp = /^[a-zA-z0-9\'\+\.\(\), -]*$/;

    return {

        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {

            function myValidation(value) {
                if (regExp.test(value)) {
                    ctrl.$setValidity('validCompanyName', true);
                } else {
                    ctrl.$setValidity('validCompanyName', false);
                }
                return value;
            }
            ctrl.$parsers.push(myValidation);
        }

    };

}

function validateName(){

    var regExp = /^[a-zA-z0-9\s\w'-]*$/;

    return {

        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {

            function myValidation(value) {
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

}

function validatePhone() {

    var regExp = /^[0-9\s\+\-\(\) ]*$/;

    return {
        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {

            function myValidation(value) {
                if (regExp.test(value)) {
                    ctrl.$setValidity('validPhone', true);
                } else {
                    ctrl.$setValidity('validPhone', false);
                }
                return value;
            }
            ctrl.$parsers.push(myValidation);
        }        
    };

}

function validateEmail(){

    var regExp = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,})$/;

    return {
        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {

            function myValidation(value) {
                if (regExp.test(value)) {
                    ctrl.$setValidity('validEmail', true);
                } else {
                    ctrl.$setValidity('validEmail', false);
                }
                return value;
            }
            ctrl.$parsers.push(myValidation);
        }        
    };

}

function validateAddress(){

    var regExp = /^[a-zA-z0-9\s\-\(\).,]*$/;

    return {
        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {
            
            var modelController = elem.controller('ngModel');

            function myValidation(value) {
                if (regExp.test(value)) {

                    modelController.$setValidity('validAddress', true);
                } else {
                    modelController.$setValidity('validAddress', false);
                }
                return value;
            }
            ctrl.$parsers.push(myValidation);
        }
    };

}

function validateZip(){

    var regExp = /^[0-9\-]*$/;

    return {
        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {
            
            var modelController = elem.controller('ngModel');

            function myValidation(value) {
                if (regExp.test(value)) {

                    modelController.$setValidity('validZip', true);
                } else {
                    modelController.$setValidity('validZip', false);
                }
                return value;
            }
            ctrl.$parsers.push(myValidation);
        }        
    };
}


function uiSelectRequired() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            console.log('what')
            if (angular.isUndefined(attrs.multiple)) {
                 return;
            }
            ngModelCtrl.$isEmpty = function (modelValue) {
                console.log(modelValue)
                return !modelValue.length;
            };
        }
    };
};
// function checkStrength() {

//     return {
//         replace: false,
//         restrict: 'EACM',
//         link: function (scope, iElement, iAttrs) {
//             console.log(scope)
//             var strength = {
//                 colors: ['#e30613', '#f9b233', '#53ab58', '#418746'],
//                 measureStrength: function (p) {
//                     var _force = 0;                    
//                     var _regex = /[$-/:-?{-~!"^_`\[\]]/g;
                                          
//                     var _lowerLetters = /[a-z]+/.test(p);                    
//                     var _upperLetters = /[A-Z]+/.test(p);
//                     var _numbers = /[0-9]+/.test(p);
//                     var _symbols = _regex.test(p);
                                          
//                     var _flags = [_lowerLetters, _upperLetters, _numbers, _symbols];                    
//                     var _passedMatches = $.grep(_flags, function (el) { return el === true; }).length;                                          
                    
//                     _force += 2 * p.length + ((p.length >= 10) ? 1 : 0);
//                     _force += _passedMatches * 10;
                        
//                     // penality (short password)
//                     _force = (p.length <= 6) ? Math.min(_force, 10) : _force;                                      
                    
//                     // penality (poor variety of characters)
//                     _force = (_passedMatches == 1) ? Math.min(_force, 10) : _force;
//                     _force = (_passedMatches == 2) ? Math.min(_force, 20) : _force;
//                     _force = (_passedMatches == 3) ? Math.min(_force, 30) : _force;
                    
//                     return _force;

//                 },
//                 getColor: function (s) {

//                     var idx = 0;
//                     if (s <= 10) { idx = 0; }
//                     else if (s <= 20) { idx = 1; }
//                     else if (s <= 30) { idx = 2; }
//                     else { idx = 3; }
//                     // else { idx = 4; }
//                     return { idx: idx + 1, col: this.colors[idx] };

//                 }
//             };

//             var updatePasswordStrength = function (viewValue) {
//                 iElement.css({ "display": "inline" });
//                 if (!viewValue || viewValue === '') {
//                     iElement.children('li')
//                     .css({ "background": "#DDD" })
//                 } else {

//                     var color = strength.getColor(strength.measureStrength(viewValue));
//                     iElement.children('li')
//                     .css({ "background": "#DDD" })
//                     .slice(0, color.idx)
//                     .css({ "background": color.col });

//                 }

//                 return viewValue;

//             };

//             scope.userProfileForm[iAttrs.checkStrength].$parsers.unshift(updatePasswordStrength);
//             scope.userProfileForm[iAttrs.checkStrength].$formatters.unshift(updatePasswordStrength);

//         },
//         template: '<li class="point md-point lg-point"></li><li class="point md-point lg-point"></li><li class="point md-point lg-point"></li><li class="point md-point lg-point"></li>'
//     };
// }


function refValidate() {

    var regExp = /[&<>]/;

    return {
        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {

            function myValidation(value) {
                if (!regExp.test(value)) {
                    ctrl.$setValidity('validRef', true);
                } else {
                    ctrl.$setValidity('validRef', false);
                }
                return value;
            }
            ctrl.$parsers.push(myValidation);
        }        
    };

}


function selectNgFiles() { //if files to be uploaded vary in future, add condition to check type or create new directive
    return {
        require: "ngModel",
        link: function postLink(scope,elem,attrs,ngModel) {
            var validFormats = ['pdf'];
            elem.bind('change', function () {
                validFile(false);
                scope.$apply(function () {
                    ngModel.$render();
                });
            });
            ngModel.$render = function () {
                ngModel.$setViewValue(elem[0].files[0]);
            };
            function validFile(bool) {
                ngModel.$setValidity('pdfIncorrect', bool);
            }
            ngModel.$parsers.push(function(value) {
                var ext = value.name.substr(value.name.lastIndexOf('.')+1);
                if(ext=='') return;
                if(validFormats.indexOf(ext) == -1){
                    return value;
                }
                validFile(true);
                return value;
            });
        }
    }
}

function selectNgValidationFiles() { //if files to be uploaded vary in future, add condition to check type or create new directive
    return {
        require: "ngModel",
        link: function postLink(scope,elem,attrs,ngModel) {
            var validFormats = ['pdf', 'PDF', 'doc', 'DOC', 'docx', 'DOCX', 'jpg', 'JPG', 'jpeg', 'JPEG','png', 'PNG', 'gif', 'GIF'];
            elem.bind('change', function () {
                validFile(false);
                scope.$apply(function () {
                    ngModel.$render();
                });
            });
            ngModel.$render = function () {
                ngModel.$setViewValue(elem[0].files[0]);
            };
            function validFile(bool) {
                ngModel.$setValidity('pdfIncorrect', bool);
            }
            ngModel.$parsers.push(function(value) {
                var ext = value.name.substr(value.name.lastIndexOf('.')+1);
                if(ext=='') return;
                if(validFormats.indexOf(ext) == -1){
                    return value;
                }
                validFile(true);
                return value;
            });
        }
    }
};


export default angular.module('directives.validation-rules', [])
    .directive('validateName', validateName)
    .directive('validateNumbers', validateNumbers)
    .directive('validatePhone', validatePhone)
    .directive('validateEmail', validateEmail)
    .directive('validateAddress', validateAddress)
    .directive('validateZip', validateZip)
    .directive('refValidate', refValidate)
    .directive('selectNgFiles', selectNgFiles)
    .directive('selectNgValidationFiles', selectNgValidationFiles)
    .directive('validateCompanyName', validateCompanyName)
    .directive('uiSelectRequired', uiSelectRequired)
    .name;
