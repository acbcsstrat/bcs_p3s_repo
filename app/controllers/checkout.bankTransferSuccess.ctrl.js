angular.module('ppApp').controller('bankTransferSuccessCtrl', bankTransferSuccessCtrl);

bankTransferSuccessCtrl.$inject = ['$scope', '$rootScope', '$stateParams']

function bankTransferSuccessCtrl($scope, $rootScope, $stateParams) {

	var vm = this;

	vm.pageTitle = 'Bank Transfer Details';

	$scope.orderObj = $stateParams.orderObj;	

}
