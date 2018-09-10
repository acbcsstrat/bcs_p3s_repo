angular.module('ppApp').controller('renewalHistoryCtrl', renewalHistoryCtrl);

renewalHistoryCtrl.$inject = ['renewal', 'patent', 'chunkDataService']

function renewalHistoryCtrl(renewal, patent, chunkDataService) {

    var vm = this;

    vm.renewal = renewal;
    vm.patent = patent;

}