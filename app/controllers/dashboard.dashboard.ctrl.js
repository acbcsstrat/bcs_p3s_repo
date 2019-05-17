angular.module('ppApp').controller('dashboardCtrl', dashboardCtrl);

dashboardCtrl.$inject = ['$scope','$state', 'patentIds', '$timeout', '$rootScope', 'patentPhasesService', '$transitions'];

function dashboardCtrl ($scope, $state, patentIds, $timeout, $rootScope, patentPhasesService, $transitions) {

    var vm = this;

    vm.animate = false;
    vm.pageTitle = 'Dashboard';
    vm.date = new Date().getTime();

    $timeout(function(){
      vm.dashboardLoaded = true;
    }, 300);

    function init() {

        if(patentIds.length > 0) {
            if(patentPhasesService.getPatents === '' || patentPhasesService.patentNumbers.Total !== patentIds.length) { //check if any patents have been addded. Otherwise there is no need to execute code
                setPatents();
            } 
        } else {
            patentPhasesService.sortPatentNumbers(null)
            patentPhasesService.setPatents(null); //no patents avaialble
        }
        
    }

    init();

	function setPatents() {
		patentPhasesService.sortPatentNumbers(patentIds)
        $timeout(function(){
            vm.animate = true;
        }, 300)
	}

    if(patentIds.length > 0) {
        $scope.$emit('phaseChange', {phase: 'green'});
    }

    $scope.$on('phaseChange', function(e, o){
        $scope.$broadcast('updatePhase', {phase: o.phase});
    })

    $scope.$on('updatePatent', function(e, o){
        $scope.$broadcast('updateCost');
    })    

}
