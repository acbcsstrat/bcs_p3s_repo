angular.module('ppApp').controller('feeBreakDownCtrl', feeBreakDownCtrl);

feeBreakDownCtrl.$inject = ['$scope', '$timeout', '$state', 'organiseTextService', '$location', 'currentTransactionsService', '$anchorScroll']

function feeBreakDownCtrl($scope, $timeout, $state, organiseTextService, $location, currentTransactionsService, $anchorScroll) {

    var vm = this;

    vm.actionStatus = actionStatus;
    vm.fetchItemTransaction = fetchItemTransaction;
    vm.patent = $scope.$parent.patent;
    vm.setFees = setFees;

    vm.data = {    
        availableAction: [],
        selectedAction: {}
    }
    console.log(vm.patent)
    function checkServices() {
        // vm.patent.renewalFeeUI = {

        //     claimsFee1EUR: 0,
        //     claimsFee1USD: 0,
        //     claimsFee2EUR: 0,
        //     claimsFee2USD: 0,
        //     costHistoryUI: {fxRateYesterday: 0.818845, subTotalEURYesterday: 2591.41, subTotalUSDYesterday: 3164.72, fxRateLastWeek: 0.818845, subTotalEURLastWeek: 2591.41},
        //     currentOfficialFeeEUR: 25530,
        //     currentOfficialFeeUSD: 30589.71949,
        //     designationFeeEUR: 5855,
        //     designationFeeUSD: 7514.42,
        //     dollarComponentUSD: 755,
        //     euroComponentEUR: 25350,
        //     examinationFeeEUR: 18525,
        //     examinationFeeUSD: 25228.75,
        //     excessPageFeeEUR: 0,
        //     excessPageFeeUSD: 0,
        //     expressFeeEUR: 0,
        //     expressFeeUSD: 0,
        //     extensionFeeEUR: 0
        // }
        // vm.patent.portfolioUI.serviceList.push({
        //    costBandEndDate: 1579132800000,
        //     costBandEndDateUI: "Thu Jan 16, 2020",
        //     currentOfficialFeeEUR: 2530,
        //     currentOfficialFeeUSD: 3089.71949,
        //     currentStageColour: "Green",
        //     currentStageCostUSD: 3164.71949,
        //     failedReason: null,
        //     nextStageColour: "Amber",
        //     nextStageCostUSD: 3473.691439,
        //     serviceStatus: "show price",
        //     serviceType: "Renewal"

        //     })
        
        vm.patent.portfolioUI.serviceList.forEach(function(data, index){
            vm.data.availableAction.push({id: index, action: data.serviceType})
        })
        vm.data.selectedAction = vm.data.availableAction[0];
    }

    checkServices();

    function setFees(action) {
        console.log(action)
        if(action == 'Form1200') {
            console.log('form1200')
            vm.availableFees = vm.patent.form1200FeeUI;
        }

        if(action == 'Renewal') {
            console.log('renewal')
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