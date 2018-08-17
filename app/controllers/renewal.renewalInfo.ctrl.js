angular.module('ppApp').controller('renewalInfoCtrl', renewalInfoCtrl);

renewalInfoCtrl.$inject = ['patent', '$timeout', 'chunkDataService', 'fxCalculationService'];

function renewalInfoCtrl(patent, $timeout, chunkDataService, fxCalculationService) {

    var vm = this;

    vm.patent = patent;
    vm.displayNotifications = displayNotifications;

    vm.$onInit = function() {
        if(patent) {
            fxCalculationService.setFx(patent);
            vm.patentFx = fxCalculationService;
        }       
    }

    $timeout(function() {
        vm.displayNotifications('Green');
    }, 100);    

    function displayNotifications(phase) {  //migrate to renewalCtrl
        vm.chunkedData = chunkDataService.chunkData(phaseNotifications(phase), 8);
    };

    function phaseNotifications(phase) { //migrate to renewalCtrl

        var notificationsArr = patent.notificationUIs;
        var notifications = [];

        notificationsArr.forEach(function(data){
            if(data.costbandcolor == phase) {
                notifications.push(data);
            }
        });

        return notifications;

    }

}