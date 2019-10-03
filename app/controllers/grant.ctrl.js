angular.module('ppApp').controller('grantCtrl', grantCtrl);

grantCtrl.$inject = ['patent', '$scope', '$rootScope', '$uibModal', 'grantService', '$state', '$timeout', 'activeTabService'];

function grantCtrl(patent, $scope, $rootScope, $uibModal, grantService, $state, $timeout, activeTabService) {

	var vm = this;

	vm.patent = patent;
	vm.initiateGrantOrder = initiateGrantOrder;
    vm.templates = [
        { name: 'grantintro.html', url: 'app/templates/grant/grant.intro.tpl.htm'},
        { name: 'grantquestions.html', url: 'app/templates/grant/grant.questionnaire.tpl.htm'},
        { name: 'grantgenerated.html', url: 'app/templates/grant/grant.ready.tpl.htm'}
    ];
    vm.highestPoint = 0;
    vm.uninhibitGrantConfirm = uninhibitGrantConfirm;
    vm.deleteGrantConfirm = deleteGrantConfirm;

    function init() {
  
    	vm.activeTab = 0;


		if(patent.p3sServicesWithFees[0].serviceStatus == 'Grant available') {
			vm.grantStage = 1;
    		vm.grantTemplate = vm.templates[0].url;        
    	}


		if(patent.p3sServicesWithFees[0].serviceStatus == 'Grant saved' || patent.p3sServicesWithFees[0].serviceStatus == 'Manual processing') {
			vm.grantStage = 2;
    		vm.grantTemplate = vm.templates[2].url;        
    	}    	
    }

    init();

    $rootScope.$on('submitGrantData', function(e, data){
        console.log(data)
        var formData = new FormData();
        var config = { headers: {'Content-Type': undefined} };
        var notifyWhenValidationAvailable = data.data.optInValidation.no === true ? false : true;
        formData.append('patentID', patent.patentID);
        formData.append('clientRef', data.data.clientRef);
        formData.append('totalClaims', parseInt(data.data.totalClaims));
        formData.append('ofWhichClaimsUnpaid', parseInt(data.data.totalAdditionalClaims));
        formData.append('totalPages', parseInt(data.data.totalPages));
        formData.append('ofWhichPagesUnpaid', parseInt(data.data.totalAdditionalPages));
        formData.append('notifyWhenValidationAvailable', notifyWhenValidationAvailable);
        formData.append('frenchTranslation', data.data.translations.frenchTranslation);
        formData.append('germanTranslation', data.data.translations.germanTranslation);

        grantService.submitGrant(formData, config)
        .then(
            function(response){

                

                var modalInstance = $uibModal.open({
                    templateUrl: 'app/templates/modals/modal.grant-order-prepared.tpl.htm',
                    appendTo: undefined,
                    controllerAs: '$ctrl',
                    controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                        this.dismissModal = function() {
                            $uibModalInstance.close();
                        };

                    }]
                });

                $state.go('portfolio.patent', {}, {reload: true})

            },
            function(errResponse){

                var modalInstance = $uibModal.open({
                    templateUrl: 'app/templates/modals/modal.grant-order-not-prepared.tpl.htm',
                    appendTo: undefined,
                    controllerAs: '$ctrl',
                    controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                        this.dismissModal = function() {
                            $uibModalInstance.close();
                        };

                    }]
                });

                $state.go('portfolio.patent', {}, {reload: true})

            }
        )

    })


	var grantQuestions = [

        // { 
        //     title: 'representative',
        //     template: 'representative',
        //     displayHelp: false,
        //     checkError: function(value) {
        //         var obj = {};
        //         obj.title = 'Representative';
        //         obj.message = 'If you confirm that you do not wish IP Place to act as representative, The Patent Place can only offer help with your application offline\
        //             via a Patent Administrator, and the order will become unavailable to process via the applcation. For further help please contact The Patent Place via\
        //              email: support@ip.place, or phone: +44 203 696 0949';
        //         if(value === true) {
        //             this.showError = true;
        //             inhibitGrantConfirm(obj);
        //             return
        //         }
        //         this.showError = false;
        //     },
        //     showError: false,
        //     valid: false,
        //     required: true
        // },
        // { 
        //     title: 'approve',
        //     template: 'approvetext',
        //     displayHelp: false,
        //     checkError: function(value) {
        //         var obj = {};
        //         obj.title = 'Patent Specification';
        //         obj.message = 'If you confirm that you do not approve the text of the Patent Specification, The Patent Place can only offer help with your application offline\
        //             via a Patent Administrator, and the order will become unavailable to process via the applcation. For further help please contact The Patent Place via\
        //              email: support@ip.place, or phone: +44 203 696 0949';
        //         if(value === true) {
        //             this.showError = true;
        //             inhibitGrantConfirm(obj);
        //             return
        //         }
        //         this.showError = false;
        //     },      
        //     showError: false,
        //     valid: false,
        //     required: true
        // },
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
            title: 'clientref',
            template: 'clientref',
            displayHelp: false,
            showError: false,
            showError: false,
            valid: false,
            required: true,
            data: patent.clientRef //provides any default data
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

        grantService.representativeCheck(patent.patentID)
        .then(
            function(response){

                if(response.changeOfRepresentativeNeeded === true) {
                    grantQuestions.splice(0, 1)
                }

                grantService.setQuestions(grantQuestions);
                vm.grantTemplate = vm.templates[1].url;
            }
        )
		

	}

    function uninhibitGrantConfirm() {

        var modalInstance = $uibModal.open({
            templateUrl: 'app/templates/modals/modal.confirm-uninhibit-grant-order.tpl.htm',
            appendTo: undefined,
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                this.uninhibitGrant = function() {
                    $uibModalInstance.close();
                    grantService.unhibitGrant(patent.patentID)
                    .then(
                        function(response){
                            $state.reload();
                            var modalInstance = $uibModal.open({
                                templateUrl: 'app/templates/modals/modal.grant-order-uninhibited.tpl.htm',
                                appendTo: undefined,
                                controllerAs: '$ctrl',
                                controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                                    this.dismissModal = function() {
                                        $uibModalInstance.close();
                                    };

                                }]
                            });

                        },
                        function(errResponse){
                            console.errr('Error deleting grant order: ', errResponse)
                        }
                    )
                }

                this.dismissModal = function() {
                    $uibModalInstance.close();
                    $state.reload()
                };

            }]
        });

    }


    function inhibitGrantConfirm(message) {

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
                                <button class="btn btn--lg btn--green pill-radius" data-ng-click="$ctrl.confirm()">Confirm</button>\
                            </div>\
                        </div>',
            appendTo: undefined,
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', '$timeout', '$state', function($uibModalInstance, $timeout, $state){

                if(patent.p3sServicesWithFees[0].serviceStatus === 'Grant available') {

                    this.confirm = function() {
                        grantService.inhibitGrant(patent.patentID)
                        .then(
                            function(response) {
                                $state.reload();
                                $uibModalInstance.close();
                            },
                            function(errResponse){
                                console.error('Error inhibiting grant order: ', errResponse)
                            }
                        )
                    }
                }

                this.dismissModal = function() {
                    $uibModalInstance.close();
                };

            }]
        });

    }

    function deleteGrantConfirm() {

        var modalInstance = $uibModal.open({
            templateUrl: 'app/templates/modals/modal.confirm-delete-grant-order.tpl.htm',
            appendTo: undefined,
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                this.deleteGrant = function() {
                    $uibModalInstance.close();
                    grantService.unhibitGrant(patent.patentID)
                    .then(
                        function(response){
                            $state.reload()
                            var modalInstance = $uibModal.open({
                                templateUrl: 'app/templates/modals/modal.grant-order-deleted.tpl.htm',
                                appendTo: undefined,
                                controllerAs: '$ctrl',
                                controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                                    this.dismissModal = function() {
                                        $uibModalInstance.close();
                                    };

                                }]
                            });

                        },
                        function(errResponse){
                            console.errr('Error deleting grant order: ', errResponse)
                        }
                    )
                }

                this.dismissModal = function() {
                    $uibModalInstance.close();
                    $state.reload()
                };

            }]
        });

    }

}