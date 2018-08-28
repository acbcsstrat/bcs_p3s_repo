angular.module('ppApp').controller('patentInfoCtrl', patentInfoCtrl);

patentInfoCtrl.$inject = ['$scope', 'patent', '$rootScope', '$state', '$timeout', '$location', '$anchorScroll', 'fxCalculationService', 'currentTransactionsService', 'patentsRestService', 'chunkDataService', '$uibModal', 'coreService']

function patentInfoCtrl($scope, patent, $rootScope, $state, $timeout, $location, $anchorScroll, fxCalculationService, currentTransactionsService, patentsRestService, chunkDataService, $uibModal, coreService) {

	var vm = this;

	vm.patent = patent;
	vm.fetchItemRenewal = fetchItemRenewal;
	vm.fetchItemTransaction = fetchItemTransaction;
	vm.openUpdateConfirmModal = openUpdateConfirmModal;
	vm.openDeleteConfirmModal = openDeleteConfirmModal;
	vm.deletePatent = deletePatent;
    vm.updatePatent = updatePatent;
    vm.editItem = editItem;
    vm.doneEditing = doneEditing;
    vm.editing=[];

    vm.$onInit = function() {
        if(patent) {
            fxCalculationService.setFx(patent);
            vm.patentFx = fxCalculationService;

            coreService.ppContact()
            .then(
                function(response){
                    vm.partnerName = response.partnerName;
                    vm.partnerPhone = response.partnerPhone;
                },
                function(errResponse){

                }
            )
        }
    }

	function fetchItemRenewal() {
		$rootScope.$broadcast("renewalHistory"); //REVISE TO SEE IF MORE EFFICIENT WAY
	};

	function fetchItemTransaction(id) {
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

	function openUpdateConfirmModal(id) {

		var modalInstance = $uibModal.open({
			templateUrl: 'app/templates/modals/modal.update-patent.tpl.htm',
			appendTo: undefined,
			scope: $scope,
			controller: ['$uibModalInstance', '$scope', '$timeout', function($uibModalInstance, $scope, $timeout){
                
			  	$scope.dismissModal = function () {
			    	$uibModalInstance.close();
			  	};

			  	$timeout(function(){
			  		vm.updatePatent(id); //migrate to renewalsCtrl when API provided
			  	})

			}]

		});

	};

	function openDeleteConfirmModal(id) {

		var modalInstance = $uibModal.open({
			templateUrl: 'app/templates/modals/modal.remove-patent.tpl.htm',
			appendTo: undefined,
			scope: $scope,
			controller: ['$uibModalInstance', '$scope', '$timeout', function($uibModalInstance, $scope, $timout){

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

			}]
		});
	};

 	function deletePatent(id){

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
						templateUrl: 'app/templates/modals/modal.delete-patent-error.tpl.htm',
						appendTo: undefined,
						scope: $scope,
						controller: ['$uibModalInstance', '$scope', function($uibModalInstance ,$scope) {

							vm.updatePatent(id);

						  	$scope.dismissModal = function () {
						    	$uibModalInstance.close();
						  	};
						}]
					});
            	}
            }
        );
    };

    function updatePatent(patent) {
    	var id = patent.id;
    	patentsRestService.updatePatent(patent, id);
    };

    function editItem(index) {
        vm.editing[index] = true;
    };

    function doneEditing(index) {
        vm.editing[index] = false;
    };
	
}