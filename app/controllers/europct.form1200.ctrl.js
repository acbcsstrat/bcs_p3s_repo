angular.module('ppApp').controller('form1200Ctrl', form1200Ctrl);

form1200Ctrl.$inject = ['patent', '$state'];

function form1200Ctrl(patent, $state) {

    var vm = this;

    // vm.patent = patent;

   
    // vm.initiate1200 = initiate1200;

    // vm.$onInit = function() {
    //     vm.activeSelectedTab = 0;
    //     $state.go("portfolio.patent.euro-pct.form1200.intro", {}, {reload: false})
    // }


    // function initiate1200(appNo) {
    //     console.log(appNo)
    //     vm.activeSelectedTab = 1;

    // }

    // vm.form1200Incorrect = form1200Incorrect;
    // vm.form1200Correct = form1200Correct;

    // function form1200Correct() {
    //     vm.generatedPdf = false;
    //     vm.patentFound = false;
    //     vm.costPanel = true;
    // }

    // function form1200Incorrect() {
    //     $state.go('form1200');
    // }


    //   var patentFromJson = angular.fromJson($stateParams.patent);
    // vm.patent = patentFromJson.data;
    // vm.correctPatent = correctPatent;
    // vm.incorrectPatent = incorrectPatent;
    // vm.confirmEntity = confirmEntity;
    // vm.redirectedPortfolio = redirectedPortfolio;
    // vm.amendmentsMade =  amendmentsMade;
    // vm.confirmNoAmendments = confirmNoAmendments;
    
    // vm.enterReference = enterReference;
    // vm.generateForm = generateForm;

    // vm.patentFound = true;
    // vm.displayQuestionnaire = true;
    // vm.costPanel = false;

    // var validateStates = [
    //     {
    //         name: 'Bosnia and Herzegovina',
    //         abbr: 'BA',
    //         id: '1',
    //         type: 'ext'
    //     },
    //     {
    //         name: 'Montenegro',
    //         abbr: 'ME',
    //         id: '2',
    //         type: 'ext'
    //     },
    //     {
    //         name: 'Cambodia',
    //         abbr: 'ME',
    //         id: '3'            
    //     },
    //     {
    //         name: 'Morocco',
    //         abbr: 'MA',
    //         id: '4'            
    //     },
    //     {
    //         name: 'Republic of Moldova',
    //         abbr: 'MD',
    //         id: '5'            
    //     },
    //     {
    //         name: 'Tunisia',
    //         abbr: 'TN',
    //         id: '6'            
    //     }
    // ]

    // vm.chunkedData = chunkDataService.chunkData(validateStates, 1);

    // vm.rates = {
    //     today: 1.5,
    //     yDay: 1.35,
    //     lstWk: 1.55,
    //     lstMnth: 1.95
    // }

    // vm.submitForm1200 = function(obj) {
    //     console.log('WHAT')
    //     console.log(obj)
    // }

    // vm.question = {
    //     q1: true
    // }

    // vm.transaction = {
    //     feeUI: {
    //         supplmentaryFee: 678,
    //         designationFee: 11700,
    //         examFee: 1635,
    //         filingFee: 120,
    //         claimsFee: 900,
    //         subTotal_USD: 15003
    //     }
    // }

    // function incorrectPatent() {
    //     $state.go('form1200', {}, {reload: true});
    //     //modal potentially displayed
    // }

    // function correctPatent() {
    //     vm.question.q2 = true;
    //     vm.activeTab = 2;
    // }

    // function confirmEntity() {
    //     vm.question.q3 = true;
    //     vm.activeTab = 3;
    // }

    // function redirectedPortfolio() {
    //     var modalInstance = $uibModal.open({
    //         templateUrl: 'app/templates/modals/modal.amendments-made.tpl.htm',
    //         appendTo: undefined,
    //         scope: $scope,
    //         controller: ['$uibModalInstance', '$scope', '$timeout', function($uibModalInstance, $scope, $timeout){
    //             $scope.dismissModal = function () {
    //                 $uibModalInstance.close();
    //             };
    //         }]
    //     })
    // }

    // function amendmentsMade(check) {

    //     if(check) {
    //         var modalInstance = $uibModal.open({
    //             templateUrl: 'app/templates/modals/modal.amendments-made.tpl.htm',
    //             appendTo: undefined,
    //             scope: $scope,
    //             controller: ['$uibModalInstance', '$scope', '$timeout', function($uibModalInstance, $scope, $timeout){

    //                 $scope.redirectPureIdeas = function() {
    //                     portfolioService.manualProcessing()
    //                     .then(
    //                         function(response){
    //                             $state.go('portfolio', {actionRequest: 'manualProcessing'})
    //                         },
    //                         function(errResponse){

    //                         }
    //                     )
    //                     //service to send data to back end for Pure Ideas to contact uer
    //                 }

    //                 $scope.dismissModal = function() {
    //                     $scope.confirmAmendments = false;
    //                     $uibModalInstance.close();
    //                 }

    //             }]
    //         });
    //     }
    // }

    // function confirmNoAmendments() {
    //     vm.question.q4 = true;
    //     vm.activeTab = 4;
    // }

    // function enterReference() {
    //     vm.question.q5 = true;
    //     vm.activeTab = 5;
    // }

    // function generateForm() {
    //     $http.get('hardcodedpdffolder/certificates/dummyCertificateNumber1.pdf')
    //     .then(
    //         function(response){
    //             vm.doc_details = {
    //                 file_url: 'hardcodedpdffolder/certificates/dummyCertificateNumber1.pdf'
    //             }
    //             console.log('whattt')
    //             $state.go('epeForm.generatedForm1200', {reload: true})
    //         },
    //         function(errResponse){

    //         }
    //     )
    // }
    
} 