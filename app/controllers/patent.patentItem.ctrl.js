angular.module('ppApp').controller('patentItemCtrl', patentItemCtrl);

patentItemCtrl.$inject = ['$rootScope', '$scope', '$state']

function patentItemCtrl($rootScope, $scope, $state) {

	var vm = this;

	vm.activePatentItemMenu = 'Patent Info';
<<<<<<< HEAD
	vm.loadChart = loadChart;
=======
	// vm.loadChart = loadChart;
>>>>>>> origin/fe-branch-v2.2
	vm.loading = true;
	
	angular.element(function () {
		vm.loading = false;
	    vm.patentLoaded = true;
<<<<<<< HEAD
	});	

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
=======
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
>>>>>>> origin/fe-branch-v2.2
	
}