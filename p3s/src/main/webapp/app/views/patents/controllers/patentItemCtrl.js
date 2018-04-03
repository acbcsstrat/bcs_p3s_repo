angular.module('ppApp').controller('patentItemCtrl', patentItemCtrl);

patentItemCtrl.$inject = ['$scope']

function patentItemCtrl($scope) {

	var vm = this;
	
	vm.activePatentItemMenu = 'Patent Info';

	$scope.$on('renewalHistory', function() {		
		vm.activePatentItemMenu = 'Renewal History';
		vm.activeSelectedTab = 2;
	});	
	
}