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