angular.module('ppApp').controller('euroPctCtrl', euroPctCtrl);

euroPctCtrl.$inject = ['patent']

function euroPctCtrl(patent) {

    var vm = this;

    vm.form1200Available = form1200Available;

    function form1200Available() {
        if(patent.epctStatus == 'Epct rejected' || patent.epctStatus == 'Epct available') {
            return false;
        }
        return true;
    }

}