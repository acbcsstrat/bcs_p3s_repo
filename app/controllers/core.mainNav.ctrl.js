angular.module('ppApp').controller('mainNavCtrl', mainNavCtrl);

mainNavCtrl.$inject = ['$scope', '$mdSidenav', 'ngCart', '$timeout']

function mainNavCtrl($scope, $mdSidenav, ngCart,  $timeout){

 	$scope.toggleLeft = buildToggler('left');
    $scope.toggleRight = buildToggler('right');

    function buildToggler(componentId) {
      return function() {
        $mdSidenav(componentId).toggle();
      };
    }
    
};