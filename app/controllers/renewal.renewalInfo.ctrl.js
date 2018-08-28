angular.module('ppApp').controller('renewalInfoCtrl', renewalInfoCtrl);

renewalInfoCtrl.$inject = ['patent','$timeout', 'chunkDataService', 'renewalRestService'];

function renewalInfoCtrl(patent, $timeout, chunkDataService, renewalRestService) {

    var vm = this;

    vm.patent = patent;
    vm.updateRenewalNotifications = updateRenewalNotifications;


    function updateRenewalNotifications(id) {

        renewalRestService.updateNotifications()
        .then(
            function(response){

            },
            function(errResponse){

            }
        )

    }

    function updateNotificationsSuccess() {

            vm.updatePatent(id); //migrate to renewalsCtrl when API provided

            var modalInstance = $uibModal.open({
                templateUrl: 'app/templates/modals/modal.update-patent.tpl.htm',
                appendTo: undefined,
                controllerAs: '$ctrl'
                controller: ['$uibModalInstance', '$scope', '$timeout', function($uibModalInstance, $scope, $timeout){
                    
                    this.dismissModal = function () {
                        $uibModalInstance.close();
                    };

                        
                    
                }]

            });
    }



    // vm.$onInit = function() {
        // if(patent) {
        //     fxCalculationService.setFx(patent);
        //     vm.patentFx = fxCalculationService;
        // }
    // }

    // $timeout(function() {
    //     vm.displayNotifications('Green');
    // }, 100);    

    // function displayNotifications(phase) {  //migrate to renewalCtrl
    //     vm.chunkedData = chunkDataService.chunkData(phaseNotifications(phase), 8);
    // };

    // function phaseNotifications(phase) { //migrate to renewalCtrl

    //     var notificationsArr = patent.notificationUIs;
    //     var notifications = [];

    //     notificationsArr.forEach(function(data){
    //         if(data.costbandcolor == phase) {
    //             notifications.push(data);
    //         }
    //     });

    //     return notifications;

    // }

}