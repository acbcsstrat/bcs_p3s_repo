angular.module('ppApp').controller('form1200questionnaireCtrl', form1200questionnaireCtrl);

form1200questionnaireCtrl.$inject = ['patent', '$stateParams', '$timeout'];

function form1200questionnaireCtrl(patent, $stateParams, $timeout) {

    var vm = this;

    vm.manualProcess = manualProcess;
    vm.questionNav = [
        {
            index: 0,
            title: 'Q.1'
        },
        {
            index: 1,
            title: 'Q.2'
        },
        {
            index: 2,
            title: 'Q.3'
        },
        {
            index: 3,
            title:  'Q.4'
        },
        {
            index: 4,
            title: 'Q.5'
        },
        {
            index: 5,
            title: 'Q.6'
        },
        {
            index: 6,
            title: 'Q.7'
        }
    ]

    vm.confirmEntity = {
        index: 0,
        navItem: 1,
        fn: function() {
            vm.activeTab = 1; //2nd
        }
    }

    vm.amendments = {
        index: 1,
        navItem: 2,
        fn: function(){
            vm.activeTab = 2; //3rd
        }
    }

    vm.documents = {
        active: false,
        index: 2,
        navItem: 3,
        fn: function() {
            vm.activeTab = 3;
        }
    }

    vm.extAndValid = {
        index: 2,
        navItem: 3,
        fn: function() {
            if(!vm.documents.active) {
                vm.activeTab = 3;
            } else {
                vm.activeTab = 4;
            }
        }
    }

    vm.reference = {
        index: 3,
        navItem: 5,
        fn: function() {
            vm.activeTab = 5;
        }               
    }

    vm.confirmPages = {
        index: 4,
        navItem: 6,
        fn: function() {
            vm.activeTab = 6;
        }           
    }

    vm.renewal = {
        active: false,
        index: 5,
        navItem: 7 
    }

    vm.$onInit = function () {

        var questions = {
            showOptionalQuestion: true,
            isYear3RenewalDue: true
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

        if(questions.showOptionalQuestion && questions.isYear3RenewalDue) {
            return;    
        } else if (questions.showOptionalQuestion || questions.isYear3RenewalDue) {
            vm.questionNav = vm.questionNav.splice(0, (vm.questionNav.length - 1))
        } else {
            vm.questionNav = vm.questionNav.splice(0, (vm.questionNav.length - 2))
        }
        
    }

    function manualProcess(value, question) {

        if(value == true && question == 'amendments') {
            console.log('ding dong')
        }

        if(value == true && question == 'documents') {
            console.log('ding doy ')
        }

    }          

} 