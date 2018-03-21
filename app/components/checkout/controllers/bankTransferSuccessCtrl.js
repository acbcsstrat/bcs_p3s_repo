function bankTransferSuccessCtrl($scope, $rootScope, $stateParams) {

	$rootScope.page = 'Bank Transfer Details';

	$scope.orderObj = $stateParams.orderObj;	

}

app.controller('bankTransferSuccessCtrl', bankTransferSuccessCtrl);