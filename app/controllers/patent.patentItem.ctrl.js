angular.module('ppApp').controller('patentItemCtrl', patentItemCtrl);

patentItemCtrl.$inject = ['$rootScope', '$scope']

function patentItemCtrl($rootScope, $scope) {

	var vm = this;
	
	console.log('hello')

	vm.activePatentItemMenu = 'Patent Info';
	vm.loadChart = loadChart;

	$scope.$on('renewalHistory', function() {		
		vm.activePatentItemMenu = 'Renewal History';
		vm.activeSelectedTab = 2;
	});	

	function loadChart() { //required to load chart in costanalysis
		$rootScope.$broadcast('loadChart')
	}
	
}