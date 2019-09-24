angular.module('ppApp').controller('renewalCostCtrl', renewalCostCtrl);

renewalCostCtrl.$inject = ['$scope', '$timeout', '$state', '$location', '$anchorScroll', 'patentIds','currentTransactionsService', 'dashboardService', 'organiseTextService']

function renewalCostCtrl($scope, $timeout, $state, $location, $anchorScroll, patentIds, currentTransactionsService, dashboardService, organiseTextService) {

	var vm = this;

	vm.fxTimeFrame = 'Today';

    vm.loading = true;
    vm.noPatents = true;
    var updateCosttimeout;

    function init() {
        if(patentIds.length == 0) {
            vm.noPatents = true;
        }
    }

    init();

   $scope.$on('updateCost', function(e, o){
        updateCosttimeout = $timeout(function(){
            vm.actionCost = dashboardService.fetchActionCost();
            vm.loading = false;
        }, 300)

    })  

   $scope.$on('$destroy', function(){
        $timeout.cancel(updateCosttimeout)
   })

}
