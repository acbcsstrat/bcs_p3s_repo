ActionsAvailableController.$inject = ['$scope', '$timeout', 'DashboardService']

export default function ActionsAvailableController($scope, $timeout, DashboardService) {

	var vm = this;

	vm.phaseLoaded = true;

    vm.date = new Date();
    vm.setActionCost = setActionCost;
    vm.setPhase = setPhase
<<<<<<< HEAD:app/features/dashboard/controllers/actions-available.controller.js
    vm.patents = DashboardService.getPatents;
=======
    vm.patents = (function(){
        var obj = {}
        for(var property in dashboardService.getPatents) {
            if(dashboardService.getPatents.hasOwnProperty(property)) {
                if(Array.isArray(dashboardService.getPatents[property])) {
                    obj[property] = dashboardService.getPatents[property].filter(function(el){
                        return el.p3sServices[0].saleType === 'Online' || el.p3sServices[0].saleType === 'Offline';
                    })
                }
            }
        }
        return obj;
    }())

>>>>>>> fe-branch-v3:app/controllers/dashboard.actions-available.ctrl.js
    vm.availableActions = 0;
    var setActionCostTmeout;

    function initialPhase(){
        for(var property in vm.patents) {
            if(vm.patents.hasOwnProperty(property)) {
                if(vm.patents[property].length > 0) {
                    return vm.patents[property][0];
                }
            }
        }
    }

    function setPhase(phase) {
        setActionCost(vm.patents[phase][0])
    }

    function setActionCost(patent) {
        DashboardService.setActionCost(patent)
        setActionCostTmeout = $timeout(function(){
            $scope.$emit('updatePatent')
        })
    }

    $scope.$on('$destroy', function(){
        $timeout.cancel(setActionCostTmeout)
    })

    setActionCost(initialPhase())

}