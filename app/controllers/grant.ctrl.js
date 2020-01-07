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
    vm.checkError = checkError;
    vm.submitGrantData = submitGrantData;
    $scope.formData = {};
    $scope.validate = {};
    var grantAction;


    function init() {

    	vm.activeTab = 0;

        if(patent.clientRef !== '') {
            $scope.formData.clientRef = patent.clientRef;
        }

		if(patent.p3sServicesWithFees[0].serviceStatus == 'Grant available') {

			vm.grantStage = 1;
    		vm.grantTemplate = vm.templates[0].url;        
    	}

		if(patent.p3sServicesWithFees[0].serviceStatus == 'Grant saved' || patent.p3sServicesWithFees[0].serviceStatus == 'Manual processing' || patent.p3sServicesWithFees[0].serviceStatus == 'Payment in progress' || patent.p3sServicesWithFees[0].serviceStatus == 'EPO Instrcted') {
			vm.grantStage = 2;
    		vm.grantTemplate = vm.templates[2].url;
    	}
    }

    init();

    var destroyFrom;

    function submitGrantData(data){

        var formData = new FormData();
        var config = { headers: {'Content-Type': undefined} };
        var notifyWhenValidationAvailable = data.optInValidation.no === true ? false : true;
        formData.append('patentID', patent.patentID);
        formData.append('clientRef', data.clientRef);
        formData.append('totalClaims', parseInt(data.totalClaims));
        formData.append('ofWhichClaimsUnpaid', parseInt(data.totalAdditionalClaims));
        formData.append('totalPages', parseInt(data.totalPages));
        formData.append('ofWhichPagesUnpaid', parseInt(data.totalAdditionalPages));
        formData.append('notifyWhenValidationAvailable', notifyWhenValidationAvailable);
        formData.append('frenchTranslation', data.translations.frenchTranslation);
        formData.append('germanTranslation', data.translations.germanTranslation);

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

                $state.go('portfolio.modal.patent', {patentId: patent.patentID, prepareGrant: 1, form1200generate: 0}, {reload: true})

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

                $state.go('portfolio.modal.patent', {patentId: patent.patentID}, {reload: true})

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
                 email: support@ip.place, or phone: +44 203 696 0949';
        }
        if(question == 'approveText' && value === true) {
            obj.title = 'Patent Specification';
            obj.message = 'If you confirm that you do not approve the text of the Patent Specification, The Patent Place can offer help with your application offline\
                via a Patent Administrator, and the order will become unavailable to process online. For further help please contact The Patent Place via\
                 email: support@ip.place, or phone: +44 203 696 0949';            
        }      
        inhibitGrantConfirm(obj);  
    }

	function initiateGrantOrder() {

        grantService.representativeCheck(patent.patentID)
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
                    grantService.deleteGrant(patent.patentID)
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

    $scope.$on('$destroy', function() {
      destroyFrom(); // remove listener.
    });         

}