function patentRenewalsCtrl(patent, renewal) {

	var vm = this;

	vm.renewal = renewal;

	vm.patent = patent;
	
}

angular.module('ppApp').controller('patentRenewalsCtrl', patentRenewalsCtrl);