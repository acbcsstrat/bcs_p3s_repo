function patentItemCtrl($scope, patent) {

	var vm = this;
	
	vm.activePatentItemMenu = 'Patent Info';

	$scope.$on('renewalHistory', function() {		
		vm.activePatentItemMenu = 'Renewal History';
		vm.activeSelectedTab = 2;
	});	
	
}

app.controller('patentItemCtrl', patentItemCtrl);