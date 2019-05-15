angular.module('ppApp').controller('form1200Ctrl', form1200Ctrl);

form1200Ctrl.$inject = ['$scope', 'patent', '$state', 'organiseTextService', '$stateParams', '$timeout', 'form1200Service', '$uibModal', 'activeTabService'];

function form1200Ctrl($scope, patent, $state, organiseTextService, $stateParams, $timeout, form1200Service, $uibModal, activeTabService) {

    var vm = this;

    vm.patent = patent;
    vm.initiateForm1200 = initiateForm1200;
    vm.templates = [
        { name: 'form1200intro.html', url: 'app/templates/europct/europct.form1200.intro.tpl.htm'},
        { name: 'form1200questions.html', url: 'app/templates/europct/europct.form1200.questionnaire.tpl.htm'},
        { name: 'form1200generated.html', url: 'app/templates/europct/europct.form1200.generated.tpl.htm'}
    ];
    
    var service = $scope.$parent.availableServices;

    //QUESTIONAIRE

    vm.manualProcess = manualProcess;// NOT REQUIRED FOR RELEASE 1
    vm.chkValidStates = chkValidStates;
    vm.chkExtStates = chkExtStates;
    vm.submitForm1200 = submitForm1200;
    vm.questionsParam = '';
    vm.cancel1200 = cancel1200;
    vm.formData = {};
    vm.formData.clientRef = patent.clientRef;
    vm.formData.isYear3RenewalPaying = false;
    vm.entityAccepted = false;

    function init() {
        $scope.patent = patent;
        if(service[0].status == 'Epct available') {
            vm.form1200Template = vm.templates[0].url;
            vm.epctStage = 1;
        }
        if(service[0].status == 'Epct being generated' || service[0].status == 'Epct saved') {
            vm.form1200Template = vm.templates[2].url;
            vm.epctStage = 2;
        }
       

    }

    init()


    //QUESTIONAIRE
    
    function initiateForm1200() {
        

        form1200Service.fetchQuestions(patent.id)
        .then(
            function(response){
                if(response !== null) {
                    vm.form1200Template = vm.templates[1].url;
                    vm.questionsParam = response;
                    return;
                }
            },
            function(errResponse){
                console.log('error: ', errResponse)
            }
        )
        .then(
            function(){

                if(patent.form1200FeeUI === null) {
                    vm.loading = false;
                    vm.patentsLoaded = true;
                } else {

                    vm.formData.extensionStatesUI = vm.questionsParam.extensionStatesUI;
                    vm.formData.validationStatesUI = vm.questionsParam.validationStatesUI;
                    
                    var questions = {
                        showOptionalQuestion: function() {
                            if(vm.questionsParam.showOptionalQuestion) {
                                return true;
                            } else {
                                return false;
                            }
                        },
                        isYear3RenewalDue: function() {
                            if(vm.questionsParam.isYear3RenewalDue) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    }

                    if(questions.showOptionalQuestion()) { //if extra question is included, extend index of other quesitons
                        vm.documents.active = true;
                        vm.extAndValid.index++;
                        vm.reference.index++;
                        vm.confirmPages.index++;
                        vm.renewal.index++;
                    }

                    if(questions.isYear3RenewalDue()) {
                        vm.renewal.active = true;
                    }
                }

            }        
        )
    }

    vm.confirmEntity = {
        index: 0,
        title: function() {
           return 'Q.'+(this.index+1)+'';
        },
        activeTabFn: function() {
            return this.index+1;
        },        
        fn: function() {
            vm.activeTab = this.activeTabFn();
            vm.confirmEntityChecked = true;
        }
    }

    vm.amendments = {
        index: 1,
        title: function() {
           return 'Q.'+(this.index+1)+'';
        },
        activeTabFn: function(dir) {
            if(dir === 'prev') {
                return this.index-1;
            } else {
               if(!vm.documents.active) {
                    vm.documentsChecked = true;
                }                
                return this.index+1;
            }
            
        },
        fn: function(event){
            var btn = angular.element(event.currentTarget)
            if(btn.hasClass('prev')) {
                vm.activeTab = this.activeTabFn('prev');
            } else {
                vm.activeTab = this.activeTabFn('next');
            }
            vm.amendmentsChecked = true;
        }
    }

    vm.documents = {
        active: false,
        index: 2,
        title: function() {
           return 'Q.'+(this.index+1)+'';
        },
        activeTabFn: function(dir) {
            if(dir === 'prev') {
                return this.index-1;
            } else {             
                vm.documentsChecked = true;
                return this.index+1;
            }
        },        
        fn: function(event) {
            var btn = angular.element(event.currentTarget)            
            if(btn.hasClass('prev')) {
                vm.activeTab = this.activeTabFn('prev');
            } else {
                vm.activeTab = this.activeTabFn('next');
            }            
           
        }
    }

    vm.extAndValid = {
        index: 2,
        title: function() {
           return 'Q.'+(this.index+1)+'';
        },
        activeTabFn: function(dir) {
            if(dir === 'prev') {
                return this.index-1;
            } else {
                vm.extAndValidChecked = true;                        
                return this.index+1;
            }
        },        
        fn: function(event) {
            var btn = angular.element(event.currentTarget);
            if(btn.hasClass('prev')) {
                vm.activeTab = this.activeTabFn('prev');
            } else { 
                vm.activeTab = this.activeTabFn('next');
            }
        }
    }

    vm.reference = {
        index: 3,
        title: function() {
           return 'Q.'+(this.index+1)+'';
        },
        activeTabFn: function(dir) {
            if(dir === 'prev') {
                return this.index-1;
            } else {           
                vm.referenceChecked = true; 
                return this.index+1;
            }
        },
        fn: function(event) {
            var btn = angular.element(event.currentTarget);
            if(btn.hasClass('prev')) {
                vm.activeTab = this.activeTabFn('prev');
            } else { 
                vm.activeTab = this.activeTabFn('next');
            }
        }               
    }

    vm.confirmPages = {
        index: 4,
        title: function() {
           return 'Q.'+(this.index+1)+'';
        },
        activeTabFn: function(dir) {
            if(dir === 'prev') {
                return this.index-1;
            } else { 
                vm.confirmPagesChecked = true;
                return this.index+1;
            }            
        },
        fn: function(event) {
            var btn = angular.element(event.currentTarget);
            if(btn.hasClass('prev')) {
                vm.activeTab = this.activeTabFn('prev');
            } else { 
                vm.activeTab = this.activeTabFn('next');
            }
        }
    }

    vm.renewal = {
        active: false,
        index: 5,
        title: function() {
           return 'Q.'+(this.index+1)+'';
        },
        activeTabFn: function(dir) {
            if(dir === 'prev') {
                return this.index-1;
            } else { 
                return this.index+1;
            }            
        },        
        fn: function(event) {
            var btn = angular.element(event.currentTarget);
            if(btn.hasClass('prev')) {
                vm.activeTab = this.activeTabFn('prev');
            } else { 
                vm.activeTab = this.activeTabFn('next');
            }
        }        
    }

    function cancel1200() {
        var modalInstance = $uibModal.open({
            templateUrl: 'app/templates/modals/modal.confirm-cancel-1200.tpl.htm',
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

        var arr = []

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

    function submitForm1200(data) {
        var arr = sortPageDetails(data);
        vm.formData.pageDescriptionsUI = arr;
        vm.formData.id = patent.id;
        vm.formData.totalClaims = parseInt(vm.formData.totalClaims);
        vm.formData.totalPages = parseInt(vm.formData.totalPages);
        form1200Service.submitForm1200(vm.formData)
        .then(
            function(response){
                activeTabService.setTab(2)
                $state.go('portfolio.patent', {}, {reload: true});
            },
            function(errResponse){
                form1200Errors() 
            }
        )
    }

    function chkValidStates(item, index) {
        if(item === '') {
            vm.questionsParam.validationStatesUI[index].selected = true;
        } else {
            vm.questionsParam.validationStatesUI[index].selected = false;
        }
        vm.formData.validationStatesUI =  vm.questionsParam.validationStatesUI;
    }

    function chkExtStates(item, index) {
        if(item === '') {
            vm.questionsParam.extensionStatesUI[index].selected = true;
        } else {
            vm.questionsParam.extensionStatesUI[index].selected = false;
        }
        vm.formData.extensionStatesUI =  vm.questionsParam.extensionStatesUI;
    }

    function form1200Errors() {
        var modalInstance = $uibModal.open({
            templateUrl: 'app/templates/modals/modal.generate-form1200-error.tpl.htm',
            appendTo: undefined,
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', '$scope', '$timeout', function($uibModalInstance, $scope, $timeout){

                vm.proceedMsgAmend  = true;
                this.dismissModal = function () {
                    $uibModalInstance.close();
                };

            }]
        });
    }

    function manualProcess(value, question) {// NOT NEEDED FOR RELEASE 1

        if(value === true && question == 'amendments') {
            vm.documentsChecked = false;
            vm.extAndValidChecked = false;
            vm.referenceChecked = false;
            vm.confirmPagesChecked = false;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/templates/modals/modal.manual-processing-amendments.tpl.htm',
                appendTo: undefined,
                controllerAs: '$ctrl',
                controller: ['$uibModalInstance', '$scope', '$timeout', function($uibModalInstance, $scope, $timeout){

                    vm.proceedMsgAmend  = true;
                    this.dismissModal = function () {
                        $uibModalInstance.close();
                    };

                    this.ok = function () {
                        $state.go('portfolio', {manual: true}, {reload: true});
                        $uibModalInstance.close();
                    };


                }]
            });
        } else {
            vm.proceedMsgAmend = false;
        }

        if(value === true && question == 'documents') {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/templates/modals/modal.manual-processing-documents.tpl.htm',
                appendTo: undefined,
                controllerAs: '$ctrl',
                controller: ['$uibModalInstance', '$scope', '$timeout', function($uibModalInstance, $scope, $timeout){

                    vm.proceedMsgDocs  = true;
                    this.dismissModal = function () {
                        $uibModalInstance.close();
                    };

                    this.ok = function () {
                        $state.go('portfolio', {manual: true}, {reload: true});
                        $uibModalInstance.close();
                    };


                }]
            });            
        } else {
            vm.proceedMsgDocs = false;
        }

    }

} 