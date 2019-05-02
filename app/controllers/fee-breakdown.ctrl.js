angular.module('ppApp').controller('feeBreakDownCtrl', feeBreakDownCtrl);

feeBreakDownCtrl.$inject = ['patent', '$scope', '$timeout', '$state', 'organiseTextService', '$location', 'currentTransactionsService', '$anchorScroll']

function feeBreakDownCtrl(patent, $scope, $timeout, $state, organiseTextService, $location, currentTransactionsService, $anchorScroll) {

    var vm = this;

    vm.actionStatus = actionStatus;
    vm.fetchItemTransaction = fetchItemTransaction;
    vm.patent = patent;
    vm.setFees = setFees;
    vm.feeData = null;

    if($scope.$parent.availableServices.length > 0) {

        vm.data = {};
        vm.data.availableAction = $scope.$parent.availableServices;
        vm.data.selectedAction = { id: vm.data.availableAction[0].id, action: vm.data.availableAction[0].action };
        setFees(vm.data.selectedAction.action)
        vm.feeData = true;

    }

    function setFees(action) {

        if(action == 'Form1200') {
            vm.availableFees = vm.patent.form1200FeeUI;
        }

        if(action == 'Renewal') {
            vm.availableFees = vm.patent.renewalFeeUI;
        }

    }

    function actionStatus(text) {
        return organiseTextService.actionStatus(text)
    }

    function fetchItemTransaction(id) {
        currentTransactionsService.fetchCurrentTransactions()
        .then(
            function(response) {

                var match = response.filter(function(el){
                    return el.serviceUIs.find(function(item){
                        return item.patentUI.id === id;
                    })
                })

                if(match !== undefined || typeof match !== 'undefined') {
                    $state.go('current-transactions.current-transaction-item',{transId: match[0].id}) //if match, go current-transaction-item
                    .then(
                        function(response){
                            $timeout(function() {
                                $location.hash('currTransAnchor'); 
                                $anchorScroll();  //scroll to anchor href
                            }, 300);
                        },
                        function(errResponse){
                            console.log(errResponse);
                        }
                    );
                }

            },
            function(errResponse) {
                console.log(errResponse);
            }
        );
    };            

}