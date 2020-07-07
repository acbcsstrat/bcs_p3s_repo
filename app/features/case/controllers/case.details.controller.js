CaseDetailsController.$inject = ['caseSelected', '$scope', '$state', 'CasesRestService', '$uibModal']

export default function CaseDetailsController(caseSelected, $scope, $state, CasesRestService, $uibModal) {

	var vm = this;

	vm.patent = caseSelected;
    vm.updatePatent = updatePatent;    

    function updatePatentSuccess() {

        $state.reload();

        var modalInstance = $uibModal.open({
            template: require('html-loader!../html/modals/modal.update-patent-success.tpl.htm'),
            appendTo: undefined,
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', function($uibModalInstance){

                this.dismissModal = function() {
                    $uibModalInstance.close();
                };

            }]

        });
        
    }

    function updatePatentError() {

        var modalInstance = $uibModal.open({
            template: require('html-loader!../html/modals/modal.update-patent-error.tpl.htm'),
            appendTo: undefined,
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', function($uibModalInstance){

                this.dismissModal = function() {
                    $uibModalInstance.close();
                };

            }]

        });

    }

    function updatePatent(patent) {

        CasesRestService.updatePatent(patent, patent.patentID)
        .then(
            function(response){
                updatePatentSuccess();
            },
            function(errResponse){
                updatePatentError();
            }
        )

    };


}