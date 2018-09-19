angular.module('ppApp').controller('patentItemCtrl', patentItemCtrl);

patentItemCtrl.$inject = ['$rootScope', '$scope', '$state']

function patentItemCtrl($rootScope, $scope, $state) {

	var vm = this;

	vm.activePatentItemMenu = 'Patent Info';
	vm.loadChart = loadChart;

	vm.$onInit = function() {
		$state.go('portfolio.patent.patent-info', {}, {reload: false})
	}

	$scope.$on('renewalHistory', function() {		
		vm.activePatentItemMenu = 'Renewal History';
		vm.activeSelectedTab = 2;
	});	

	function loadChart() { //required to load chart in costanalysis
		$rootScope.$broadcast('loadChart')
	}
	
}