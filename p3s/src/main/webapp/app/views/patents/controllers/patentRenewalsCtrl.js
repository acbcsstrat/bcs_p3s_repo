angular.module('ppApp').controller('patentRenewalsCtrl', patentRenewalsCtrl);

patentRenewalsCtrl.$inject = ['patent', 'renewal']

function patentRenewalsCtrl(patent, renewal) {

	var vm = this;
	console.log(renewal)
	vm.renewal = renewal;
	vm.patent = patent;
	
}