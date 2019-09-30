import DashboardService from './dashboard.serv.js';

DashboardController.$inject = ['$timeout', '$scope', 'patentIds', 'DashboardService'];

export default function DashboardController($timeout, $scope, patentIds, DashboardService) {

    console.log('dshboardscope', $scope)

    var vm = this;

    vm.animate = false;
    vm.pageTitle = 'Dashboard';
    vm.date = new Date().getTime();

    $timeout(function(){
      vm.dashboardLoaded = true;
    }, 300);

    function init() {
        $scope.$emit('updatePatent')
        DashboardService.sortPatents(patentIds);
    }

    init();

    $scope.$on('updatePatent', function(e, o){
        $scope.$broadcast('updateCost');
    })    

}