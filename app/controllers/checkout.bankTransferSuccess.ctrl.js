angular.module('ppApp').controller('bankTransferSuccessCtrl', bankTransferSuccessCtrl);

bankTransferSuccessCtrl.$inject = ['$scope', '$rootScope', '$stateParams']

function bankTransferSuccessCtrl($scope, $rootScope, $stateParams) {

	$rootScope.page = 'Bank Transfer Details';

	$scope.orderObj = $stateParams.orderObj;	

}
