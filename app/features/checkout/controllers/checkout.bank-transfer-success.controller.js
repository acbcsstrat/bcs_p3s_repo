BankTransferSuccessController.$inject = ['$scope', '$stateParams']

export default function BankTransferSuccessController($scope, $stateParams) {

	var vm = this;

	vm.pageTitle = 'Bank Transfer Details';

	$scope.orderObj = $stateParams.orderObj;	

}
