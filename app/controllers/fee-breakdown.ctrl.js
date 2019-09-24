angular.module('ppApp').controller('feeBreakDownCtrl', feeBreakDownCtrl);

feeBreakDownCtrl.$inject = ['patent', '$scope', '$timeout', '$state', 'organiseTextService', '$location', 'currentTransactionsService', '$anchorScroll', 'organiseColourService']

function feeBreakDownCtrl(patent, $scope, $timeout, $state, organiseTextService, $location, currentTransactionsService, $anchorScroll, organiseColourService) {

    var vm = this;

    vm.patent = patent;
    vm.setFees = setFees;
    vm.getCurrColour = getCurrColour;
    vm.feeData = null;
    
    if($scope.$parent.availableServices.length > 0) {

        vm.data = {};
        vm.data.availableAction = $scope.$parent.availableServices;
        vm.data.selectedAction = { id: vm.data.availableAction[0].id, action: vm.data.availableAction[0].action };
        vm.feeData = true;

    }

    function init() {

        if(patent.p3sServicesWithFees.length > 0) {
            patent.cssCurrent = organiseColourService.getCurrColour(patent.p3sServicesWithFees[0].currentStageColour, 'text')
            patent.cssNext = organiseColourService.getCurrColour(patent.p3sServicesWithFees[0].nextStageColour, 'text')
        }

        patent.urgentAttention = (function(){
            if(patent.serviceStatus == 'Too late to renew') {
                return true;
            }
            if(patent.serviceStatus == 'Too late' && patent.p3sServicesWithFees[0].currentStageColour == 'Red') {
                return true
            }
            return false
        }())        
    }

    init()

    function getCurrColour(color, type) {
      return organiseColourService.getCurrColour(color, type)
    }    

    function setFees(action) {

        vm.availableFees = '';

        if(patent.renewalFeeUI === null && patent.form1200FeeUI === null) { //patent.grantFeeUI === null
            return;
        }

        if(action == 'Form1200') {
            vm.displayForm1200 = true;
            vm.displayRenewal = false;
            vm.availableFees = patent.p3sServicesWithFees[1].form1200FeeUI;
            vm.availableFees.ppFeesUSD = Number(Math.round(( vm.availableFees.subTotalUSD -  vm.availableFees.currentOfficialFeeUSD) + 'e2') +'e-2');
            vm.availableFees.ppFeesEUR = Number(Math.round(( vm.availableFees.subTotalEUR -  vm.availableFees.currentOfficialFeeEUR) + 'e2') +'e-2');
        }

        if(action == 'Renewal') {
            vm.displayForm1200 = false;
            vm.displayRenewal = true;
            vm.availableFees = patent.p3sServicesWithFees[1].renewalFeeUI;
            vm.availableFees.ppFeesUSD = Number(Math.round((vm.availableFees.subTotalUSD - vm.availableFees.currentOfficialFeeUSD) + 'e2') +'e-2');
            vm.availableFees.ppFeesEUR = Number(Math.round((vm.availableFees.subTotalEUR - vm.availableFees.currentOfficialFeeEUR) +'e2')+'e-2');
        }

        if(action == 'Grant') {
            
            vm.availableFees = patent.p3sServicesWithFees[1].grantFeeUI;
            vm.availableFees.ppFeesUSD = Number(Math.round((vm.availableFees.subTotalUSD - vm.availableFees.currentOfficialFeeUSD) + 'e2') +'e-2');
            vm.availableFees.ppFeesEUR = Number(Math.round((vm.availableFees.subTotalEUR - vm.availableFees.currentOfficialFeeEUR) + 'e2') +'e-2');
        }        

        vm.availableFees.savings = Number(Math.round((patent.p3sServicesWithFees[0].nextStageCostUSD - patent.p3sServicesWithFees[0].currentStageCostUSD) + 'e2') +'e-2');

    }

}