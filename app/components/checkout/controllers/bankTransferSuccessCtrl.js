function bankTransferSuccessCtrl($scope, $rootScope, $stateParams) {

	$rootScope.page = 'Bank Transfer Details';

	$scope.orderObj = $stateParams.orderObj;	

}

angular.module('ppApp').controller('bankTransferSuccessCtrl', bankTransferSuccessCtrl);