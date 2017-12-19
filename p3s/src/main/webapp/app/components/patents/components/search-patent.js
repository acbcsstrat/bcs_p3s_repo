app.component('searchpatent', {
	templateUrl: 'p3sweb/app/components/patents/views/search-patent.htm',
	controller: ['searchPatentService', '$state', '$stateParams', '$rootScope', 'patentsRestService', '$timeout', '$uibModal', '$scope', '$anchorScroll', function(searchPatentService, $state, $stateParams, $rootScope, patentsRestService, $timeout, $uibModal, $scope, $anchorScroll) {

		var vm = this;
	 	vm.queriedPatent = {};

	 	$rootScope.page = 'Add Patent';

		vm.patentNotifications = {
			green: 'Green',
			amber: 'Amber',
			red: 'Red',
			blue: 'Blue',
			black: 'Black'
		}

		vm.colourKey = function(colour) {
			switch(colour) {
				case 0:
					vm.colourPhaseTitle = {
						title: 'Green',
						color: '#53ab58'
					}
				break;
				case 1:
					vm.colourPhaseTitle = {
						title: 'Amber',
						color: '#f9b233'						
					}
				break;
				case 2:
					vm.colourPhaseTitle = {
						title: 'Red',
						color: '#e30613'
					}
				break;
				case 3:
					vm.colourPhaseTitle = {
						title: 'Blue',
						color: '#0097ce'					
					}
				break;
				case 4:
					vm.colourPhaseTitle = {
						title: 'Black',
						color: '#3c3c3b'
					}
			}
		}

		vm.returnedAppNo = '';

		vm.openConfirmModal = function(patent) {

			var modalInstance = $uibModal.open({
				templateUrl: 'p3sweb/app/components/patents/views/modals/modal-confirm-found-patent.htm',
				scope: $scope,
				appendTo: undefined,
				controller: function($uibModalInstance ,$scope) {
				  	$scope.addPatent = function () {
				 		$timeout(function(){
							patentsRestService.savePatent(patent)
					            .then(
					            	function(response){
			        			 		var patent = response[0];
						             	$state.go('patents.patent', {patentId: patent.id}, {reload: false});
										$timeout(function() {
										  $anchorScroll('patentItemAnchor')
										  console.log('say what')
										}, 200);
					             	},
						            function(errResponse){
						                console.error('Error while saving Patent');
						            }
				    		)
				 		}, 300);
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

		    modalInstance.result.then(function() {
	     		console.log('good')
		    }, function() {
		       console.log('bad')
		    })
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
		  
        	var newArr = [];

        	function chunk(arr, size) {
        		for (i=0; i < arr.length; i+=size) {
	        		newArr.push(arr.slice(i, i+size));
	        	}
	        	return newArr;
        	}  	
        	
        	$timeout(function() {
    			vm.chunkedData = chunk(phaseNotifications(phase), 5);
    			vm.colourPhase = phase;
    		}, 100)
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
					}
				},
				function(errResponse) {
					console.log(errResponse)
					vm.queriedPatent = null;
					switch(errResponse.status) {
						case 400:
							vm.searchError = 'We’ve not been able to find that patent in the European Patent Register.  Please enter an application number such as 18 123456.2';
						break;
						case 404:
							vm.searchError = 'We’ve not been able to find Patent Application '+patentNo+' in the European Patent Register.  Please check the number you’re entering and try again.  ';
						break;
						case 204:
							vm.searchError = 'It looks like we’ve already added Patent Application '+patentNo+' in to the system.  You should be able to find it in the List Patents page using the search boxes.';
					}
				}
			);
        }
	}
]})
.directive('validatePatent', function(){

	return {

		require: 'ngModel',
		link: function(scope, elem, attr, ctrl) {

			var regExp = /^[a-zA-Z0-9.\s]*$/

			function checkValidation(value) {

				if(regExp.test(value)) {
					ctrl.$setValidity('validPatent', true) 
				} else {
					ctrl.$setValidity('validPatent', false) 
				}
				return value
			}
			ctrl.$parsers.push(checkValidation)
		}

	}
})




