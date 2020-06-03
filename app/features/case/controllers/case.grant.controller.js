GrantController.$inject = ['caseSelected', '$scope', '$uibModal', '$state', '$timeout', 'GrantService'];

export default function GrantController(caseSelected, $scope, $uibModal, $state, $timeout, GrantService) {

	var vm = this;

	vm.patent = caseSelected;
	vm.initiateGrantOrder = initiateGrantOrder;
    vm.templates = [
        { name: 'grantintro.html', url:  require('html-loader!../html/grant/grant.intro.tpl.htm')},
        { name: 'grantquestions.html', url: require('html-loader!../html/grant/grant.questionnaire.tpl.htm')},
        { name: 'grantgenerated.html', url: require('html-loader!../html/grant/grant.ready.tpl.htm')}
    ];
    vm.highestPoint = 0;
    vm.uninhibitGrantConfirm = uninhibitGrantConfirm;
    vm.deleteGrantConfirm = deleteGrantConfirm;
    vm.checkError = checkError;
    vm.submitGrantData = submitGrantData;
    $scope.formData = {};
    $scope.validate = {};

    function init() {
        $scope.phoneNumber = $scope.ppDetails.partnerPhone;
    	vm.activeTab = 0;

        if(caseSelected.clientRef !== '') {
            $scope.formData.clientRef = caseSelected.clientRef;
        }

		if(caseSelected.p3sServicesWithFees[0].serviceStatus == 'Grant available') {

			vm.grantStage = 1;
    		vm.grantTemplate = vm.templates[0].url;        
    	}

		if(caseSelected.p3sServicesWithFees[0].serviceStatus == 'Grant saved' || caseSelected.p3sServicesWithFees[0].serviceStatus == 'Manual processing' || caseSelected.p3sServicesWithFees[0].serviceStatus == 'Payment in progress' || caseSelected.p3sServicesWithFees[0].serviceStatus == 'EPO Instrcted') {
			vm.grantStage = 2;
    		vm.grantTemplate = vm.templates[2].url;
    	}
    }

    init();

    function submitGrantData(data){

        var formData = new FormData();
        var config = { headers: {'Content-Type': undefined} };
        var notifyWhenValidationAvailable = true; //REMOVE EVENTALLY. QUICK FIX. PROPERTY NOT REQUIRED
        formData.append('patentID', caseSelected.patentID);
        formData.append('clientRef', data.clientRef);
        formData.append('totalClaims', parseInt(data.totalClaims));
        formData.append('ofWhichClaimsUnpaid', parseInt(data.totalAdditionalClaims));
        formData.append('totalPages', parseInt(data.totalPages));
        formData.append('ofWhichPagesUnpaid', parseInt(data.totalAdditionalPages));
        formData.append('notifyWhenValidationAvailable', notifyWhenValidationAvailable);
        formData.append('frenchTranslation', data.translations.frenchTranslation);
        formData.append('germanTranslation', data.translations.germanTranslation);

        GrantService.submitGrant(formData, config)
        .then(
            function(response){

                var modalInstance = $uibModal.open({
                    template:  require('html-loader!../html/modals/modal.grant-order-prepared.tpl.htm'),
                    appendTo: undefined,
                    controllerAs: '$ctrl',
                    controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                        this.dismissModal = function() {
                            $uibModalInstance.close();
                        };

                    }]
                });

                $state.go('portfolio.modal.case', {caseId: caseSelected.patentID, prepareGrant: 1, form1200generate: 0}, {reload: true})

            },
            function(errResponse){

                var modalInstance = $uibModal.open({
                    template:  require('html-loader!../html/modals/modal.grant-order-not-prepared.tpl.htm'),
                    appendTo: undefined,
                    controllerAs: '$ctrl',
                    controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                        this.dismissModal = function() {
                            $uibModalInstance.close();
                        };

                    }]
                });

                $state.go('portfolio.modal.case', {caseId: caseSelected.patentID}, {reload: true})

            }
        )

    }

    function checkError(question, value) {
        if(value === false || typeof value === 'undefined' || value === undefined) { return;}
        var obj = {};
        if(question == 'representative' && value === true) {
            obj.title = 'Representative';
            obj.message = 'If you confirm that you do not wish IP Place to act as representative, The Patent Place can offer help with your application offline\
                via a Patent Administrator, and the order will become unavailable to process online. For further help please contact The Patent Place via\
                 email: support@ip.place, or phone: {{{{phoneNumber}}}}';
        }
        if(question == 'approveText' && value === true) {
            obj.title = 'Patent Specification';
            obj.message = 'If you confirm that you do not approve the text of the Patent Specification, The Patent Place can offer help with your application offline\
                via a Patent Administrator, and the order will become unavailable to process online. For further help please contact The Patent Place via\
                 email: support@ip.place, or phone: {{{{phoneNumber}}}}';            
        }      
        inhibitGrantConfirm(obj);  
    }

	function initiateGrantOrder() {

        GrantService.representativeCheck(caseSelected.patentID)
        .then(
            function(response){
                if(response === true) {
                    vm.representativeRequired = true;
                }
                vm.grantTemplate = vm.templates[1].url;
            }
        )
		

	}

    function uninhibitGrantConfirm() {

        var modalInstance = $uibModal.open({
            template:  require('html-loader!../html/modals/modal.confirm-uninhibit-grant-order.tpl.htm'),
            appendTo: undefined,
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                this.uninhibitGrant = function() {
                    $uibModalInstance.close();
                    GrantService.unhibitGrant(caseSelected.patentID)
                    .then(
                        function(response){
                            $state.reload();
                            var modalInstance = $uibModal.open({
                                template:  require('html-loader!../html/modals/modal.grant-order-uninhibited.tpl.htm'),
                                appendTo: undefined,
                                controllerAs: '$ctrl',
                                controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                                    this.dismissModal = function() {
                                        $uibModalInstance.close();
                                    };

                                }]
                            });

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

                if(caseSelected.p3sServicesWithFees[0].serviceStatus === 'Grant available') {

                    this.confirm = function() {
                        GrantService.inhibitGrant(caseSelected.patentID)
                        .then(
                            function(response) {
                                $state.reload();
                                $uibModalInstance.close();
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
            template:  require('html-loader!../html/modals/modal.confirm-delete-grant-order.tpl.htm'),
            appendTo: undefined,
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                this.deleteGrant = function() {
                    $uibModalInstance.close();
                    GrantService.deleteGrant(caseSelected.patentID)
                    .then(
                        function(response){
                            $state.reload()
                            var modalInstance = $uibModal.open({
                                template:  require('html-loader!../html/modals/modal.grant-order-deleted.tpl.htm'),
                                appendTo: undefined,
                                controllerAs: '$ctrl',
                                controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                                    this.dismissModal = function() {
                                        $uibModalInstance.close();
                                    };

                                }]
                            });

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