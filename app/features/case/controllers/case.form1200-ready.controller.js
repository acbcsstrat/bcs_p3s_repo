Form1200ReadyController.$inject = ['caseSelected', '$scope', '$state', '$timeout', '$compile', '$uibModal', 'Form1200Service', 'ActiveTabService'];

export default function Form1200ReadyController(caseSelected, $scope, $state, $timeout, $compile, $uibModal, Form1200Service, ActiveTabService) {

    var vm = this;


    vm.patent = caseSelected;
    $scope.patent = caseSelected; //needed for generated controller
    vm.initiateForm1200 = initiateForm1200;
    
    vm.templates = [ //compiled with help of dynamic directive
        { name: 'form1200intro.html', url: require('html-loader!../html/europct/europct.form1200.intro.tpl.htm')},
        { name: 'form1200questions.html', url: require('html-loader!../html/europct/europct.form1200.questionnaire.tpl.htm')},
        { name: 'form1200generated.html', url: require('html-loader!../html/europct/europct.form1200.generated.tpl.htm')},
        { name: 'form1200manual.html', url: require('html-loader!../html/europct/europct.form1200.manual.tpl.htm')}
    ];

    vm.questionsParam = '';
    vm.cancel1200 = cancel1200;
    vm.chkValidStates = chkValidStates;
    vm.chkExtStates = chkExtStates;
    vm.checkError = checkError;
    vm.submitForm1200Data = submitForm1200Data;
    vm.excessClaimsCheck = excessClaimsCheck;
    vm.notPayingExcess = notPayingExcess;
    vm.amendmentsMade = amendmentsMade;
    vm.uploadAmended = uploadAmended;
    $scope.formData = {};
    $scope.validate = {};
    $scope.excessobject = {};
    $scope.phoneNumber = '';
    $scope.test = {};
    $scope.$parent.promise
    .then(
        function(response){

            $scope.phoneNumber = $scope.ppDetails.partnerPhone;
            var service = $scope.$parent.availableServices;

            if(service[0].status == 'Epct available') {
                vm.form1200Template = vm.templates[0].url;
                vm.epctStage = 1;
            }

            if(service[0].status == 'Epct being generated' || service[0].status == 'Epct saved' || service[0].status == 'Epct rejected' || service[0].status == 'Payment in progress') {
                vm.form1200Template = vm.templates[2].url;
                vm.epctStage = 2;
            }

            if(service[0].type === 'Offline') {
                vm.form1200Template = vm.templates[3].url;
                vm.urgent = service[0].urgent;
                vm.epctStage = 2;
            }

        }
    )

    function initiateForm1200() {

        Form1200Service.fetchQuestions(caseSelected.patentID)
        .then(
            function(response){

                if(response !== null) {
                    $scope.formData.extensionStatesUI = response.extensionStatesUI;
                    $scope.formData.validationStatesUI = response.validationStatesUI;
                    if(response.clientRef !== '') {
                        $scope.formData.clientRef = response.clientRef;
                    }
                    if(response.showOptionalQuestion === true) {
                        vm.additionalDocuments = true;
                    }
                    if(response.isYear3RenewalDue === true) {
                        vm.isYear3RenewalDue = true;
                    }

                    vm.form1200Template = vm.templates[1].url;
                    
                }
            }
        )

    }

    function amendmentsMade(value) {
        vm.amendedOptions = value === true ? true : false;

    }

    function uploadAmended(value) {
        vm.displayAmendedUpload = value === true ? true : false;
        if(value) {
            var modalInstance = $uibModal.open({
                template: require('html-loader!../html/modals/modal.not-checking-claims.tpl.htm'),
                appendTo: undefined,
                controllerAs: '$ctrl',
                controller: ['$uibModalInstance', '$scope', '$timeout', function($uibModalInstance, $scope, $timeout){

                    this.dismissModal = function () {
                        $uibModalInstance.close();
                    };

                    this.ok = function () {
                        $state.go('portfolio', {reload: true});
                        $uibModalInstance.close();
                    };


                }]
            });
        }        
    }

    function notPayingExcess(value) {

        if(value === true) {
            var modalInstance = $uibModal.open({
                template: require('html-loader!../html/modals/modal.not-paying-excess.tpl.htm'),
                appendTo: undefined,
                controllerAs: '$ctrl',
                controller: ['$uibModalInstance', '$scope', '$timeout', function($uibModalInstance, $scope, $timeout){

                    this.dismissModal = function () {
                        $uibModalInstance.close();
                    };

                    this.ok = function () {
                        $state.go('portfolio', {reload: true});
                        $uibModalInstance.close();
                    };


                }]
            });
        }

    }

    function checkError(question, value) {

        if(value === false || typeof value === 'undefined' || value === undefined) { return;}
        var obj = {};
        var message = '';
        if(question == 'entity' && value === true) {
            message = 'NaturalPerson';
            obj.title = 'Entity or a natural person, Rule 6(4)';
            var template = '<p>If you do not wish to delcare that you are an entity or a natural person, The Patent Place can offer help with your application offline\
                via a Patent Administrator, and the order will become unavailable to process online. For further help please contact The Patent Place via\
                 email: support@ip.place, or phone: '+ $scope.phoneNumber +'</p>';
            obj.message = $compile(template)($scope); 
        }
        if(question == 'amendments' && value === true) {
            message = 'Amended';
            obj.title = 'Amendments made';
            var template = '<p>If you confirm that amendments have been made to the application, The Patent Place can offer help with your application offline\
                via a Patent Administrator, and the order will become unavailable to process online. For further help please contact The Patent Place via\
                 email: support@ip.place, or phone: '+ $scope.phoneNumber +'</p>';
            obj.message = $compile(template)($scope);
        }
        if(question == 'documents' && value === true) {
            message = 'DocsRequired'
            obj.title = 'Additional copies required';
            var template = '<p>If you confirm that you require additional copies of the document cited in the supplementary European search report,\
                The Patent Place can offer help with your application offline via a Patent Administrator, and the order will become unavailable to process online.\
                For further help please contact The Patent Place via email: support@ip.place, or phone: '+ $scope.phoneNumber +'</p>';
            obj.message = $compile(template)($scope);
        }              
        manualProcess(obj, message);  
    }

    function excessClaimsCheck(value) {
        vm.excessClaimsDue = value > 15 ? true : false;
    }

    function chkValidStates(item, index) {
        if(item === '') {
            $scope.formData.validationStatesUI[index].selected = true;
        } else {
            $scope.formData.validationStatesUI[index].selected = false;
        }
    }

    function chkExtStates(item, index) {     
        if(item === '') {
            $scope.formData.extensionStatesUI[index].selected = true;
        } else {
            $scope.formData.extensionStatesUI[index].selected = false;
        }
    }


    function cancel1200() {
        var modalInstance = $uibModal.open({
            template: require('html-loader!../html/modals/modal.confirm-cancel-1200.tpl.htm'),
            appendTo: undefined,
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', '$scope', '$timeout', function($uibModalInstance, $scope, $timeout){

                this.dismissModal = function () {
                    $uibModalInstance.close();
                };

                this.ok = function () {
                    $state.go('portfolio', {reload: true});
                    $uibModalInstance.close();
                };


            }]
        });

    }




    function sortPageDetails(data) {

        var arr = [];

        for(var property in data) {
            if(data.hasOwnProperty(property)) {
                switch(property) {
                    case 'claims':
                        data[property].type = 'Claims';
                        arr.push(data[property])
                    break;
                    case 'description':
                        data[property].type = 'Description';
                        arr.push(data[property])
                    break;
                    case 'drawings':
                        data[property].type = 'Drawings';
                        arr.push(data[property])
                    break;
                }
            }
        }

        return arr;

    }

    function invalidPageNos(error) {

        $scope.formDataSubmitted = false;
        var modalInstance = $uibModal.open({
            template: require('html-loader!../html/modals/modal.invalid-page-nos.tpl.htm'),
            appendTo: undefined,
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                this.dismissModal = function() {
                    $uibModalInstance.close();
                };

            }]
        });
    }


    function submitForm1200Data(data){

        $scope.formDataSubmitted = true;

        var arr = sortPageDetails(data.pageDetailsData);
     
        var config = { 
            headers: { 'Content-Type': undefined},
            transformRequest: angular.identity,
            // params: { amendedDoc: paramsData }       
        }; 

        var formData = new FormData();

        var uploadRequired;

        if($scope.validate.amendments) {
            if($scope.validate.amendments.no) {
                uploadRequired = null;
            }
            
        }
        if($scope.excessobject.excessdocs){
            if($scope.excessobject.excessdocs.yes) {
                uploadRequired = true;
            }
            if($scope.excessobject.excessdocs.no) {
                uploadRequired = false;
            }
            
        }

        formData.append('pageDescriptionsUI', JSON.stringify(arr))
        formData.append('patentID', caseSelected.patentID)
        formData.append('clientRef', data.clientRef)
        formData.append('totalClaims', parseInt(data.totalClaims))
        formData.append('validationStatesUI', JSON.stringify(data.validationStatesUI))
        formData.append('extensionStatesUI', JSON.stringify(data.extensionStatesUI))
        formData.append('isAmendmentsMade', $scope.validate.amendments.yes)

        if(data.numAdditionalCopies) {
            formData.append('numAdditionalCopies', data.numAdditionalCopies)
        }

        if(data.amended.amendedDoc) {
            formData.append('amendedDoc', data.amended.amendedDoc)
        }

        formData.append('isYear3RenewalPaying', data.isYear3RenewalPaying ? data.isYear3RenewalPaying.yes : false);
        formData.append('isExcessClaimsPaying', $scope.excessobject.excessclaims ?  $scope.excessobject.excessclaims.yes : false)
        formData.append('isUploadRequired', uploadRequired)

        Form1200Service.submitForm1200(formData, config)
        .then(
            function(response){

                var modalInstance = $uibModal.open({
                    template: require('html-loader!../html/modals/modal.form1200-generating.tpl.htm'), //create html for notifications update success
                    appendTo: undefined,
                    controllerAs: '$ctrl',
                    controller: ['$uibModalInstance', function($uibModalInstance){
                        this.dismissModal = function () {
                            $uibModalInstance.close();
                        };
                    }]

                })
                ActiveTabService.setTab(2);
                $state.go('portfolio.modal.case', {form1200generate: 1, prepareGrant: 0}, {reload: true});
            },
            function(errResponse){
                console.log('Error : ', errResponse)
                var modalInstance = $uibModal.open({
                    template: require('html-loader!../html/modals/modal.generate-form1200-error.tpl.htm'),
                    appendTo: undefined,
                    controllerAs: '$ctrl',
                    controller: ['$uibModalInstance', '$scope', '$timeout', function($uibModalInstance, $scope, $timeout){

                        vm.proceedMsgAmend  = true;
                        this.dismissModal = function () {
                            $uibModalInstance.close();
                        };

                    }]
                });
                $state.go('portfolio.modal.case', {caseId: caseSelected.patentID}, {reload: true});
            }
        )

    }

    function manualProcess(message, reason) {// NOT NEEDED FOR RELEASE 1

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

               

                this.confirm = function() {
                    Form1200Service.inhibitForm1200(caseSelected.patentID, reason)
                    .then(
                        function(response) {
                            $state.reload();
                            $uibModalInstance.close();
                        }
                    )
                }
                

                this.dismissModal = function() {
                    $uibModalInstance.close();
                };

            }]
        });    

    } 
}