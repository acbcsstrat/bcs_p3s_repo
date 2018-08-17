angular.module('ppApp').controller('form1200questionnaireCtrl', form1200questionnaireCtrl);

form1200questionnaireCtrl.$inject = ['patent', '$stateParams', '$timeout', 'chunkDataService', '$state'];

function form1200questionnaireCtrl(patent, $stateParams, $timeout, chunkDataService, $state) {

    var vm = this;

    vm.manualProcess = manualProcess;
    // vm.chunkedData = chunkDataService.chunkData(validateStates, 1);
    vm.generateForm1200 = generateForm1200;
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
            showOptionalQuestion: true,
            isYear3RenewalDue: false
        }

        if(questions.showOptionalQuestion) {
            vm.documents.active = true;
            vm.extAndValid.index++;
            vm.reference.index++;
            vm.confirmPages.index++;
            vm.renewal.index++;
        }

        if(questions.isYear3RenewalDue) {
            vm.renewal.active = true;
        }

    }

    function generateForm1200() {
        $state.go('portfolio.patent.euro-pct.form1200.generated', {}, {reload: false})
    }

    function manualProcess(value, question) {

        if(value == true && question == 'amendments') {
        }

        if(value == true && question == 'documents') {
        }

    }          

}