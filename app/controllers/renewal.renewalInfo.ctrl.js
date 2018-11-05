angular.module('ppApp').controller('renewalInfoCtrl', renewalInfoCtrl);

renewalInfoCtrl.$inject = ['patent', '$state', '$timeout', 'chunkDataService', 'renewalRestService', '$uibModal'];

function renewalInfoCtrl(patent, $state, $timeout, chunkDataService, renewalRestService, $uibModal) {

    var vm = this;

    vm.patent = patent;
    vm.updateRenewalNotifications = updateRenewalNotifications;
    vm.displayNotifications = displayNotifications;
    vm.fetchRenewal = fetchRenewal();
    var notificationUIs = [
        {"title": "Starts", "defaultOn": true, "displayOrder": 10, "emailTemplateId": "email_reminder_green_opens", "costbandcolor": "Green", "id": 1},
        {"title": "6 weeks", "defaultOn": false, "displayOrder": 20, "emailTemplateId": "email_reminder_standard", "costbandcolor": "Green", "id": 2},
        {"title": "2 weeks", "defaultOn": false, "displayOrder": 30, "emailTemplateId": "email_reminder_standard", "costbandcolor": "Green", "id": 3},
        {"title": "1 week", "defaultOn": false, "displayOrder": 40, "emailTemplateId": "email_reminder_standard", "costbandcolor": "Green", "id": 4},
        {"title": "2 days", "defaultOn": true, "displayOrder": 50, "emailTemplateId": "email_reminder_standard", "costbandcolor": "Green", "id": 5},
        {"title": "Starts", "defaultOn": true, "displayOrder": 60, "emailTemplateId": "email_reminder_amber_opens", "costbandcolor": "Amber", "id": 6},
        {"title": "1 day", "defaultOn": false, "displayOrder": 80, "emailTemplateId": "email_reminder_standard", "costbandcolor": "Amber", "id": 7},
        {"title": "3 days", "defaultOn": true, "displayOrder": 90, "emailTemplateId": "email_reminder_red_3day", "costbandcolor": "Red", "id": 8},
        {"title": "Starts", "defaultOn": true, "displayOrder": 100, "emailTemplateId": "email_reminder_blue_opens", "costbandcolor": "Blue", "id": 9},
        {"title": "12 weeks", "defaultOn": true, "displayOrder": 110, "emailTemplateId": "email_reminder_standard", "costbandcolor": "Blue", "id": 10},
        {"title": "6 weeks", "defaultOn": false, "displayOrder": 120, "emailTemplateId": "email_reminder_standard", "costbandcolor": "Blue", "id": 11},
        {"title": "2 weeks", "defaultOn": false, "displayOrder": 130, "emailTemplateId": "email_reminder_standard", "costbandcolor": "Blue", "id": 12},
        {"title": "1 week", "defaultOn": false, "displayOrder": 140, "emailTemplateId": "email_reminder_standard", "costbandcolor": "Blue", "id": 13},
        {"title": "2 days", "defaultOn": true, "displayOrder": 150, "emailTemplateId": "email_reminder_standard", "costbandcolor": "Blue", "id": 14},
        {"title": "5 days", "defaultOn": true, "displayOrder": 160, "emailTemplateId": "email_reminder_black_5day", "costbandcolor": "Black", "id": 15},
        {"title": "Online Ends", "defaultOn": true, "displayOrder": 220, "emailTemplateId": "email_reminder_after_black", "costbandcolor": "Black", "id": 16}
    ]

    function fetchRenewal() { //function to select the renewal from the serviceslist
        var renewal;
        patent.serviceList.forEach(function(item){
            if(item.serviceType == 'Renewal') {
                renewal = item;
            }
        })
        return renewal;
    }

    function updateRenewalNotifications(id) {

        renewalRestService.updateNotifications(id)
        .then(
            function(response){
                updateNotificationsSuccess();
            },
            function(errResponse){
                updateNotificationsError();
            }
        )

    }

    function updateNotificationsSuccess() {

        var modalInstance = $uibModal.open({
            templateUrl: 'app/templates/modals/modal.update-renewal-notifications-success.tpl.htm',
            appendTo: undefined,
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', '$scope', '$timeout', function($uibModalInstance, $scope, $timeout){

                this.dismissModal = function () {
                    $uibModalInstance.close();
                };

            }]

        });

    }

    function updateNotificationsError() {

        var modalInstance = $uibModal.open({
            templateUrl: 'app/templates/modals/modal.update-renewal-notifications-error.tpl.htm',
            appendTo: undefined,
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', '$scope', '$timeout', function($uibModalInstance, $scope, $timeout){
                
                this.dismissModal = function () {
                    $uibModalInstance.close();
                };

            }]

        });

    }

    $timeout(function() {
        vm.displayNotifications('Green');
    }, 100);    

    function displayNotifications(phase) {  //migrate to renewalCtrl
        vm.notifications = chunkDataService.chunkData(phaseNotifications(phase), 6);
    };

    function phaseNotifications(phase) { //migrate to renewalCtrl

        var notificationsArr = notificationUIs;
        var notifications = [];

        notificationsArr.forEach(function(data){
            if(data.costbandcolor == phase) {
                notifications.push(data);
            }
        });

        return notifications;

    }

}