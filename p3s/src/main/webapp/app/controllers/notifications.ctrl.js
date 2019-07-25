angular.module('ppApp').controller('notificationsCtrl', notificationsCtrl);

notificationsCtrl.$inject = ['patent', '$scope', '$state', '$timeout', '$location', '$anchorScroll', 'chunkDataService', 'notificationService', '$uibModal', 'organiseTextService', 'organiseColourService', 'currentTransactionsService', 'coreService', '$rootScope'];

function notificationsCtrl(patent, $scope, $state, $timeout, $location, $anchorScroll, chunkDataService, notificationService, $uibModal, organiseTextService, organiseColourService, currentTransactionsService, coreService, $rootScope) {

    var vm = this;

    vm.patent = patent;
    vm.updateNotifications = updateNotifications;
    vm.displayNotifications = displayNotifications;
    vm.notificationNavItems = [];
    vm.notificationUrl = 'rest-renewal-notifications/';
    vm.openGuide = openGuide;

    vm.data = {    
        availableAction: [],
        selectedAction: {}
    }

    vm.activeTab = 0;

    function checkServices() {

        if(vm.patent.portfolioUI.epeStage == 'Prosecution') {
            vm.data.availableAction.push({id: 0, action: 'Renewal'})
        }
        if(vm.patent.portfolioUI.epeStage == 'Filing') {
            vm.data.availableAction.push({id: 0, action: 'Form1200'})
        }
        vm.data.selectedAction = vm.data.availableAction[0];

    }

    checkServices()

    function openGuide() {
        coreService.openAppGuide();
        $rootScope.$broadcast('appGuideOpen');
    }    

    function updateNotifications(id, ui, url) {
        notificationService.updateNotifications(id, patent[ui], url)
        .then(
            function(response){
                updateNotificationsSuccess();
            },
            function(errResponse){
                updateNotificationsError(errResponse);
            }
        )
    };

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

    function displayNotifications(action, phase) {  //migrate to renewalCtr

        var notificationUi;

        if(action == 'Form1200') { 
            vm.notificationUi = 'epctNotificationUIs';
            vm.notificationUrl = 'rest-epct-notifications/';
            vm.availableNotifications = chunkDataService.chunkData(phaseNotifications(phase, patent[vm.notificationUi]), 6);
            vm.notificationNavItems = [
                {id: 0, colour: 'Green', css: 'green'}, 
                {id: 1, colour: 'Amber', css: 'amber'}
            ]
        }

        if(action == 'Renewal') {

            vm.notificationUi = 'renewalNotificationUIs';
            vm.availableNotifications = chunkDataService.chunkData(phaseNotifications(phase, patent[vm.notificationUi]), 6);
            vm.notificationUrl = 'rest-renewal-notifications/';
            vm.notificationNavItems = [
                {id: 0, colour: 'Green', css: 'green'}, 
                {id: 1, colour: 'Amber', css: 'amber'}, 
                {id: 2, colour: 'Red', css: 'red'}, 
                {id: 3, colour: 'Blue', css: 'blue'}, 
                {id: 4, colour: 'Black', css: 'black'}
            ]
        }

    };

    function phaseNotifications(phase, ui) { //migrate to renewalCtrl

        return ui.filter(function(data){
            return data.costbandcolor == phase;
        });

    }

}
