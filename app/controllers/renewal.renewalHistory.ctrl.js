angular.module('ppApp').controller('renewalHistoryCtrl', renewalHistoryCtrl);

renewalHistoryCtrl.$inject = ['patent', 'renewal', 'chunkDataService']

function renewalHistoryCtrl(patent, renewal, chunkDataService) {

    var vm = this;

    vm.patent = patent;
    vm.renewal = []; //set value to array for view purposes

}