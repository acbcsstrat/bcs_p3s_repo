angular.module('ppApp').controller('dashboardCtrl', dashboardCtrl);

dashboardCtrl.$inject = ['$scope','$state', 'patentIds', '$timeout', '$rootScope', 'patentPhasesService'];

function dashboardCtrl ($scope, $state, patentIds, $timeout, $rootScope, patentPhasesService) {

    var vm = this;

   	setPatents();
    
    vm.animate = false;
    vm.pageTitle = 'Dashboard';
    vm.date = new Date().getTime();

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
