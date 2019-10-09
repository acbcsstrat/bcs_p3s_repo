 angular.module('ppApp').controller('form1200Ctrl', form1200Ctrl);

form1200Ctrl.$inject = ['$scope', '$rootScope', 'patent', '$state', 'organiseTextService', '$stateParams', '$timeout', 'form1200Service', '$uibModal', 'activeTabService'];

function form1200Ctrl($scope, $rootScope, patent, $state, organiseTextService, $stateParams, $timeout, form1200Service, $uibModal, activeTabService) {

    var vm = this;
    var service = $scope.$parent.availableServices;
    vm.patent = patent;
    vm.initiateForm1200 = initiateForm1200;
    vm.templates = [
        { name: 'form1200intro.html', url: 'app/templates/europct/europct.form1200.intro.tpl.htm'},
        { name: 'form1200questions.html', url: 'app/templates/europct/europct.form1200.questionnaire.tpl.htm'},
        { name: 'form1200generated.html', url: 'app/templates/europct/europct.form1200.generated.tpl.htm'}
    ];
    vm.questionsParam = '';
    vm.cancel1200 = cancel1200;

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

    var form1200Questions = [
        { 
            title: 'entity',
            template: 'entity',
            displayHelp: false,
            checkError: null,
            showError: false,
            valid: false,
            required: true
        },
        { 
            title: 'amendments',
            template: 'amendments',
            displayHelp: false,
            checked: false,
            checkError: function(value) {
                if(value === true) {
                    this.showError = true;
                    manualProcess('amendments')
                    return
                }
                this.showError = false;
            },
            showError: false,
            valid: false,
            questionEnabled: false,
            required: true

        },
        { 
            title: 'clientRef',
            template: 'reference',
            displayHelp: false,
            checkError: null,
            showError: false,
            valid: false,
            questionEnabled: false,
            required: true,
            data: patent.clientRef

        },
        { 
            title: 'startEnd',
            template: 'startend',
            displayHelp: false,
            checkError: null,
            showError: false,
            valid: false,
            questionEnabled: false,
            required: true

        }             

    ];
    
    function initiateForm1200() {
        
        // console.log('intiate')

        form1200Service.fetchQuestions(patent.patentID)
        .then(
            function(response){
                if(response !== null) {
                    vm.form1200Template = vm.templates[1].url;
                    return;
                }
            }
        )
        .then(
            function(){

                if(patent.form1200FeeUI === null) {
                    vm.loading = false;
                    vm.patentsLoaded = true;
                } else {

                    var stateObj = { 
                        title: 'states',
                        template: 'states',
                        displayHelp: false,
                        checked: true,
                        checkError: null,
                        showError: false,
                        valid: true,
                        questionEnabled: false,
                        required: false,
                        checkItems: {
                            extensionStatesUI: [
                                {stateCode: "BA", stateName: "Bosnia and Herzegovina", isSelected: false},
                                {stateCode: "ME", stateName: "Montenegro", isSelected: false}
                            ],
                            validationStatesUI: [
                                {stateCode: "MA", stateName: "Morocco", isSelected: false},
                                {stateCode: "MD", stateName: "Republic of Moldova", isSelected: false},
                                {stateCode: "TN", stateName: "Tunisia", isSelected: false},
                                {stateCode: "KH", stateName: "Cambodia", isSelected: false}      
                            ]
                        }                        

                    }

                    form1200Questions.splice(2, 0, stateObj)




                    if(vm.questionsParam.showOptionalQuestion) {

                        var obj = { 
                            title: 'documents',
                            template: 'documents',
                            displayHelp: false,
                            checked: true,
                            checkError: function(value) {
                                if(value === true) {
                                    this.showError = true;
                                    manualProcess('documents')
                                    return
                                }
                                this.showError = false;
                            },
                            showError: false,
                            valid: false,
                            questionEnabled: false,
                            required: false
                        }
                        form1200Questions.splice(2, 0, obj)

                    }
     
                    if(vm.questionsParam.isYear3RenewalDue) {

                        var obj = { 
                            title: 'isYear3RenewalPaying',
                            template: 'renewal',
                            displayHelp: false,
                            checked: true,
                            checkError: null,
                            showError: false,
                            valid: true,
                            questionEnabled: false,
                            required: false
                        }
                        form1200Questions.push(obj)

                    }

                    form1200Questions.map(function(item, index) {
                        item.index = index
                        return item;
                    })

                }

            }        
        )
        .then(
            function(){
                form1200Service.setQuestions(form1200Questions)
            }
        )
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

    var destroyFrom;

    destroyFrom = $rootScope.$on('submitForm1200Data', function(e, data){    

        var arr = sortPageDetails(data.data.pageDetailsData);

        var formData = new FormData();
        var config = { headers: {'Content-Type': undefined} };

        if(data.data.isYear3RenewalDue) {
            formData.append('isYear3RenewalDue', data.data.isYear3RenewalDue);
        }
        if(data.data.showOptionalQuestion) {
            formData.append('showOptionalQuestion', data.data.showOptionalQuestion);
        }

        formData.append('pageDescriptionsUI', arr);
        formData.append('id', patent.patentID);
        formData.append('clientRef', data.data.clientRef);
        formData.append('totalClaims', parseInt(data.data.totalClaims));
        formData.append('totalPages', parseInt(data.data.totalPages));
        formData.append('validationStatesUI', data.data.validationStatesUI);
        formData.append('extensionStatesUI', data.data.extensionStatesUI);

        form1200Service.submitForm1200(formData, config)
        .then(
            function(response){
                form1200Generating();
                activeTabService.setTab(2)
                $state.go('portfolio.patent', {}, {reload: true});
            },
            function(errResponse){
                console.error('Error: Unable to generate form 1200. Error response: ', errResponse)
                form1200Errors() 
            }
        )

    })

    $scope.$on('$destroy', function() {
      destroyFrom(); // remove listener.
    }); 

    function form1200Generating() {

        var modalInstance = $uibModal.open({
            templateUrl: 'app/templates/modals/modal.form1200-generating.tpl.htm', //create html for notifications update success
            appendTo: undefined,
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', function($uibModalInstance){
                this.dismissModal = function () {
                    $uibModalInstance.close();
                };
            }]

        })

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

    function manualProcess(question) {// NOT NEEDED FOR RELEASE 1

        if(question == 'amendments') {

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
        }

        if(question == 'documents') {
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
        }
    }

} 