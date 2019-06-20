angular.module('ppApp').controller('coreCtrl', coreCtrl);

coreCtrl.$inject = ['$uibModal', '$scope', 'coreService', 'localStorageService', '$timeout', 'patentsRestService', 'Idle', 'Keepalive', '$http', 'ngCart', 'coreService', 'organiseColourService'];

function coreCtrl($uibModal, $scope, coreService, localStorageService, $timeout, patentsRestService, Idle, Keepalive, $http, ngCart, coreService, organiseColourService) {

	var vm = this;

	var urgentResponse = [];
	var systemResponse = [];
	var patentsFound = true;
	var userTimedOut = false;
	var messageArr = [];

	$scope.$on('IdleStart', function() {
		
	  	closeModals();

	  	$scope.warning = $uibModal.open({
		  	templateUrl: 'app/templates/modals/modal.idle.tpl.htm',
	  		windowClass: 'modal-danger',
			appendTo: undefined
	    });
	});

  	$scope.$on('IdleEnd', function() {
	  	closeModals();
	});

	$scope.$on('IdleTimeout', function() {

	  	closeModals();

     	ngCart.empty();
    	$http.post('http://localhost:8080/p3sweb/resources/j_spring_security_logout')
      	.then(
      		function(response){
      		  	window.location.reload('http://localhost:8080/p3sweb/login');
      		},
          	function(errResponse) {
            	console.log(errResponse)
          	}    
		)    	
      	
	});

  	$scope.$on('appGuideOpen', function(){
		var modalInstance = $uibModal.open({
			templateUrl: 'app/templates/app/app.in-app-guide.tpl.htm',
			windowClass: 'app-guide-panel',
			controllerAs:'$ctrl',
			controller: ['$uibModalInstance', function($uibModalInstance) {

			    this.slides = [
			        {index: 0, title: 'Color Phase'},
			        {index: 1, title: 'Portfolio'},
			        {index: 2, title: 'Case overview'},
			        {index: 3, title: 'Add Patent'},
			        {index: 4, title: 'Form 1200'}

			    ]

			    this.slides2 = [
			        {index: 4, title: 'Form 1200'},
			        {index: 5, title: 'Fees'},
			        {index: 6, title: 'Checkout'},
			        {index: 7, title: 'Transactions'},
			        {index: 8, title: 'Nav'}
			    ]				    

		 	  	this.dismissWelcomeModal = function () {
			    	$uibModalInstance.close();
			  	};

			}]
		});
  	})

    function init() {

        patentsRestService.fetchAllPatents()
        .then(
            function(response){
                if(response.length === 0) {
                    patentsFound = false;
                }
			    if(patentsFound === false) {
					$timeout(function() {
					 	
					 	welcomeMessageModal();
						
					}, 350);
				}                

            },
            function(errResponse){
                console.log(errResponse)
            }
        )

    }

    init();

	function welcomeMessageModal() {
		var modalInstance = $uibModal.open({
			templateUrl: 'app/templates/modals/modal.welcome-message.tpl.htm',
			scope: $scope,
			controllerAs:'$ctrl',
			controller: ['$uibModalInstance', function($uibModalInstance) {

		 	  	this.dismissWelcomeModal = function () {
			    	$uibModalInstance.close();
			  	};
			}]
		});
 	}

	// function displayMessages() {

	// 	var counter = localStorageService.get('counter');

	// 	if(counter === null) {

	// 		localStorageService.set('counter', 1);

	// 		counter = localStorageService.get('counter');

	// 		coreService.getMessages()
	// 	    .then(
	// 	    	function(response){

	// 	    		var date = new Date().getTime();

	//     		 	if(response.systemMessages.length > 0) {

	// 		            $timeout(function() {
	// 		                systemMessageModal(response.systemMessages)    
	// 		            }, 1000);

	// 		        } //if end

	// 				if(response.urgentPatents.length > 0) {
	// 	    			response.urgentPatents.forEach(function(data){
	// 	    				urgentResponse.push(data);
	// 	    			});

	// 					$timeout(function() {
	// 						urgentPatentModal(response);
	// 					}, 500);
	// 				}


	// 	    	},
	// 	    	function(errResponse){
	// 	    		console.log(errResponse);
	// 	    	}
	// 		);
	// 	    if(patentsFound === false) {
	// 			$timeout(function() {
				 	
	// 			 	welcomeMessageModal();
					
	// 			}, 350);
	// 		}

	// 	} //if end

	// }

	// displayMessages();
	
	function closeModals() {
	    if ($scope.warning) {
	      $scope.warning.close();
	      $scope.warning = null;
	    }

	    if ($scope.timedout) {
	      $scope.timedout.close();
	      $scope.timedout = null;
	    }
	}

    function systemMessageModal(message) {

        var modalInstance = $uibModal.open({
            templateUrl: 'app/templates/modals/modal.system-message.tpl.htm',
            scope: $scope,
            appendTo: undefined,
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', function($uibModalInstance) {




                this.systemMessage = {
                	message:  message
                }

                this.systemOk = function () {
                    $uibModalInstance.close();
                };

				this.checkedMessages = function(id, checked) {

					if(checked) {
						messageArr.push(id)
						$scope.message = true;
					} else {
						messageArr.splice(-1, 1)
					}

					if(messageArr.length == 0) {
						$scope.message = false;				
					}

				}

				this.supresssMessages = function() {
					coreService.supressMessages(messageArr)
				} 	                

            }],
            resolve: {
                message: function() {
                    return systemResponse;
                }
            }
        });

    }; //function end

	function urgentPatentModal(response) {

		var modalInstance = $uibModal.open({
			templateUrl: 'app/templates/modals/modal.urgent-message.tpl.htm',
			scope: $scope,
			appendTo: undefined,
			controllerAs: '$ctrl',
			controller: ['$uibModalInstance', 'message', function($uibModalInstance, message) {
				this.urgentPatents = message;
				this.urgentPatents.map(function(item, i){
					item.color = {}
					item.color.current = organiseColourService.getCurrColour(item.costBandColour, 'text')
					item.color.next = organiseColourService.getNextColour(item.costBandColour, 'text')
				})

		        coreService.ppContact()
		        .then(
		            function(response){
		                this.partnerName = response.partnerName;
		                this.partnerPhone = response.partnerPhone;
		            },
		            function(errResponse){
		            	console.log(errResponse)
		            }
		        )

		 	  	this.urgentOk = function () {
			    	$uibModalInstance.close();
			  	};

			  	this.urgentDismissModal = function() {
			  		$uibModalInstance.dismiss();
			  	};

			}],
			resolve: {
				message: function() {
					return urgentResponse;
				}
			}
		});
 	} //function urgentPatentModal

}