DashboardController.$inject = ['$state',  '$timeout', '$scope', 'DashboardService', 'PatentsRestService'];

export default function DashboardController($state, $timeout, $scope, DashboardService, PatentsRestService) {

    var vm = this;

    vm.animate = false;
    vm.date = new Date().getTime();

    var promise = PatentsRestService.fetchAllPatents();

    promise.then(
        function(response){
            DashboardService.sortPatents(response);
            $scope.dashboardData = response;
            vm.dashboardLoaded = true;
            $state.go('dashboard.content', {patents: response}, {reload: false});
        }
    )

    $scope.$on('updatePatent', function(e, o){
        $scope.$broadcast('updateCost');
    })

}