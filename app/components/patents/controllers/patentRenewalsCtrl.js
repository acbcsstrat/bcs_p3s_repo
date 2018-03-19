function patentRenewalsCtrl(patent, renewal) {

	var vm = this;

	vm.renewal = renewal;

	vm.patent = patent;
	
}

app.controller('patentRenewalsCtrl', patentRenewalsCtrl);