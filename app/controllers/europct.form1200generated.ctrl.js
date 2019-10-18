angular.module('ppApp').controller('form1200GeneratedCtrl', form1200GeneratedCtrl);

form1200GeneratedCtrl.$inject = ['$scope', '$rootScope', '$http', '$state', '$stateParams', 'euroPctService', '$timeout', '$uibModal', 'form1200Service'];

function form1200GeneratedCtrl($scope, $rootScope, $http, $state, $stateParams, euroPctService, $timeout, $uibModal, form1200Service) {

    var vm = this;

    $scope.patent = $scope.$parent.patent
    $scope.confirmDeleteApplication = confirmDeleteApplication;
    $scope.deleteApplicationReq = false;

    function confirmDeleteApplication(id) {

        var modalInstance = $uibModal.open({
            templateUrl: 'app/templates/modals/modal.confirm-delete-epct-application-success.tpl.htm', //create html for notifications update success
            appendTo: undefined,
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', function($uibModalInstance){

                this.confirm = function() {
                    deleteApplication($scope.patent.patentID)
                    $uibModalInstance.close();
                }

                this.dismissModal = function () {
                    $uibModalInstance.close();
                    
                };
               
            }]

        });      

    }

    function deleteApplication(id) {

        $scope.deleteApplicationReq = true;
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

        $scope.deleteApplicationReq = true;

        var modalInstance = $uibModal.open({
            templateUrl: 'app/templates/modals/modal.delete-epct-application-success.tpl.htm', //create html for notifications update success
            appendTo: undefined,
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', function($uibModalInstance){
                this.dismissModal = function () {
                    $uibModalInstance.close();
                    
                };
                $timeout(function() {
                    $state.go('portfolio.patent', {patentId: $scope.patent.patentID}, {reload: true}); //go to patent info on successful deletion                    
                }, 200);
               
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


}