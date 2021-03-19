Form1200GeneratedController.$inject = ['$scope', '$state', 'Form1200Service', '$timeout', '$uibModal'];

export default function Form1200GeneratedController($scope, $state, Form1200Service, $timeout, $uibModal) {

    var vm = this;


    function init() {

        $scope.phoneNumber = $scope.ppDetails.partnerPhone;
        $scope.patent = $scope.$parent.patent
        $scope.confirmDeleteApplication = confirmDeleteApplication;
        $scope.deleteApplicationReq = false;

    }

    init()

    function confirmDeleteApplication(id) {

        var modalInstance = $uibModal.open({
            template: require('html-loader!../html/modals/modal.confirm-delete-epct-application-success.tpl.htm'), //create html for notifications update success
            appendTo: undefined,
            backdropClass: 'second-backdrop',
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', function($uibModalInstance){

                this.confirm = function() {
                    deleteApplication($scope.patent)
                    $uibModalInstance.close();
                }

                this.dismissModal = function () {
                    $uibModalInstance.close();
                    
                };
               
            }]

        });      

    }

    function deleteApplication(patent) {
        $scope.deleteApplicationReq = true;
        Form1200Service.deleteApplication(patent)
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
            template: require('html-loader!../html/modals/modal.delete-epct-application-success.tpl.htm'), //create html for notifications update success
            appendTo: undefined,
            backdropClass: 'second-backdrop',
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', function($uibModalInstance){
                this.dismissModal = function () {
                    $uibModalInstance.close();
                    
                };

                $state.reload('portfolio.modal.case'); //go to patent info on successful deletion                    

                $scope.$on('$destroy', function(){
                    $timeout.cancel(timeout)
                })
               
            }]

        });
    }

    function deleteApplicationError(errResponse) {

        var modalInstance = $uibModal.open({
            template: require('html-loader!../html/modals/modal.delete-epct-application-error.tpl.htm'), //create html for notifications update success
            appendTo: undefined,
            backdropClass: 'second-backdrop',
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
            template: require('html-loader!../html/modals/modal.edit-epct-application-error.tpl.htm'), //create html for notifications update success
            appendTo: undefined,
            backdropClass: 'second-backdrop',
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