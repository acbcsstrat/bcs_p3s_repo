function addPatentCtrl($state, $stateParams, $scope, $rootScope, $timeout, $location, $anchorScroll, searchPatentService, chunkDataService, patentsRestService, $uibModal) {

	var vm = this;

	var patentFromJson = angular.fromJson($stateParams.patent);
	vm.queriedPatent = patentFromJson.data;

	vm.patentNotifications = {
		green: 'Green',
		amber: 'Amber',
		red: 'Red',
		blue: 'Blue',
		black: 'Black'
	}	

	vm.displayNotifications = function(phase) {

		function phaseNotifications(phase) {

			var notificationsArr = vm.queriedPatent.notificationUIs;
	  		var notifications = [];

	  		notificationsArr.forEach(function(data){
	  			if(data.costbandcolor == phase) {
	  				notifications.push(data)
	  			}
	  		})

	  		return notifications;

	  	}

    	$timeout(function() {
			vm.chunkedData = chunkDataService.chunkData(phaseNotifications(phase), 4);
			vm.colourPhase = phase;
		}, 10)

	}

	vm.displayNotifications(vm.patentNotifications.green)	

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

	vm.openConfirmModal = function(patent) {

		var modalInstance = $uibModal.open({
			templateUrl: 'p3sweb/app/components/patents/views/modals/modal-confirm-found-patent.htm',
			scope: $scope,
			appendTo: undefined,
			controller: function($uibModalInstance, $scope, $location, $anchorScroll) {

			  	$scope.addPatent = function () {
			 		$timeout(function(){
						patentsRestService.savePatent(patent)
				            .then(
				            	function(response){
		        			 		var patent = response[0];
					             	$state.go('patents.patent', {patentId: patent.id})
					             	.then(
										function(response){
											$timeout(function() {
												$location.hash('patentAnchor');
											  	$anchorScroll();
											}, 300);
										},
										function(errResponse){
											console.log(errResponse)
										}
									);

				             	},
					            function(errResponse){
					                console.error('Error while saving Patent');
					            }
			    		)
			 		}, 100);

		  			$timeout(function() {
						$uibModalInstance.close()
		  			}, 100);
			  	};

				$scope.dismissModal = function () {
			    	$uibModalInstance.close();
			  	};

			  	$scope.cancelAdd = function() {
		  			$state.go('search-patent', {}, {reload: true});
			  		$uibModalInstance.dismiss('cancel');
			  	}

			}
		})

	}


}

app.controller('addPatentCtrl', addPatentCtrl);