FeeBreakDownController.$inject = ['caseSelected', '$scope', '$timeout'];

export default function FeeBreakDownController(caseSelected, $scope, $timeout) {

    var vm = this;

    vm.patent = caseSelected;
    vm.setFees = setFees;
    var loadFeeTimeout;
    
    $scope.$parent.promise
    .then(
        function(response){
            loadFeeTimeout = $timeout(function() {
                setFees($scope.$parent.availableServices[0].action)
                vm.data = {};
                vm.data.availableAction = $scope.$parent.availableServices;
                vm.data.selectedAction = { id: vm.data.availableAction[0].id, action: vm.data.availableAction[0].action };
            }, 10);

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

        if(feeUIAvailable(caseSelected.p3sServicesWithFees))

        if(action == 'Euro-PCT') {
            vm.displayForm1200 = true;
            vm.displayRenewal = false;
            vm.displayGrant = false;
            vm.displayValidation = false;
            vm.availableFees.official = caseSelected.p3sServicesWithFees.filter(function(item){
                return item.serviceType === 'Euro-PCT';
            }).map(function(fee) {
                fee.feeUI = fee.form1200FeeUI;
                fee.feeUI.savings = Number(Math.round((fee.nextStageCostUSD - fee.currentStageCostUSD) + 'e2') +'e-2');
                fee.fxRate = fee.form1200FeeUI.fxRate;             
                return fee;
            })
        }

        if(action == 'renewal') {
            vm.displayForm1200 = false;
            vm.displayRenewal = true;
            vm.displayGrant = false;
            vm.displayValidation = false;
            vm.availableFees.official = caseSelected.p3sServicesWithFees.filter(function(item){
                return item.serviceType === 'renewal';
            }).map(function(fee) {
                fee.feeUI = fee.renewalFeeUI;
                fee.feeUI.savings = Number(Math.round((fee.nextStageCostUSD - fee.currentStageCostUSD) + 'e2') +'e-2');
                fee.fxRate = fee.renewalFeeUI.fxRate;
                return fee;
            })
        }

        if(action == 'grant') {
            vm.displayForm1200 = false;
            vm.displayRenewal = false;
            vm.displayGrant = true;
            vm.displayValidation = false;
            vm.availableFees.official = caseSelected.p3sServicesWithFees.filter(function(item){
                return item.serviceType === 'grant';
            }).map(function(fee) {
                fee.feeUI = fee.grantFeeUI;
                fee.feeUI.savings = Number(Math.round((fee.nextStageCostUSD - fee.currentStageCostUSD) + 'e2') +'e-2');
                fee.fxRate = fee.grantFeeUI.fxRate;
                return fee;
            })
        }

        if(action == 'validation') {
            vm.displayForm1200 = false;
            vm.displayRenewal = false;
            vm.displayGrant = false;
            vm.displayValidation = true;
            var official = caseSelected.p3sServicesWithFees.filter(function(item){
                return item.serviceType === 'validation';
            }).map(function(fee) {
                fee.feeUI = fee.validationFeeUI;
                if(fee.feeUI !== null) {
                    fee.fxRate = fee.validationFeeUI.fxRate;
                    fee.feeUI.savings = Number(Math.round((fee.nextStageCostUSD - fee.currentStageCostUSD) + 'e2') +'e-2');
                }
                
                return fee;
            })

            vm.availableFees.official = official[0];

            if(vm.availableFees.official.feeUI !== null) {            
                

                vm.availableFees.ppFeesUSD = Number(Math.round((vm.availableFees.official.feeUI.subTotalUSD - vm.availableFees.official.feeUI.currentOfficialFeeUSD) + 'e2') +'e-2');
                vm.availableFees.ppFeesEUR = Number(Math.round((vm.availableFees.official.feeUI.subTotalEUR - vm.availableFees.official.feeUI.currentOfficialFeeEUR) +'e2')+'e-2');
            }

            return;           

        }

        if(action !== 'validation') {        
            vm.availableFees.ppFeesUSD = Number(Math.round((vm.availableFees.official[0].feeUI.subTotalUSD - vm.availableFees.official[0].feeUI.currentOfficialFeeUSD) + 'e2') +'e-2');
            vm.availableFees.ppFeesEUR = Number(Math.round((vm.availableFees.official[0].feeUI.subTotalEUR - vm.availableFees.official[0].feeUI.currentOfficialFeeEUR) +'e2')+'e-2');
            vm.availableFees.savings = Number(Math.round((vm.availableFees.official[0].nextStageCostUSD - vm.availableFees.official[0].currentStageCostUSD) + 'e2') +'e-2');
            
        }

    }

    $scope.$on('$destroy', function(){
        $timeout.cancel(loadFeeTimeout)
    })

}