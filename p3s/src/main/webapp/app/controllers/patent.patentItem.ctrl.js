angular.module('ppApp').controller('patentItemCtrl', patentItemCtrl);

patentItemCtrl.$inject = ['patent', '$rootScope', '$scope', '$state', '$stateParams']

function patentItemCtrl(patent, $rootScope, $scope, $state, $stateParams) {

	var vm = this;

	vm.activePatentItemMenu = 'Patent Info';
	vm.loading = true;
	vm.serviceAvailable = serviceAvailable;

	function serviceAvailable(item) {
		for(var i = 0; i < patent.portfolioUI.serviceList.length; i++) {
			if(patent.portfolioUI.serviceList[i].serviceType == item) { return false; }
			break;
		}
		return true;
	}

	angular.element(function () {
		vm.loading = false;
	    vm.patentLoaded = true;
	    $state.go('portfolio.patent.patent-info', {}, {reload: false})
	});	

}