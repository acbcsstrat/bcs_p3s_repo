angular.module('ppApp').controller('form1200GeneratedCtrl', form1200GeneratedCtrl);

form1200GeneratedCtrl.$inject = ['$scope', '$rootScope','patent', '$http', '$state', '$stateParams', 'euroPctService', '$timeout', '$uibModal', 'form1200Service'];

function form1200GeneratedCtrl($scope, $rootScope, patent, $http, $state, $stateParams, euroPctService, $timeout, $uibModal, form1200Service) {

    var vm = this;

    $rootScope.page = 'Form 1200 Generating';

    vm.form1200;
    vm.deleteApplication = deleteApplication;
    vm.editApplication = editApplication; 
    vm.portfolioDir = portfolioDir;
    vm.loadingQuestions = false;
    vm.costData = $stateParams.form1200.form1200FeeUI;
    // var fetchForm1200 = fetchForm1200;


        console.log($stateParams)
        // if($stateParams.form1200 === '') {
        //     $state.go('portfolio', {}, {reload: true});
        // } else {
        
        // }
        
    function init() {
        form1200Generating();
        checkForm1200();   
    }

    init();

    function form1200Generating() {

        var modalInstance = $uibModal.open({
            templateUrl: 'app/templates/modals/modal.form1200-generating.tpl.htm', //create html for notifications update success
            appendTo: undefined,
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', function($uibModalInstance){
                this.dismissModal = function () {
                    $uibModalInstance.close();
                };
            }]

        })

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
                $state.go('portfolio.patent.euro-pct.form1200.questionnaire', {savedForm1200: response.data}, {reload: false}) //send saved data to questionnaire
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
        console.log($stateParams.form1200)
        form1200Service.submitForm1200($stateParams.form1200)
        .then(
            function(response){
                console.log(response)

                $rootScope.page = 'Form 1200 Generated';
                vm.form1200 = response;


            },
            function(errResponse){
                console.log('Error generating form 1200')
            }
        )
    }

    function portfolioDir() {
        $state.go('portfolio', {}, {reload: true});
    }

}