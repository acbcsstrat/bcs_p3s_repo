angular.module('ppApp').controller('renewalsCarouselCtrl', renewalsCarouselCtrl);

renewalsCarouselCtrl.$inject = ['$scope', '$timeout', '$window', 'patentIds', 'patentPhasesService', 'dashboardService', 'organiseColourService', 'organiseTextService']

function renewalsCarouselCtrl($scope, $timeout, $window, patentIds, patentPhasesService, dashboardService, organiseColourService, organiseTextService) {

	var vm = this;

	vm.phaseLoaded = true;

    vm.date = new Date();
    vm.setActionCost = setActionCost;
    vm.setPhase = setPhase
    vm.patents = dashboardService.getPatents;
    vm.availableActions = 0;
    var setActionCostTmeout;

    var initialPhase = (function(){
        for(var property in vm.patents) {
            if(vm.patents.hasOwnProperty(property)) {
                if(vm.patents[property].length > 0) {
                    return vm.patents[property][0];
                }
            }
        }
    }())

    function setPhase(phase) {
        setActionCost(vm.patents[phase][0])
    }

    function setActionCost(patent) {
        dashboardService.setActionCost(patent)
        setActionCostTmeout = $timeout(function(){
            $scope.$emit('updatePatent')
        }, 300)
    }

    $scope.$on('$destroy', function(){
        $timeout.cancel(setActionCostTmeout)
    })

    setActionCost(initialPhase)

}