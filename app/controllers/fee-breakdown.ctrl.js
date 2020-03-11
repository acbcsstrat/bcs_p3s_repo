angular.module('ppApp').controller('feeBreakDownCtrl', feeBreakDownCtrl);

feeBreakDownCtrl.$inject = ['patent', '$scope', '$timeout', '$state', 'organiseTextService', '$location', 'currentTransactionsService', '$anchorScroll', 'organiseColourService']

function feeBreakDownCtrl(patent, $scope, $timeout, $state, organiseTextService, $location, currentTransactionsService, $anchorScroll, organiseColourService) {

    var vm = this;

    vm.patent = patent;
    vm.setFees = setFees;
    vm.feeData = null;
    
    $scope.$parent.promise
    .then(
        function(response){
            if(response.length > 0) {
                setFees($scope.$parent.availableServices[0].action)
                vm.data = {};
                vm.data.availableAction = $scope.$parent.availableServices;
                vm.data.selectedAction = { id: vm.data.availableAction[0].id, action: vm.data.availableAction[0].action };
                vm.feeData = true;
            }

        }
    )

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
            vm.displayValidation = false;
            vm.availableFees.official = patent.p3sServicesWithFees.filter(function(item){
                return item.serviceType === 'Euro-PCT';
            }).map(function(fee) {
                fee.form1200FeeUI.savings = Number(Math.round((fee.nextStageCostUSD - fee.currentStageCostUSD) + 'e2') +'e-2');
                fee.form1200FeeUI.data = fee;
                vm.availableFees.fxRate = fee.form1200FeeUI.fxRate;
                return fee.form1200FeeUI;
            })
        }

        if(action == 'renewal') {
            vm.displayForm1200 = false;
            vm.displayRenewal = true;
            vm.displayGrant = false;
            vm.displayValidation = false;
            vm.availableFees.official = patent.p3sServicesWithFees.filter(function(item){
                return item.serviceType === 'renewal';
            }).map(function(fee) {
                fee.renewalFeeUI.savings = Number(Math.round((fee.nextStageCostUSD - fee.currentStageCostUSD) + 'e2') +'e-2');
                fee.renewalFeeUI.data = fee;
                vm.availableFees.fxRate = fee.renewalFeeUI.fxRate;
                return fee.renewalFeeUI;
            })
        }

        if(action == 'grant') {
            vm.displayForm1200 = false;
            vm.displayRenewal = false;
            vm.displayGrant = true;
            vm.displayValidation = false;
            vm.availableFees.official = patent.p3sServicesWithFees.filter(function(item){
                return item.serviceType === 'grant';
            }).map(function(fee) {
                fee.grantFeeUI.savings = Number(Math.round((fee.nextStageCostUSD - fee.currentStageCostUSD) + 'e2') +'e-2');
                fee.grantFeeUI.data = fee;
                vm.availableFees.fxRate = fee.grantFeeUI.fxRate;
                return fee.grantFeeUI;
            })
        }

        if(action == 'validation') {
            vm.displayForm1200 = false;
            vm.displayRenewal = false;
            vm.displayGrant = false;
            vm.displayValidation = true;
            

            var official = patent.p3sServicesWithFees.filter(function(item){
                return item.serviceType === 'validation';
            }).map(function(fee) {
                fee.validationFeeUI.savings = Number(Math.round((fee.nextStageCostUSD - fee.currentStageCostUSD) + 'e2') +'e-2');
                fee.validationFeeUI.data = fee;
                vm.availableFees.fxRate = fee.validationFeeUI.fxRate;
                return fee.validationFeeUI;
            })

            vm.availableFees.official = official[0];

            vm.availableFees.ppFeesUSD = Number(Math.round((vm.availableFees.official.subTotalUSD - vm.availableFees.official.currentOfficialFeeUSD) + 'e2') +'e-2');
            vm.availableFees.ppFeesEUR = Number(Math.round((vm.availableFees.official.subTotalEUR - vm.availableFees.official.currentOfficialFeeEUR) +'e2')+'e-2');
            vm.availableFees.savings = Number(Math.round((patent.p3sServicesWithFees.nextStageCostUSD - patent.p3sServicesWithFees.currentStageCostUSD) + 'e2') +'e-2'); 
            return;           

        }

        vm.availableFees.ppFeesUSD = Number(Math.round((vm.availableFees.official[0].subTotalUSD - vm.availableFees.official[0].currentOfficialFeeUSD) + 'e2') +'e-2');
        vm.availableFees.ppFeesEUR = Number(Math.round((vm.availableFees.official[0].subTotalEUR - vm.availableFees.official[0].currentOfficialFeeEUR) +'e2')+'e-2');
        vm.availableFees.savings = Number(Math.round((patent.p3sServicesWithFees[0].nextStageCostUSD - patent.p3sServicesWithFees[0].currentStageCostUSD) + 'e2') +'e-2');

        

    }

}