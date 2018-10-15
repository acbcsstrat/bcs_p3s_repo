angular.module('ppApp').controller('euroPctCostAnalysisCtrl', euroPctCostAnalysisCtrl);

euroPctCostAnalysisCtrl.$inject = ['patent', 'ca']

function euroPctCostAnalysisCtrl(patent, ca) {

    var vm = this;

    vm.ca = ca;

}