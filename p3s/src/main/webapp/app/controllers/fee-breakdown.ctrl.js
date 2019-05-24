angular.module('ppApp').controller('feeBreakDownCtrl', feeBreakDownCtrl);

feeBreakDownCtrl.$inject = ['patent', '$scope', '$timeout', '$state', 'organiseTextService', '$location', 'currentTransactionsService', '$anchorScroll', 'organiseColourService']

function feeBreakDownCtrl(patent, $scope, $timeout, $state, organiseTextService, $location, currentTransactionsService, $anchorScroll, organiseColourService) {

    var vm = this;

    vm.actionStatus = actionStatus;
    vm.fetchItemTransaction = fetchItemTransaction;
    vm.patent = patent;
    vm.setFees = setFees;
    vm.getCurrColour = getCurrColour;
    vm.feeData = null;

    if($scope.$parent.availableServices.length > 0) {

        vm.data = {};
        vm.data.availableAction = $scope.$parent.availableServices;
        vm.data.selectedAction = { id: vm.data.availableAction[0].id, action: vm.data.availableAction[0].action };
        setFees(vm.data.selectedAction.action)
        vm.feeData = true;

    }

    function getCurrColour(color, type) {
      return organiseColourService.getCurrColour(color, type)
    }    

    function setFees(action) {
 
        if(action == 'Form1200') {
            vm.availableFees = patent.form1200FeeUI;
            vm.availableFees.ppFeesUSD = patent.form1200FeeUI.subTotalUSD - patent.form1200FeeUI.currentOfficialFeeUSD;
            vm.availableFees.ppFeesEUR = patent.form1200FeeUI.subTotalEUR - patent.form1200FeeUI.currentOfficialFeeEUR;
        }

        if(action == 'Renewal') {
            vm.availableFees = patent.renewalFeeUI;
            vm.availableFees.ppFeesUSD = patent.renewalFeeUI.subTotalUSD - patent.renewalFeeUI.currentOfficialFeeUSD;
            vm.availableFees.ppFeesEUR = patent.renewalFeeUI.subTotalEUR - patent.renewalFeeUI.currentOfficialFeeEUR;            
        }

        vm.availableFees.savings = patent.portfolioUI.serviceList[0].nextStageCostUSD - patent.portfolioUI.serviceList[0].currentStageCostUSD;

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