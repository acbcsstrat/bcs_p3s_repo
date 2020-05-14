RenewalHistoryController.$inject = ['caseSelected', 'RenewalHistoryService']

export default function RenewalHistoryController(caseSelected, RenewalHistoryService) {

    var vm = this;

    vm.patent = caseSelected;

    function init(){

        RenewalHistoryService.fetchHistory(caseSelected.patentID)
        .then(
        	function(response){
                vm.renewal = response;
            }
        )
    }

    init();

}