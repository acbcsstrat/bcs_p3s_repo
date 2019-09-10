angular.module('ppApp').controller('grantCtrl', grantCtrl);

grantCtrl.$inject = ['patent', '$scope', '$rootScope', '$uibModal', 'grantService', '$state', '$timeout'];

function grantCtrl(patent, $scope, $rootScope, $uibModal, grantService, $state, $timeout) {

	var vm = this;

	vm.patent = patent;
	vm.grantNotSuitable = grantNotSuitable;
	vm.initiateGrantOrder = initiateGrantOrder;
    vm.templates = [
        { name: 'grantintro.html', url: 'app/templates/grant/grant.intro.tpl.htm'},
        { name: 'grantquestions.html', url: 'app/templates/grant/grant.questionnaire.tpl.htm'},
        { name: 'grantgenerated.html', url: 'app/templates/grant/grant.ready.tpl.htm'}
    ];
    vm.highestPoint = 0;
    vm.prepareAction = prepareAction;

    function init() {
  
    	vm.activeTab = 0;

		if(patent.serviceList[0].serviceStatus == 'Grant available') {
			vm.grantStage = 1;
    		vm.grantTemplate = vm.templates[0].url;        
    	}

		if(patent.serviceList[0].serviceStatus == 'Grant saved') {
			vm.grantStage = 2;
    		vm.grantTemplate = vm.templates[2].url;        
    	}    	
    }

    init()

    $rootScope.$on('submitGrantData', function(e, formData){

        formData.data.totalClaims = parseInt(formData.data.totalClaims);
        formData.data.totalAdditionalClaims = parseInt(formData.data.totalAdditionalClaims);
        formData.data.totalPages = parseInt(formData.data.totalPages);
        formData.data.totalAdditionalPages = parseInt(formData.data.totalAdditionalPages);

        if(formData.data.optInValidation.no === true) {
            formData.data.optInValidation = formData.data.optInValidation.no === true ? false : true;
        }

        grantService.submitGrant(formData.data)
        .then(
            function(response){
                activeTabService.setTab(2)
                $state.go('portfolio.patent', {}, {reload: true});
            },
            function(errResponse){
                form1200Errors() 
            }
        )

    })


	var grantQuestions = [

        { 
            title: 'approve',
            template: 'approvetext',
            displayHelp: false,
            checkError: function(value) {
                if(value === true) {
                    this.showError = true;
                    grantNotSuitable()
                    return
                }
                this.showError = false;
            },
            showError: false,
            valid: false,
            required: true
        },
        { 
            title: 'totalclaims',
            template: 'totalclaims',
            displayHelp: false,
            showError: false,
            valid: false,
            questionEnabled: false,
            required: true

        },
        { 
            title: 'additionalclaims',
            template: 'additionalclaims',
            displayHelp: false,
            showError: false,
            valid: false,
            questionEnabled: false,
            required: true
        },
        { 
            title: 'totalpages',
            template: 'totalpages',
            displayHelp: false,
            showError: false,
            valid: false,
            questionEnabled: false,
            required: true
        },
        { 
            title: 'additionalpages',
            template: 'additionalpages',
            displayHelp: false,
            showError: false,
            valid: false,
            questionEnabled: false,
            required: true
        },
        { 
            title: 'optInValidations',
            template: 'optforvalidations',
            displayHelp: false,
            showError: false,
            valid: false,
            questionEnabled: false,
            required: true
        }           
	];

	function initiateGrantOrder() {
		grantService.setQuestions(grantQuestions);
    	vm.grantTemplate = vm.templates[1].url;
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

	function grantNotSuitable() {

		vm.cannotProceed = true;
        var modalInstance = $uibModal.open({
            templateUrl: 'app/templates/modals/modal.confirm-grant-not-suitable.tpl.htm',
            appendTo: undefined,
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                this.dismissModal = function() {
                    $uibModalInstance.close();
                };

            }]
        });
		
	}
}