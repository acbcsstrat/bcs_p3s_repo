angular.module('ppApp').controller('grantCtrl', grantCtrl);

grantCtrl.$inject = ['patent', '$scope', '$rootScope', '$uibModal', 'grantService', '$state', '$timeout'];

function grantCtrl(patent, $scope, $rootScope, $uibModal, grantService, $state, $timeout) {

	var vm = this;

	vm.patent = patent;
    // vm.grantNotSuitable = grantNotSuitable;
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

		if(patent.P3SserviceWithFees[0].serviceStatus == 'Grant available') {
			vm.grantStage = 1;
    		vm.grantTemplate = vm.templates[0].url;        
    	}

		if(patent.P3SserviceWithFees[0].serviceStatus == 'Grant saved') {
			vm.grantStage = 2;
    		vm.grantTemplate = vm.templates[2].url;        
    	}    	
    }

    init()

    $rootScope.$on('submitGrantData', function(e, data){

        var formData = new FormData();
        var notifyWhenValidationAvailable = (function(){
            data.data.optInValidation = data.data.optInValidation.no === true ? false : true;
        }())
        formData.append('patent_ID', patent.id);
        formData.append('totalClaims', parseInt(data.data.totalClaims));
        formData.append('ofWhichClaimsUnpaid', parseInt(data.data.totalAdditionalClaims));
        formData.append('totalPages', parseInt(data.data.totalPages));
        formData.append('ofWhichPagesUnpaid', parseInt(data.data.totalAdditionalPages));
        formData.append('notifyWhenValidationAvailable', notifyWhenValidationAvailable);
        formData.append('frenchTranslation', data.data.translations.frenchTranslation);
        formData.append('germanTranslation', data.data.translations.germanTranslation);

        grantService.submitGrant(formData)
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
            title: 'representative',
            template: 'representative',
            displayHelp: false,
            checkError: function(value) {
                if(value === true) {
                    this.showError = true;
                    grantNotSuitableRepresentative()
                    return
                }
                this.showError = false;
            },
            showError: false,
            valid: false,
            required: true
        },
        { 
            title: 'approve',
            template: 'approvetext',
            displayHelp: false,
            checkError: function(value) {
                if(value === true) {
                    this.showError = true;
                    grantNotSuitableApprove()
                    return
                }
                this.showError = false;
            },
            showError: false,
            valid: false,
            required: true
        },
        { 
            title: 'translations',
            template: 'translations',
            displayHelp: false,
            showError: false,
            valid: false,
            required: true,
            fileUpload: true
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

	function grantNotSuitableRepresentative() {

		vm.cannotProceed = true;
        var modalInstance = $uibModal.open({
            templateUrl: 'app/templates/modals/modal.confirm-grant-not-suitable-representative.tpl.htm',
            appendTo: undefined,
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                this.dismissModal = function() {
                    $uibModalInstance.close();
                };

            }]
        });
		
	}

    function grantNotSuitableApprove() {

        vm.cannotProceed = true;
        var modalInstance = $uibModal.open({
            templateUrl: 'app/templates/modals/modal.confirm-grant-not-suitable-approve.tpl.htm',
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