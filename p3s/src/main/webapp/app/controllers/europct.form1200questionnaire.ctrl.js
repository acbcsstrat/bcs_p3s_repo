angular.module('ppApp').controller('form1200questionnaireCtrl', form1200questionnaireCtrl);

form1200questionnaireCtrl.$inject = ['patent', '$scope', '$rootScope', '$stateParams', '$timeout', 'chunkDataService', '$state', '$uibModal', 'form1200Service'];

function form1200questionnaireCtrl(patent, $scope, $rootScope, $stateParams, $timeout, chunkDataService, $state, $uibModal, form1200Service) {

    var vm = this;

    $rootScope.page = 'Form 1200 Questionnaire';

    vm.manualProcess = manualProcess;// NOT REQUIRED FOR RELEASE 1
    vm.chkValidStates = chkValidStates;
    vm.chkExtStates = chkExtStates;
    vm.submitForm1200 = submitForm1200;
    vm.questionsParam =  $stateParams.questions; //questions passed from form1200.intro
    vm.cancel1200 = cancel1200;
    vm.formData = {};
    vm.loading = true;
    vm.patentsLoaded = false;
    vm.entityAccepted = false;

    vm.confirmEntity = {
        index: 0,
        title: function() {
           return 'Q.'+(this.index+1)+'';
        },
        activeTabFn: function() {
            return this.index+1;
        },        
        fn: function() {
            vm.activeTab = this.activeTabFn();
            vm.confirmEntityChecked = true;
        }
    }

    vm.amendments = {
        index: 1,
        title: function() {
           return 'Q.'+(this.index+1)+'';
        },
        activeTabFn: function() {
            return this.index+1;
        },
        fn: function(){
            vm.activeTab = this.activeTabFn();
            vm.amendmentsChecked = true;
            if(!vm.documents.active) {
                vm.documentsChecked = true;
            }
        }
    }

    vm.documents = {
        active: false,
        index: 2,
        title: function() {
           return 'Q.'+(this.index+1)+'';
        },
        activeTabFn: function() {
            return this.index+1;
        },        
        fn: function() {
            vm.activeTab = this.activeTabFn();
            vm.documentsChecked = true;
        }
    }

    vm.extAndValid = {
        index: 2,
        title: function() {
           return 'Q.'+(this.index+1)+'';
        },
        activeTabFn: function() {
            return this.index+1;
        },        
        fn: function() {
            vm.activeTab = this.activeTabFn();
            vm.extAndValidChecked = true;
        }
    }

    vm.reference = {
        index: 3,
        title: function() {
           return 'Q.'+(this.index+1)+'';
        },
        activeTabFn: function() {
            return this.index+1;
        },
        fn: function() {
            vm.activeTab = this.activeTabFn();
            vm.referenceChecked = true;
        }               
    }

    vm.confirmPages = {
        index: 4,
        title: function() {
           return 'Q.'+(this.index+1)+'';
        },
        activeTabFn: function() {
            return this.index+1;
        },
        fn: function() {
            vm.activeTab = this.activeTabFn();
            vm.confirmPagesChecked = true;
        }           
    }

    vm.renewal = {
        active: false,
        index: 5,
        title: function() {
           return 'Q.'+(this.index+1)+'';
        } 
    }

    function init() {

        if(patent.form1200FeeUI === null) {
            vm.loading = false;
            vm.patentsLoaded = true;
        }

        if(vm.questionsParam.length === 0) {
            $state.go('portfolio.patent.euro-pct.form1200.intro');
        } else {

            if($stateParams.savedForm1200) { //if user is editing
                vm.formData = $stateParams.savedForm1200;
                vm.confirmEntityModel = true; //tick entity checjbox
            } else { //if new form

                vm.formData.extensionStatesUI = vm.questionsParam.extensionStatesUI;
                vm.formData.validationStatesUI = vm.questionsParam.validationStatesUI;
                
                var questions = {
                    showOptionalQuestion: function() {
                        if(vm.questionsParam.showOptionalQuestion) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    isYear3RenewalDue: function() {
                        if(vm.questionsParam.isYear3RenewalDue) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }

                if(questions.showOptionalQuestion()) {
                    vm.documents.active = true;
                    vm.extAndValid.index++;
                    vm.reference.index++;
                    vm.confirmPages.index++;
                    vm.renewal.index++;
                }

                if(questions.isYear3RenewalDue()) {
                    vm.renewal.active = true;
                }
            }

        }

    }

    init();

    function cancel1200() {
        var modalInstance = $uibModal.open({
            templateUrl: 'app/templates/modals/modal.confirm-cancel-1200.tpl.htm',
            appendTo: undefined,
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', '$scope', '$timeout', function($uibModalInstance, $scope, $timeout){

                this.dismissModal = function () {
                    $uibModalInstance.close();
                };

                this.ok = function () {
                    $state.go('portfolio', {reload: true});
                    $uibModalInstance.close();
                };


            }]
        });

    }

    function sortPageDetails(data) {

        var arr = []

        for(var property in data) {
            if(data.hasOwnProperty(property)) {
                switch(property) {
                    case 'claims':
                        data[property].type = 'Claims';
                        arr.push(data[property])
                    break;
                    case 'description':
                        data[property].type = 'Description';
                        arr.push(data[property])
                    break;
                    case 'drawings':
                        data[property].type = 'Drawings';
                        arr.push(data[property])
                    break;
                }
            }
        }

        return arr;

    }

    function submitForm1200(data) {

        var arr = sortPageDetails(data);
        vm.formData.pageDescriptionsUI = arr;
        vm.formData.EP_ApplicationNumber = patent.ep_ApplicationNumber;

        form1200Service.submitForm1200(patent.id, vm.formData)
        .then(
            function(response){
                $state.go('portfolio.patent.euro-pct.form1200.generated', {form1200: response}, {reload: false})
            },
            function(errResponse){

            }
        )
    }

    function chkValidStates(item, index) {
        if(item === '') {
            vm.questionsParam.validationStatesUI[index].selected = true;
        } else {
            vm.questionsParam.validationStatesUI[index].selected = false;
        }
        vm.formData.validationStatesUI =  vm.questionsParam.validationStatesUI;
    }

    function chkExtStates(item, index) {
        if(item === '') {
            vm.questionsParam.extensionStatesUI[index].selected = true;
        } else {
            vm.questionsParam.extensionStatesUI[index].selected = false;
        }
        vm.formData.extensionStatesUI =  vm.questionsParam.extensionStatesUI;
    }

    function manualProcess(value, question) {// NOT NEEDED FOR RELEASE 1

        if(value === true && question == 'amendments') {

            var modalInstance = $uibModal.open({
                templateUrl: 'app/templates/modals/modal.manual-processing-amendments.tpl.htm',
                appendTo: undefined,
                controllerAs: '$ctrl',
                controller: ['$uibModalInstance', '$scope', '$timeout', function($uibModalInstance, $scope, $timeout){

                    vm.proceedMsgAmend  = true;
                    this.dismissModal = function () {
                        $uibModalInstance.close();
                    };

                    this.ok = function () {
                        $state.go('portfolio', {manual: true}, {reload: true});
                        $uibModalInstance.close();
                    };


                }]
            });
        } else {
            vm.proceedMsgAmend = false;
        }

        if(value === true && question == 'documents') {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/templates/modals/modal.manual-processing-documents.tpl.htm',
                appendTo: undefined,
                controllerAs: '$ctrl',
                controller: ['$uibModalInstance', '$scope', '$timeout', function($uibModalInstance, $scope, $timeout){

                    vm.proceedMsgDocs  = true;
                    this.dismissModal = function () {
                        $uibModalInstance.close();
                    };

                    this.ok = function () {
                        $state.go('portfolio', {manual: true}, {reload: true});
                        $uibModalInstance.close();
                    };


                }]
            });            
        } else {
            vm.proceedMsgDocs = false;
        }

    }          

}