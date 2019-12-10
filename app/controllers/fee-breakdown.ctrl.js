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

    function feeUIAvailable(array) {

        return array.some(function(o) {
            return Object.keys(o).some(function(k){
                return k.toLowerCase().indexOf('feeui') !== -1 && o[k] !== null;
            })
        })

    }

    function setFees(action) {

        vm.availableFees = {};

        if(feeUIAvailable(patent.p3sServicesWithFees))

        if(action == 'Euro-PCT') {
            vm.displayForm1200 = true;
            vm.displayRenewal = false;
            vm.displayGrant = false;
            vm.availableFees.official = patent.p3sServicesWithFees.filter(function(item){
                return item.serviceType === 'Euro-PCT';
            }).map(function(fee) {
                fee.form1200FeeUI.savings = Number(Math.round((fee.nextStageCostUSD - fee.currentStageCostUSD) + 'e2') +'e-2');
                return fee.form1200FeeUI;
            })
        }

        if(action == 'renewal') {
            vm.displayForm1200 = false;
            vm.displayRenewal = true;
            vm.displayGrant = false;            
            vm.availableFees.official = patent.p3sServicesWithFees.filter(function(item){
                return item.serviceType === 'renewal';
            }).map(function(fee) {
                fee.renewalFeeUI.savings = Number(Math.round((fee.nextStageCostUSD - fee.currentStageCostUSD) + 'e2') +'e-2');
                return fee.renewalFeeUI;
            })
        }

        if(action == 'grant') {
            vm.displayForm1200 = false;
            vm.displayRenewal = false;
            vm.displayGrant = true;       
            vm.availableFees.official = patent.p3sServicesWithFees.filter(function(item){
                return item.serviceType === 'grant';
            }).map(function(fee) {
                fee.grantFeeUI.savings = Number(Math.round((fee.nextStageCostUSD - fee.currentStageCostUSD) + 'e2') +'e-2');
                return fee.grantFeeUI;
            })
        }

        vm.availableFees.ppFeesUSD = Number(Math.round((vm.availableFees.official[0].subTotalUSD - vm.availableFees.official[0].currentOfficialFeeUSD) + 'e2') +'e-2');
        vm.availableFees.ppFeesEUR = Number(Math.round((vm.availableFees.official[0].subTotalEUR - vm.availableFees.official[0].currentOfficialFeeEUR) +'e2')+'e-2');
        vm.availableFees.savings = Number(Math.round((patent.p3sServicesWithFees[0].nextStageCostUSD - patent.p3sServicesWithFees[0].currentStageCostUSD) + 'e2') +'e-2');

    }

}