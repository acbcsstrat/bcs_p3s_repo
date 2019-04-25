angular.module('ppApp').controller('notificationsCtrl', notificationsCtrl);

notificationsCtrl.$inject = ['$scope', '$state', '$timeout', '$location', '$anchorScroll', 'chunkDataService', 'notificationService', '$uibModal', 'organiseTextService', 'organiseColourService', 'currentTransactionsService'];

function notificationsCtrl($scope, $state, $timeout, $location, $anchorScroll, chunkDataService, notificationService, $uibModal, organiseTextService, organiseColourService, currentTransactionsService) {

    var vm = this;

    var patent = $scope.$parent.patent;
    vm.patent = $scope.$parent.patent;
    vm.updateNotifications = updateNotifications;
    vm.displayNotifications = displayNotifications;
    vm.notificationNavItems = [];
    vm.notificationUrl = 'rest-renewal-notifications/';
    vm.data = {    
        availableAction: [],
        selectedAction: {}
    }

    function checkServices() {

        vm.patent.portfolioUI.serviceList.forEach(function(data, index){
            vm.data.availableAction.push({id: index, action: data.serviceType})
        })
        vm.data.selectedAction = vm.data.availableAction[0];
    }

    checkServices()

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
            vm.notificationNavItems = [{id: 0, colour: 'Green'}, {id: 1, colour: 'Amber'}]
        }

        if(action == 'Renewal') {
            console.log('should hit')
            vm.notificationUi = 'renewalNotificationUIs';
            vm.availableNotifications = chunkDataService.chunkData(phaseNotifications(phase, patent[vm.notificationUi]), 6);
            vm.notificationUrl = 'rest-renewal-notifications/';
            vm.notificationNavItems = [
                {id: 0, colour: 'Green'}, 
                {id: 1, colour: 'Amber'}, 
                {id: 2, colour: 'Red'}, 
                {id: 3, colour: 'Blue'}, 
                {id: 4, colour: 'Black'}
            ]
        }

    };

    function phaseNotifications(phase, ui) { //migrate to renewalCtrl

        return ui.filter(function(data){
            return data.costbandcolor == phase;
        });

    }

}
