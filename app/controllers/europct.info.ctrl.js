angular.module('ppApp').controller('euroPctInfoCtrl', euroPctInfoCtrl);

euroPctInfoCtrl.$inject = ['patent', '$timeout', 'chunkDataService', 'euroPctService', '$uibModal', 'organiseTextService', 'organiseColourService'];

function euroPctInfoCtrl(patent, $timeout, chunkDataService, euroPctService, $uibModal, organiseTextService, organiseColourService) {

    var vm = this;

    vm.patent = patent;
    vm.deleteApplication = deleteApplication;
    vm.editApplication = editApplication;
    vm.updateNotifications = updateNotifications;
    vm.getStatus = getStatus;
    vm.checkActionStatus = checkActionStatus;
    vm.getCurrColour = getCurrColour;
    vm.displayNotifications = displayNotifications;

    function getCurrColour(colour, type) {
        return organiseColourService.getCurrColour(colour, type);
    }

    function checkActionStatus(text){
       return organiseTextService.actionStatus(text)
    }

    function getStatus(text) {
        return organiseTextService.uiStatus(text);
    }

    function deleteApplication(id) {    

        var modalInstance = $uibModal.open({
            templateUrl: 'app/templates/modals/modal.commit-delete-europct.tpl.htm', //create html for notifications update success
            appendTo: undefined,
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', function($uibModalInstance){

                this.dismissModal = function () {
                    $uibModalInstance.close();
                };

                this.deleteApplication = function() {
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
                // $state.go('portfolio.patent', {patentId: patent.id}, {reload: true}); //go to patent info on successful deletion
            }]
        });
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
        euroPctService.updateNotifications(id, patent.epctNotificationUIs)
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
        // console.log(phaseNotifications)
        return patent.epctNotificationUIs.filter(function(data){
            return data.costbandcolor == phase;
        });

    }

}
