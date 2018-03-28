angular.module('ppApp').controller('dashboardCtrl', dashboardCtrl);

dashboardCtrl.$inject = ['$scope', '$state', '$timeout', '$rootScope'];

function dashboardCtrl ($scope, $state, $timeout, $rootScope) {

    var vm = this;
    
    $rootScope.page = 'Dashboard';

    $timeout(function() {
      vm.animate = true;
    }, 100);

    vm.date = new Date().getTime();

    $scope.$on('phaseChange', function(e, o){
        $scope.$broadcast('updateRenewalCarousel', {phase: o.phase});
    })

}
