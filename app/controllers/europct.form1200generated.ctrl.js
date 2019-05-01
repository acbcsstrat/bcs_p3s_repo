angular.module('ppApp').controller('form1200GeneratedCtrl', form1200GeneratedCtrl);

form1200GeneratedCtrl.$inject = ['$scope', '$rootScope', '$http', '$state', '$stateParams', 'euroPctService', '$timeout', '$uibModal', 'form1200Service'];

function form1200GeneratedCtrl($scope, $rootScope, $http, $state, $stateParams, euroPctService, $timeout, $uibModal, form1200Service) {

    var vm = this;

    vm.pageTitle = 'Form 1200 Generating';

    console.log($scope.$parent.patent)
    vm.patent = $scope.$parent.patent
    vm.deleteApplication = deleteApplication;

    function init() {    
        checkForm1200();
    }

    init();

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

    function checkForm1200() {
        if(vm.patent.form1200PdfUrl === null) {
            vm.form1200Ready = false;
            return
        }
        vm.form1200Ready = true;
       
    }


}