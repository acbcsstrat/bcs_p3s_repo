angular.module('ppApp').controller('renewalHistoryCtrl', renewalHistoryCtrl);

renewalHistoryCtrl.$inject = ['patent', 'chunkDataService', 'renewalRestService']

function renewalHistoryCtrl(patent, chunkDataService, renewalRestService) {

    var vm = this;

    vm.patent = patent;

    function init(){

        renewalRestService.fetchHistory(patent.id)
        .then(
        	function(response){
                vm.renewal = response;
            }
        )
    }

    init();


}