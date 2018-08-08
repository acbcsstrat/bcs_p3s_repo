angular.module('ppApp').controller('renewalInfoCtrl', renewalInfoCtrl);

renewalInfoCtrl.$inject = ['chunkDataService']

function renewalInfoCtrl(chunkDataService) {

    var vm = this;

    // vm.displayNotifications = displayNotifications;

    // activateData();

    // function activateData() {
    //     $timeout(function() {
    //         vm.displayNotifications('Green');
    //     }, 100);
    //     if(patent) {
    //         fxCalculationService.setFx(patent);
    //         vm.patentFx = fxCalculationService;
    //     }
    // }

    // function displayNotifications(phase) {  //migrate to renewalCtrl
    //     vm.chunkedData = chunkDataService.chunkData(phaseNotifications(phase), 8);
    // };

    // function phaseNotifications(phase) { //migrate to renewalCtrl

    //     var notificationsArr = patent.notificationUIs;
    //     var notifications = [];
            
    //     notificationsArr.forEach(function(data){
    //         if(data.costbandcolor == phase) {
    //             notifications.push(data);
    //         }
    //     });

    //     return notifications;

    // }
}