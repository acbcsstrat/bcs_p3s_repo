angular.module('ppApp').controller('renewalHistoryCtrl', renewalHistoryCtrl);

renewalHistoryCtrl.$inject = ['patent', 'chunkDataService']

function renewalHistoryCtrl(patent, chunkDataService) {

    var vm = this;

    vm.patent = patent;

}