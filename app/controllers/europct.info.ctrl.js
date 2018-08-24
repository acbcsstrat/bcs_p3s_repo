angular.module('ppApp').controller('euroPctInfoCtrl', euroPctInfoCtrl);

euroPctInfoCtrl.$inject = ['$timeout', 'chunkDataService', 'patent'];

function euroPctInfoCtrl($timeout, chunkDataService, patent) {

    var vm = this;

    vm.patent = patent;
    vm.displayNotifications = displayNotifications;

    displayNotifications('Green');

    function displayNotifications(phase) {
        $timeout(function() {
            vm.chunkedData = chunkDataService.chunkData(phaseNotifications(phase), 8);
            vm.colourPhase = phase;
        }, 10)
    }

    function phaseNotifications(phase) {

        var notifications = [];

        vm.patent.notificationUIs.forEach(function(data){
            if(data.costbandcolor == phase) {
                notifications.push(data)
            }
        })

        return notifications;

    }

}