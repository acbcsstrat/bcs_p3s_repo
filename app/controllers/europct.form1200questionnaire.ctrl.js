angular.module('ppApp').controller('form1200questionnaireCtrl', form1200questionnaireCtrl);

form1200questionnaireCtrl.$inject = ['patent', '$scope', '$stateParams', '$timeout', 'chunkDataService', '$state', '$uibModal'];

function form1200questionnaireCtrl(patent, $scope, $stateParams, $timeout, chunkDataService, $state, $uibModal) {

    var vm = this;

    vm.manualProcess = manualProcess;
    vm.chkValidStates = chkValidStates;
    vm.chkExtStates = chkExtStates;
    vm.submitForm1200 = submitForm1200;
    vm.questionsParam =  $stateParams.questions;
    vm.formData = {};
    vm.formData.extensionStatesUI = vm.questionsParam.extensionStatesUI
    vm.formData.validationStatesUI = vm.questionsParam.validationStatesUI

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


    vm.$onInit = function () {

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

        // form1200Service.generateForm1200(vm.formData)
        // .then(
        //     function(response){
                $state.go('portfolio.patent.euro-pct.form1200.generated', {}, {reload: false})
        //     },
        //     function(errResponse){

        //     }
        // )
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

    function manualProcess(value, question) {

        if(value == true && question == 'amendments') {

            var modalInstance = $uibModal.open({
                templateUrl: 'app/templates/modal.manual-processing-amendments.tpl.htm',
                appendTo: undefined,
                controllerAs: '$ctrl',
                controller: ['$uibModalInstance', '$scope', '$timeout', function($uibModalInstance, $scope, $timeout){

                    vm.proceedMsgAmend  = true;
                    this.dismissModal = function () {
                        $uibModalInstance.close();
                    };

                    this.ok = function () {
                        $state.go('portfolio', {manual: true}, {reload: true});
                    };


                }]
            });
        } else {
            vm.proceedMsgAmend = false;
        }

        if(value == true && question == 'documents') {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/templates/modal.manual-processing-documents.tpl.htm',
                appendTo: undefined,
                controllerAs: '$ctrl',
                controller: ['$uibModalInstance', '$scope', '$timeout', function($uibModalInstance, $scope, $timeout){

                    vm.proceedMsgDocs  = true;
                    this.dismissModal = function () {
                        $uibModalInstance.close();
                    };

                    this.ok = function () {
                        $state.go('portfolio', {manual: true}, {reload: true});
                    };


                }]
            });            
        } else {
            vm.proceedMsgDocs = false;
        }

    }          

}