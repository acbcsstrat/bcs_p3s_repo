angular.module('ppApp').controller('dashboardCtrl', dashboardCtrl);

dashboardCtrl.$inject = ['$scope','$state', '$timeout', '$rootScope'];

function dashboardCtrl ($scope, $state, $timeout, $rootScope) {

    var vm = this;
    
    $rootScope.page = 'Dashboard';

    vm.date = new Date().getTime();

    $scope.$on('phaseChange', function(e, o){
        $scope.$broadcast('updatePhase', {phase: o.phase});
    })

    $scope.$on('updatePatent', function(e, o){
        $scope.$broadcast('updateCost');
    })    

}
