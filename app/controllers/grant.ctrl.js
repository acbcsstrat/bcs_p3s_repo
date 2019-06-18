angular.module('ppApp').controller('grantCtrl', grantCtrl);

grantCtrl.$inject = ['patent', '$scope', '$uibModal', 'grantService', '$state', '$timeout'];

function grantCtrl(patent, $scope, $uibModal, grantService, $state, $timeout) {

	var vm = this;

	vm.patent = patent;
	vm.grantNotSuitable = grantNotSuitable;
	vm.initiateGrantOrder = initiateGrantOrder;
	vm.current = '';
    vm.templates = [
        { name: 'grantintro.html', url: 'app/templates/grant/grant.intro.tpl.htm'},
        { name: 'grantquestions.html', url: 'app/templates/grant/grant.questionnaire.tpl.htm'},
        { name: 'grantgenerated.html', url: 'app/templates/grant/grant.ready.tpl.htm'}
    ];
    vm.highestPoint = 0;
    vm.prepareAction = prepareAction;

    vm.next = function() {
    	var i = vm.getIndex(vm.current.index, 1);
    	vm.current = vm.questions[i];
    	if(vm.current.index >= vm.highestPoint) {
    		vm.highestPoint = vm.current.index;
    	}
    }

    vm.previous = function() {

    	var i = vm.getIndex(vm.current.index, -1);
    	vm.current = vm.questions[i];

    }

    vm.getIndex = function(currentIndex, shift) {
    	var len = vm.questions.length;
    	return (((currentIndex + shift) + len) % len)
    }

    vm.setNavIndex = function(navIndex) {

    	if(navIndex < vm.current.index) {
    		vm.previous();
    	}

    	if(navIndex > vm.current.index) {
    		vm.next();
    	}

    }

    function init() {
  
    	vm.activeTab = 0;

		if(patent.serviceList.serviceStatus == 'Grant available') {
			vm.grantStage = 1;
    		vm.grantTemplate = vm.templates[0].url;        
    	}

		if(patent.serviceList.serviceStatus == 'Grant saved') {
			vm.grantStage = 2;
    		vm.grantTemplate = vm.templates[2].url;        
    	}    	
    }

    init()

	function initiateGrantOrder() {

        grantService.fetchQuestions()
        .then(
            function(response){
            	vm.questions = response;
  				vm.current = response[0];
            	vm.grantTemplate = vm.templates[1].url;  
            }
        )
	}

	function prepareAction() {

		grantService.prepareOrder()
		.then(
			function(response){

		        var modalInstance = $uibModal.open({
		            templateUrl: 'app/templates/modals/modal.prepare-grant-order.tpl.htm',
		            appendTo: undefined,
		            controllerAs: '$ctrl',
		            controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

		                this.dismissModal = function() {
		                    $uibModalInstance.close();
		                };

		                $timeout(function(){
		                	$state.go('portfolio.patent', {grantOrder: 1}, {reload: true})
		                }, 300)

		            }]
		        });
			}
		)	

	}

	function confirmNotifyValidation(checked) {

		grantService.optForNotification()
		.then(
			function(response){
				vm.hideOptIn = true;
		        var modalInstance = $uibModal.open({
		            templateUrl: 'app/templates/modals/modal.validaiton-notify-success.tpl.htm',
		            appendTo: undefined,
		            controllerAs: '$ctrl',
		            controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

		                this.dismissModal = function() {
		                    $uibModalInstance.close();
		                };

		                $timeout(function(){
		                	$state.go('.', {}, {reload: true})
		                }, 300)

		            }]
		        });
			}
		)

	}

	function grantNotSuitable(question, value, manual) {

		if(manual === 'no' || manual === 'yes' && !value) {
			vm.cannotProceed = false;
		}

		var msg = {};

		if(value &&  manual === 'yes' && question.category !== 'notifyValidation') {
			vm.cannotProceed = true;
	        var modalInstance = $uibModal.open({
	            templateUrl: 'app/templates/modals/modal.confirm-grant-not-suitable.tpl.htm',
	            appendTo: undefined,
	            controllerAs: '$ctrl',
	            controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

	            	this.reasonObj = msg;

	                this.dismissModal = function() {
	                    $uibModalInstance.close();
	                };

	            }]
	        });
		}


	}


}