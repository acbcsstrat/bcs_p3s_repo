var app = angular.module('myApp', ['ui.router', 'chart.js', 'ngIdle', 'ngAnimate', 'ui.bootstrap', 'ngCart', 'ngCookies', 'ngMaterial', 'slickCarousel', 'angularMoment', 'ngTable']);

app.run(['Idle', 'userService', '$rootScope', 'amMoment', '$timeout', function(Idle, userService, $rootScope, amMoment, $timeout) {


    $rootScope.page = '';

    $rootScope.color = 'green';

    userService.fetchUser()
    .then(
        function(response){
            $rootScope.user = response;
        },
        function(errResponse){
            console.log(errResponse)
        }
    )

	Idle.watch();

    function timeZoneClocks() {

            var cet = moment.tz("Europe/London").format('HH:mm MM/D/YY');
            var est = moment.tz("America/New_York").format('HH:mm MM/D/YY');
        
        var t = $timeout(function() {

            $rootScope.cetTime = cet;
            $rootScope.estTime =  est;
            timeZoneClocks()
        }, 500);
    }

   timeZoneClocks()


}]);

app.controller('mainNavCtrl', ['$scope', '$mdSidenav', 'ngCart', function($scope, $mdSidenav, ngCart){
 	$scope.toggleLeft = buildToggler('left');
    $scope.toggleRight = buildToggler('right');

   

    function buildToggler(componentId) {
      return function() {
        $mdSidenav(componentId).toggle();
      };
    } 
}]);

app.controller('coreCtrl', ['$scope', 'Idle', 'Keepalive', '$uibModal', '$http', 'ngCart', function($scope, Idle, Keepalive, $uibModal, $http, ngCart){

         
      	function closeModals() {
	        if ($scope.warning) {
	          $scope.warning.close();
	          $scope.warning = null;
	        }

	        if ($scope.timedout) {
	          $scope.timedout.close();
	          $scope.timedout = null;
	        }
      	}

      	$scope.$on('IdleStart', function() {

        	closeModals();

        	$scope.warning = $uibModal.open({
          		templateUrl: 'warning-dialog.html',
          		windowClass: 'modal-danger'
    		});
      	});

	  	$scope.$on('IdleEnd', function() {
	    	closeModals();
	  	});

  		var userTimedOut = false;

      	$scope.$on('IdleTimeout', function() {
        	closeModals();

     		userTimedOut = true;  

	        if (userTimedOut) {
                ngCart.empty()
	        	$http.post('http://localhost:8080/p3sweb/resources/j_spring_security_logout')
	        	.then(
	        		function(){
		        		window.location.reload('http://localhost:8080/p3sweb/login');
	        		}    
	    		)    	
	        }

      	});
}])

app.directive('checkStrength', function () {

    return {
        replace: false,
        restrict: 'EACM',
        link: function (scope, iElement, iAttrs) {

            var strength = {
                colors: ['#F00', '#F90', '#FF0', '#9F0', '#0F0'],
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
                }
            });
        },
        template: '<li class="point"></li><li class="point"></li><li class="point"></li><li class="point"></li><li class="point"></li>'
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



	