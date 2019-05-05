angular.module('ppApp').controller('addPatentCtrl', addPatentCtrl);

addPatentCtrl.$inject = ['$state', '$stateParams', '$rootScope', '$timeout', '$location', '$anchorScroll', 'searchPatentService', 'chunkDataService', 'patentsRestService', '$uibModal'];

function addPatentCtrl($state, $stateParams, $rootScope, $timeout, $location, $anchorScroll, searchPatentService, chunkDataService, patentsRestService, $uibModal) {

	var vm = this;

	vm.openCancelSearchModal = openCancelSearchModal;
	vm.openConfirmModal = openConfirmModal;
	vm.patent =  JSON.parse($stateParams.patent).data;

  	function openCancelSearchModal() {

		var modalInstance = $uibModal.open({
			templateUrl: 'app/templates/modals/modal.cancel-search.tpl.htm',
            appendTo: undefined,
            // scope: $scope, // asigns modal to the rootscope rathen than the modal scope
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
			 		$timeout(function(){
						patentsRestService.savePatent(patent)
			            .then(
			            	function(response){
	        			 		var patent = response[0];
				             	$state.go('portfolio.patent', {patentId: patent.id})
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
}