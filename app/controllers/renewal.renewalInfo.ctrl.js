angular.module('ppApp').controller('renewalInfoCtrl', renewalInfoCtrl);

renewalInfoCtrl.$inject = ['$scope', 'patent', '$state', '$timeout', 'chunkDataService', 'renewalRestService', '$uibModal', 'organiseColourService'];

function renewalInfoCtrl($scope, patent, $state, $timeout, chunkDataService, renewalRestService, $uibModal, organiseColourService) {

    var vm = this;

    vm.patent = patent;
    vm.updateRenewalNotifications = updateRenewalNotifications;
    vm.displayNotifications = displayNotifications;
    vm.fetchRenewal = patent.renewalFeeUI;
    vm.getCurrColour = getCurrColour;
    vm.getNextColour = getNextColour;
    vm.nextStageColour = nextStageColour;
    vm.submitt = submitt;

    function submitt(item) {
        console.log(item)
    }

    function updateRenewalNotifications(patent, id) {
        renewalRestService.updateNotifications(patent.notificationUIs, id)
        .then(
            function(response){
                updateNotificationsSuccess();
            },
            function(errResponse){
                updateNotificationsError();
            }
        )
    }

    function nextStageColour() {
        return patent.portfolioUI.serviceList.map(function(el){
            return el.nextStageColour;
        })
    }

    function getCurrColour(colour, item){
        return organiseColourService.getCurrColour(colour, item);
    }


    function getNextColour(colour, item){
        return organiseColourService.getNextColour(colour, item);
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

        var notifications = [];

        return patent.notificationUIs.filter(function(data){
            return data.costbandcolor == phase;
        });


    }

}