angular.module('ppApp').controller('form1200Ctrl', form1200Ctrl);

form1200Ctrl.$inject = ['patent'];

function form1200Ctrl(patent) {

    var vm = this;

    vm.form1200Incorrect = form1200Incorrect;
    vm.form1200Correct = form1200Correct;

    function form1200Correct() {
        vm.generatedPdf = false;
        vm.patentFound = false;
        vm.costPanel = true;
    }

    function form1200Incorrect() {
        $state.go('form1200');
    }
    
} 