function addPatentCtrl($state, $scope, $rootScope, searchPatentService) {

	var vm = this;

	$rootScope.page = 'Add Patent';
	
  	vm.openCancelSearchModal = function() {

		var modalInstance = $uibModal.open({
			templateUrl: 'p3sweb/app/components/patents/views/modals/modal-cancel-search.htm',
			scope: $scope,
			appendTo: undefined,
			controller: function($uibModalInstance ,$scope) {

				$scope.cancelAdd = function() {
					$state.go('search-patent', {}, {reload: true});
				}

				$scope.cancel = function() {
					$uibModalInstance.close();
				}

			}
		})

  	}

	vm.findPatent = function(patentNo) {
		searchPatentService.findPatent(patentNo)
		.then(
			function(response) {
				console.log(response)
				if(response.status == 204 || response.data == '') {
					vm.queriedPatent = null;
					vm.searchError = 'It looks like we’ve already added Patent Application '+patentNo+' in to the system.  You should be able to find it in the List Patents page using the search boxes.';
				} else {
					vm.queriedPatent = response.data;
					vm.returnedAppNo = response.data.patentApplicationNumber;
					vm.displayNotifications(vm.patentNotifications.green)
					$state.go('search-patent.add-patent', {applicationNo: patentNo}, {reload: false});
				}
			},
			function(errResponse) {
				vm.queriedPatent = null;
				switch(errResponse.status) {
					case 400:
						vm.searchError = 'We’ve not been able to find that patent in the European Patent Register.  Please enter an application number such as 18 123456.2';
					break;
					case 404:
						vm.searchError = 'We’ve not been able to find Patent Application '+patentNo+' in the European Patent Register.  Please check the number you’re entering and try again.';
					break;
					case 204:
						vm.searchError = 'It looks like we’ve already added Patent Application '+patentNo+' in to the system.  You should be able to find it in the List Patents page using the search boxes.';
				}
			}
		);
    }  	

}

app.controller('addPatentCtrl', addPatentCtrl);