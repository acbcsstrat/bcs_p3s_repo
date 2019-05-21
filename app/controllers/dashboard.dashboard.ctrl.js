angular.module('ppApp').controller('dashboardCtrl', dashboardCtrl);

dashboardCtrl.$inject = ['$scope','$state', 'patentIds', '$timeout', '$rootScope', 'patentPhasesService', '$transitions', 'dashboardService', '$transitions'];

function dashboardCtrl ($scope, $state, patentIds, $timeout, $rootScope, patentPhasesService, $transitions, dashboardService, $transitions) {

    var vm = this;

    vm.animate = false;
    vm.pageTitle = 'Dashboard';
    vm.date = new Date().getTime();

    $timeout(function(){
      vm.dashboardLoaded = true;
    }, 300);

    $transitions.onFinish({}, function(transition) {
      console.log(
          "Successful Transition from " + transition.from().name +
          " to " + transition.to().name
      );
    });    

    function init() {
        $scope.$emit('updatePatent')
        dashboardService.sortPatents(patentIds);
    }

    init();

    $scope.$on('updatePatent', function(e, o){
        $scope.$broadcast('updateCost');
    })    

}
