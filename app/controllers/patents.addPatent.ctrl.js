angular.module('ppApp').controller('addPatentCtrl', addPatentCtrl);

addPatentCtrl.$inject = ['$state', '$stateParams', '$scope', '$timeout', '$location', '$anchorScroll', 'patentsRestService', '$uibModal'];

function addPatentCtrl($state, $stateParams, $scope, $timeout, $location, $anchorScroll, patentsRestService, $uibModal) {

	var vm = this;

	vm.openCancelSearchModal = openCancelSearchModal;
	vm.openConfirmModal = openConfirmModal;
	vm.patent =  JSON.parse($stateParams.patent).data;
	var toPatentTimeout;

  	function openCancelSearchModal() {

		var modalInstance = $uibModal.open({
			templateUrl: 'app/templates/modals/modal.cancel-search.tpl.htm',
            appendTo: undefined,
            controllerAs: '$ctrl',
			controller: ['$uibModalInstance', function($uibModalInstance) {

				this.cancelAdd = function() {
					$uibModalInstance.close();
					$state.go('search-patent', {}, {reload: true});
				}

				this.dismissModal = function() {
					$uibModalInstance.close();
				}

			}]
		})

  	}

	function openConfirmModal(patent) {

		var modalInstance = $uibModal.open({
			templateUrl: 'app/templates/modals/modal.confirm-found-patent.tpl.htm',
            appendTo: undefined,
            controllerAs: '$ctrl',
			controller: ['$uibModalInstance', '$location', '$anchorScroll', function($uibModalInstance, $location, $anchorScroll) {

			  	this.addPatent = function () {
			  		vm.addingPatent = true;
			  		$uibModalInstance.close();
					patentsRestService.savePatent(patent)
		            .then(
		            	function(response){

		                    var match = response.find(function(item){
		                        return item.ep_ApplicationNumber == patent.ep_ApplicationNumber;
		                    })

			             	$state.go('portfolio.patent', {patentId: match.id}) //BE NEEDS TO AMEND CALL 16.10.19 ASAP. UPDATE V2 TO V3
			             	.then(
								function(response){
									toPatentTimeout = $timeout(function() {
										$location.hash('patentAnchor');
									  	$anchorScroll();
									}, 300);
								}
							);

		             	},
			            function(errResponse){
			                console.error('Error while saving Patent');
			            }
		    		)

			  	};

				this.dismissModal = function () {
			    	$uibModalInstance.close();
			  	};

			  	this.cancelAdd = function() {
	  				$uibModalInstance.close();			  		
		  			$state.go('search-patent', {}, {reload: true});

			  	}

			}]
		})
	}

	$scope.$on('$destroy', function(){
		$timeout.cancel(toPatentTimeout)
	})
}