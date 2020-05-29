RenewalHistoryController.$inject = ['$scope', 'caseSelected', 'RenewalHistoryService']

export default function RenewalHistoryController($scope, caseSelected, RenewalHistoryService) {

    var vm = this;

    vm.patent = caseSelected;

    function init(){
        vm.renewal = $scope.$parent.renewalHistory;
    }

    init();

}