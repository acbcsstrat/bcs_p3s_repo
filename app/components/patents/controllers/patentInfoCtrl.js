function patentInfoCtrl($scope, patent, $rootScope, $state, $timeout, fxCalculationService, currentTransactionsService, patentsRestService, chunkDataService, $uibModal) {

	var vm = this;

	vm.patent = patent;

	if(patent) {

		vm.patentFx = fxCalculationService.setFx(patent);
		vm.patentFx = fxCalculationService;
	
		vm.displayNotifications = function(phase) {	

			function phaseNotifications(phase) {

		  		var notificationsArr = patent.notificationUIs;
		  		var notifications = [];
	  			
		  		notificationsArr.forEach(function(data){
		  			if(data.costbandcolor == phase) {
		  				notifications.push(data);
		  			}
		  		});

		  		return notifications;

	  		}

	    	vm.chunkedData = chunkDataService.chunkData(phaseNotifications(phase), 8);

		};

		$timeout(function() {
			vm.displayNotifications('Green');
		}, 100);	

	}

	vm.fetchItemRenewal = function() {
		$rootScope.$broadcast("renewalHistory"); //REVISE TO SEE IF MORE EFFICIENT WAY
	};

	vm.fetchItemTransaction = function(id) {
		currentTransactionsService.fetchCurrentTransactions()
		.then(
			function(response) {
				response.forEach(function(data) {
					const transId = data.id;
					data.renewalUIs.forEach(function(data, i) {
						if(data.patentUI.id == id) { //compare id submitted from view to all array items id
							$state.go('current-transactions.current-transaction-item',{transId: transId}) //if match, go current-transaction-item
							.then(
								function(response){
									$timeout(function() {
										$location.hash('currTransAnchor'); 
									  	$anchorScroll();  //scroll to anchor href
									}, 300);
								},
								function(errResponse){
									console.log(errResponse);
								}
							);
						}
					});
				});
			},
			function(errResponse) {
				console.log(errResponse);
			}
		);
	};

	vm.openUpdateConfirmModal = function(id) {

		var modalInstance = $uibModal.open({
			templateUrl: 'p3sweb/app/components/patents/views/modals/modal-update-patent-template.htm',
			appendTo: undefined,
			scope: $scope,
			controller: function($uibModalInstance, $scope, $timeout){

			  	$scope.dismissModal = function () {
			    	$uibModalInstance.close();
			  	};

			  	$timeout(function(){
			  		vm.updatePatent(id);
			  	})

			}

		});

	};

	vm.openDeleteConfirmModal = function(id) {

		var modalInstance = $uibModal.open({
			templateUrl: 'p3sweb/app/components/patents/views/modals/modal-remove-patent-template.htm',
			appendTo: undefined,
			scope: $scope,
			controller: function($uibModalInstance, $scope){

				$scope.dismissModal = function () {
			    	$uibModalInstance.close();
			  	};

			  	$scope.deletePatent = function () {
		  			vm.deletePatent(id);
		  			$timeout(function() {
						$uibModalInstance.close();
		  			}, 300);
			  	};

			  	$scope.cancelDeletion = function() {
			  		$uibModalInstance.dismiss('cancel');
			  	};

			}
		});
	};

 	vm.deletePatent = function(id){

        patentsRestService.deletePatent(id)
            .then(function(){
             	$state.go('patents', {}, {reload: true})
         		.then(function(){
             		$timeout(function(){patentsRestService.fetchAllPatents()}, 400);
             	});
             },
            function(errResponse){
            	if(errResponse.status === 304) {
					var modalInstance = $uibModal.open({
						templateUrl: 'p3sweb/app/components/patents/views/modals/modal-delete-patent-error.htm',
						appendTo: undefined,
						scope: $scope,
						controller: function($uibModalInstance ,$scope) {

							vm.updatePatent(id);

						  	$scope.dismissModal = function () {
						    	$uibModalInstance.close();
						  	};
						}
					});
            	}
            }
        );
    };

    vm.updatePatent = function(patent) {
    	var id = patent.id;
    	patentsRestService.updatePatent(patent, id);
    };

    vm.editing=[];

    vm.editItem = function (index) {
        vm.editing[index] = true;
    };

    vm.doneEditing = function (index) {
        vm.editing[index] = false;
    };
	
}

angular.module('ppApp').controller('patentInfoCtrl', patentInfoCtrl);