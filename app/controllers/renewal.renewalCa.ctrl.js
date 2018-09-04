angular.module('ppApp').controller('renewalCaCtrl', renewalCaCtrl);

renewalCaCtrl.$inject = ['patent','ca', '$timeout', 'chunkDataService', 'costAnalysisService'];

function renewalCaCtrl(patent, ca, $timeout, chunkDataService, costAnalysisService) {

    var vm = this;

    vm.ca = ca;

}