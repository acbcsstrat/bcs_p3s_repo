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
    vm.notificationUi; //required for uopdating notifications
    vm.notificationUrl;
    var colors = ['green', 'amber', 'red', 'blue', 'black'];
    vm.toBlueOrNotToBlue = false;
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

    checkServices();

    vm.notifications = {};

    function displayNotifications(action) {  //displays the specifed actions notifications

        if(action == 'Form1200') { 
            vm.notificationUi = 'epctNotificationUIs';
            vm.notificationUrl = 'rest-epct-notifications/';
            vm.toBlueOrNotToBlue = false;
        }

        if(action == 'Renewal') {
            vm.notificationUi = 'renewalNotificationUIs';
            vm.notificationUrl = 'rest-renewal-notifications/';
            vm.toBlueOrNotToBlue = true;
        }



        phaseNotifications()

    };

    function phaseNotifications() {  //all info assigned to scope is requried for submitting data

        for(var i = 0; colors.length > i; i++) {
            if(vm.toBlueOrNotToBlue) {
                vm.notifications[colors[i]] = chunkDataService.chunkData(fetchNotificationUi(colors[i], patent[vm.notificationUi]), 6)//chunk data makes sure the coluns go no more than 6
            }
            if(!vm.toBlueOrNotToBlue) {
                if(i == 2) { break };
                vm.notifications[colors[i]] = chunkDataService.chunkData(fetchNotificationUi(colors[i], patent[vm.notificationUi]), 6)
            }
        }        

    }    

    function fetchNotificationUi(phase, ui) { //returns the phases notifciations for chunkdata service
        return ui.filter(function(data){
            return data.costbandcolor.toLowerCase() == phase.toLowerCase();
        });
    }

    console.log(vm.notifications)




    function openGuide() {
        coreService.openAppGuide();
        $rootScope.$broadcast('appGuideOpen');
    }    

    function updateNotifications(id, ui, url) {
        vm.updatingNotifications = true;
        notificationService.updateNotifications(id, patent[ui], url)
        .then(
            function(response){
                updateNotificationsSuccess();
                vm.updatingNotifications = false;
            },
            function(errResponse){
                updateNotificationsError(errResponse);
                vm.updatingNotifications = false;
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



}
