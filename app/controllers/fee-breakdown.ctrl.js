angular.module('ppApp').controller('feeBreakDownCtrl', feeBreakDownCtrl);

feeBreakDownCtrl.$inject = ['patent', '$scope', '$timeout', '$state', 'organiseTextService', '$location', 'currentTransactionsService', '$anchorScroll', 'organiseColourService']

function feeBreakDownCtrl(patent, $scope, $timeout, $state, organiseTextService, $location, currentTransactionsService, $anchorScroll, organiseColourService) {

    var vm = this;

    vm.patent = patent;
    vm.setFees = setFees;
    vm.feeData = null;
    
    if($scope.$parent.availableServices.length > 0) {

        vm.data = {};
        vm.data.availableAction = $scope.$parent.availableServices;
        vm.data.selectedAction = { id: vm.data.availableAction[0].id, action: vm.data.availableAction[0].action };
        vm.feeData = true;

    }

    function setFees(action) {

        vm.availableFees = '';

        if(patent.p3sServicesWithFees[0].renewalFeeUI === null && patent.p3sServicesWithFees[0].form1200FeeUI === null && patent.p3sServicesWithFees[0].grantFeeUI === null) { //patent.grantFeeUI === null
            return;
        }

        if(action == 'epct') {
            vm.displayForm1200 = true;
            vm.displayRenewal = false;
            vm.displayGrant = false;
            vm.availableFees = patent.p3sServicesWithFees[0].form1200FeeUI;
            vm.availableFees.ppFeesUSD = Number(Math.round(( vm.availableFees.subTotalUSD -  vm.availableFees.currentOfficialFeeUSD) + 'e2') +'e-2');
            vm.availableFees.ppFeesEUR = Number(Math.round(( vm.availableFees.subTotalEUR -  vm.availableFees.currentOfficialFeeEUR) + 'e2') +'e-2');
        }

        if(action == 'renewal') {
            vm.displayForm1200 = false;
            vm.displayRenewal = true;
            vm.displayGrant = false;            
            vm.availableFees = patent.p3sServicesWithFees[0].renewalFeeUI;
            vm.availableFees.ppFeesUSD = Number(Math.round((vm.availableFees.subTotalUSD - vm.availableFees.currentOfficialFeeUSD) + 'e2') +'e-2');
            vm.availableFees.ppFeesEUR = Number(Math.round((vm.availableFees.subTotalEUR - vm.availableFees.currentOfficialFeeEUR) +'e2')+'e-2');
        }

        if(action == 'grant') {
            vm.displayForm1200 = false;
            vm.displayRenewal = false;
            vm.displayGrant = true;       
            vm.availableFees = patent.p3sServicesWithFees[0].grantFeeUI;
            vm.availableFees.ppFeesUSD = Number(Math.round((vm.availableFees.subTotalUSD - vm.availableFees.currentOfficialFeeUSD) + 'e2') +'e-2');
            vm.availableFees.ppFeesEUR = Number(Math.round((vm.availableFees.subTotalEUR - vm.availableFees.currentOfficialFeeEUR) + 'e2') +'e-2');
        }        

        vm.availableFees.savings = Number(Math.round((patent.p3sServicesWithFees[0].nextStageCostUSD - patent.p3sServicesWithFees[0].currentStageCostUSD) + 'e2') +'e-2');

    }

}