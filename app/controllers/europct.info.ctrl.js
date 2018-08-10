angular.module('ppApp').controller('euroPctInfoCtrl', euroPctInfoCtrl);

euroPctInfoCtrl.$inject = ['$timeout', 'chunkDataService', 'patent'];

function euroPctInfoCtrl($timeout, chunkDataService, patent) {

    var vm = this;

    vm.displayNotifications = displayNotifications;

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