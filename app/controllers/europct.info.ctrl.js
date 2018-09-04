angular.module('ppApp').controller('euroPctInfoCtrl', euroPctInfoCtrl);

euroPctInfoCtrl.$inject = ['$timeout', 'chunkDataService', 'patent', 'euroPctService', '$uibModal'];

function euroPctInfoCtrl($timeout, chunkDataService, patent, euroPctService, $uibModal) {

    var vm = this;

    vm.patent = patent;
    vm.deleteApplication = deleteApplication;
    vm.editApplication = editApplication;
    vm.updateNotifications = updateNotifications;
    vm.displayNotifications = displayNotifications;

    var notificationUIs = [
        {"title": "Starts", "defaultOn": true, "displayOrder": 10, "emailTemplateId": "email_reminder_green_opens", "costbandcolor": "Green", "id": 1},
        {"title": "6 weeks", "defaultOn": false, "displayOrder": 20, "emailTemplateId": "email_reminder_standard", "costbandcolor": "Green", "id": 2},
        {"title": "2 weeks", "defaultOn": false, "displayOrder": 30, "emailTemplateId": "email_reminder_standard", "costbandcolor": "Green", "id": 3},
        {"title": "1 week", "defaultOn": false, "displayOrder": 40, "emailTemplateId": "email_reminder_standard", "costbandcolor": "Green", "id": 4},
        {"title": "2 days", "defaultOn": true, "displayOrder": 50, "emailTemplateId": "email_reminder_standard", "costbandcolor": "Green", "id": 5},
        {"title": "Starts", "defaultOn": true, "displayOrder": 60, "emailTemplateId": "email_reminder_amber_opens", "costbandcolor": "Amber", "id": 6},
        {"title": "1 day", "defaultOn": false, "displayOrder": 80, "emailTemplateId": "email_reminder_standard", "costbandcolor": "Amber", "id": 7},
        {"title": "3 days", "defaultOn": true, "displayOrder": 90, "emailTemplateId": "email_reminder_red_3day", "costbandcolor": "Red", "id": 8}
    ]

    function deleteApplication(id) {    
        euroPctService.deleteApplication(id)
        .then(
            function(response){
                deleteApplicationSuccess();
            },
            function(errResponse){
                deleteApplicationError(errResponse);
            }
        )
    }

    function editApplication(id) {    
        euroPctService.editApplication(id)
        .then(
            function(response){
                $state.go('portfolio.patent.euro-pct.form1200.questionnaire', {savedForm1200: response.data}, {reload: false}) //send saved data to questionnaire
            },
            function(errResponse){
                editApplicationError(errResponse);
            }
        )
    }    

    function updateNotifications(id) {
        euroPctService.updateNotifications(id)
        .then(
            function(response){
                updateNotificationsSuccess();
            },
            function(errResponse){
                updateNotificationsError(errResponse);
            }
        )

    };

    function deleteApplicationSuccess() {
        var modalInstance = $uibModal.open({
            templateUrl: 'app/templates/modals/modal.delete-epct-application-success.tpl.htm', //create html for notifications update success
            appendTo: undefined,
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', function($uibModalInstance){
                this.dismissModal = function () {
                    $uibModalInstance.close();
                };
                $state.go('portfolio.patent', {patentId: patent.id}, {reload: true}); //go to patent info on successful deletion
            }]

        });
    }

    function deleteApplicationError(errResponse) {

        var modalInstance = $uibModal.open({
            templateUrl: 'app/templates/modals/modal.delete-epct-application-error.tpl.htm', //create html for notifications update success
            appendTo: undefined,
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', function($uibModalInstance){

                this.error = errResponse;

                this.dismissModal = function () {
                    $uibModalInstance.close();
                };

            }]

        });

    }        

    function editApplicationError(errResponse) {

        var modalInstance = $uibModal.open({
            templateUrl: 'app/templates/modals/modal.edit-epct-application-error.tpl.htm', //create html for notifications update success
            appendTo: undefined,
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', function($uibModalInstance){

                this.error = errResponse;

                this.dismissModal = function () {
                    $uibModalInstance.close();
                };

            }]

        });

    }   

    function updateNotificationsSuccess() {
        var modalInstance = $uibModal.open({
            templateUrl: 'app/templates/modals/modal.update-epct-notifications-success.tpl.htm', //create html for notifications update success
            appendTo: undefined,
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', function($uibModalInstance){
                this.dismissModal = function () {
                    $uibModalInstance.close();
                };
            }]

        });
    }

    function updateNotificationsError(errResponse) {

        var modalInstance = $uibModal.open({
            templateUrl: 'app/templates/modals/modal.update-epct-notifications-error.tpl.htm', //create html for notifications update fail
            appendTo: undefined,
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', function($uibModalInstance){

                this.error = errResponse;

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
