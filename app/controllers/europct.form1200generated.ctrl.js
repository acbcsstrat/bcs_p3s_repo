angular.module('ppApp').controller('form1200GeneratedCtrl', form1200GeneratedCtrl);

form1200GeneratedCtrl.$inject = ['$scope', 'patent', '$http', '$state', '$stateParams', 'euroPctService', '$timeout', '$uibModal'];

function form1200GeneratedCtrl($scope, patent, $http, $state, $stateParams, euroPctService, $timeout, $uibModal) {

    var vm = this;

    vm.patent = patent;
    vm.deleteApplication = deleteApplication;
    vm.editApplication = editApplication; 
    vm.portfolioDir = portfolioDir;
    vm.loadingQuestions = false;
    vm.form1200 = {};
    vm.costData = $stateParams.form1200.form1200FeeUI;
    var fetchForm1200 = fetchForm1200;

    if(!vm.form1200.form1200PdfUrl) {
        fetchForm1200()
    }

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

    function editApplication(id) {    
        euroPctService.editApplication(id)
        .then(
            function(response){
                // $state.go()
            },
            function(errResponse){
                editApplicationError(errResponse);
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
            }]

        })
        // .closed.then(function(){
        //     $state.go('portfolio.patent',{patentId: patent.id}, {reload: true})
        // });
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

    function fetchForm1200() {
        euroPctService.generateForm1200($stateParams.form1200)
        .then(
            function(response){
                $timeout(function(){
                    if(response.patents[0].ep_ApplicationNumber) {
                        vm.form1200.form1200PdfUrl = true;
                    } else {
                        $timeout(function(){
                            fetchForm1200();
                        }, 10000)
                    }
                }, 5000)
                // $state.go('portfolio.patent.euro-pct.form1200.generated', {form1200: response}, {reload: false})
            },
            function(errResponse){
                console.log('Error generating form 1200')
                // $state.go('portfolio.patent.euro-pct.form1200.generated', {form1200: 'error'}, {reload: false})
            }
        )
    }

    function portfolioDir() {
        $state.go('portfolio', {}, {reload: true});
    }

}