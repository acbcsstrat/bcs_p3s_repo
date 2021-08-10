function validFileSize($parse){

    return {
        require: 'ngModel',
        restrict: 'A',
        link: function(scope, el, attrs, ngModel) {

            var model = $parse(attrs.ngModel);
            var modelSetter = model.assign;
            var maxSize = 2000; //2000 B
            el.bind('change', function() {
                scope.$apply(function() {
                    scope.fileStore.maxSizeError = false;
                    if (el[0].files.length > 1) {
                        modelSetter(scope, el[0].files);
                    } else {
                        modelSetter(scope, el[0].files[0]);
                    }

                    if(el[0].files.length > 0) {
                        var fileSize = el[0].files[0].size;
                        if (fileSize === 0) {
                           scope.fileStore.maxSizeError = true;
                        }
                    }
                    
                });
            });
        }

    }
}

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

function validateTextField() {

    var regExp = /[[\]<>"%;&+*/\\]/g;

    return {

        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {

            function myValidation(value) {

                if(regExp.test(value)) {
                     ctrl.$setValidity('validTextField', false);                  
                } else {

                     ctrl.$setValidity('validTextField', true);
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

            if (angular.isUndefined(attrs.multiple)) {
                 return;
            }
            ngModelCtrl.$isEmpty = function (modelValue) {
                return !modelValue.length;
            };
        }
    };
};

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
            var validFormats = ['pdf', 'PDF'];
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


fileModel.$inject = ['$parse'];

function fileModel($parse) {
    return {
       restrict: 'A',
       link: function(scope, element, attrs) {
              var model = $parse(attrs.fileModel);
              var modelSetter = model.assign;

              element.bind('change', function(){
                 scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                 });
              });
       }
    };
}

export default angular.module('directives.validation-rules', [])
    .directive('fileModel', fileModel)
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
    .directive('validateTextField', validateTextField)
    .directive('validFileSize', validFileSize)
    .name;
