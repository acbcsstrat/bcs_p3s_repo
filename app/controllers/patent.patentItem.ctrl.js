angular.module('ppApp').controller('patentItemCtrl', patentItemCtrl);

patentItemCtrl.$inject = ['$rootScope', '$scope', '$state']

function patentItemCtrl($rootScope, $scope, $state) {

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