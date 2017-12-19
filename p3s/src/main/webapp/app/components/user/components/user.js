app.component('user', {
  	bindings: { 
        user: '<',
        timezones: '<'
    },
	templateUrl: 'p3sweb/app/components/user/views/user-profile.htm',
	controller: ['userService', 'timezoneService', '$q', '$rootScope', '$scope', '$timeout', '$uibModal', function(userService, timezoneService, $q, $rootScope, $scope, $timeout, $uibModal) {
		
		var vm = this;

        $rootScope.page = 'Profile'

        $scope.newPassword = '';

        vm.$onInit = function() {
            $scope.user = vm.user;
        }

        vm.updateUser = function(user, p) {
           
            
        }

        vm.confirmUpdate = function(user, p) {

            var modalInstance = $uibModal.open({
                templateUrl: 'p3sweb/app/components/user/views/modals/modal-successfully-updated-profile.htm',
                appendTo: undefined,
                controller: function($uibModalInstance, $scope) {

                    if (p !== '') {
                        user.newPassword = p;
                    }

                    $timeout(function() {
                        userService.updateUser(user);
                    }, 200);

                    $scope.dismissModal = function() {
                        $uibModalInstance.close();
                    }
                    
                }
            })

        }

        userService.listUsers()
        .then(
            function(response){
                
                vm.companyUsers = response;
                var userCol = (response.length / 2) + 1;
                var newArr = [];

                function chunk(arr, size) {
                    for (i=0; i < arr.length; i+=size) {
                        newArr.push(arr.slice(i, i+size));
                    }
                    return newArr;
                }           

                vm.chunkedData = chunk(vm.companyUsers, userCol);
            },
            function(errResponse){
                console.log(errResponse)
            }
        )
        
	}]
})

app.directive('validateName', function(){

    var regExp = /^[a-zA-z0-9\s\w'-]*$/;

    return {

        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {

            

            function myValidation(value) {
                if (regExp.test(value)) {
                    console.log('EARYAAAAAA')
                    ctrl.$setValidity('validName', true);
                } else {
                    console.log('ERNNOOOOOO')
                    ctrl.$setValidity('validName', false);
                }
                return value;
            }
            ctrl.$parsers.push(myValidation);

        }

    }

})
.directive('validatePhone', function(){

    var regExp = /^[0-9\s\+\-\(\)\']*$/;

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
    }

})
.directive('validateAddress', function(){

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
    }    

})
.directive('validateZip', function(){

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
    }    

})


app.directive('checkStrength', function () {

    return {
        replace: false,
        restrict: 'EACM',
        link: function (scope, iElement, iAttrs) {

            var strength = {
                colors: ['#e30613', '#e30613', '#f9b233', '#f9b233', '#53ab58'],
                mesureStrength: function (p) {
                    
                    var _force = 0;                    
                    var _regex = /[$-/:-?{-~!"^_`\[\]]/g;
                                          
                    var _lowerLetters = /[a-z]+/.test(p);                    
                    var _upperLetters = /[A-Z]+/.test(p);
                    var _numbers = /[0-9]+/.test(p);
                    var _symbols = _regex.test(p);
                                          
                    var _flags = [_lowerLetters, _upperLetters, _numbers, _symbols];                    
                    var _passedMatches = $.grep(_flags, function (el) { return el === true; }).length;                                          
                    
                    _force += 2 * p.length + ((p.length >= 10) ? 1 : 0);
                    _force += _passedMatches * 10;
                        
                    // penality (short password)
                    _force = (p.length <= 6) ? Math.min(_force, 10) : _force;                                      
                    
                    // penality (poor variety of characters)
                    _force = (_passedMatches == 1) ? Math.min(_force, 10) : _force;
                    _force = (_passedMatches == 2) ? Math.min(_force, 20) : _force;
                    _force = (_passedMatches == 3) ? Math.min(_force, 40) : _force;
                    
                    return _force;

                },
                getColor: function (s) {

                    var idx = 0;
                    if (s <= 10) { idx = 0; }
                    else if (s <= 20) { idx = 1; }
                    else if (s <= 30) { idx = 2; }
                    else if (s <= 40) { idx = 3; }
                    else { idx = 4; }
                    return { idx: idx + 1, col: this.colors[idx] };

                }
            };

            scope.$watch(iAttrs.checkStrength, function () {
                if (scope.newPassword === '') {
                    iElement.children('li')
                        .css({ "background": "#DDD" })
                } else {
                    var c = strength.getColor(strength.mesureStrength(scope.newPassword));
                    iElement.css({ "display": "inline" });
                    iElement.children('li')
                        .css({ "background": "#DDD" })
                        .slice(0, c.idx)
                        .css({ "background": c.col });
                         console.log(c.col)
                }
            });
        },
        template: '<li class="point md-point lg-point"></li><li class="point md-point lg-point"></li><li class="point md-point lg-point"></li><li class="point md-point lg-point"></li><li class="point md-point lg-point"></li>'
    };
});

app.directive('pwCheck', [function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            var firstPassword = '#' + attrs.pwCheck;
            elem.add(firstPassword).on('keyup', function () {
                scope.$apply(function () {
                    // console.info(elem.val() === $(firstPassword).val());
                    ctrl.$setValidity('pwmatch', elem.val() === $(firstPassword).val());
                });
            });
        }
    }
}]);