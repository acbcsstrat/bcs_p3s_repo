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

        if(patent.portfolioUI.serviceList.length > 0) {
            patent.portfolioUI.cssCurrent = organiseColourService.getCurrColour(patent.portfolioUI.serviceList[0].currentStageColour, 'text')
            patent.portfolioUI.cssNext = organiseColourService.getCurrColour(patent.portfolioUI.serviceList[0].nextStageColour, 'text')
        }

        patent.urgentAttentionReq = (function(){
            if(patent.portfolioUI.serviceStatus == 'Too late to renew') {
                return true;
            }
            if(patent.portfolioUI.serviceStatus == 'Too late' && patent.portfolioUI.serviceList[0].currentStageColour == 'Red') {
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

        if(patent.renewalFeeUI === null && patent.form1200FeeUI === null && patent.grantFeeUI === null) { //!!!!!! ADDED GRANTFEEUI CHECK. SHOULD BE OKAY FOR PRODUCTION
            return
        }

        if(action == 'Form1200') {
            vm.displayForm1200 = true;
            vm.displayRenewal = false;
            vm.availableFees = patent.form1200FeeUI;
            vm.availableFees.ppFeesUSD = Number(Math.round((patent.form1200FeeUI.subTotalUSD - patent.form1200FeeUI.currentOfficialFeeUSD) + 'e2') +'e-2')
            vm.availableFees.ppFeesEUR = Number(Math.round((patent.form1200FeeUI.subTotalEUR - patent.form1200FeeUI.currentOfficialFeeEUR) + 'e2') +'e-2')
        }

        if(action == 'Renewal') {
            vm.displayForm1200 = false;
            vm.displayRenewal = true;
            vm.availableFees = patent.renewalFeeUI;
            vm.availableFees.ppFeesUSD = Number(Math.round((patent.renewalFeeUI.subTotalUSD - patent.renewalFeeUI.currentOfficialFeeUSD) + 'e2') +'e-2')
            vm.availableFees.ppFeesEUR = Number(Math.round((patent.renewalFeeUI.subTotalEUR - patent.renewalFeeUI.currentOfficialFeeEUR) +'e2')+'e-2')
        }

        if(action == 'Grant and Publishing Fees') { //!!!!!!!!! TEST DATA FOR GRANT
            vm.availableFees = patent.grantFeeUI;
            vm.availableFees.ppFeesUSD = patent.grantFeeUI.subTotalUSD - patent.grantFeeUI.currentOfficialFeeUSD;
            vm.availableFees.ppFeesEUR = patent.grantFeeUI.subTotalEUR - patent.grantFeeUI.currentOfficialFeeEUR;            
        }        

        vm.availableFees.savings = Number(Math.round((patent.portfolioUI.serviceList[0].nextStageCostUSD - patent.portfolioUI.serviceList[0].currentStageCostUSD) + 'e2') +'e-2')

    }

}