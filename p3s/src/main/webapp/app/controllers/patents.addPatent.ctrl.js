angular.module('ppApp').controller('addPatentCtrl', addPatentCtrl);

addPatentCtrl.$inject = ['$state', '$stateParams', '$scope', '$rootScope', '$timeout', '$location', '$anchorScroll', 'searchPatentService', 'chunkDataService', 'patentsRestService', '$uibModal'];

function addPatentCtrl($state, $stateParams, $scope, $rootScope, $timeout, $location, $anchorScroll, searchPatentService, chunkDataService, patentsRestService, $uibModal) {

	var vm = this;

	var patentFromJson = angular.fromJson($stateParams.patent);
	vm.queriedPatent = patentFromJson.data;
	vm.displayNotifications = displayNotifications;
	vm.openCancelSearchModal = openCancelSearchModal;
	vm.openConfirmModal = openConfirmModal;
	vm.displayNotifications = displayNotifications;
	vm.patentNotifications = {
		green: 'Green',
		amber: 'Amber',
		red: 'Red',
		blue: 'Blue',
		black: 'Black'
	}

	displayNotifications(vm.patentNotifications.green)	

	function displayNotifications(phase) {
    	$timeout(function() {
			vm.chunkedData = chunkDataService.chunkData(phaseNotifications(phase), 8);
			vm.colourPhase = phase;
		}, 10)
	}

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


  	function openCancelSearchModal() {

		var modalInstance = $uibModal.open({
			templateUrl: 'app/templates/modal.cancel-search.tpl.htm',
			scope: $scope,
			appendTo: undefined,
			controller: ['$uibModalInstance', '$scope', function($uibModalInstance ,$scope) {

				$scope.cancelAdd = function() {
					$state.go('search-patent', {}, {reload: true});
				}

				$scope.cancel = function() {
					$uibModalInstance.close();
				}

			}]
		})

  	}

	function openConfirmModal(patent) {

		var modalInstance = $uibModal.open({
			templateUrl: 'app/templates/modal.confirm-found-patent.tpl.htm',
			scope: $scope,
			appendTo: undefined,
			controller: ['$uibModalInstance', '$scope', '$location', '$anchorScroll', function($uibModalInstance, $scope, $location, $anchorScroll) {

			  	$scope.addPatent = function () {
			 		$timeout(function(){
						patentsRestService.savePatent(patent)
			            .then(
			            	function(response){
	        			 		var patent = response[0];
				             	$state.go('patents.patent', {patentId: patent.id}, {reload: true})
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

			}]
		})
	}
}