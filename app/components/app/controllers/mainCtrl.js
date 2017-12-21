app.controller('coreCtrl', ['$uibModal', '$scope', function($uibModal, $scope){

	var vm = this;

	console.log('hello')

	vm.open = function() {

		console.log('open')

		var modalInstance = $uibModal.open({
			templateUrl: '../views/modalTemplate.html',
			appendTo: undefined,
			controller: function($uibModalInstance ,$scope){

			  	vm.ok = function () {
			    	$uibModalInstance.close();
			  	};

			  	vm.cancel = function () {
					$uibModalInstance.dismiss('cancel');
			  	};
			}
		})

	    modalInstance.result.then(function() {
	      //resolved
	    }, function() {
	      //rejected
	    })
	}

}])

