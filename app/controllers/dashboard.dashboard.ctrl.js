angular.module('ppApp').controller('dashboardCtrl', dashboardCtrl);

dashboardCtrl.$inject = ['$scope', 'patentIds', '$timeout', 'dashboardService'];

function dashboardCtrl ($scope, patentIds, $timeout, dashboardService) {

    var vm = this;

    vm.animate = false;
    vm.pageTitle = 'Dashboard';
    vm.date = new Date().getTime();
    var dasboardInitTimeout;


    function init() {
        $scope.$emit('updatePatent')
        dashboardService.sortPatents(patentIds);
        dasboardInitTimeout = $timeout(function(){
          vm.dashboardLoaded = true;
        }, 300);
    }

    init();

    $scope.$on('updatePatent', function(e, o){
        $scope.$broadcast('updateCost');
    })    

    $scope.$on('$destroy', function(){
        $timeout.cancel(dasboardInitTimeout)
    })

}
