angular.module('ppApp').controller('euroPctCtrl', euroPctCtrl);

euroPctCtrl.$inject = ['patent']

function euroPctCtrl(patent) {

    var vm = this;

    vm.form1200Available = form1200Available;

    function form1200Available(item) {
        if(patent.portfolioUI.epctStatus == 'Epct rejected' && patent.portfolioUI.epctStatus == 'Epct available') {
            return false;
        }
        return true;
    }

}