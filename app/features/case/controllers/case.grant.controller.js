GrantController.$inject = ['caseSelected', '$scope', '$uibModal', '$state', '$timeout', 'GrantService', '$compile', '$cookies'];

export default function GrantController(caseSelected, $scope, $uibModal, $state, $timeout, GrantService, $compile, $cookies) {

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
    vm.excessClaims = excessClaims;
    vm.excessPages = excessPages;
    $scope.formData = {};
    $scope.validate = {};
    $scope.phoneNumber = '';

    function init() {
        // $cookies.remove('grantAttempts');
        $scope.phoneNumber = $scope.ppDetails.partnerPhone;
    	vm.activeTab = 0;

        if(caseSelected.clientRef !== '') {
            $scope.formData.clientRef = caseSelected.clientRef;
        }

		if(caseSelected.p3sServicesWithFees[0].serviceStatus == 'Grant available') {

			vm.grantStage = 1;
    		vm.grantTemplate = vm.templates[0].url;        
    	}

		if(caseSelected.p3sServicesWithFees[0].serviceStatus == 'Grant saved' || caseSelected.p3sServicesWithFees[0].serviceStatus == 'Too Late Online' || caseSelected.p3sServicesWithFees[0].serviceStatus == 'Manual processing' || caseSelected.p3sServicesWithFees[0].serviceStatus == 'Payment in progress' || caseSelected.p3sServicesWithFees[0].serviceStatus == 'EPO Instrcted') {
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
        // formData.append('notifyWhenValidationAvailable', notifyWhenValidationAvailable);
        formData.append('frenchTranslation', data.translations.frenchTranslation);
        formData.append('germanTranslation', data.translations.germanTranslation);
        
        if(data.isExcessClaims) {
            formData.append('isExcessClaims', data.isExcessClaims.yes);
            if(data.isExcessClaims.yes) {
                formData.append('feePayable_016', data.feePayable_016);
                formData.append('feePayable_016e', data.feePayable_016e);
                formData.append('totalClaimsAmountPayable', data.totalClaimsAmountPayable);
                formData.append('numClaimsPaid', data.numClaimsPaid);
            }
        }

        if(data.isExcessPages) {
            formData.append('isExcessPages', data.isExcessPages.yes);
            if(data.isExcessPages.yes) {
                formData.append('feePayable_008', data.feePayable_008);
                formData.append('totalPagesAmountPayable', data.totalPagesAmountPayable);
                formData.append('numPagesPaid', data.numPagesPaid);
            }
        }
        

        // for(var pair of formData.entries()) {
        //    console.log(pair[0]+ ', '+ pair[1]); 
        // }
        var cookieExp = new Date();
        cookieExp.setDate(cookieExp.getDate() + 1);

        var attempts = $cookies.get('grantAttempts');

        if(!attempts) {
            $cookies.put('grantAttempts', 1, { expires: cookieExp } );
            formData.append('isFirstTime', true);
        } else {
            if(attempts < 2) {
                $cookies.put('grantAttempts', Number(attempts) + Number(1));
                
            }
            formData.append('isFirstTime', false);
            
        }



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

                if(errResponse.status !== 406) {
                    var modalInstance = $uibModal.open({
                        template:  require('html-loader!../html/modals/modal.grant-order-not-prepared.tpl.htm'),
                        appendTo: undefined,
                        controllerAs: '$ctrl',
                        controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){
                            console.log($scope.ppDetails.partnerPhone)
                            this.phoneNumber = $scope.ppDetails.partnerPhone;

                            this.dismissModal = function() {
                                $uibModalInstance.close();
                            };

                        }]
                    });     
                }

                if(errResponse.status == 406 && attempts !== 2) {
                    var modalInstance = $uibModal.open({
                        template:  require('html-loader!../html/modals/modal.grant-first-mismatch.tpl.htm'),
                        appendTo: undefined,
                        controllerAs: '$ctrl',
                        controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){
                            console.log($scope.ppDetails.partnerPhone)

                            this.phoneNumber = $scope.ppDetails.partnerPhone;

                            this.dismissModal = function() {
                                $uibModalInstance.close();
                            };

                        }]
                    });   
                }

                if(errResponse.status == 406 && attempts == 2) {
                    var modalInstance = $uibModal.open({
                        template:  require('html-loader!../html/modals/modal.grant-second-mismatch.tpl.htm'),
                        appendTo: undefined,
                        controllerAs: '$ctrl',
                        controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){
                            console.log($scope.ppDetails.partnerPhone)
                            this.phoneNumber = $scope.ppDetails.partnerPhone;

                            this.dismissModal = function() {
                                $uibModalInstance.close();
                            };

                        }]
                    });   
                }                



                $state.go('portfolio.modal.case', {caseId: caseSelected.patentID}, {reload: true})

            }
        )

    }

    function excessClaims(value) {
        if(value) {
            vm.excessClaimsDue = true;
        } else {
            vm.excessClaimsDue = false;
        }
    }

    function excessPages(value) {
        if(value) {
            vm.excessPagesDue = true;
        } else {
            vm.excessPagesDue = false;
        }
    }

    function checkError(question, value) {
        if(value === false || typeof value === 'undefined' || value === undefined) { return;}
        var obj = {};
        if(question == 'representative' && value === true) {
            obj.title = 'Representative';
            var template = '<p>If you confirm that you do not wish IP Place to act as representative, The Patent Place can offer help with your application offline\
                via a Patent Administrator, and the order will become unavailable to process online. For further help please contact The Patent Place via\
                 email: support@ip.place, or phone: '+ $scope.phoneNumber + '</p>';
            obj.message = $compile(template)($scope);
        }
        if(question == 'approveText' && value === true) {
            obj.title = 'Patent Specification';
            var template = '<p>If you confirm that you do not approve the text of the Patent Specification, The Patent Place can offer help with your application offline\
                via a Patent Administrator, and the order will become unavailable to process online. For further help please contact The Patent Place via\
                 email: support@ip.place, or phone: '+ $scope.phoneNumber + '</p>';     
            obj.message = $compile(template)($scope);      
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
                            <p class="font-body w-100 text-center m-b-sm m-t-xs">'+ message.message[0].innerHTML+'</p>\
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