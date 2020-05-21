RemindersController.$inject = ['caseSelected', '$scope', '$rootScope', '$uibModal', 'ChunkDataService', 'RemindersService', 'CoreService'];

export default function RemindersController(caseSelected, $scope, $rootScope, $uibModal, ChunkDataService, RemindersService,  CoreService) {

    var vm = this;

    vm.patent = caseSelected;
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

        vm.data.availableAction = caseSelected.p3sServicesWithFees.filter(function(item){
            return item.serviceType !== 'postgrant';
        }).map(function(action, idx){
            if(action.serviceType == 'epct') { action.serviceType = 'Euro-PCT'}
            return {id: idx, action: action.serviceType}
        })

        vm.data.selectedAction = vm.data.availableAction[0];

    }

    checkServices();

    vm.notifications = {};

    function displayNotifications(action) {  //displays the specifed actions notifications

        if(typeof action == undefined) { return; }

        if(action == 'Euro-PCT') { 
            vm.notificationUi = 'allEpctNotificationUIs';
            vm.notificationUrl = 'rest-epct-notifications/';
            vm.toBlueOrNotToBlue = false; //USED TO DETERMINE WHETHER TO DISPLAY BLUE
        }

        if(action == 'renewal') {
            vm.notificationUi = 'allRenewalNotificationUIs';
            vm.notificationUrl = 'rest-renewal-notifications/';
            vm.toBlueOrNotToBlue = true;
        }

        if(action == 'grant') {
            vm.notificationUi = 'allGrantNotificationUIs';
            vm.notificationUrl = 'rest-grant-notifications/';
            vm.toBlueOrNotToBlue = false;
        }

        if(action !== 'validation') { 
            phaseNotifications();
        }


    };

    function phaseNotifications() {  //all info assigned to scope is requried for submitting data

        for(var i = 0; colors.length > i; i++) {
            if(vm.toBlueOrNotToBlue) {
                vm.notifications[colors[i]] = ChunkDataService.chunkData(fetchNotificationUi(colors[i], caseSelected[vm.notificationUi]), 6)//chunk data makes sure the coluns go no more than 6
            }
            if(!vm.toBlueOrNotToBlue) {
                if(i == 2) { break }; //if only green and amber available
                vm.notifications[colors[i]] = ChunkDataService.chunkData(fetchNotificationUi(colors[i], caseSelected[vm.notificationUi]), 6)
            }
        }        

    }    

    function fetchNotificationUi(phase, ui) { //returns the phases notifciations for chunkdata service
        return ui.filter(function(data){
            return data.costbandcolor.toLowerCase() == phase.toLowerCase();
        });
    }

    function openGuide() {
        CoreService.openAppGuide();
        $rootScope.$broadcast('appGuideOpen');
    }    

    function updateNotifications(id, ui, url) {
        vm.updatingNotifications = true;
        RemindersService.updateNotifications(id, caseSelected[ui], url)
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
            template: require('html-loader!../html/modals/modal.update-epct-notifications-success.tpl.htm'), //create html for notifications update success
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
            template: require('html-loader!../html/modals/modal.update-epct-notifications-error.tpl.htm'), //create html for notifications update fail
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
