export default function DashboardController () {

    var vm = this;

    vm.animate = false;
    vm.pageTitle = 'Dashboard';
    vm.date = new Date().getTime();

    $timeout(function(){
      vm.dashboardLoaded = true;
    }, 300);

    function init() {
        $scope.$emit('updatePatent')
        dashboardService.sortPatents(patentIds);
    }

    init();

    $scope.$on('updatePatent', function(e, o){
        $scope.$broadcast('updateCost');
    })    

}