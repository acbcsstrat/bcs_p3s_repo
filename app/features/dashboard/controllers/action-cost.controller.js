ActionCostController.$inject = ['$scope', '$timeout', 'patentIds', 'DashboardService']

export default function ActionCostController($scope, $timeout, patentIds, DashboardService) {

	var vm = this;

	vm.fxTimeFrame = 'Today';

    vm.loading = true;
    vm.noPatents = true;
    var updateCosttimeout;

    $scope.$on('dashboardLoaded', function(event, response){
        if(response.length == 0) {
            vm.noPatents = true;
        }
    })

   $scope.$on('updateCost', function(e, o){
        updateCosttimeout = $timeout(function(){
            vm.actionCost = DashboardService.fetchActionCost();
            vm.loading = false;

        }, 300)
    })  

   $scope.$on('$destroy', function(){
        $timeout.cancel(updateCosttimeout)
   })

}
