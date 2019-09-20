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
    vm.uninhibitGrantConfirm = uninhibitGrantConfirm;

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
                var obj = {}
                obj.title = 'Representative'
                ob.message = 'If you confirm that you do not wish IP Place to act as representative The Patent Place can only offer help with your application offline\
                    via a Patent Administrator, and the order will become unavailable to process via the applcation. For further help please contact The Patent Place via\
                     email: support@ip.place, or phone: +44 203 696 0949'
                if(value === true) {
                    this.showError = true;
                    inhibitGrantConfirm(obj);
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
                var obj = {}
                obj.title = 'Patent Specification'
                ob.message = 'If you confirm that you do not approve the text of the Patent Specification, The Patent Place can only offer help with your application offline\
                    via a Patent Administrator, and the order will become unavailable to process via the applcation. For further help please contact The Patent Place via\
                     email: support@ip.place, or phone: +44 203 696 0949'
                if(value === true) {
                    this.showError = true;
                    inhibitGrantConfirm(obj);
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

    function uninhibitGrant() {
        grantService.unhibitGrant(patent.patentID)
        .then(
            function(response){

                var modalInstance = $uibModal.open({
                    templateUrl: 'app/templates/modals/modal.grant-order-deleted.tpl.htm',
                    appendTo: undefined,
                    controllerAs: '$ctrl',
                    controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                        this.dismissModal = function() {
                            $uibModalInstance.close();
                            $state.reload()
                        };

                    }]
                });

            },
            function(errResponse){
                console.errr('Error deleting grant order: ', errResponse)
            }
        )
    }

    function uninhibitGrantConfirm() {

        var modalInstance = $uibModal.open({
            templateUrl: 'app/templates/modals/modal.confrm-grant-order-delete.tpl.htm',
            appendTo: undefined,
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                this.uninhibitGrant = function() {
                    uninhibitGrant()
                }

                this.dismissModal = function() {
                    $uibModalInstance.close();
                    $state.reload()
                };

            }]
        });

    }

    function inhibitGrant() {
        grantService.inhibitGrant(patent.patentID)
        .then(
            function(response) {
                $state.reload();
            },
            function(errResponse){
                console.error('Error inhibiting grant order: ', errResponse)
            }
        )
    }

    function inhibitGrantconfirm(message) {

        var modalInstance = $uibModal.open({
            template: '<div class="modal-header d-flex flex-column align-items-center justify-content-center">\
                            <span class="modal-cross cursor-pointer" data-ng-click="$ctrl.dismissModal()"><i class="txt-grey fa fa-times fa-2x"></i></span>\
                            <div class="m-b-sm">\
                                <i class="fas fa-exclamation-circle fa-4x txt-phase-red"></i>\
                            </div>\
                            <p class="font-h3 font-weight-medium">'+message.title+'</p>\
                            <p class="font-body w-100 text-center m-b-sm m-t-xs">'+ message.message+'</p>\
                            <div class="d-flex">\
                                <button class="btn btn--lg btn--red pill-radius m-r-md" data-ng-click="$ctrl.dismissModal()">Cancel</button>\
                                <button class="btn btn--lg btn--green pill-radius" data-ng-click="$ctrl.confirmNotSuitable()">Confirm</button>\
                            </div>\
                        </div>',
            appendTo: undefined,
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                this.confirm = function() {
                    inhibitGrant();
                }

                this.dismissModal = function() {
                    $uibModalInstance.close();
                };

            }]
        });

    }

}