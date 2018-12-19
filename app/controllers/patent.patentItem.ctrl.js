angular.module('ppApp').controller('patentItemCtrl', patentItemCtrl);

patentItemCtrl.$inject = ['patent', '$rootScope', '$scope', '$state', '$stateParams', 'renewalRestService']

function patentItemCtrl(patent, $rootScope, $scope, $state, $stateParams, renewalRestService) {

	var vm = this;

	vm.activePatentItemMenu = 'Patent Info';
	vm.loading = true;
	vm.serviceAvailable = serviceAvailable;
	var foundHistory;

	function init() {	
		renewalRestService.fetchHistory(patent.id)
		.then(
			function(response){
				foundHistory = response.length === 0 ? false: true;
			},
			function(errResponse){
				console.log(errResponse)
			}
		)
	}

	init();
	
	function serviceAvailable(item) {
		for(var i = 0; i < patent.portfolioUI.serviceList.length; i++) {
			if(item == 'Renewal' && foundHistory === true) {
				return false;
			}
			if(patent.portfolioUI.serviceList[i].serviceType == item) { 
				return false; 
			}
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