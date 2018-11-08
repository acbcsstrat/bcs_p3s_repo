angular.module('ppApp').controller('patentItemCtrl', patentItemCtrl);

patentItemCtrl.$inject = ['patent', '$rootScope', '$scope', '$state', '$stateParams']

function patentItemCtrl(patent, $rootScope, $scope, $state, $stateParams) {

	var vm = this;

	vm.activePatentItemMenu = 'Patent Info';
	// vm.loadChart = loadChart;
	vm.loading = true;
	
	angular.element(function () {
		vm.loading = false;
	    vm.patentLoaded = true;
	    $state.go('portfolio.patent.patent-info', {}, {reload: false})
	});	

	// vm.$onInit = function() {
		
	// 	console.log('should do')
	// }

	// $scope.$on('renewalHistory', function() {		
	// 	vm.activePatentItemMenu = 'Renewal History';
	// 	vm.activeSelectedTab = 2;
	// });	

	// function loadChart() { //required to load chart in costanalysis
	// 	$rootScope.$broadcast('loadChart')
	// }

	
}