(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[6],{

/***/ "./app/features/case/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/angular/index.js
var node_modules_angular = __webpack_require__("./node_modules/angular/index.js");
var angular_default = /*#__PURE__*/__webpack_require__.n(node_modules_angular);

// EXTERNAL MODULE: ./app/features/portfolio/services/portfolio.cases.serv.js + 1 modules
var portfolio_cases_serv = __webpack_require__("./app/features/portfolio/services/portfolio.cases.serv.js");

// CONCATENATED MODULE: ./app/features/case/services/case.form1200.serv.js
/* harmony default export */ var case_form1200_serv = (angular.module('services.form1200-service', []).service('Form1200Service', Form1200Service).name);

Form1200Service.$inject = ['$http', '$q', 'Upload', 'ngCart'];

function Form1200Service($http, $q, Upload, ngCart) {

    var factory = {
        fetchQuestions: fetchQuestions,
        submitForm1200: submitForm1200,
        setQuestions: setQuestions,
        questions: '',
        getQuestions: getQuestions,
        inhibitForm1200: inhibitForm1200,
        generateForm1200: generateForm1200,
        deleteApplication: deleteApplication,
        editApplication: editApplication,
        updateNotifications: updateNotifications        
    }

    function inhibitForm1200(id, reason) {

        var deferred = $q.defer();

        var config = {
            params: {patent_id: id, failure_reason: reason}
        }

        $http.get(ppdomain+'rest-reject-form1200/', config)
        .then(
            function(response){
                deferred.resolve(response.data)
            },
            function(errResponse){
                console.error('Error: Unable to inhibit form1200. Error response:', errResponse);
                deferred.reject(errResponse.data)
            }
        )

        return deferred.promise;

    }

    function fetchQuestions(id) {

        var deferred = $q.defer();

        $http.get(ppdomain+'rest-start-form1200/'+id)
        .then(
            function(response){
                deferred.resolve(response.data)
            },
            function(errResponse){
                console.error('Error: Unable to fetch questions. Error response:', errResponse);
                deferred.reject(errResponse.data)
            }
        )

        return deferred.promise;
    }

    function submitForm1200(data, config) {

        var deferred = $q.defer();

        $http.post(ppdomain+'rest-form1200/', data, config)
        .then(
            function(response){
                deferred.resolve(response.data)
            },
            function(errResponse){
                console.error('Error: Unable to submit form1200. Error response:', errResponse);
                deferred.reject(errResponse.data)
            }
        )

        return deferred.promise;

    }

    function setQuestions(data){

        factory.questions = data;

    }

    function getQuestions() {
        return factory.questions;
    }

    function generateForm1200(data) {

        var deferred = $q.defer();

        $http.post(ppdomain+'rest-form1200/'+data)
        .then(
            function(response){
                deferred.resolve(response.data)
            },
            function(errResponse){
                deferred.reject(errResponse.data)
            }
        )

        return deferred.promise;

    }

    function updateNotifications(id, list) {

        var deferred = $q.defer()

        $http.put(ppdomain+'rest-epct-notifications/'+id, list)
        .then(
            function(response){
                deferred.resolve(response.data)
            },
            function(errResponse){
                deferred.reject(errResponse.data)
            }
        )

        return deferred.promise;
    }        

    function deleteApplication(patent) {
            
        var deferred = $q.defer()

        var actionIds = patent.p3sServicesWithFees.map(function(r){
            return r.actionID;
        })

        var cartItems = ngCart.getItems().map(function(r){
            return parseInt(r._id);
        })

        var found = actionIds.find(function(r) {
            return cartItems.indexOf(r) >= 0;
        })      

        if(found) {
            ngCart.removeItemById(found, true)
        }

        $http.delete(ppdomain+'rest-form1200/'+patent.patentID)
        .then(
            function(response){
                deferred.resolve(response.data)
            },
            function(errResponse){
                deferred.reject(errResponse.data)
            }
        )

        return deferred.promise;
    }

    function editApplication(id) {
            
        var deferred = $q.defer()  

        $http.put(ppdomain+'rest-form1200/'+id)
        .then(
            function(response){
                deferred.resolve(response.data)
            },
            function(errResponse){
                deferred.reject(errResponse.data)
            }
        )

        return deferred.promise;
    }       

    return factory;

}
// CONCATENATED MODULE: ./app/features/case/services/case.grant.serv.js
/* harmony default export */ var case_grant_serv = (angular.module('services.grant-service', []).factory('GrantService', GrantService).name);

GrantService.$inject = ['$http', '$q', '$timeout', 'ngCart'];

function GrantService($http, $q, $timeout, ngCart){

    var factory = {
        submitGrant: submitGrant,
        inhibitGrant: inhibitGrant,
        unhibitGrant: unhibitGrant,
        setQuestions: setQuestions,
        getQuestions: getQuestions,
        deleteGrant: deleteGrant,
        representativeCheck: representativeCheck
    }


    function unhibitGrant(patent) { //for manual processing items

        var deferred = $q.defer();

        $http.delete(ppdomain+'rest-inhibit-grant/'+patent.patentID)
        .then(
            function(response){
                deferred.resolve(response.data)
            },
            function(errResponse){
                console.error('Error: Unable to reset grant order. Error response:', errResponse);
                deferred.reject(errResponse.data)
            }
        )

        return deferred.promise;

    }

    function inhibitGrant(id, reason) {

        var deferred = $q.defer();

        var config = {
            params: {patent_id: id, failure_reason: reason}
        }        

        $http.get(ppdomain+'rest-inhibit-grant/', config)
        .then(
            function(response){
                deferred.resolve(response.data)
            },
            function(errResponse){
                console.error('Error: Unable create grant order. Error response:', errResponse);
                deferred.reject(errResponse.data)
            }
        )

        return deferred.promise;
    }

    function deleteGrant(patent) {

        var deferred = $q.defer();

        var actionIds = patent.p3sServicesWithFees.map(function(r){
            return r.actionID;
        })

        var cartItems = ngCart.getItems().map(function(r){
            return parseInt(r._id);
        })

        var found = actionIds.find(function(r) {
            return cartItems.indexOf(r) >= 0;
        })      

        if(found) {
            ngCart.removeItemById(found, true)
        }        

        $http.delete(ppdomain+'rest-grant/'+patent.patentID)
        .then(
            function(response){
                deferred.resolve(response.data)
            },
            function(errResponse){
                console.error('Error: Unable to reset grant order. Error response:', errResponse);
                deferred.reject(errResponse.data)
            }
        )

        return deferred.promise;

    }

    function submitGrant(data, config) {

        var deferred = $q.defer();

       $http.post(ppdomain+'rest-grant/', data, config)
       .then(
            function(response){
                deferred.resolve(response.data)
            },
            function(errResponse){
                console.error('Error: Unable to submit grant data. Error response:', errResponse);
                deferred.reject(errResponse)
            }
        )

        return deferred.promise;

    }

    function setQuestions(data){

        factory.questions = data;

    }

    function getQuestions() {
        return factory.questions;
    }    

    function representativeCheck(id) {
        
        var deferred = $q.defer();

        $http.get(ppdomain+'rest-start-grant/'+id)
        .then(
            function(response){
                deferred.resolve(response.data)
            },
            function(errResponse){
                console.error('Error: Unable to fetch conditional boolean value to display first question')
                deferred.reject(response.data)
            }
        )

        return deferred.promise

    }

    return factory;

}
// CONCATENATED MODULE: ./app/features/case/services/case.reminders.serv.js
/* harmony default export */ var case_reminders_serv = (angular.module('services.reminders-service', []).factory('RemindersService', RemindersService).name);

RemindersService.$inject = ['$q', '$http'];

function RemindersService($q, $http) {

    var factory = {
        updateNotifications: updateNotifications
    }

    function updateNotifications(id, list, url) {

        var deferred = $q.defer()

        $http.put(ppdomain+url+id, list)
        .then(
            function(response){
                deferred.resolve(response.data)
            },
            function(errResponse){
                deferred.reject(errResponse.data)
            }
        )

        return deferred.promise;
    }        

    return factory;

}
// CONCATENATED MODULE: ./app/features/case/services/case.renewal.serv.js
/* harmony default export */ var case_renewal_serv = (angular.module('services.renewal-service', []).service('RenewalHistoryService', RenewalHistoryService).name);

RenewalHistoryService.$inject = ['$http', '$q'];

function RenewalHistoryService($http, $q) {

    var factory = {
        fetchHistory: fetchHistory
    }

    function fetchHistory(id) {

        var deferred = $q.defer();

        $http.get(ppdomain+'rest-renewal-history/'+id)
        .then(
            function(response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while fetching renewal history');
                deferred.reject(errResponse.data);
            }
        );

        return deferred.promise;

    };

    return factory;

}
// CONCATENATED MODULE: ./app/features/case/services/case.validation.serv.js
/* harmony default export */ var case_validation_serv = (angular.module('services.validation-service', []).factory('ValidationService', ValidationService).name);

ValidationService.$inject = ['$http', '$q', 'Upload'];

function ValidationService($http, $q, Upload) {

	var factory = {
		fetchDesignatedStates: fetchDesignatedStates,
		deleteQuote: deleteQuote,
		requestQuote: requestQuote,
		fetchPreparedQuote: fetchPreparedQuote,
		submitPoas: submitPoas,
		poaUploadSuccessNotify: poaUploadSuccessNotify,
		poaUploadFailNotify: poaUploadFailNotify
	}

	function poaUploadSuccessNotify(id) {
		$http.post(ppdomain+'rest-validation-uploadPOACompleted/'+id)
	}

	function poaUploadFailNotify(id) {
		$http.post(ppdomain+'rest-validation-uploadPOAFailed/'+id)
	}	


	function submitPoas(id, data) {

		var deferred = $q.defer();

        Upload.upload({
            url: ppdomain+'rest-validation-uploadPOA/',
            data:{ 
                patentID: id,
                stateCode: data.stateCode,
                signedPoaDoc: data.signedPoaDoc
            },
            arrayKey: ''
        }).then(function (response) {
            deferred.resolve(response)

        }, function (errResponse) {
        	console.error('Error submiting poas. Error: ', errResponse)
            deferred.reject(errResponse)
        });

		return deferred.promise;

	}	


	function fetchDesignatedStates(id) {

		var deferred = $q.defer()

		$http.get(ppdomain+'rest-validation-quote-request/'+id) //VALIDATION TEST DATA 
		.then(
			function(response){
				deferred.resolve(response.data)
			},
			function(errResponse){
				console.error('Error returning validation service : ', errResponse)
				deferred.reject(errResponse)
			}	
		)

		return deferred.promise;

	}

	function requestQuote(formData) {

		var deferred = $q.defer();

		$http.post(ppdomain+'rest-validation-quote-request/', formData) //VALIDATION TEST DATA 
		.then(
			function(response){
				deferred.resolve(response.data)
			},
			function(errResponse){
				console.error('Error returning validation service : ', errResponse)
				deferred.reject(errResponse)
			}	
		)

		return deferred.promise;

	}

	function fetchPreparedQuote(id) {

		var deferred = $q.defer();

		$http.get(ppdomain+'rest-validation-quote/'+ id) //VALIDATION TEST DATA 
		.then(
			function(response){
				deferred.resolve(response.data)
			},
			function(errResponse){
				console.error('Error returning validation service fetchPreparedQuote : ', errResponse)
				deferred.reject(errResponse)
			}	
		)

		return deferred.promise;

	}		

	function deleteQuote(id) {

		var deferred = $q.defer();

		$http.delete(ppdomain+'rest-validation-quote/'+ id) //VALIDATION TEST DATA 
		.then(
			function(response){
				deferred.resolve(response.data)
			},
			function(errResponse){
				console.error('Error returning validation service deleteQuote : ', errResponse)
				deferred.reject(errResponse)
			}	
		)

		return deferred.promise;

	}	

	return factory;

}
// CONCATENATED MODULE: ./app/global/services/app.activeTab.serv.js
/* harmony default export */ var app_activeTab_serv = (angular.module('services.activetab-service', []).service('ActiveTabService', ActiveTabService).name);

ActiveTabService.$inject = ['$q', '$http'];

function ActiveTabService($q, $http) {

    var factory = {
        setTab: setTab,
        getTab: 0
    }

    function setTab(index) {
        factory.getTab = index;
    }

    return factory;

}
// EXTERNAL MODULE: ./app/global/services/app.core.serv.js
var app_core_serv = __webpack_require__("./app/global/services/app.core.serv.js");

// CONCATENATED MODULE: ./app/global/services/app.chunkData.serv.js
/* harmony default export */ var app_chunkData_serv = (angular.module('services.chunkdata-service', []).factory('ChunkDataService', ChunkDataService).name);

function ChunkDataService() {

	return {

		chunkData: function(arr, size) {

	    	var newArr = [];

    		for (var i=0; i < arr.length; i+=size) {
        		newArr.push(arr.slice(i, i+size));
        	}

        	return newArr;
	    	
		}

	}

}
// EXTERNAL MODULE: ./app/global/directives/dynamic.directive.js
var dynamic_directive = __webpack_require__("./app/global/directives/dynamic.directive.js");

// CONCATENATED MODULE: ./app/features/case/controllers/case.overview.controller.js
CaseOverviewController.$inject = ['caseSelected', '$scope', '$state', '$stateParams', '$timeout', 'CasesRestService', '$uibModal', 'RenewalHistoryService', 'ActiveTabService', '$mdDialog', 'ngCart']

function CaseOverviewController(caseSelected, $scope, $state, $stateParams, $timeout, CasesRestService, $uibModal, RenewalHistoryService, ActiveTabService, $mdDialog, ngCart) {

    var vm = this;

    vm.confirmDeletePatent = confirmDeletePatent;
    vm.closeCaseoverview = closeCaseoverview;
    vm.deletePatent = deletePatent;
    vm.refreshChart = refreshChart;
    vm.patent = caseSelected;
    vm.portfolioLoaded = false;
    vm.setTab = setTab;
    vm.checkAvailableAction = checkAvailableAction;
    vm.processView = processView
    vm.openMenu = openMenu;
    vm.pendingAssisted = null;
    vm.assistedAvailable = null;
    $scope.notInProgress = true;
    $scope.noReminders = false;
    $scope.caseoverview_tab = 'details';
    $scope.showOptions = false;
    $scope.activeLeft = 0;
    $scope.renewalHistory = null;
    vm.supportType = ['Intellectual Property', 'Assisted Formality Filing', 'WebApp Technical', 'Other'];

    var chartTimeout;
    var originatorEv;
    vm.openSupportMenu = openSupportMenu;
    vm.selectSupportType = selectSupportType;
    vm.selectMultiFormality = selectMultiFormality;

    var requestObj = {};

    var assistedOkStatuses = ['Epct available', 'Epct saved', 'Epct being generated', 'Grant available', 'Grant saved', 'Validation available', 'Preparing quote', 'Quote provided'];

    function findCommonElements3(arr1, arr2) {
        return arr1.some(item => arr2.includes(item))
    }

    function openSupportMenu($mdMenu, ev) {


        if(caseSelected.p3sServicesWithFees.length > 1) {
            vm.multipleFormalities = true;
            vm.displaySupportTypes = false;

        } else {

            if(!vm.assistedAvailable || vm.pendingAssisted) { //if status is not eligble for assisted formality filing || 

                var index = vm.supportType.indexOf('Assisted Formality Filing');
                if(index > -1) {                
                    vm.supportType.splice(index, 1);
                }
            }

            requestObj.formalityType = caseSelected.p3sServicesWithFees[0].serviceType;
            vm.multipleFormalities = false;
            vm.displaySupportTypes = true;
        }
        originatorEv = ev;
        $mdMenu.open(ev);
    }

    function selectMultiFormality(type) {

        var index = vm.supportType.indexOf('Assisted Formality Filing');
        if(type =='renewal') {
            if(index >= 0) {            
                vm.supportType.splice(index, 1);
            }
        }
        if(type =='grant') {

            var formalityStatus = caseSelected.p3sServicesWithFees.find(function(x){
                return x.serviceType == 'grant';
            }).serviceStatus;

            var mappedStatuses = caseSelected.p3sServicesWithFees.map(function(item){
                return item.serviceStatus;
            })

            vm.pendingAssisted = caseSelected.p3sServicesWithFees.some(function(item){
                return item.supportRequestedBy !== null;
            })

            vm.assistedAvailable = assistedOkStatuses.some(function(item){
                return item == formalityStatus;
            })

            if(!findCommonElements3(mappedStatuses, assistedOkStatuses) || vm.pendingAssisted) { //if assisted filing isn't available
                var index = vm.supportType.indexOf('Assisted Formality Filing');
                if(index > -1) { 
                    vm.supportType.splice(index, 1);
                }
            }


            if(index < 0 && vm.assistedAvailable) { //if user has previously selected 'renewal', populate array with assisted formality filing
                vm.supportType.push('Assisted Formality Filing')
            }
        }             
        requestObj.formalityType = type;
        vm.multipleFormalities = false;
        vm.displaySupportTypes = true;
    }    

    function confirmRequestForSupport(obj) {

        var modalInstance = $uibModal.open({
            template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.confirm-requesting-assitance.tpl.htm"),
            scope: $scope,
            controllerAs:'$ctrl',
            backdrop: 'static',
            keyboard: false,
            controller: ['$uibModalInstance', function($uibModalInstance) {

                this.supportType = obj.supportType;
                this.epApplicationNumber = obj.epApplicationNumber;
                
                this.cancel = function () {
                    $uibModalInstance.close();
                };

                this.confirm = function () {
                    $state.go('general-support', {supportObj: obj});
                };                    

            }]

        })
    }

    function selectSupportType(type) {

        requestObj.supportType = type;
        requestObj.epApplicationNumber = caseSelected.ep_ApplicationNumber;
        requestObj.patentID = caseSelected.patentID;            
        if(type !== 'Assisted Formality Filing') {
            confirmRequestForSupport(requestObj)
        } else {
            var modalInstance = $uibModal.open({
                template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.assisted-formality-details.tpl.htm"),
                scope: $scope,
                controllerAs:'$ctrl',
                backdrop: 'static',
                keyboard: false,
                windowClass: 'wide-modal',
                controller: ['$uibModalInstance', function($uibModalInstance) {
                    
                    this.cancel = function () {
                        $uibModalInstance.close(false);
                    };

                    this.confirm = function () {
                        $uibModalInstance.close(true);
                    };

                    this.feeOject = {                           
                        'epctSupportFee': 900,
                        'grantSupportFee': 600,
                        'valAnySupportFee': 550,
                        'valLondonSupportFee': 300
                    }

                }]


            })

            modalInstance.result.then(function(x){
                if(x) {
                    requestObj.supportType = type;
                    confirmRequestForSupport(requestObj)
                }
            })
        }
    }

    function processView(tab, index, chart) {

        if(!$scope.notInProgress || (tab == 'reminders' &&  !$scope.noReminders)  || tab == 'details') {
            vm.setTab(tab)
            $scope.activeLeft = index;
            if(chart !== undefined) {
                vm.refreshChart()
            }
        }
    }

    function openMenu($mdMenu, ev) {
        originatorEv = ev;
        $mdMenu.open(ev);
    };

    function init() {

        if($stateParams.form1200generate === 1) {
            $scope.activeLeft = 2;
            $scope.caseoverview_tab = 'form1200';
            ActiveTabService.setTab(0);
        }

        if($stateParams.prepareGrant === 1) {
            $scope.activeLeft = 4;
            $scope.caseoverview_tab = 'grantandpublishing';
            ActiveTabService.setTab(0);
        }

        if($stateParams.validationQuote === 1) {
            $scope.activeLeft = 8;
            $scope.caseoverview_tab = 'validation';
            ActiveTabService.setTab(0);
        }        

        $scope.promise.then(
            function(){

                $scope.phoneNumber = $scope.ppDetails.partnerPhone;
                vm.portfolioLoaded = true;
                RenewalHistoryService.fetchHistory(caseSelected.patentID) //needs to be invoked outside of availableServices. A service wont be available even if there is renewal history
                .then(
                    function(response){
                        $scope.renewalHistory = response;
                        if(response.length > 0) {
                           vm.displayRenewalHistoryTab = true;
                           return;
                        }
                        vm.displayRenewalHistoryTab = false;
                    }
                )


                $scope.noReminders = caseSelected.p3sServicesWithFees.some(function(item){
                    return item.saleType == 'Not In Progress' && item.serviceStatus == 'NotUsed';
                })
                 
                $scope.notInProgress = caseSelected.p3sServicesWithFees.every(function(item){
                    return (item.saleType == 'Not In Progress' && item.serviceType !== 'validation' && item.serviceStatus !== 'Completed')|| (item.serviceType == 'validation' && (item.serviceStatus == 'Validation available' || item.serviceStatus == 'Preparing quote')) || (item.saleType == 'Offline' && item.serviceType == 'validation');
                })

                $scope.availableServices = caseSelected.p3sServicesWithFees.filter(function(o){
                    return o.saleType !== 'Not In Progress' || (o.saleType == 'Not In Progress' && o.serviceType == 'validation' && o.serviceStatus == 'Completed');
                }).map(function(k, index){
                    if(k.serviceType == 'epct') { k.serviceType = 'Euro-PCT' }
                    return {id: index, action: k.serviceType, status: k.serviceStatus, type: k.saleType, urgent: k.isUrgentAttention}
                })

                $scope.availableServices.forEach(function(obj){
  
                    if(obj.type == 'Not In Progress' && obj.action !== 'validation' && obj.status !== 'Completed') { return; }

                    if(obj.action == 'Euro-PCT') {
                        vm.displayForm1200Tab = true;
                    }

                    if(obj.action == 'grant') {
                        // if(obj.status == 'Grant available' || obj.status == 'Grant saved' || obj.status == 'Manual processing' || obj.status == 'Payment in progress' || obj.status == 'EPO instructed' ) {
                            vm.displayGrantTab = true;
                        // }
                    }

                    if(obj.action == 'validation') {
                        vm.displayValidationTab = true;
                    }
                })

                vm.pendingAssisted = caseSelected.p3sServicesWithFees.some(function(item){
                    return item.supportRequestedBy !== null;
                })
                
                vm.assistedAvailable = caseSelected.p3sServicesWithFees.some(function(item){
                    return assistedOkStatuses.includes(item.serviceStatus)
                })

            }
        )

    }

    init()

    function refreshChart (){
        chartTimeout = $timeout(function(){  
            var evt = document.createEvent('UIEvents');
            evt.initUIEvent('resize', true, false, window, 0);
            window.dispatchEvent(evt);
        }, 300)
    }

    function setTab(tab) {
        $scope.caseoverview_tab = tab;
    }

    function closeCaseoverview() {
        $state.go('portfolio', {}, {reload: false})
    }

    function confirmDeletePatent(patent) {

        var modalInstance = $uibModal.open({
            template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.confirm-delete-patent.tpl.htm"),
            appendTo: undefined,
            backdropClass: 'second-backdrop',
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                this.dismissModal = function() {
                    $uibModalInstance.close();
                };

                this.deletePatent = function() {
                    this.deleteInprogress = true;
                    deletePatent(patent);
                    $timeout(function() {
                        $uibModalInstance.close();
                    }, 300);
                };

                this.cancelDeletion = function() {
                    $uibModalInstance.close();
                };

            }]
        });
    };

    function deletePatent(patent){


        var actionIds = patent.p3sServicesWithFees.map(function(r){
            return r.actionID;
        })

        var cartItems = ngCart.getItems().map(function(r){
            return parseInt(r._id);
        })

        var found = actionIds.find(function(r) {
            return cartItems.indexOf(r) >= 0;
        })      

        if(found) {
            ngCart.removeItemById(found, true)
        }

        

        CasesRestService.deletePatent(patent.patentID)
        .then(
            function(response){
                $state.go('portfolio', {}, {reload: true})
            },
            function(errResponse){
                deletePatentError(errResponse);
            }
        );
    };

    function deletePatentError(errResponse) {

        if(errResponse.status === 304) {
            var modalInstance = $uibModal.open({
                template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.delete-patent-error-trans.tpl.htm"),
                appendTo: undefined,
                controllerAs: '$ctrl',
                controller: ['$uibModalInstance', function($uibModalInstance) {

                    // vm.updatePatent(id); DONT THINK IS NEEDED

                    this.dismissModal = function () {
                        $uibModalInstance.close();
                    };
                }]
            });
        } else {
            var modalInstance = $uibModal.open({
                template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.delete-patent-error.tpl.htm"),
                appendTo: undefined,
                controllerAs: '$ctrl',
                controller: ['$uibModalInstance', function($uibModalInstance) {

                    // vm.updatePatent(id); DONT THINK IS NEEDED

                    this.dismissModal = function () {
                        $uibModalInstance.close();
                    };
                }]
            });
        }

    }

    function checkAvailableAction(services) {
        vm.actionsAvailable = services.some(function(item){
            return item.saleType === 'Online' || item.saleType === 'Offline' || (item.saleType === 'In Progress' && item.serviceStatus !== 'Preparing quote');
        })
    }

    $scope.$on('$destroy', function(){
        $timeout.cancel(chartTimeout);
    })


    
}
// CONCATENATED MODULE: ./app/features/case/controllers/case.costchart.controller.js
CostChartController.$inject = ['caseSelected', 'ca','$scope', '$timeout']

function CostChartController(caseSelected, ca, $scope, $timeout) {

    var vm = this;

    vm.patent = caseSelected;
    vm.setData = setData;
    vm.barData = null;
    var costTimeout;

    $scope.$parent.promise
    .then(
        function(response){

            if(response.length > 0 && $scope.$parent.availableServices.length) {
                costTimeout = $timeout(function(){

                    vm.data = {};
                    vm.data.availableAction = $scope.$parent.availableServices;
                    vm.data.selectedAction = { id: vm.data.availableAction[0].id, action: vm.data.availableAction[0].action };

                    if(ca !== undefined || typeof ca !== 'undefined') {
             
                        vm.barOptions = {
                            chart: {
                                type: 'multiBarHorizontalChart',
                                barColor: [],
                                tooltip: {
                                    hideDelay: 0,
                                    contentGenerator: function(d) {
                                        var str = '<div style="font-weight:bold; margin:auto; text-align:center;">' +d.data.tip +'</div>';
                                        return str;
                                    }
                                },                
                                height: 350,
                                showControls: false,
                                showValues: true,
                                showLegend: false,
                                stacked: true,
                                duration: 500,
                                margin: {
                                    left: 90,
                                    right: 10
                                },
                                x: function(d){
                                    return d.x;
                                },
                                y: function(d){
                                    return d.y;
                                },
                                multibar: {
                                    groupSpacing: 0.4
                                },
                                xAxis: {
                                    axisLabel: 'Date',
                                    tickFormat: function(d) {
                                        return d3.time.format('%x')(new Date(d))
                                    },
                                    axisLabelDistance: 25,                         
                                    showMaxMin: false,
                                    rotateYLabel: true, orient: 'left', css:{ 'transform':'rotate(45deg)' }
                                },
                                yAxis: {
                                    axisLabel: 'Cost',
                                    tickFormat: function(d){
                                        return d3.format('.02f')(d);
                                    },       
                                    showMaxMin: false
                                }
                            }
                        } //barOptions end

                    }   

                    setData(vm.data.selectedAction.action)
                })
               
            } //outer if condition
        }
    )


    function setData(type) {

        if(type === undefined || typeof type === 'undefined') {
            return;
        }

        var barChartData = ca.filter(function(item){
            if(item.info == 'epct') { item.info = 'Euro-PCT' }
            return item.info === type;
        }).map(function(data){
            return data.data;
        })

        if(type == 'renewal') {
            vm.barOptions.chart.barColor = ["#3c3c3b", "#0097ce", "#e30613", "#f9b233", "#53ab58"];
        }

        if(type == 'Euro-PCT' || type == 'grant') {

            vm.barOptions.chart.barColor = ["#e30613", "#f9b233", "#53ab58"];
        }     

        var barChartArr = [], label = [], barData = [], tip = [];;

        var objIndex = 0;

        for(var item in barChartData[0]) {
            if(barChartData[0].hasOwnProperty(item)) {
                if((item.includes('StartDate')) && (!item.includes('UI'))) {
                    label.push(barChartData[0][item]);
                }

                if((item.includes('StartDateUI'))) {
                    tip.push(barChartData[0][item]);
                }

                if(item.includes('Cost') && barChartData[0][item] !== null) {
                    barData.push(barChartData[0][item]);
                }
            }
        }
      
        for (var i = 0; label.length && i < barData.length; i++) {
            barChartArr[i] = {'y': barData[i], 'x':label[i], 'tip':tip[i]}; //pairs the items from two arrays into a single array in the new array
        }

        barChartArr.reverse();

        vm.barData = [
            {
                'key': 'Cost',
                'values': barChartArr
            }
        ]
    }

    $scope.$on('$destroy', function(){
        $timeout.cancel(costTimeout)
    })

}
// CONCATENATED MODULE: ./app/features/case/controllers/case.details.controller.js
CaseDetailsController.$inject = ['caseSelected', '$scope', '$state', 'CasesRestService', '$uibModal']

function CaseDetailsController(caseSelected, $scope, $state, CasesRestService, $uibModal) {

	var vm = this;

	vm.patent = caseSelected;
    vm.updatePatent = updatePatent;    

    function updatePatentSuccess() {

        var modalInstance = $uibModal.open({
            template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.update-patent-success.tpl.htm"),
            appendTo: undefined,
            backdropClass: 'second-backdrop',
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', function($uibModalInstance){

                this.dismissModal = function() {
                    $uibModalInstance.close();
                };

            }]

        });
        
    }

    function updatePatentError() {

        var modalInstance = $uibModal.open({
            template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.update-patent-error.tpl.htm"),
            appendTo: undefined,
            backdropClass: 'second-backdrop',
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', function($uibModalInstance){

                this.dismissModal = function() {
                    $uibModalInstance.close();
                };

            }]

        });

    }

    function updatePatent(patent) {

        CasesRestService.updatePatent(patent, patent.patentID)
        .then(
            function(response){
                updatePatentSuccess();
            },
            function(errResponse){
                updatePatentError();
            }
        )

    };


}
// CONCATENATED MODULE: ./app/features/case/controllers/case.form1200-generated.controller.js
Form1200GeneratedController.$inject = ['$scope', '$state', 'Form1200Service', '$timeout', '$uibModal'];

function Form1200GeneratedController($scope, $state, Form1200Service, $timeout, $uibModal) {

    var vm = this;


    function init() {

        $scope.phoneNumber = $scope.ppDetails.partnerPhone;
        $scope.patent = $scope.$parent.patent
        $scope.confirmDeleteApplication = confirmDeleteApplication;
        $scope.deleteApplicationReq = false;

        var assistedOkStatuses = ['Epct available', 'Epct saved', 'Epct being generated'];

        vm.pendingAssisted = $scope.patent.p3sServicesWithFees.some(function(item){
            return item.supportRequestedBy !== null;
        })
        
        vm.assistedAvailable = $scope.patent.p3sServicesWithFees.some(function(item){
            return assistedOkStatuses.includes(item.serviceStatus)
        })

    }

    init()

    function confirmDeleteApplication(id) {

        var modalInstance = $uibModal.open({
            template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.confirm-delete-epct-application-success.tpl.htm"), //create html for notifications update success
            appendTo: undefined,
            backdropClass: 'second-backdrop',
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', function($uibModalInstance){

                this.confirm = function() {
                    deleteApplication($scope.patent)
                    $uibModalInstance.close();
                }

                this.dismissModal = function () {
                    $uibModalInstance.close();
                    
                };
               
            }]

        });      

    }

    function deleteApplication(patent) {
        $scope.deleteApplicationReq = true;
        Form1200Service.deleteApplication(patent)
        .then(
            function(response){
                deleteApplicationSuccess();
            },
            function(errResponse){
                deleteApplicationError(errResponse);
            }
        )

    }

    function deleteApplicationSuccess() {

        $scope.deleteApplicationReq = true;

        var modalInstance = $uibModal.open({
            template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.delete-epct-application-success.tpl.htm"), //create html for notifications update success
            appendTo: undefined,
            backdropClass: 'second-backdrop',
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', function($uibModalInstance){
                this.dismissModal = function () {
                    $uibModalInstance.close();
                    
                };

                $state.reload('portfolio.modal.case'); //go to patent info on successful deletion

                $scope.$on('$destroy', function(){
                    $timeout.cancel(timeout)
                })
               
            }]

        });
    }

    function deleteApplicationError(errResponse) {

        var modalInstance = $uibModal.open({
            template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.delete-epct-application-error.tpl.htm"), //create html for notifications update success
            appendTo: undefined,
            backdropClass: 'second-backdrop',
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', function($uibModalInstance){

                this.error = errResponse;

                this.dismissModal = function () {
                    $uibModalInstance.close();
                };

            }]

        });

    }

    function editApplicationError(errResponse) {

        var modalInstance = $uibModal.open({
            template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.edit-epct-application-error.tpl.htm"), //create html for notifications update success
            appendTo: undefined,
            backdropClass: 'second-backdrop',
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', function($uibModalInstance){

                this.error = errResponse;

                this.dismissModal = function () {
                    $uibModalInstance.close();
                };

            }]

        });

    }


}
// CONCATENATED MODULE: ./app/features/case/controllers/case.form1200-ready.controller.js
Form1200ReadyController.$inject = ['caseSelected', '$scope', '$state', '$timeout', '$compile', '$uibModal', 'Form1200Service', 'ActiveTabService'];

function Form1200ReadyController(caseSelected, $scope, $state, $timeout, $compile, $uibModal, Form1200Service, ActiveTabService) {

    var vm = this;


    vm.patent = caseSelected;
    $scope.patent = caseSelected; //needed for generated controller
    vm.initiateForm1200 = initiateForm1200;
    
    vm.templates = [ //compiled with help of dynamic directive
        { name: 'form1200intro.html', url: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/europct/europct.form1200.intro.tpl.htm")},
        { name: 'form1200questions.html', url: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/europct/europct.form1200.questionnaire.tpl.htm")},
        { name: 'form1200generated.html', url: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/europct/europct.form1200.generated.tpl.htm")},
        { name: 'form1200manual.html', url: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/europct/europct.form1200.manual.tpl.htm")}
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

            var assistedOkStatuses = ['Epct available', 'Epct saved', 'Epct being generated'];

            vm.pendingAssisted = caseSelected.p3sServicesWithFees.some(function(item){
                return item.supportRequestedBy !== null;
            });
            
            vm.assistedAvailable = caseSelected.p3sServicesWithFees.some(function(item){
                return assistedOkStatuses.includes(item.serviceStatus)
            });

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
                vm.patent.test = 'test;'
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
                template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.not-checking-claims.tpl.htm"),
                appendTo: undefined,
                backdropClass: 'second-backdrop',
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
                template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.not-paying-excess.tpl.htm"),
                appendTo: undefined,
                backdropClass: 'second-backdrop',
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
            var template = '<p>﻿﻿If you are not able to declare that you are an entity or a natural person, The Patent Place can offer help with your application offline\
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
            template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.confirm-cancel-1200.tpl.htm"),
            appendTo: undefined,
            backdropClass: 'second-backdrop',
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
            template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.invalid-page-nos.tpl.htm"),
            appendTo: undefined,
            backdropClass: 'second-backdrop',
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


        if($scope.excessobject.excessdocs){

            if($scope.excessobject.excessdocs.yes) {
                uploadRequired = true;
            }
            if($scope.excessobject.excessdocs.no) {
                uploadRequired = false;
            }
            formData.append('isUploadRequired', uploadRequired)
            
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

        if(data.amended) {
            if(data.amended.amendedDoc) {
                formData.append('amendedDoc', data.amended.amendedDoc)
            }
        }

        formData.append('isYear3RenewalPaying', data.isYear3RenewalPaying ? data.isYear3RenewalPaying.yes : false);
        formData.append('isExcessClaimsPaying', $scope.excessobject.excessclaims ?  $scope.excessobject.excessclaims.yes : false)

        if($scope.validate.amendments) {
            if($scope.validate.amendments.no) {
                if(formData.get('isUploadRequired')) {
                    delete formData.delete('isUploadRequired');
                }
            }
            
        }

        Form1200Service.submitForm1200(formData, config)
        .then(
            function(response){

                var modalInstance = $uibModal.open({
                    template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.form1200-generating.tpl.htm"), //create html for notifications update success
                    appendTo: undefined,
                    backdropClass: 'second-backdrop',
                    controllerAs: '$ctrl',
                    controller: ['$uibModalInstance', function($uibModalInstance){
                        this.dismissModal = function () {
                            $uibModalInstance.close();
                        };
                    }]

                })
                ActiveTabService.setTab(2);

                $state.reload('portfolio.modal.case');

            },
            function(errResponse){
                console.error('Error : ', errResponse)
                var modalInstance = $uibModal.open({
                    template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.generate-form1200-error.tpl.htm"),
                    appendTo: undefined,
                    backdropClass: 'second-backdrop',
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
            backdropClass: 'second-backdrop',
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
// CONCATENATED MODULE: ./app/features/case/controllers/case.fxchart.controller.js
FxChartController.$inject = ['caseSelected', 'ca', '$scope', '$timeout', '$state']

function FxChartController(caseSelected, ca, $scope, $timeout, $state) {

    var vm = this;

    vm.patent = caseSelected;
    vm.setData = setData;
    vm.lineData = null;
    var fxTimeout;

    $scope.$parent.promise
    .then(
        function(response){
            if(response.length > 0 && $scope.$parent.availableServices.length) {
                fxTimeout = $timeout(function(){

                    vm.data = {};
                    vm.data.availableAction = $scope.$parent.availableServices;
                    vm.data.selectedAction = { id: vm.data.availableAction[0].id, action: vm.data.availableAction[0].action }
                    
                    if(ca !== undefined || typeof ca !== 'undefined') {
                       
                        vm.lineOptions = {
                            chart: {
                                type: 'lineChart',
                                height: 350,
                                margin : {
                                    top: 30,
                                    right: 50,
                                    bottom: 30,
                                    left: 50
                                },
                                clipEdge: false,
                                duration: 500,
                                tooltip: {
                                  hideDelay: 0
                                },                      
                                showLegend: false,
                                x: function(d, i){ 
                                    return d[0];
                                },
                                y: function(d){
                                    return d[1];
                                },
                                useInteractiveGuideline: true,
                                xAxis: {
                                    tickFormat: function (d, i) {
                                        return d3.time.format('%x')(new Date(d));
                                    },
                                    axisLabelDistance: 20,
                                    staggerLabels: false,
                                    rotateLabels: 0,
                                    rotateYLabel: true,
                                    showMaxMin: true,
                                    height: 60,
                                    ticks: null,
                                    width: 75,
                                    margin: {
                                        top: 0,
                                        right: 0,
                                        bottom: 0,
                                        left: 0
                                    },
                                    duration: 250,
                                    orient: 'bottom',
                                    tickValues: null,
                                    tickSubdivide: 0,
                                    tickSize: 6,
                                    tickPadding: 10,
                                    domain: [
                                        0,
                                        1
                                    ],
                                    range: [
                                        0,
                                        1
                                    ]           
                                },
                                yAxis: {
                                    tickFormat: function(d){
                                        return '$ ' + d3.format('.00f')(d);
                                    },
                                    axisLabelDistance: 20,
                                    rotateLabels: 0,
                                    rotateYLabel: true,
                                    showMaxMin: true,
                                    height: 60,
                                    width: 75,
                                    margin: {
                                        top: 0,
                                        right: 0,
                                        bottom: 0,
                                        left: -30
                                    },
                                    duration: 250,
                                    orient: 'left',
                                    tickValues: null,
                                    tickSubdivide: 0,
                                    tickSize: 6,
                                    tickPadding: 10,
                                    domain: [
                                        0,
                                        1
                                    ],
                                    range: [
                                        0,
                                        1
                                    ]
                                },
                                tooltip: {
                                    keyFormatter: function(d) {
                                        return d3.time.format('%x')(new Date(d));
                                    }
                                },
                                useVoronoi: false,
                                lines: {
                                    interactive: true
                                },
                                showXAxis: true,
                                showYAxis: true
                            }
                        }

                        setData(vm.data.selectedAction.action)

                    }
                }) //timeout end
            }

        })

        function setData(type) {


            if(type === undefined || typeof type === 'undefined') {
                return;
            }

            var fxChartData = ca.filter(function(item){
                if(item.info == 'epct') { item.info = 'Euro-PCT' }
                return item.info === type;
            }).map(function(data){
                return data.data.lineChart;
            })

            var lineDataArr = [];

            for (var property in fxChartData[0]) { //change lineData
                if (fxChartData[0].hasOwnProperty(property)) {
                    var dayData = fxChartData[0][property].currentOfficialFeeUSD !== undefined ? fxChartData[0][property].currentOfficialFeeUSD : fxChartData[0][property];
                    var str = property.split("T").shift();
                    var date = new Date(str).getTime();
                    lineDataArr.push([date, dayData]);
                }
            }                
            

            vm.lineData = [
                {
                    values: lineDataArr,
                    color: '#2ca02c'
                }
            ]

        }  //setData send

        $scope.$on('$destroy', function(){
            $timeout.cancel(fxTimeout)
        })

}
// CONCATENATED MODULE: ./app/features/case/controllers/case.grant.controller.js
GrantController.$inject = ['caseSelected', '$scope', '$uibModal', '$state', '$timeout', 'GrantService', '$compile', '$cookies'];

function GrantController(caseSelected, $scope, $uibModal, $state, $timeout, GrantService, $compile, $cookies) {

	var vm = this;

	vm.patent = caseSelected;
	vm.initiateGrantOrder = initiateGrantOrder;
    vm.templates = [
        { name: 'grantintro.html', url:  __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/grant/grant.intro.tpl.htm")},
        { name: 'grantquestions.html', url: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/grant/grant.questionnaire.tpl.htm")},
        { name: 'grantgenerated.html', url: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/grant/grant.ready.tpl.htm")}
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

        var assistedOkStatuses = ['Grant available', 'Grant saved'];

        vm.pendingAssisted = caseSelected.p3sServicesWithFees.some(function(item){
            return item.supportRequestedBy !== null;
        })
        
        vm.assistedAvailable = caseSelected.p3sServicesWithFees.some(function(item){
            return assistedOkStatuses.includes(item.serviceStatus)
        })

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

        vm.formDataSubmitted = true; 
        var formData = new FormData();
        var config = { headers: {'Content-Type': undefined} };
        var notifyWhenValidationAvailable = true; //REMOVE EVENTALLY. QUICK FIX. PROPERTY NOT REQUIRED
        formData.append('patentID', caseSelected.patentID);
        formData.append('clientRef', data.clientRef);
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
        
        var cookieExp = new Date();
        cookieExp.setDate(cookieExp.getDate() + 1);

        var attempts = $cookies.get('grantAttempts');

        if(!attempts) {
            $cookies.put('grantAttempts', 1);
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
                    template:  __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.grant-order-prepared.tpl.htm"),
                    appendTo: undefined,
                    backdropClass: 'second-backdrop',
                    controllerAs: '$ctrl',
                    controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                        this.dismissModal = function() {
                            $uibModalInstance.close();
                        };

                    }]
                });

                $state.go('portfolio.modal.case', {caseId: caseSelected.patentID, prepareGrant: 1, form1200generate: 0}, {reload: false})

            },
            function(errResponse){

                if(errResponse.status !== 406) {

                    vm.formDataSubmitted = false; 
                    var modalInstance = $uibModal.open({
                        template:  __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.grant-order-not-prepared.tpl.htm"),
                        appendTo: undefined,
                        backdropClass: 'second-backdrop',
                        controllerAs: '$ctrl',
                        controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                            this.phoneNumber = $scope.ppDetails.partnerPhone;

                            this.dismissModal = function() {
                                $uibModalInstance.close();
                            };

                        }]
                    });     
                }

                if(errResponse.status == 406 && attempts == undefined ) {

                    vm.formDataSubmitted = false; 
                    var modalInstance = $uibModal.open({
                        template:  __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.grant-first-mismatch.tpl.htm"),
                        appendTo: undefined,
                        backdropClass: 'second-backdrop',
                        controllerAs: '$ctrl',
                        controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                            this.phoneNumber = $scope.ppDetails.partnerPhone;

                            this.dismissModal = function() {
                                $uibModalInstance.close();
                            };

                        }]
                    });   
                }

                if(errResponse.status == 406 && attempts >= 1) {
                    var modalInstance = $uibModal.open({
                        template:  __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.grant-second-mismatch.tpl.htm"),
                        appendTo: undefined,
                        backdropClass: 'second-backdrop',
                        controllerAs: '$ctrl',
                        controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                            this.phoneNumber = $scope.ppDetails.partnerPhone;

                            this.dismissModal = function() {
                                $uibModalInstance.close();
                            };

                        }]
                    });

                    $state.reload('portfolio.modal.case');
                }

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
        var reason = ''
        if(question == 'representative' && value === true) {
            obj.title = 'Representative';
            var template = '<p>If you confirm that you do not wish IP Place to act as representative, The Patent Place can offer help with your application offline\
                via a Patent Administrator, and the order will become unavailable to process online. For further help please contact The Patent Place via\
                 email: support@ip.place, or phone: '+ $scope.phoneNumber + '</p>';
            obj.message = $compile(template)($scope);
            reason = 'RefusedRepresentativeChange';
        }
        if(question == 'approveText' && value === true) {
            obj.title = 'Patent Specification';
            var template = '<p>If you confirm that you do not approve the text of the Patent Specification, The Patent Place can offer help with your application offline\
                via a Patent Administrator, and the order will become unavailable to process online. For further help please contact The Patent Place via\
                 email: support@ip.place, or phone: '+ $scope.phoneNumber + '</p>';     
            obj.message = $compile(template)($scope);
            reason = 'NotApproved71(3)';      
        }

        inhibitGrantConfirm(obj, reason);  
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
            template:  __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.confirm-uninhibit-grant-order.tpl.htm"),
            appendTo: undefined,
            backdropClass: 'second-backdrop',
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                this.uninhibitGrant = function() {
                    $uibModalInstance.close();
                    GrantService.unhibitGrant(caseSelected)
                    .then(
                        function(response){
                            $state.reload('portfolio.modal.case');
                            var modalInstance = $uibModal.open({
                                template:  __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.grant-order-uninhibited.tpl.htm"),
                                appendTo: undefined,
                                backdropClass: 'second-backdrop',
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
                    $state.reload('portfolio.modal.case');
                };

            }]
        });

    }


    function inhibitGrantConfirm(message, reason) {

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
            backdropClass: 'second-backdrop',
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', '$timeout', '$state', function($uibModalInstance, $timeout, $state){

                if(caseSelected.p3sServicesWithFees[0].serviceStatus === 'Grant available') {

                    this.confirm = function() {
                        GrantService.inhibitGrant(caseSelected.patentID, reason)
                        .then(
                            function(response) {
                                $state.reload('portfolio.modal.case');
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
            template:  __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.confirm-delete-grant-order.tpl.htm"),
            appendTo: undefined,
            backdropClass: 'second-backdrop',
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                this.deleteGrant = function() {
                    $uibModalInstance.close();
                    GrantService.deleteGrant(caseSelected)
                    .then(
                        function(response){
                            $state.reload('portfolio.modal.case');
                            var modalInstance = $uibModal.open({
                                template:  __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.grant-order-deleted.tpl.htm"),
                                appendTo: undefined,
                                backdropClass: 'second-backdrop',
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
                    $state.reload('portfolio.modal.case');
                };

            }]
        });
    }
}
// CONCATENATED MODULE: ./app/features/case/controllers/case.reminders.controller.js
RemindersController.$inject = ['caseSelected', '$scope', '$rootScope', '$uibModal', 'ChunkDataService', 'RemindersService', 'CoreService'];

function RemindersController(caseSelected, $scope, $rootScope, $uibModal, ChunkDataService, RemindersService,  CoreService) {

    var vm = this;

    vm.patent = caseSelected;
    vm.updateNotifications = updateNotifications;
    vm.displayNotifications = displayNotifications;
    vm.notificationNavItems = [];
    vm.notificationUrl = 'rest-renewal-notifications/';
    vm.openGuide = openGuide;
    vm.notificationUi; //required for uopdating notifications
    vm.notificationUrl;
    var colors = ['green', 'amber', 'red', 'blue', 'black'];
    vm.validationReminders = false;
    vm.toBlueOrNotToBlue = false;
    vm.data = {    
        availableAction: [],
        selectedAction: {}
    }

    vm.activeTab = 0;

    function checkServices() {

        vm.data.availableAction = caseSelected.p3sServicesWithFees.filter(function(item){
            return item.serviceType !== 'postgrant';
        }).map(function(action, idx){
            if(action.serviceType == 'epct') { action.serviceType = 'Euro-PCT'}
            return {id: idx, action: action.serviceType}
        })

        vm.data.selectedAction = vm.data.availableAction[0];

    }

    checkServices();

    vm.notifications = {};

    function displayNotifications(action) {  //displays the specifed actions notifications

        if(typeof action == undefined) { return; }

        if(action == 'Euro-PCT') { 
            vm.notificationUi = 'allEpctNotificationUIs';
            vm.notificationUrl = 'rest-epct-notifications/';
            vm.toBlueOrNotToBlue = false; //USED TO DETERMINE WHETHER TO DISPLAY BLUE
        }

        if(action == 'renewal') {
            vm.notificationUi = 'allRenewalNotificationUIs';
            vm.notificationUrl = 'rest-renewal-notifications/';
            vm.toBlueOrNotToBlue = true;
        }

        if(action == 'grant') {
            vm.notificationUi = 'allGrantNotificationUIs';
            vm.notificationUrl = 'rest-grant-notifications/';
            vm.toBlueOrNotToBlue = false;
        }

        if(action == 'validation') {
            vm.notificationUi = 'allValidationNotificationUIs';
            vm.notificationUrl = 'rest-validation-notifications/';
            vm.toBlueOrNotToBlue = false;
            colors = ['green', 'red'];
            vm.validationReminders = true;
        }        

        if(action !== 'N/A') { 
            phaseNotifications();
        }


    };

    function phaseNotifications() {  //all info assigned to scope is requried for submitting data

        for(var i = 0; colors.length > i; i++) {
            if(vm.toBlueOrNotToBlue) {
                vm.notifications[colors[i]] = ChunkDataService.chunkData(fetchNotificationUi(colors[i], caseSelected[vm.notificationUi]), 6)//chunk data makes sure the coluns go no more than 6
            }
            if(!vm.toBlueOrNotToBlue) {
                if(!vm.validationReminders) {                
                    if(i == 3) { break }; //if only green, amber and red available
                    vm.notifications[colors[i]] = ChunkDataService.chunkData(fetchNotificationUi(colors[i], caseSelected[vm.notificationUi]), 6)
                } else {
                    if(i == 2) { break }; //if only green, amber and red available
                    vm.notifications[colors[i]] = ChunkDataService.chunkData(fetchNotificationUi(colors[i], caseSelected[vm.notificationUi]), 6)
                }
            }
        }        

    }    

    function fetchNotificationUi(phase, ui) { //returns the phases notifciations for chunkdata service
        return ui.filter(function(data){
            return data.costbandcolor.toLowerCase() == phase.toLowerCase();
        });
    }

    function openGuide() {
        CoreService.openAppGuide();
        $rootScope.$broadcast('appGuideOpen');
    }    

    function updateNotifications(id, ui, url) {
        vm.updatingNotifications = true;
        RemindersService.updateNotifications(id, caseSelected[ui], url)
        .then(
            function(response){
                updateNotificationsSuccess();
                vm.updatingNotifications = false;
            },
            function(errResponse){
                updateNotificationsError(errResponse);
                vm.updatingNotifications = false;
            }
        )
    };

    function updateNotificationsSuccess() {
        var modalInstance = $uibModal.open({
            template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.update-epct-notifications-success.tpl.htm"), //create html for notifications update success
            appendTo: undefined,
            backdropClass: 'second-backdrop',
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', function($uibModalInstance){
                this.dismissModal = function () {
                    $uibModalInstance.close();
                };
            }]

        });
    }

    function updateNotificationsError(errResponse) {

        var modalInstance = $uibModal.open({
            template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.update-epct-notifications-error.tpl.htm"), //create html for notifications update fail
            appendTo: undefined,
            backdropClass: 'second-backdrop',
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', function($uibModalInstance){

                this.error = errResponse;

                this.dismissModal = function () {
                    $uibModalInstance.close();
                };
            }]

        });

    }        



}

// CONCATENATED MODULE: ./app/features/case/controllers/case.renewal-history.controller.js
RenewalHistoryController.$inject = ['$scope', '$timeout', 'caseSelected', 'RenewalHistoryService']

function RenewalHistoryController($scope, $timeout, caseSelected, RenewalHistoryService) {

    var vm = this;

    vm.patent = caseSelected;

    $scope.promise.then(
    	function(){
    		$timeout(function(){
    			vm.renewal = $scope.$parent.renewalHistory;	
    		}, 500)
     
    	}

    )

}
// CONCATENATED MODULE: ./app/features/case/controllers/case.validation.controller.js
ValidationController.$inject = ['caseSelected', '$scope', '$uibModal', '$state', '$timeout', '$q', 'ValidationService'];

function ValidationController(caseSelected, $scope, $uibModal, $state, $timeout, $q, ValidationService) {

	var vm = this;

    vm.checkStates = checkStates;
    vm.submitValidationData = submitValidationData;
    vm.stateSelection = stateSelection;
    vm.requestNewQuote = requestNewQuote;
    vm.submitPoaDocuments = submitPoaDocuments;
    vm.patent = '';
    vm.templates = [
        { name: 'validationAvailable', url: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/validation/validation-available.tpl.htm")},
        { name: 'quotePending', url: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/validation/validation-quote-pending.tpl.htm")},
        { name: 'quoteProvided', url: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/validation/validation-quote-provided.tpl.htm")},
        { name: 'paymentInProgress', url: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/validation/validation-payment-in-progress.tpl.htm")},
        { name: 'poasProvided', url: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/validation/validation-poa-available.tpl.htm")},
        { name: 'noPoasProvided', url: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/validation/validation-nopoas-required.tpl.htm")},
        { name: 'workInProgress', url: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/validation/validation-wip.tpl.htm")},
        { name: 'manual', url: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/validation/validation-manual.tpl.htm")},
        { name: 'completed', url: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/validation/validation-completed.tpl.htm")}
    ];

    $scope.formData = {};
    var validationAction;
    var allState = [];
    vm.validationInfo = {};
    vm.domain = ppdomain;

    function stateSelection(selection) {

        $scope.selectionBoolean =  selection == 'De-select all' ? false : true;
        for(var i = 0; 0 < allState.length; i++ ) {
            if(allState[i] === undefined) { return; }
            allState[i].selected = $scope.selectionBoolean;
        }
    }

    function init() {

        $scope.isChecked = true;
        vm.patent = caseSelected; 
        $scope.phoneNumber = $scope.ppDetails.partnerPhone;

        var assistedOkStatuses = ['Validation available', 'Preparing quote', 'Quote provided'];

        vm.pendingAssisted = caseSelected.p3sServicesWithFees.some(function(item){
            return item.supportRequestedBy !== null;
        })
        
        vm.assistedAvailable = caseSelected.p3sServicesWithFees.some(function(item){
            return assistedOkStatuses.includes(item.serviceStatus)
        })        

        var serviceStatusL = caseSelected.p3sServicesWithFees[0].serviceStatus.toLowerCase();
        if(caseSelected.p3sServicesWithFees[0].validationFeeUI !== null) {
            var array = [];
            allState = array.concat(caseSelected.p3sServicesWithFees[0].validationFeeUI.designatedStates, caseSelected.p3sServicesWithFees[0].validationFeeUI.extensionStates, caseSelected.p3sServicesWithFees[0].validationFeeUI.validationStates)
        }
        vm.activeTab = 0;
        stateSelection('De-select all');
        if(serviceStatusL == 'validation available') { //VALIDATION TEST DATA - REMOVE NotUsed
            vm.validationTemplate = vm.templates[0].url;        
        }
        
        if(serviceStatusL == 'preparing quote' || serviceStatusL == 'quote pending') {
            vm.validationTemplate = vm.templates[1].url;        
        }        

        if(serviceStatusL == 'quote provided') {
            vm.validationTemplate = vm.templates[2].url;        
        }

        if(serviceStatusL == 'payment in progress' || serviceStatusL == 'pa instructed') {
            vm.validationTemplate = vm.templates[3].url;        
        }

        if(serviceStatusL == 'blank poas provided' || serviceStatusL == 'blank poas downloaded') { //VALIDATION TEST DATA - REMOVE NotUsed
            var noPoasNeeded = allState.every(function(item){
                return item.poaNeeded === false;
            })            
            caseSelected.postAddress = caseSelected.validationQuoteUI.poaPostalAddress.split(',');
            vm.validationTemplate = vm.templates[4].url;        
            
        }                    

        if(serviceStatusL == 'scanned poas received' || serviceStatusL == 'poas provided to pa' || serviceStatusL == 'paper documents received') { //VALIDATION TEST DATA - REMOVE NotUsed
            
            var noPoasNeeded = allState.every(function(item){
                return item.poaNeeded === false;
            })                   
            if(noPoasNeeded) {
                vm.validationTemplate = vm.templates[5].url;  
            } else {
                vm.validationTemplate = vm.templates[6].url;
            }
        }

        if(serviceStatusL == 'completed') {
            vm.validationTemplate = vm.templates[8].url;
            var array = [];
            vm.statesCompleted = array.concat(caseSelected.p3sServicesWithFees[0].validationFeeUI.designatedStates, caseSelected.p3sServicesWithFees[0].validationFeeUI.extensionStates, caseSelected.p3sServicesWithFees[0].validationFeeUI.validationStates);
        }

        if(caseSelected.p3sServicesWithFees[0].saleType.toLowerCase() == 'offline') { //VALIDATION TEST DATA - REMOVE NotUsed
            vm.validationTemplate = vm.templates[7].url;  
        }

        // if(caseSelected.p3sServicesWithFees[0].validationFeeUI !== null) {
        //     var array = [];
        //     allState = array.concat(caseSelected.p3sServicesWithFees[0].validationFeeUI.designatedStates, caseSelected.p3sServicesWithFees[0].validationFeeUI.extensionStates, caseSelected.p3sServicesWithFees[0].validationFeeUI.validationStates)
        // }

        if(caseSelected.p3sServicesWithFees[0].serviceStatus.toLowerCase() == 'validation available') {
            ValidationService.fetchDesignatedStates(caseSelected.patentID)
            .then(
                function(response){
                    vm.validationInfo = response;
                    $scope.formData.corresdpondenceName = response.firstName +' ' + response.lastName;
                    $scope.formData.corresdpondenceEmailaddress = response.emailaddress;
                    $scope.formData.designatedStates = response.designatedStates;
                    $scope.formData.extensionStates = response.extensionStates;
                    $scope.formData.validationStates = response.validationStates;
                    var array = [];
                    allState = array.concat($scope.formData.designatedStates, $scope.formData.extensionStates, $scope.formData.validationStates);
                }
            )
        }

        if(caseSelected.p3sServicesWithFees[0].serviceStatus.toLowerCase() == 'preparing quote') { 
            ValidationService.fetchPreparedQuote(caseSelected.patentID)
            .then(
                function(response){
                    vm.preparedQuote = response;
                }
            )

        }

        function addSignedPoaDoc(item) {
            item.signedPoaDoc = '';
            return item;
        }

        if(caseSelected.p3sServicesWithFees[0].serviceStatus.toLowerCase() == 'blank poas provided' || caseSelected.p3sServicesWithFees[0].serviceStatus.toLowerCase() == 'blank poas downloaded') {
            $scope.formData.designatedStates = vm.patent.p3sServicesWithFees[0].validationFeeUI.designatedStates;
            $scope.formData.extensionStates = vm.patent.p3sServicesWithFees[0].validationFeeUI.extensionStates;
            $scope.formData.validationStates = vm.patent.p3sServicesWithFees[0].validationFeeUI.validationStates;   

        }

    }

    init()

    function requestNewQuote() {

        var modalInstance = $uibModal.open({
            template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.validation-confirm-deletion.tpl.htm"),
            appendTo: undefined,
            backdropClass: 'second-backdrop',
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                this.confirmDeletion = function() {
                    $uibModalInstance.close();
                    ValidationService.deleteQuote(caseSelected.patentID)
                    .then(
                        function(response){
                            $state.go('portfolio.modal.case', {caseId: caseSelected.patentID, prepareGrant: 0, form1200generate: 0, validationQuote: 1}, {reload: true})
                        }
                    )
                }

                this.dismissModal = function() {
                    $uibModalInstance.close();
                };

            }]
        });

    }

    function removeCost(item) {
        delete item.validationCost_EUR;
        delete item.validationCost_USD;
        if(!item.signedPoaDoc) { item.signedPoaDoc = null; };
        return item;
    }

    function submitPoaDocuments(data) {

        vm.formDataSubmitted = true;

        var formData = {};

        var designatedMap = data.designatedStates.map(removeCost);
        var extensionMap = data.extensionStates.map(removeCost);
        var validationMap = data.validationStates.map(removeCost);
        var allStatesMapped = designatedMap.concat(extensionMap, validationMap)

        allStatesMapped = allStatesMapped.filter(function(item){
            if(item.signedPoaDoc == null) { return false; }
            return true;
        })
        .map(function(item){
            var newObj = {};
            newObj.stateCode = item.stateCode;
            newObj.signedPoaDoc = item.signedPoaDoc;
            return newObj;
        })

        var promiseArray = [];

        for(var i = 0; i < allStatesMapped.length; i++) {
            promiseArray.push(ValidationService.submitPoas(caseSelected.patentID, allStatesMapped[i]))
        }

        $q.all(promiseArray)
        .then(
            function(response){
                ValidationService.poaUploadSuccessNotify(caseSelected.patentID)
                var modalInstance = $uibModal.open({
                    template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.validation-poas-submitted.tpl.htm"),
                    appendTo: undefined,
                    backdropClass: 'second-backdrop',
                    controllerAs: '$ctrl',
                    controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                        this.dismissModal = function() {
                            $uibModalInstance.close();
                        };

                    }]
                });

                $state.go('portfolio.modal.case', {caseId: caseSelected.patentID, prepareGrant: 0, form1200generate: 0, validationQuote: 1}, {reload: true})
            },
            function(errResponse){

                ValidationService.poaUploadFailNotify(caseSelected.patentID)
                var modalInstance = $uibModal.open({
                    template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.validation-poas-submitted-error.tpl.htm"),
                    appendTo: undefined,
                    backdropClass: 'second-backdrop',
                    controllerAs: '$ctrl',
                    controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                        this.dismissModal = function() {
                            $uibModalInstance.close();
                        };

                    }]
                });

                $state.go('portfolio.modal.case', {caseId: caseSelected.patentID, prepareGrant: 0, form1200generate: 0, validationQuote: 1}, {reload: true})
            }
        )

    }

    function submitValidationData(data){

        var formData = {};

        var names = data.corresdpondenceName.split(' ');

        data.designatedStates = data.designatedStates.filter(function(data){
            return data.selected === true;
        }).map(function(filtered){
            delete filtered.selected;
            return filtered;
        })
        data.extensionStates = data.extensionStates.filter(function(data){
            return data.selected === true;
        }).map(function(filtered){
            delete filtered.selected;
            return filtered;
        })
        data.validationStates = data.validationStates.filter(function(data){
            return data.selected === true;
        }).map(function(filtered){
            delete filtered.selected;
            return filtered;
        })

        formData.patentID = caseSelected.patentID;
        
        formData.lastName = names.pop();
        formData.firstName = names.toString().replace(/,/g, ' ');

        formData.latestDateToRequestQuote = vm.validationInfo.latestDateToRequestQuote;
        formData.latestDateToPurchaseQuote = vm.validationInfo.latestDateToPurchaseQuote;
        formData.emailaddress = data.corresdpondenceEmailaddress;
        formData.designatedStates = JSON.parse(angular.toJson(data.designatedStates));
        formData.extensionStates = JSON.parse(angular.toJson(data.extensionStates));
        formData.validationStates = JSON.parse(angular.toJson(data.validationStates));

        ValidationService.requestQuote(formData)
        .then(
            function(response){

                var modalInstance = $uibModal.open({
                    template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.validation-quote-requested.tpl.htm"),
                    appendTo: undefined,
                    backdropClass: 'second-backdrop',
                    controllerAs: '$ctrl',
                    controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                        this.dismissModal = function() {
                            $uibModalInstance.close();
                        };

                    }]
                });

                $state.go('portfolio.modal.case', {caseId: caseSelected.patentID, prepareGrant: 0, form1200generate: 0, validationQuote: 1}, {reload: true})
            },
            function(errResponse) {
                var modalInstance = $uibModal.open({
                    template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.validation-quote-failed.tpl.htm"),
                    appendTo: undefined,
                    backdropClass: 'second-backdrop',
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

    function checkStates(item, index, type) {

        for(var i = 0; 0 < allState.length; i++ ) {
            if(allState[i] === undefined) { break; }
            if(allState[i].selected === true) {
                $scope.isChecked = true;
                break;
            }
            $scope.isChecked = false;
        }

        if(type === undefined) { return };

        var validateType = type+ 'States';

        if(item === true) {
            $scope.formData[validateType][index].selected = true;
        } else {
            $scope.formData[validateType][index].selected = false;
        } 


    }

}
// CONCATENATED MODULE: ./app/features/case/controllers/case.fee-breakdown.controller.js
FeeBreakDownController.$inject = ['caseSelected', '$scope', '$timeout'];

function FeeBreakDownController(caseSelected, $scope, $timeout) {

    var vm = this;

    vm.patent = caseSelected;
    vm.setFees = setFees;
    var loadFeeTimeout;
    
    $scope.$parent.promise
    .then(
        function(response){
            $scope.phoneNumber = $scope.ppDetails.partnerPhone;
            if($scope.$parent.availableServices.length) {            
                loadFeeTimeout = $timeout(function() {
                    setFees($scope.$parent.availableServices[0].action)
                    vm.data = {};
                    vm.data.availableAction = $scope.$parent.availableServices;
                    vm.data.selectedAction = { id: vm.data.availableAction[0].id, action: vm.data.availableAction[0].action };
                }, 10);
            }

        }
    )

    function feeUIAvailable(array) {

        return array.some(function(o) {
            return Object.keys(o).some(function(k){
                return k.toLowerCase().indexOf('feeui') !== -1 && o[k] !== null;
            })
        })

    }

    function setFees(action) {

        vm.availableFees = {};

        if(feeUIAvailable(caseSelected.p3sServicesWithFees))

        if(action == 'Euro-PCT') {
            vm.displayForm1200 = true;
            vm.displayRenewal = false;
            vm.displayGrant = false;
            vm.displayValidation = false;
            vm.availableFees.official = caseSelected.p3sServicesWithFees.filter(function(item){
                return item.serviceType === 'Euro-PCT';
            }).map(function(fee) {
                fee.feeUI = fee.form1200FeeUI;
                fee.feeUI.savings = Number(Math.round((fee.nextStageCostUSD - fee.currentStageCostUSD) + 'e2') +'e-2');
                fee.fxRate = fee.form1200FeeUI.fxRate;             
                return fee;
            })
        }

        if(action == 'renewal') {
            vm.displayForm1200 = false;
            vm.displayRenewal = true;
            vm.displayGrant = false;
            vm.displayValidation = false;
            vm.availableFees.official = caseSelected.p3sServicesWithFees.filter(function(item){
                return item.serviceType === 'renewal';
            }).map(function(fee) {
                fee.feeUI = fee.renewalFeeUI;
                fee.feeUI.savings = Number(Math.round((fee.nextStageCostUSD - fee.currentStageCostUSD) + 'e2') +'e-2');
                fee.fxRate = fee.renewalFeeUI.fxRate;
                return fee;
            })
        }

        if(action == 'grant') {
            vm.displayForm1200 = false;
            vm.displayRenewal = false;
            vm.displayGrant = true;
            vm.displayValidation = false;
            vm.availableFees.official = caseSelected.p3sServicesWithFees.filter(function(item){
                return item.serviceType === 'grant';
            }).map(function(fee) {
                fee.feeUI = fee.grantFeeUI;
                fee.feeUI.savings = Number(Math.round((fee.nextStageCostUSD - fee.currentStageCostUSD) + 'e2') +'e-2');
                fee.fxRate = fee.grantFeeUI.fxRate;
                return fee;
            })
        }

        if(action == 'validation') {
            vm.displayForm1200 = false;
            vm.displayRenewal = false;
            vm.displayGrant = false;
            vm.displayValidation = true;
            var official = caseSelected.p3sServicesWithFees.filter(function(item){
                return item.serviceType === 'validation';
            }).map(function(fee) {
                fee.feeUI = fee.validationFeeUI;
                if(fee.feeUI !== null) {
                    fee.fxRate = fee.validationFeeUI.fxRate;
                    fee.feeUI.savings = Number(Math.round((fee.nextStageCostUSD - fee.currentStageCostUSD) + 'e2') +'e-2');
                }
                
                return fee;
            })           

            vm.availableFees.official = official[0];

            if(vm.availableFees.official.feeUI !== null) {  
                vm.availableFees.ppFeesUSD = Number(vm.availableFees.official.feeUI.processingFeeUSD);
                vm.availableFees.ppFeesEUR = Number(vm.availableFees.official.feeUI.processingFeeEUR);
            }
            
            return;           

        }

        if(action !== 'validation') {        
            vm.availableFees.ppFeesUSD = Number(vm.availableFees.official[0].feeUI.processingFeeUSD + vm.availableFees.official[0].feeUI.expressFeeUSD + vm.availableFees.official[0].feeUI.urgentFeeUSD);
            vm.availableFees.ppFeesEUR = Number(vm.availableFees.official[0].feeUI.processingFeeEUR + vm.availableFees.official[0].feeUI.expressFeeEUR + vm.availableFees.official[0].feeUI.urgentFeeEUR);
            vm.availableFees.savings = Number(Math.round((vm.availableFees.official[0].nextStageCostUSD - vm.availableFees.official[0].currentStageCostUSD) + 'e2') +'e-2');
        }
        
    }

    $scope.$on('$destroy', function(){
        $timeout.cancel(loadFeeTimeout)
    })

}
// CONCATENATED MODULE: ./app/features/case/index.js




























// import routing  from './case.routes';

/* harmony default export */ var features_case = __webpack_exports__["default"] = (angular_default.a.module('ppApp.caseoverview', [portfolio_cases_serv["a" /* default */], case_form1200_serv, case_grant_serv, case_reminders_serv, case_renewal_serv, case_validation_serv, app_activeTab_serv, app_core_serv["a" /* default */], app_chunkData_serv, dynamic_directive["a" /* default */]])
  	.controller('CaseOverviewController', CaseOverviewController)
  	.controller('CostChartController', CostChartController)
  	.controller('CaseDetailsController', CaseDetailsController)
  	.controller('Form1200GeneratedController', Form1200GeneratedController)
  	.controller('Form1200ReadyController', Form1200ReadyController)
  	.controller('FxChartController', FxChartController)
  	.controller('GrantController', GrantController)
  	.controller('RemindersController', RemindersController)
  	.controller('RenewalHistoryController', RenewalHistoryController)
    .controller('ValidationController', ValidationController)
    .controller('FeeBreakDownController', FeeBreakDownController)
  	.name);

/***/ }),

/***/ "./app/features/checkout/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/angular/index.js
var node_modules_angular = __webpack_require__("./node_modules/angular/index.js");
var angular_default = /*#__PURE__*/__webpack_require__.n(node_modules_angular);

// CONCATENATED MODULE: ./app/features/checkout/services/checkout.bank-transfer-commit.serv.js
/* harmony default export */ var checkout_bank_transfer_commit_serv = (angular.module('services.banktransfercommit-service', []).factory('BankTransferCommitService', BankTransferCommitService).name);

BankTransferCommitService.$inject = ['$http', '$q', '$state'];

function BankTransferCommitService($http, $q, $state){

	var factory = {
		commitTransfer: commitTransfer
	};

	return factory;

	function commitTransfer(order) {

		var deferred = $q.defer();
		$http.post(ppdomain+'rest-committed-banktransfer/', order)
		.then(
			function(response){
				deferred.resolve(response.data)
			},
			function(errResponse){
				console.error('Error commmitting transacton. Error: ', errResponse)
				deferred.reject(response.data)
			});
			
			return deferred.promise;

	};
}
// CONCATENATED MODULE: ./app/features/checkout/services/checkout.basket.serv.js
/* harmony default export */ var checkout_basket_serv = (angular.module('services.basket-service', []).factory('BasketService', BasketService).name);

BasketService.$inject = ['$http', '$q'];

function BasketService($http, $q){

	var factory = {};

		var REST_SERVICE_URI = ppdomain+'rest-basket/';
		
		factory.fetchBasketPatents = function(ids) {
			
			var deferred = $q.defer();

			$http.post(REST_SERVICE_URI, ids)
			.then(
				function(response){
					deferred.resolve(response.data);
				},
				function(errResponse){
					deferred.reject(errResponse);
				}
			);

			return deferred.promise;
			
		};

	return factory;

}
// CONCATENATED MODULE: ./app/features/checkout/controllers/checkout.basket.controller.js
BasketController.$inject = ['$rootScope'];

function BasketController($rootScope) {

	var vm = this;

}


// CONCATENATED MODULE: ./app/features/checkout/controllers/checkout.bank-transfer-prep.controller.js
BankTransferPrepController.$inject = ['BankTransferCommitService', '$state', '$scope', '$stateParams', '$uibModal', 'ngCart']

function BankTransferPrepController(BankTransferCommitService, $state, $scope, $stateParams, $uibModal, ngCart) {

	var vm = this;

	vm.pageTitle = 'Confirm Order';
	vm.orderObj = $stateParams.orderObj;
	vm.details = $stateParams.details
	vm.preparingTransaction = false;
	if(vm.orderObj == '') { //if page is refreshed when on bank prepration page
		$state.go('portfolio', {reload: true}); //direct user to patents
	} else {

		vm.details.patentNos = $stateParams.orderObj.basketItems;
		vm.orderObj.billingDetails = $stateParams.details.billingDetails;

		vm.openCancelTransModal = openCancelTransModal;
		vm.commitTransfer = commitTransfer;	



		function openCancelTransModal() {

			var modalInstance = $uibModal.open({
				template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/checkout/html/modals/modal.cancel-transaction.tpl.htm"),
				appendTo: undefined,
				controllerAs: '$ctrl',
				controller: ['$uibModalInstance', function($uibModalInstance) {

				  	this.dismissModal = function () {
				    	$uibModalInstance.close();
				  	};

				  	this.cancelTrans = function () {
				  		ngCart.empty();
				    	$uibModalInstance.close();
				    	$state.go('portfolio');
				  	};

				}]
			});

		};

		function commitTransfer() {

			vm.preparingTransaction = true;

			vm.orderObj.billingDetails = $stateParams.details.billingDetails;
			BankTransferCommitService.commitTransfer(vm.orderObj) //SERVICE HANDLES STATE.GO
			.then(
	            function(response){
	            	$state.go('bank-transfer-success', {orderObj: response});
	            },
	            function(errResponse){
	            	if(errResponse.status === 500) {
						var modalInstance = $uibModal.open({
							template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/checkout/html/modals/modal.commit-error.tpl.htm"),
							appendTo: undefined,
           					controllerAs: '$ctrl',							
							controller: ['$uibModalInstance', function($uibModalInstance) {

							  	this.dismissModal = function () {
							    	$uibModalInstance.close();
							    	$state.go('portfolio', {reload: true})
							  	};

							}]
						});
					}
	            	if(errResponse.status === 409) {
						var modalInstance = $uibModal.open({
							template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/checkout/html/modals/modal.commit-error-price.tpl.htm"),
							appendTo: undefined,
           					controllerAs: '$ctrl',								
							controller: ['$uibModalInstance', function($uibModalInstance) {

							  	this.dismissModal = function () {
							    	$uibModalInstance.close();
							    	$state.go('portfolio', {reload: true})							    	
							  	};

							}]
						});
					}
	            }
	        );
		};
	}
}
// CONCATENATED MODULE: ./app/features/checkout/controllers/checkout.bank-transfer-success.controller.js
BankTransferSuccessController.$inject = ['$scope', '$stateParams']

function BankTransferSuccessController($scope, $stateParams) {

	var vm = this;

	vm.pageTitle = 'Bank Transfer Details';

	$scope.orderObj = $stateParams.orderObj;	

}

// CONCATENATED MODULE: ./app/features/checkout/index.js









/* harmony default export */ var checkout = __webpack_exports__["default"] = (angular_default.a.module('ppApp.checkout', [checkout_bank_transfer_commit_serv, checkout_basket_serv])
	.controller('BasketController', BasketController)	
	.controller('BankTransferPrepController', BankTransferPrepController)
	.controller('BankTransferSuccessController', BankTransferSuccessController)
	.name);

/***/ }),

/***/ "./app/features/forgot-password/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/angular/index.js
var angular = __webpack_require__("./node_modules/angular/index.js");
var angular_default = /*#__PURE__*/__webpack_require__.n(angular);

// EXTERNAL MODULE: ./app/features/login/services/authorisation.serv.js
var authorisation_serv = __webpack_require__("./app/features/login/services/authorisation.serv.js");

// CONCATENATED MODULE: ./app/features/forgot-password/controllers/forgot-password.controller.js
ForgotPasswordController.$inject = ['$state', '$rootScope','$http', '$scope', '$cookies', 'AuthorisationService', '$uibModal', 'Idle']

function ForgotPasswordController($state, $rootScope, $http, $scope, $cookies, AuthorisationService, $uibModal, Idle) {

	var vm = this;

	vm.submitEmail = submitEmail;

    function init() {
        Idle.unwatch()
    }

    init();    

	function submitEmail(emailAddress) {

		var params = {
			emailAddress: emailAddress
		}

		AuthorisationService.SubmitForgottenEmail(params)
		.then(
			function(response){
                var modalInstance = $uibModal.open({
                    template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/forgot-password/html/modals/modal.forgot-password-success.tpl.htm"),
                    appendTo: undefined,
                    controllerAs: '$ctrl',
                    controller: ['$uibModalInstance', '$location', '$anchorScroll', function($uibModalInstance, $location, $anchorScroll) {

                       
                        this.dismissModal = function () {
                            $uibModalInstance.close();
                        };


                    }]
                })
                $state.go('login'); 
			},
			function(errResponse){
                vm.dataLoading = false;
                $state.go($state.current, {}, {reload: true});
                var modalInstance = $uibModal.open({
                    template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/forgot-password/html/modals/modal.forgot-password-error.tpl.htm"),
                    appendTo: undefined,
                    controllerAs: '$ctrl',
                    controller: ['$uibModalInstance', '$location', '$anchorScroll', function($uibModalInstance, $location, $anchorScroll) {

                       
                        this.dismissModal = function () {
                            $uibModalInstance.close();
                        };


                    }]
                })   
			}
		)


	}


}
// EXTERNAL MODULE: ./node_modules/zxcvbn/lib/main.js
var main = __webpack_require__("./node_modules/zxcvbn/lib/main.js");
var main_default = /*#__PURE__*/__webpack_require__.n(main);

// CONCATENATED MODULE: ./app/features/forgot-password/controllers/reset-password.controller.js


ResestPasswordController.$inject = ['$state', '$rootScope','$http', '$scope', '$cookies', '$uibModal', 'AuthorisationService', 'Idle']

function ResestPasswordController($state, $rootScope, $http, $scope, $cookies, $uibModal, AuthorisationService, Idle) {

	var vm = this;

	vm.submitEmail = submitEmail;

	vm.formData = {};
    vm.recap = {};
    vm.recap.publicKey = '6LezdHEUAAAAABvniybP4wWGWWztRMQXT5r0_WMs';
    vm.passwordUpdate = passwordUpdate;

    function init() {
        Idle.unwatch()
    }

    init();    
  
    function passwordUpdate(password) {

        if(password !== undefined) {
            if(vm.formData.password.length < 8){ //https://stackoverflow.com/questions/56314220/angularjs-minlength-validation-stop-characters-counter
                $scope.resetPasswordForm.password.$setValidity('minlength', false);
            } else{
                $scope.resetPasswordForm.password.$setValidity('minlength', true);
            }

            if(vm.formData.password.length > 20){
                $scope.resetPasswordForm.password.$setValidity('maxlength', false);
            } else{
                $scope.resetPasswordForm.password.$setValidity('maxlength', true);
            }

            vm.passwordStrength = main_default()(password);
        }
        
    }	

	function submitEmail(password) {
        vm.dataLoading = true;
		var params = {
			password: password
		}

		AuthorisationService.ResetPassword(params)
		.then(
			function(response){
                vm.dataLoading = false;
                var modalInstance = $uibModal.open({
                    template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/forgot-password/html/modals/modal.reset-password-success.tpl.htm"),
                    appendTo: undefined,
                    controllerAs: '$ctrl',
                    controller: ['$uibModalInstance', '$location', '$anchorScroll', function($uibModalInstance, $location, $anchorScroll) {

                       
                        this.dismissModal = function () {
                            $uibModalInstance.close();
                        };


                    }]
                })
                $state.go('login'); 
			},
			function(errResponse){
                vm.dataLoading = false;
                $state.go($state.current, {}, {reload: true});
                var modalInstance = $uibModal.open({
                    template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/forgot-password/html/modals/modal.reset-password-error.tpl.htm"),
                    appendTo: undefined,
                    controllerAs: '$ctrl',
                    controller: ['$uibModalInstance', '$location', '$anchorScroll', function($uibModalInstance, $location, $anchorScroll) {

                       
                        this.dismissModal = function () {
                            $uibModalInstance.close();
                        };


                    }]
                })                
			}
		)


	}


}
// CONCATENATED MODULE: ./app/features/forgot-password/index.js







/* harmony default export */ var forgot_password = __webpack_exports__["default"] = (angular_default.a.module('ppApp.login', [authorisation_serv["a" /* default */]]) //import dashboard view controllers
  	.controller('ForgotPasswordController', ForgotPasswordController)
  	.controller('ResetPasswordController', ResestPasswordController)
  	.name);

/***/ }),

/***/ "./app/features/login/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/angular/index.js
var angular = __webpack_require__("./node_modules/angular/index.js");
var angular_default = /*#__PURE__*/__webpack_require__.n(angular);

// EXTERNAL MODULE: ./app/features/login/services/authorisation.serv.js
var authorisation_serv = __webpack_require__("./app/features/login/services/authorisation.serv.js");

// EXTERNAL MODULE: ./app/global/services/app.core.serv.js
var app_core_serv = __webpack_require__("./app/global/services/app.core.serv.js");

// CONCATENATED MODULE: ./app/features/login/controllers/login.controller.js
LoginController.$inject = ['$state', '$rootScope','$http', '$scope', '$timeout', '$cookies', 'AuthorisationService', 'CoreService', 'Idle']

function LoginController($state, $rootScope, $http, $scope, $timeout, $cookies, AuthorisationService, CoreService, Idle) {

    var vm = this;

    vm.login = login;
    vm.credentials = {};
    vm.incorrectCredentials = false;
    var dataLoadingTimeout;

    function init() {
        Idle.unwatch()
    }

    init();

    function login(data) {

        vm.dataLoading = true;

        if(!Idle.running()) {
            Idle.watch()
        }

        var params = {
            j_username: vm.credentials.username,
            j_password: vm.credentials.password
        }

        AuthorisationService.Login(params)
        .then(
            function(response){

                dataLoadingTimeout = $timeout(function(){
                    vm.dataLoading = false;
                })

                if(response.data.response === 'success') {
                    AuthorisationService.SetCredentials(vm.credentials.username, vm.credentials.password)
                    vm.incorrectCredentials = false;
                    $state.go('dashboard', {})
                } else {
                    vm.incorrectCredentials = true;
                }

            }
        )
        // .then(
        //     function(){
        //         AuthorisationService.SetCredentials(vm.credentials.username, vm.credentials.password)
        //         vm.incorrectCredentials = false;
        //         $state.go('dashboard', {})

        //     }
        // )
    };

    var Base64 = {

        keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    this.keyStr.charAt(enc1) +
                    this.keyStr.charAt(enc2) +
                    this.keyStr.charAt(enc3) +
                    this.keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = this.keyStr.indexOf(input.charAt(i++));
                enc2 = this.keyStr.indexOf(input.charAt(i++));
                enc3 = this.keyStr.indexOf(input.charAt(i++));
                enc4 = this.keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };


    $scope.$on('$destroy', function(){
        $timeout.cancel(dataLoadingTimeout)
    })

}
// CONCATENATED MODULE: ./app/features/login/index.js







/* harmony default export */ var login = __webpack_exports__["default"] = (angular_default.a.module('ppApp.login', [authorisation_serv["a" /* default */], app_core_serv["a" /* default */]]) //import dashboard view controllers
  	.controller('LoginController', LoginController)
  	.name);

/***/ }),

/***/ "./app/features/portfolio/controllers/portfolio.controller.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PortfolioController; });
PortfolioController.$inject = ['$scope', '$state', '$stateParams','$rootScope', '$timeout', '$uibModal', '$mdPanel', '$mdDialog', '$mdMenu', 'SearchPatentService',  'CasesRestService', '$cookies'];

function PortfolioController($scope, $state, $stateParams, $rootScope, $timeout, $uibModal, $mdPanel, $mdDialog, $mdMenu, SearchPatentService, CasesRestService, $cookies) {

    var vm = this;
    $scope.promise = CasesRestService.fetchAllCases();
    $scope.filter = {};
    vm.addingPatent = false;
    var displayHelpTimeout;
    var panelRef;

    function select(i) {
        vm.selected = i;
    }

    select($stateParams.caseId)

    function uniqueArray(array) {
        return array.filter(function(item, pos, self) {
            return self.indexOf(item) == pos;
        })
    }



    function noSubFilter(obj) {
        for (var key in obj) {
            if (obj[key]) { //if one of the $scope.filter ($scope.filter) properties evaluates to true (is selected) return false 
                return false;
            }
        }
        return true; //if no subfilters return true. This will result in all filtered data items being returned a true value
    }

    function checkArray(obj, service, prop) {
        return service.some(function(item) { //if filter[curretStageColour][red]
            return obj[prop][item[prop]] === true;
        })
    }

    $scope.filterByPropertiesMatchingAND = function (data) { //all data sent from filter 

        var matchesAND = true; //set macthes to true (default)

        for (var obj in $scope.filter) { //$scope.filter is populated by $scope.filter within the panel controller below. Scope filter properties are initiated from front-end. currentStageColour/serviceType

            if( $scope.filter.hasOwnProperty(obj) ) {
                if (noSubFilter($scope.filter[obj])) continue; //Check if there are any sub filter options with the value of true, if so, break from loop to return value of true
                if (!checkArray($scope.filter, data.p3sServices, obj)) { //If the property from the data matches the property from $scope.filter ($scope.filter) return false. It will not turn up in the table
                    matchesAND = false;
                    break; //break from the loop and return matchesAND which would now return false
                }
                
            }
        }
        return matchesAND;
    }; 

    function updatePortfolioData() {
        CasesRestService.fetchAllCases()
        .then(function(response) {
            $scope.portfolioData = response;            
            vm.recentlyAdded.push(response.slice(-1).pop())
        })        

    }

    $scope.promise //assigned promise to scope so child state can also resolve this promise to invoke functions
    .then(function(response) {
        if ($scope.$$destroyed) throw "Scope destroyed";
        return response;
    })
    .then(
        function(response){

            vm.portfolioLoaded = true;
            $scope.phoneNumber = $scope.ppDetails.partnerPhone;
            var portfolioLoaded = $cookies.get('portfolioLoaded');

            if($scope.firstTime && portfolioLoaded == undefined) {
                displayHelpTimeout = $timeout(function(){
                    $scope.displayCaseHelp = true;
                    $scope.displayPortfolioHelp = true
                    $cookies.put('portfolioLoaded', 'hasloaded'); 
                }, 5000)
            } else {
                $scope.displayCaseHelp = false;
                $scope.displayPortfolioHelp = false
            }

            if(!response.length) {
                vm.noPatents = true;
            }

            response.forEach(function(data){
                if(data.clientRef == '') {
                    data.clientRef = '[No Client Reference Provided]'
                }
            })

            vm.select = select;
            vm.selected = 0;
            vm.stateParams = $stateParams.patentId; 
            vm.rowSelect = rowSelect;
            vm.chipOptions = [];
            vm.showFilter = showFilter;
            vm.showAddPatent = showAddPatent;
            
            vm.sortBy = sortBy;
            $scope.selectedChip = selectedChip;
            $scope.portfolioData = response;
            $scope.displayFirstHelp = displayFirstHelp;

            vm.propertyName = 'ep_ApplicationNumber';
            vm.reverse = false;

            function displayFirstHelp(help, value) {
                if(help === 'portfolio') {
                    $scope.displayPortfolioHelp = value;
                } else {
                    $scope.displayCaseHelp = value;
                }
            }

            function rowSelect(event, patent){

                vm.caseoverviewLoading = true;
                var stateObj = '';

                vm.stateParams = $stateParams;
                if($(event.target).hasClass('generateForm1200')) {
                    stateObj = {caseId: patent.patentID, form1200generate: 1, prepareGrant: 0};                       
                }

                if($(event.target).hasClass('prepareGrant')) {
                    stateObj = {caseId: patent.patentID, prepareGrant: 1, form1200generate: 0}
                }        

                if(!$(event.target).hasClass('cartbtn') && !$(event.target).hasClass('generateForm1200') && !$(event.target).hasClass('prepareGrant')) {
                    var id = ($($(event.currentTarget).find('a'))); //find the anchor tag within row (patentApplicationNumber)
                    var patentId = id[0].id; //gets data from data-id
                    stateObj =  {caseId: patent.patentID, form1200generate: null}
                }                        

                $state.go('portfolio.modal.case', stateObj)
                .then(
                    function(){
                        vm.caseoverviewLoading = false;
                    }
                )

            };

            function sortBy(propertyName) {
                vm.reverse = (vm.propertyName === propertyName) ? !vm.reverse : false;
                vm.propertyName = propertyName;
            };

            function selectedChip(prop, value, cat) {
                if(cat == 'Euro-PCT') {cat = 'epct'}
                $scope.filter[cat][prop] = false;
            }

            function showFilter(mdMenu, $event) {
         
                mdMenu.open($event)
                $scope.categories = ['serviceType', 'currentStageColour'];     

                //return items to filter panel
                $scope.getItems = function (obj, array) { //obj is cat currentStageColour or serviceType
                    return (array || []).map(function (w) {
                        return w.p3sServices[0][obj]; //select property in p3sservices 
                    }).filter(function (w, idx, arr) {
                        if (typeof w === 'undefined') {
                            return false;
                        }
                        return arr.indexOf(w) === idx;
                    });
                };

                $scope.updateFiltered = function(prop, value, cat) {
                    if(value === true) {
                        if(cat === 'epct') {cat = 'Euro-PCT'};
                        vm.chipOptions.push({cat: cat, value: value, prop: prop})
                    } 
                    if(value === false) {
                        var index = vm.chipOptions.indexOf(cat);
                        vm.chipOptions.splice(index, 1);
                    }
                }

                $scope.closeDialog = function() {
                    $mdDialog.hide();                            
                }

            } //showFilter function end

            function showAddPatent($event) {

                var panelPosition = $mdPanel.newPanelPosition()
                    .absolute()
                    .center();

                var config = {
                    attachTo: angular.element(document.body),
                    controller: ['mdPanelRef', '$scope', function(mdPanelRef, $scope) {

                        $scope.recently = {
                            added: []
                        }
                        $scope.foundPatent = false;

                        $scope.findPatent = function(patentNo) {
                            $scope.loadingPatent = true;
                            SearchPatentService.findPatent(patentNo)
                            .then(
                                function(response) {
                                    $scope.foundPatent = response.data;
                                    $scope.loadingPatent = false;
                                    $scope.error = false;
                                    var patentJson = angular.toJson(response)
                                },
                                function(errResponse) {
                                    console.error('Error finding patent. Error message : ', errResponse)
                                    $scope.queriedPatent = false;
                                    $scope.loadingPatent = false;
                                    $scope.error = true;

                                    if(errResponse.status == 412) { //already added patent
                                        $scope.searchError = 'It looks like we\'ve already added Patent Application '+patentNo+' in to the system.  You should be able to find it in the List Patents page using the search boxes.';
                                    } 
                                    if(errResponse.status == 409){ //incorrect check digit
                                        $scope.searchError = 'It looks like the provided check digit differs from the check digit found at the European Patent Register. Please make sure the check digit is correct and try again.';
                                    }
                                    if(errResponse.status == 400 || errResponse.status == 404) { //incorrect syntax
                                        $scope.searchError = 'We\'ve not been able to find that patent in the European Patent Register. Please enter an application number such as EP18123456.2';
                                    }


                                }
                            )

                        }  

                        $scope.openConfirmModal = function(patent) {
                            var modalInstance = $uibModal.open({
                                template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/portfolio/html/modals/modal.confirm-found-patent.tpl.htm"),
                                appendTo: undefined,
                                controllerAs: '$ctrl',
                                controller: ['$uibModalInstance', '$location', '$anchorScroll', function($uibModalInstance, $location, $anchorScroll) {

                                    this.addPatent = function () {

                                        vm.addingPatent = true;
                                        $uibModalInstance.close();
                                        CasesRestService.savePatent(patent)
                                        .then(
                                            function(response){
                                                vm.addingPatent = false;

                                                updatePortfolioData();

                                                var match = response.find(function(item){
                                                    return item.ep_ApplicationNumber == patent.ep_ApplicationNumber;
                                                });

                                                $scope.recently.added.push(match);
                                                $scope.foundPatent = false;
                                                $scope.searchPatent = '';


                                            },
                                            function(errResponse){
                                                console.error('Error while saving Patent. Error: ', errResponse);
                                            }
                                        )

                                    };

                                 

                                    this.dismissModal = function () {
                                        $uibModalInstance.close();
                                    };

                                    this.cancelAdd = function() {
                                        $uibModalInstance.close();                  
                                    }

                                }]
                            })
                        }

                        $scope.$on('$destroy', function(){
                            $timeout.cancel(toPatentTimeout)
                        })                        

                    }],
                    controllerAs: '$ctrl',
                    position: panelPosition,
                    // animation: panelAnimation,
                    hasBackdrop: true,
                    targetEvent: $event,
                    template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/portfolio/html/add-patent.tpl.htm"),
                    clickOutsideToClose: true,
                    escapeToClose: true,
                    focusOnOpen: true
                };
                $mdPanel.open(config)
                .then(
                    function(result) {
                        panelRef = result;
                    },
                    function(error){
                        console.error('Error occured when opening panel: ',error)
                    }
                );

            } //showAddPatentPanel end]

        }
    )
    
    $scope.$on('$destroy', function(){
        if(panelRef) {
            panelRef.close()
        }
    })

    //SEARCH ADD PATENT

}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ "./app/features/portfolio/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/angular/index.js
var node_modules_angular = __webpack_require__("./node_modules/angular/index.js");
var angular_default = /*#__PURE__*/__webpack_require__.n(node_modules_angular);

// EXTERNAL MODULE: ./app/features/portfolio/services/portfolio.cases.serv.js + 1 modules
var portfolio_cases_serv = __webpack_require__("./app/features/portfolio/services/portfolio.cases.serv.js");

// CONCATENATED MODULE: ./app/features/portfolio/services/portfolio.search-patent.serv.js
/* harmony default export */ var portfolio_search_patent_serv = (angular.module('services.search-patent-service', []).factory('SearchPatentService', SearchPatentService).name);

SearchPatentService.$inject = ['$http', '$q']; 

function SearchPatentService($http, $q) {

    var REST_SEARCH_PATENT_SERVICE_URI = ppdomain+'rest-search-patents/';

    var factory = {
        findPatent: findPatent
    };

    return factory;

    function findPatent(patentNo) {

        var deferred= $q.defer();
        
        var patentItem = REST_SEARCH_PATENT_SERVICE_URI + patentNo;
        
        $http.get(patentItem)
            .then(
                function(response){
                deferred.resolve(response);
            }, function(errResponse) {
                switch(errResponse.status) {
                    case 400:
                        errResponse.data = 'We\'ve not been able to find that patent in the European Patent Register. Please enter an application number such as EP18123456.2';
                    break;
                    case 404:
                        errResponse.data = 'We’ve not been able to find Patent Application '+patentNo+' in the European Patent Register. Please check the number you’re entering and try again.';
                    break;
                    case 204:
                        errResponse.data = 'It looks like we\'ve already added Patent Application '+patentNo+' in to the system. You should be able to find it in the List Patents page using the search boxes.';
                    break;
                    default:
                        errResponse.data = null;
                }
                deferred.reject(errResponse);

                // console.error('$Http Error 'errResponse.status': Unable to fetch  information from EPO')
            }
        )


        return deferred.promise;

    };
}
// EXTERNAL MODULE: ./app/features/portfolio/controllers/portfolio.controller.js
var portfolio_controller = __webpack_require__("./app/features/portfolio/controllers/portfolio.controller.js");

// CONCATENATED MODULE: ./app/features/portfolio/index.js







/* harmony default export */ var portfolio = __webpack_exports__["default"] = (angular_default.a.module('ppApp.portfolio', [portfolio_cases_serv["a" /* default */], portfolio_search_patent_serv]) //import dashboard view controllers
  	.controller('PortfolioController', portfolio_controller["a" /* default */])
  	.name);

/***/ }),

/***/ "./app/features/profile/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/angular/index.js
var node_modules_angular = __webpack_require__("./node_modules/angular/index.js");
var angular_default = /*#__PURE__*/__webpack_require__.n(node_modules_angular);

// EXTERNAL MODULE: ./app/features/profile/services/profile.details.serv.js
var profile_details_serv = __webpack_require__("./app/features/profile/services/profile.details.serv.js");

// CONCATENATED MODULE: ./app/features/profile/services/profile.upload-avatar.serv.js
/* harmony default export */ var profile_upload_avatar_serv = (angular.module('services.uploadavatar-service', []).factory('UploadAvatarService', profile_upload_avatar_serv_UploadAvatarService).name);

profile_upload_avatar_serv_UploadAvatarService.$inject = ['$http', '$q'];

function profile_upload_avatar_serv_UploadAvatarService($http, $q) {

    var factory = {
        uploadAvatar: uploadAvatar
    }

    return factory


    function uploadAvatar(data) { 

        var deferred = $q.defer()

        var config = { headers: {'Content-Type': undefined} };

        $http.post('../upload-avatar/', data, config)
        .then(
            function(response){
                deferred.resolve(response.data)
            },
            function(errResponse){
                 deferred.reject(response.data)
            }
        )

        return deferred.promise;

    };
};

// EXTERNAL MODULE: ./app/global/directives/validations.directive.js
var validations_directive = __webpack_require__("./app/global/directives/validations.directive.js");

// EXTERNAL MODULE: ./app/global/services/app.timezone.serv.js
var app_timezone_serv = __webpack_require__("./app/global/services/app.timezone.serv.js");

// EXTERNAL MODULE: ./node_modules/zxcvbn/lib/main.js
var main = __webpack_require__("./node_modules/zxcvbn/lib/main.js");
var main_default = /*#__PURE__*/__webpack_require__.n(main);

// CONCATENATED MODULE: ./app/features/profile/controllers/profile.controller.js


ProfileController.$inject = ['$state', '$rootScope', '$scope', '$timeout', '$uibModal', '$http', 'UploadAvatarService', 'ProfileService', 'TimezoneService',]

function ProfileController($state, $rootScope, $scope, $timeout, $uibModal, $http, UploadAvatarService, ProfileService, TimezoneService) {

    var vm = this;

    $scope.newPassword = '';
    vm.updateTimezone = updateTimezone;
    vm.updateUser = updateUser;
    vm.openAvatarModal = openAvatarModal;
    vm.passwordUpdate = passwordUpdate;

    function init() {

        TimezoneService.fetchUsaTimeZones()
        .then(
            function(response){
                vm.ustimezones = response;
            }
        )
            
        ProfileService.fetchUser()
        .then(
            function(response){
                vm.user = response;
            }
        )

        ProfileService.listUsers()
        .then(
            function(response){

                for (var i=0; i < response.length; i++) {
                    response[i].index = i + 1;
                }

                vm.companyUsers = response;

                var userCol = (response.length / 2) + 1;
                var newArr = [];

                function chunk(arr, size) {
                    for (var i=0; i < arr.length; i+=size) {
                        newArr.push(arr.slice(i, i+size));
                    }
                    return newArr;
                }

                vm.chunkedData = {
                    chunk: chunk(vm.companyUsers, userCol)
                }

            },
            function(errResponse){
                console.error('Error listing users. Error: ', errResponse);
            }
        );
       
    }; //init end

    init();

    function passwordUpdate(password) {

        if(password) {
            vm.confirmPasswordReq = true;
            if(vm.formData.password.length < 8){ //https://stackoverflow.com/questions/56314220/angularjs-minlength-validation-stop-characters-counter
                $scope.userProfileForm.password.$setValidity('minlength', false);
            } else{
                $scope.userProfileForm.password.$setValidity('minlength', true);
            }

            if(vm.formData.password.length > 20){
                $scope.userProfileForm.password.$setValidity('maxlength', false);
            } else{
                $scope.userProfileForm.password.$setValidity('maxlength', true);
            }

            vm.passwordStrength = main_default()(password);
        } else {
            vm.confirmPasswordReq = false;
        }
        
    }

    function openAvatarModal() {
        var modalInstance = $uibModal.open({
            template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/profile/html/modals/modal.upload-avatar-pic.tpl.htm"),
            appendTo: undefined,
            controller: ['$uibModalInstance', '$scope', function($uibModalInstance, $scope){

                $scope.uploadImg = true;
                $scope.avatarImgUploaded = false;

                $scope.dismissModal = function() {
                    $uibModalInstance.close()
                }

                $scope.cropped = {
                    source: ''
                }

                $scope.imgSelected = false;

                function dataURItoBlob(dataURI) { //In computer science Base64 is a group of binary-to-text encoding schemes that represent binary data in an ASCII string format 
                    var binary = atob(dataURI.split(',')[1]);
                    var array = [];
                    for(var i = 0; i < binary.length; i++) {
                        array.push(binary.charCodeAt(i));
                    }
                    return new Blob([new Uint8Array(array)], {type: 'image/jpeg '});
                }

                $scope.uploadAvatar = function() {

                    var blob = dataURItoBlob($scope.cropped.image);
                    var formData = new FormData();
                    formData.append('image', blob);
                    UploadAvatarService.uploadAvatar(formData) 
                    .then(
                        function(response){
                            $scope.avatarImgUploaded = true;
                            $rootScope.$emit('refreshAvatar',function(){
                            })
                            $state.reload();
                        },
                        function(errResponse){
                            console.error('Error : unable to upload new image')
                        }
                    )
                         
                }

            }]
        })
    } //open avatar end

    function updateTimezone(item) {
       vm.user.business.timezone = item;
    }   

    function updateUser(user, p) {

        user = vm.user;

        if (p !== '' || p !== undefined) {
            user.newPassword = p;
        }

        ProfileService.updateUser(user)
        .then(
            function(response){  

                var modalInstance = $uibModal.open({
                    template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/profile/html/modals/modal.update-profile-success.tpl.htm"),
                    appendTo: undefined,
                    controller: ['$uibModalInstance', '$scope', function($uibModalInstance, $scope) {

                        $scope.dismissModal = function() {
                            $uibModalInstance.close();
                        };

                    }]
                })
            },
            function(errResponse){
                console.error('Error updating user. Error : ', errResponse)
                var modalInstance = $uibModal.open({
                    template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/profile/html/modals/modal.update-profile-error.tpl.htm"),
                    appendTo: undefined,
                    controller: ['$uibModalInstance', '$scope', function($uibModalInstance, $scope) {

                        $scope.dismissModal = function() {
                            $uibModalInstance.close();
                        };

                    }]
                })                
            }
        
        )

    }; //update user end
}
// CONCATENATED MODULE: ./app/features/profile/index.js














/* harmony default export */ var profile = __webpack_exports__["default"] = (angular_default.a.module('ppApp.profile', [profile_details_serv["a" /* default */], profile_upload_avatar_serv, app_timezone_serv["a" /* default */], validations_directive["a" /* default */]]) //import dashboard view controllers
  	.controller('ProfileController', ProfileController)
  	.name);

/***/ }),

/***/ "./app/features/support/general/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/angular/index.js
var node_modules_angular = __webpack_require__("./node_modules/angular/index.js");
var angular_default = /*#__PURE__*/__webpack_require__.n(node_modules_angular);

// CONCATENATED MODULE: ./app/features/support/general/services/support.serv.js
/* harmony default export */ var support_serv = (angular.module('services.support-service', []).factory('SupportService', SupportService).name);

SupportService.$inject = ['$q', '$http'];

function SupportService($q, $http) {

    var factory = {
        requestNonSpecificSupport: requestNonSpecificSupport,
        requestSpecificSupport: requestSpecificSupport,
        requestSpecificPatents: requestSpecificPatents
    }

    function requestSpecificPatents(cat) {

        var param = '';

        if(cat !== 'Assisted Formality Filing') {
            param = 'nonassistedFiling';
        } else {
            param = 'assistedFiling';
        }

        var deferred = $q.defer();

        $http.get(ppdomain+'rest-patent-enquiry/'+ param)
        .then(
            function(response){
                deferred.resolve(response.data)
            },
            function(errResponse){
                deferred.reject(errResponse.data)
            }
        )

        return deferred.promise;

    }

    function requestNonSpecificSupport(data, config) {

        var deferred = $q.defer();

        $http.post(ppdomain+'rest-non-case-specific-form/', data, config)
        .then(
            function(response){
                deferred.resolve(response.data)
            },
            function(errResponse){
                deferred.reject(errResponse.data)
            }
        )

        return deferred.promise;
    }    


    function requestSpecificSupport(data, config) {

        var deferred = $q.defer();

        $http.post(ppdomain+'rest-case-specific-form/', data, config)
        .then(
            function(response){
                deferred.resolve(response.data)
            },
            function(errResponse){
                deferred.reject(errResponse.data)
            }
        )

        return deferred.promise;        

    }    

    return factory;

}
// CONCATENATED MODULE: ./app/features/support/general/controllers/general-support.controller.js
GeneralSupportController.$inject = ['$scope', '$state', '$timeout', '$stateParams', 'SupportService', '$uibModal'];

function GeneralSupportController($scope, $state, $timeout, $stateParams, SupportService, $uibModal) {

	var vm = this;
	var filesUploaded = []; //required for checking duplicates

	vm.subCategoryRequired = false;
	vm.formData = {};
	$scope.caseFormData = {};
	$scope.caseFormData.uploadedDocs = [];
	$scope.fileStore = {}
	vm.formData.uploadedDocs = [];
	vm.files = [];
	$scope.allEnquiryCases = [];
	vm.categories = ['Intellectual Property', 'WebApp Technical', 'Other'];
	vm.specificCategories = ['Intellectual Property', 'Assisted Formality Filing', 'WebApp Technical', 'Other'];
	vm.subcategory = [];
	vm.checkSubcategories = checkSubcategories;
	vm.checkSpecificType = checkSpecificType;
	vm.formalitySelect = formalitySelect;
	vm.submitForm = submitForm;
	vm.submittingRequest = false;
	vm.specificCaseCheck = specificCaseCheck;
	vm.optionSelected = false;
	vm.caseSpecific = '';
	vm.caseSpecificCategory = '';
	$scope.removeSpecificFile = removeSpecificFile;
	var selectedPatent;
	var latestFileUploaded;
	var assistedFormaltyAgreement = false; //used for displaying modal the one time
	$scope.specificCase = {};
	// vm.specificSelectValue = '';
	var caseOverViewSupport = false;
	$scope.fileUploading = false;

	function init() {
		$scope.phoneNumber = $scope.ppDetails.partnerPhone;
		if($stateParams.supportObj) {
			caseOverViewSupport = true;
			$scope.specificCase = 'yes';
			vm.optionSelected = true;
			$scope.caseFormData.category = $stateParams.supportObj.supportType;
			vm.caseSpecificCategory = $stateParams.supportObj.supportType;
			$timeout(function(){
				$scope.caseFormData.category = $stateParams.supportObj.supportType;
			})

		}
	}

	init();

	function fetchPatents(cat) {
		
		SupportService.requestSpecificPatents(cat)
		.then(
			function(response){

				vm.fetchingPatents = false;
				if($stateParams.supportObj) {

					if($stateParams.supportObj.formalityType == 'Euro-PCT') {
						$stateParams.supportObj.formalityType = 'epct';
					}

					var id = '#' + $stateParams.supportObj.formalityType + $stateParams.supportObj.patentID;

				    $timeout(function() {
					    angular.element(document.querySelector(id)).triggerHandler('click');
				    });

				} else {				

					if(cat == 'Assisted Formality Filing' && !assistedFormaltyAgreement && response.patentEnquiries.length > 0 && !$stateParams.supportObj) {
						assistedFormaltyAgreement = true;
				        var modalInstance = $uibModal.open({
				            template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/support/general/html/modals/modal.assisted-formality-details.tpl.htm"),
				            scope: $scope,
				            controllerAs:'$ctrl',
				            backdrop: 'static',
				            keyboard: false,
				            windowClass: 'wide-modal',
				            controller: ['$uibModalInstance', function($uibModalInstance) {
				                
				                this.dismissModal = function () {
				                    $uibModalInstance.close(false);
				                };

				                this.feeOject = {		                	
									'epctSupportFee': response.epctSupportFee,
									'grantSupportFee': response.grantSupportFee,
									'valAnySupportFee': response.valAnySupportFee,
									'valLondonSupportFee': response.valLondonSupportFee,
				                }

				            }]
				        })
					}
				}

				vm.patents = response.patentEnquiries;
			},
			function(errResponse){
				console.error('controller errResponse', errResponse)
			}
		)

	}


	function checkSpecificType(newValue, oldValue) { //category check 

		if(newValue == oldValue) return;

		if(newValue == undefined) { //if caseoverview support
			newValue = $stateParams.supportObj.supportType;
		}

		vm.tableSearch = '';

		vm.assistedFiling = newValue == 'Assisted Formality Filing' ? true : false
		vm.categorySelected = true;
		if($scope.allEnquiryCases.length > 0) { //if a case has been added to enquiry
			warningCategoryChange(newValue, oldValue);
		} else {
			vm.fetchingPatents = true;
			fetchPatents(newValue);
			vm.caseSpecificCategory = newValue;
		}


	}		

	function checkSubcategories(data) {

		if(data == 'Intellectual Property') {
			vm.subCategoryRequired = true;
			vm.subcategory = ['Euro-PCT (Form 1200)', 'Renewals / Annuities', 'Grant and Publishing Fees, 71(3)', 'EP Validation', 'Other IP']
		}

		if(data == 'WebApp Technical') {
			vm.subCategoryRequired = true;
			vm.subcategory = ['Account Management', 'Patent applications', 'Fees', 'Reminders', 'Transactions', 'Technical Issue']
		}

		if(data !== 'Intellectual Property' && data !== 'WebApp Technical') {
			vm.subCategoryRequired = false;
		}

	}

    function updateCheckBoxes(value) {
 
	  	Object.keys($scope.specificCase).forEach(function(key, o){
	  		if(key === value) {
	  			$scope.specificCase[key] = true; 
	  		} else {
	  			$scope.specificCase[key] = false;
	  		}
		});

    }

    function resetFormData(allCases) {

    	$scope.caseFormData = {};
    	$scope.caseFormData.uploadedDocs = []; //reset current case file as it has been added to allEnquiryCases

    	if(vm.caseSpecificCategory) {
    		if($stateParams.supportObj) {
    			$scope.caseFormData.category = $stateParams.supportObj.supportType; 
    		}
    		$scope.caseFormData.category = vm.caseSpecificCategory;
    	}

    	if(allCases) {
			$scope.allEnquiryCases.length = 0;
			vm.patents.forEach(function(item){ //required for removing css class in view
				item.selectedForEnquiry = false;
			})
    	}
    }

	function warningCheckboxChange(newValue, oldValue) {

        var modalInstance = $uibModal.open({
            template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/support/general/html/modals/modal.loss-of-data.tpl.htm"),
            scope: $scope,
            controllerAs:'$ctrl',
            backdrop: 'static',
            keyboard: false,     
            controller: ['$uibModalInstance', function($uibModalInstance) {
                
                this.dismissModal = function () {
                    $uibModalInstance.close(false);
                };

                this.cancel  = function() {
                	$uibModalInstance.close(false);
                }

                this.confirm  = function() {
                	$uibModalInstance.close(true);
                }

            }]
        })

		modalInstance.result.then(function(value) {

			if(value) {//if they are confirming they want to change option and lose any data

				vm.caseSpecific = newValue;
				resetFormData(true);
				updateCheckBoxes(newValue)

			} else {
				vm.caseSpecific = oldValue;
				updateCheckBoxes(oldValue)
			}

    	})

	}

	function warningCategoryChange(newValue, oldValue) {

        var modalInstance = $uibModal.open({
            template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/support/general/html/modals/modal.loss-of-data.tpl.htm"),
            scope: $scope,
            controllerAs:'$ctrl',
            backdrop: 'static',
            keyboard: false,     
            controller: ['$uibModalInstance', function($uibModalInstance) {

                this.dismissModal = function () {
                    $uibModalInstance.close(false);
                };

                this.cancel  = function() {
                	$uibModalInstance.close(false);
                }

                this.confirm  = function() {
                	$uibModalInstance.close(true);
                }

            }]
        })

		modalInstance.result.then(function(value) {

			if(value) {//if they are confirming they want to change option and lose any data

				vm.caseSpecificCategory = newValue; //required for comparing old and new values
				$scope.caseFormData.category = newValue; //required for formData request
				resetFormData(true);
				vm.fetchingPatents = true;
				fetchPatents(newValue);

			} else {
				vm.caseSpecificCategory = oldValue;
				$scope.caseFormData.category = oldValue;
			}

    	})

	}

	function specificCaseCheck(newValue, oldValue, boolean) {

		vm.optionSelected = true;
	
		if(newValue == oldValue) return;
		if($scope.allEnquiryCases.length > 0) { //if a case has been added to enquiry
			warningCheckboxChange(newValue, oldValue);
		} else {
			vm.caseSpecific = newValue;
		}

	}

	function removeSpecificFile(fileName) {

		var index = $scope.caseFormData.uploadedDocs.map(x => {
		  	return x.name;
		}).indexOf(fileName);

		$scope.caseFormData.uploadedDocs.splice(index, 1)

	}


   	function checkDuplicate(file, caseSpecific) {

   		if($scope.caseFormData.uploadedDocs.length == 0 && $scope.allEnquiryCases.length == 0) return false;

   		var individualCaseFiles = $scope.caseFormData.uploadedDocs.map(function(obj){ //caseFormData.uploadedDocs
   			return obj;
   		}).some(function(e){
   			return e.name == file.name;
   		})

   		var allCaseFiles = $scope.allEnquiryCases.map(function(item){ //allEnquiryCases
   			return item.uploadedDocs;
   		}).flat().some(function(e){
   			return e.name == file.name;
   		})

   		if(allCaseFiles || individualCaseFiles) {
   			return true;
   		}

   		return false;

	}

    $scope.getFileDetails = function (e, caseSpecific) {

    	$scope.fileUploading = true;

    	var timeout;
        var validFormats = ['pdf', 'PDF', 'doc', 'DOC', 'docx', 'DOCX', 'jpg', 'JPG', 'jpeg', 'JPEG','png', 'PNG', 'gif', 'GIF', 'pptx', 'PPTX', 'csv', 'CSV', 'xlsx', 'XLSX', 'zip', 'ZIP'];
        var blobToBase64 = (blob) => {
		  	return new Promise((resolve) => {
		  		
		    	const reader = new FileReader();
		    	reader.readAsDataURL(blob);
		    	reader.onloadend = function () {
		    		$scope.fileUploading = false;
			      	resolve(reader.result);
			    };
		  	})
		};

            // STORE THE FILE OBJECT IN AN ARRAY.
        for (var i = 0; i < e.files.length; i++) {
        	var ext = e.files[i].name.substr(e.files[i].name.lastIndexOf('.')+1);

		   	if(checkDuplicate(e.files[i], caseSpecific)) {
		        var modalInstance = $uibModal.open({
		            template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/support/general/html/modals/modal.duplicate-file.tpl.htm"),
		            scope: $scope,
		            controllerAs:'$ctrl',
		            controller: ['$uibModalInstance', function($uibModalInstance) {
		            	$scope.fileUploading = false;
		                this.dismissModal = function () {
		                    $uibModalInstance.close();
		                };
		            }]
		        });
		   	} else {

		   		if(e.files[i].size > 0 && validFormats.includes(ext)) {

			    	if(caseSpecific) {

	   					async function asyncCall() {

							var newObject  = {						
							   	'lastModified'     : e.files[i].lastModified,
							   	'lastModifiedDate' : e.files[i].lastModifiedDate,
							   	'name'             : e.files[i].name,
							   	'size'             : e.files[i].size,
							   	'type'             : e.files[i].type
							};

						  	const b64 = await blobToBase64(e.files[i]);
						  	const jsonString = JSON.stringify(b64);		
						  	newObject.fileData = jsonString;
						  	$scope.caseFormData.uploadedDocs.push(newObject); //to be pushed for individualCase ADD
				   			$scope.$applyAsync(); //NEEDED				  	

			   			}

			   			asyncCall();

			    	} else {
			   			vm.files.push(e.files[i]) //Required for no case specific cases				   		
			    	}
			    }

	   			
		   	}
        }

    };

	function formalitySelect(patent, type) { //handles both initial add and editing of patent

		selectedPatent = patent;

		if(type == 'delete') {

			var index = $scope.allEnquiryCases.map(x => {
			  return x.epApplicationNumber;
			}).indexOf(selectedPatent.epApplicationNumber);

			vm.patents.map(x => { //required for removing css class in view
				if(x.epApplicationNumber == selectedPatent.epApplicationNumber) {
					x.selectedForEnquiry = false;
				}
				return x;
			})

			$scope.allEnquiryCases.splice(index, 1);

			return;
		}

        var modalInstance = $uibModal.open({
            template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/support/general/html/modals/modal.add-information-for-case.tpl.htm"),
            scope: $scope,
            controllerAs:'$ctrl',
            backdrop: 'static',
            keyboard: false,              
            controller: ['$uibModalInstance', function($uibModalInstance) {

            	//REQUIRES EDITING TO ACCOUNT FOR GRANTS WITH RENEWAL

            	this.phoneNumber = $scope.ppDetails.partnerPhone;
            	this.applicationNo = patent.epApplicationNumber;
            	this.formalityType = patent.formalityAvailable;
            	this.assistedFiling = vm.assistedFiling;

            	if(type == 'edit') {
            		var findCase = $scope.allEnquiryCases.find(function(x){
            			return x.epApplicationNumber == selectedPatent.epApplicationNumber
            		})
        			$scope.caseFormData = findCase;
            	}

                this.dismissModal = function () {
                    $uibModalInstance.close('notAdded');
                };

                this.add = function(data) {

                	if(type == 'edit') { //remove current patent that is being updated so it can be replaced with the new version
						var index = $scope.allEnquiryCases.map(x => {
						  	return x.epApplicationNumber;
						}).indexOf(selectedPatent.epApplicationNumber);

						$scope.allEnquiryCases.splice(index, 1);           		
         
                	}
    		
                	vm.patents.find(function(item){ //disable the row
					    if(selectedPatent.patentID === item.patentID && item.formalityAvailable === selectedPatent.formalityAvailable) {
				        	item.selectedForEnquiry = true;
					        return true;
					    }
					    return false;
                	})

	            	var obj = {
	            		patentID: selectedPatent.patentID,
	            		epApplicationNumber: selectedPatent.epApplicationNumber,
	            		formalityAvailable: selectedPatent.formalityAvailable,
	            		isUrgent: selectedPatent.isUrgent,
	            		isManualProcessing: selectedPatent.isManualProcessing,
	            		message: data.message,
	            		numDocsUploaded: $scope.caseFormData.uploadedDocs.length,
	            		uploadedDocs: $scope.caseFormData.uploadedDocs
	            	}

	            	//need to identify correct files by comparing applicationNo

	            	if(vm.caseSpecificCategory == 'Assisted Formality Filing') {
	            		obj.indicativeCost = selectedPatent.indicativeCost;
	            	}

	            	resetFormData();

                	$scope.allEnquiryCases.push(obj);	//used to loop in FE

					$uibModalInstance.close();

                }
            }]
        });	

        modalInstance.result.then(function(value) {

        	if(value == 'notAdded') {
        		resetFormData();
        	}
        	//need to remove any files uploaded before adding
        })

	}

	function submitForm(data, caseSpecific) {

		vm.submittingRequest = true;

		var formData = new FormData();
		var config = { headers: {'Content-Type': undefined} };
		formData.append('category', data.category);




		if(caseSpecific) {
			formData.append('patentEnquiries', JSON.stringify($scope.allEnquiryCases));

			SupportService.requestSpecificSupport(formData, config)
			.then(
				function(response){

					vm.submittingRequest = false;
					resetFormData(true);
					$scope.specificSupportForm.$setPristine();
					
			        var modalInstance = $uibModal.open({
			            template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/support/general/html/modals/modal.support-success.tpl.htm"),
			            scope: $scope,
			            controllerAs:'$ctrl',
			            controller: ['$uibModalInstance', function($uibModalInstance) {

			            	this.phoneNumber = $scope.ppDetails.partnerPhone;

			                this.dismissModal = function () {
			                    $uibModalInstance.close();
			                };
			            }]
			        });	

			        modalInstance.result.then(function(){
			        	$state.go($state.current, {supportObj: null}, {reload: true});
			        })
				},
				function(errResponse){

					vm.submittingRequest = false;

			        var modalInstance = $uibModal.open({
			            template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/support/general/html/modals/modal.support-error.tpl.htm"),
			            scope: $scope,
			            controllerAs:'$ctrl',
			            controller: ['$uibModalInstance', function($uibModalInstance) {

			            	this.phoneNumber = $scope.ppDetails.partnerPhone;

			                this.dismissModal = function () {
			                    $uibModalInstance.close();
			                };
			            }]
			        });	

				}
			)
		}

		if(!caseSpecific) {

			if(data.subcategory) {
				formData.append('subcategory', data.subcategory);
			} else {
				formData.append('subcategory', '');
			}

			formData.append('subject', data.subject);
			formData.append('numUploads', vm.files.length);
			formData.append('message', data.message);

			for (var i in vm.files) {
	            formData.append("uploadedDocs", vm.files[i]);
	        }	

			SupportService.requestNonSpecificSupport(formData, config)
			.then(
				function(response){

					vm.formData = {}; //resets field values
					vm.subCategoryRequired = false;
					vm.files = [];
					$scope.supportForm.$setPristine(); //rest forms properties
					vm.submittingRequest = false;

			        var modalInstance = $uibModal.open({
			            template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/support/general/html/modals/modal.support-success.tpl.htm"),
			            scope: $scope,
			            backdrop: 'static',
			            keyboard: false,  			            
			            controllerAs:'$ctrl',
			            controller: ['$uibModalInstance', function($uibModalInstance) {

			            	this.phoneNumber = $scope.ppDetails.partnerPhone;

			                this.dismissModal = function () {
			                    $uibModalInstance.close();
			                };
			            }]
			        });

			        modalInstance.result.then(function(){
			        	$state.go($state.current, {}, {reload: true});
			        })			        
				},
				function(errResponse){

					console.error('controller errResponse', errResponse)

					vm.submittingRequest = false;

			        var modalInstance = $uibModal.open({
			            template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/support/general/html/modals/modal.support-error.tpl.htm"),
			            scope: $scope,
			            controllerAs:'$ctrl',
			            controller: ['$uibModalInstance', function($uibModalInstance) {

			            	this.phoneNumber = $scope.ppDetails.partnerPhone;

			                this.dismissModal = function () {
			                    $uibModalInstance.close();
			                };
			            }]
			        });				

				}
			)

		}

	} //submitform function end

}
// CONCATENATED MODULE: ./app/features/support/general/index.js






/* harmony default export */ var general = __webpack_exports__["default"] = (angular_default.a.module('ppApp.support', [support_serv])
  	.controller('GeneralSupportController', GeneralSupportController)
  	.name);

/***/ }),

/***/ "./app/features/transactions/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/angular/index.js
var angular = __webpack_require__("./node_modules/angular/index.js");
var angular_default = /*#__PURE__*/__webpack_require__.n(angular);

// EXTERNAL MODULE: ./app/features/transactions/services/transactions.serv.js
var transactions_serv = __webpack_require__("./app/features/transactions/services/transactions.serv.js");

// CONCATENATED MODULE: ./app/features/transactions/controllers/transactions.controller.js
TransactionsController.$inject = ['TransactionService', '$scope', '$cookies', '$q', '$state', '$timeout'];

function TransactionsController(TransactionService, $scope, $cookies,  $q, $state, $timeout) {

    var vm = this;

    // vm.transactions = null;
    var displayHelpTimeout;
    $scope.filter = {};
    $scope.displayFirstHelp = displayFirstHelp;  

    function noSubFilter(obj) {
        for (var key in obj) {
            if (obj[key]) { //if one of the $scope.filter ($scope.filter) properties evaluates to true (is selected) return false 
                return false;
            }
        }
        return true; //if no subfilters return true. This will result in all filtered data items being returned a true value
    }

    function checkArray(obj, service, prop) {
        return service.some(function(item) { //if filter[curretStageColour][red]
            return obj[prop][item[prop]] === true;
        })
    }

    $scope.filterByPropertiesMatchingAND = function (data) { //all data sent from filter 
        var matchesAND = true; //set macthes to true (default)
        for (var obj in $scope.filter) { //$scope.filter is populated by $scope.filter within the panel controller below. Scope filter properties are initiated from front-end. currentStageColour/serviceType
            if( $scope.filter.hasOwnProperty(obj) ) {
                if (noSubFilter($scope.filter[obj])) continue; //Check if there are any sub filter options with the value of true, if so, break from loop to return value of true
                if (!$scope.filter[obj][data[obj]]) { //If the property from the data matches the property from $scope.filter ($scope.filter) return false. It will not turn up in the table
                    matchesAND = false;
                    break; //break from the loop and return matchesAND which would now return false
                }
                
            }
        }
        return matchesAND;
    };

    function displayFirstHelp(help, value) {
        $scope.displayTransactionHelp = value;

    }    

    $scope.promise = TransactionService.fetchAllTransactions()
    $scope.promise.then(
        function(response){

            $scope.transactions = response;
            var transactionLoaded = $cookies.get('transactionLoaded');
            if($scope.firstTime && transactionLoaded == undefined) {
                displayHelpTimeout = $timeout(function(){
                    $scope.displayTransactionHelp = true;
                    $cookies.put('transactionLoaded', 'hasloaded'); 
                }, 5000)
            } else {
                $scope.displayTransactionHelp = false
            }
            
            vm.sortBy = sortBy;
            vm.rowSelect = rowSelect;
            vm.select = select;
            vm.showFilter = showFilter;
            vm.selectedSortType = 'p3S_TransRef';   
            vm.updateFiltered = updateFiltered;
            vm.chipOptions = [];                        
            $scope.selectedChip = selectedChip;

            $scope.transactionsLoaded = true;

            function sortBy(propertyName) {
                vm.reverse = (vm.propertyName === propertyName) ? !vm.reverse : false;
                vm.propertyName = propertyName;
            };

            function select(i) {
                vm.selected = i;
            }            

            function rowSelect(event, transaction){
                if(event.target.nodeName !== 'SELECT') {
                    $state.go('transactions.modal.transaction-item', {transId: transaction.p3s_TransRef})
                }
                
            };          

            function selectedChip(prop, value, cat) {
                $scope.filter[cat][prop] = false;
            }

            function updateFiltered(prop, value, cat) {
                if(value === true) {
                    vm.chipOptions.push({cat: cat, value: value, prop: prop})
                } 
                if(value === false) {
                    var index = vm.chipOptions.indexOf(cat);
                    vm.chipOptions.splice(index, 1);
                }
            }

            function showFilter(mdMenu, $event) {
                mdMenu.open($event)
                $scope.categories = ['transTypeUI', 'latestTransStatus'];     

                //return items to filter panel
                $scope.getItems = function (obj, array) { //obj is cat currentStageColour or serviceType
                    return (array || []).map(function (w) {
                        return w[obj]; //select property in p3sservices 
                    }).filter(function (w, idx, arr) {
                        if (typeof w === 'undefined') {
                            return false;
                        }
                        return arr.indexOf(w) === idx;
                    });
                };


                $scope.closeDialog = function() {
                    $mdDialog.hide();                            
                }

            } //showFilter function end         

        }

    )


}
// CONCATENATED MODULE: ./app/features/transactions/controllers/transaction-item.controller.js
TransactionItemController.$inject = ['$scope', '$state', '$timeout', '$stateParams'];

function TransactionItemController($scope, $state, $timeout, $stateParams) {

	var vm = this;
	vm.setTab = setTab;
	vm.closeOverview = closeOverview;
	vm.caseoverview_tab = 'details';

	vm.transStatus = [
		{
			status: 'Initiated', 
			active: false, 
			complete: false,
			tip: 'You\'ve checked out your basket on the Patent Place, and we\'re now doing our work in the background. We will now send the request over to our payment partners Moneycorp, requesting that they book the currency exchange, and to expect a payment from you.',
			position: 'bottom-left'
		}, 
		{
			status: 'Awaiting Funds', 
			active: false, 
			complete: false,
			tip: 'MoneyCorp have booked the currency exchange, and are now waiting for your payment. They\'ll expect the funds by the date and time specified, and for it to have the correct reference on it so that the payment can be matched to the transation.',
			position: 'bottom-left'
		}, 
		{
			status: 'Funds Received', 
			active: false, 
			complete: false,
			tip: 'MoneyCorp have received your payment and they\'re now completing the foreign exchange. This happens the day after your funds were expected by MoneyCorp.',
			position: 'bottom-left'
		},
		{
			status: 'Funds Sent', 
			active: false, 
			complete: false,
			tip: 'MoneyCorp have completed the currency exchange and the Euros have been sent to the European Patent Office.',
			position: 'bottom-right'
		},
		{
			status: 'EPO Received', 
			active: false, 
			complete: false,
			tip: 'We\'ve had confirmation that the funds have been received by the EPO.',
			position: 'bottom-right'
		}, 
		{
			status: 'EPO Instructed', 
			active: false, 
			complete: false,
			tip: 'Everything is in place, and we’ve instructed the EPO.',
			position: 'bottom-right'
		},
		{
			status: 'Completed', 
			active: false, 
			complete: false,
			tip: 'We\'ve had confirmation that your transaction has been completed. You can download a copy of the invoice or any relevant certificate below.',
			position: 'bottom-right'
		}
	];	

    function closeOverview() {
        $state.go('transactions', {}, {reload: false})
    }

    function setTab(tab) {
        vm.caseoverview_tab = tab;
    }



    //assigned promise to scope so child state can also resolve this promise to invoke functions
 	$scope.promise.then(function(response){

            vm.transactionItem = response.find(function(transaction){
                return transaction.p3s_TransRef == $stateParams.transId;
            })

			vm.transactionItem.serviceUIs.map(function(item, index){
				// item.transItemStatus = transItemStatus(isValidation, transactionItem.latestTransStatus, vm.transactionItem.hasFailed);

				if(item.renewalFeeUI) { 
					item.serviceType = 'renewal'; 
					item.serviceFeeUI = item.renewalFeeUI; 
				}
				if(item.form1200FeeUI) { 
					item.serviceType = 'Euro-PCT'; 
					item.serviceFeeUI = item.form1200FeeUI; 
				}
				if(item.grantFeeUI) { 
					item.serviceType = 'grant'; 
					item.serviceFeeUI = item.grantFeeUI; 
				}

				if(item.validationFeeUI) { 
					if(vm.transStatus[3].status !== 'Processing Funds') {
						
						var obj1 = {
							status: 'Processing Funds', 
							active: false, 
							complete: false,
							tip: 'We are currently processing your funds',
							position: 'bottom-right'
						}

						var obj2 = {
							status: 'Processing', 
							active: false, 
							complete: false,
							tip: 'We are in the process of gathering and forwarding on the required documents to the appropriate European associates',
							position: 'bottom-right'
						}

						vm.transStatus.splice(3, 3);
						vm.transStatus.splice(3, 0, obj1);
						vm.transStatus.splice(4, 0, obj2);
					}

					item.serviceType = 'validation'; 
					item.serviceFeeUI = item.validationFeeUI;
					item.allStates = item.validationFeeUI.designatedStates.concat(item.validationFeeUI.validationStates, item.validationFeeUI.extensionStates)
				}

				return item;

			})

			function checkProgress() { //function to add statuses complete or active to view so it provides proggress bar to user

				var statusIndex;

				vm.transStatus.forEach(function(data, index){
					if(data.status == vm.transactionItem.latestTransStatus) {
						statusIndex = index; //find current active status
					}
				});

				for(var i=0; i <= statusIndex; i++){
					vm.transStatus[i].complete = true; //change property complete to true to all items
					if(vm.transactionItem.latestTransStatus == vm.transStatus[i].status) { //until it matches current tran statues
						vm.transStatus[i].active = true; // change active property value to true
						if(vm.transactionItem.latestTransStatus !== 'Completed') {
							vm.transStatus[i].complete = false;
						} else {
							vm.transStatus[i].active = false;
							vm.transStatus[i].complete = true;
						}
						
					}
				}
				
			};
			
			vm.checkProgress = checkProgress;
			vm.transactionLoaded = true;

	})
		




}
// CONCATENATED MODULE: ./app/features/transactions/controllers/transaction-item.details.controller.js
TransactionDetailsController.$inject = ['$scope', '$state', '$timeout', '$stateParams'];

function TransactionDetailsController($scope, $state, $timeout, $stateParams) {


	var vm = this;
	var transStatusArray = ['Initiated', 'Awaiting Funds', 'Funds Received', 'Funds Sent', 'EPO Received', 'EPO Instructed', 'Completed'];
	var transStatusValidationArray = ['Initiated', 'Awaiting Funds', 'Processing Funds', 'Processing', 'Completed'];		
	
	$scope.promise.then(function(response){
        vm.transactionItem = response.find(function(transaction){
            return transaction.p3s_TransRef == $stateParams.transId;
        })
	    var isValidation = vm.transactionItem.serviceUIs.some(function(item){
	        return item.newType == 'Validation' ? true : false;
	    })
	    vm.transactionItem.serviceUIs.map(function(item, index){
	    	var status;
	    	for(var name in item) {
	    		if(name.indexOf('Status') > -1) {
	    			status = item[name];
	    		}
	    	}
			item.transItemStatus = transItemStatus(isValidation, status, vm.transactionItem.hasFailed);
	    })
	})
	

    function transItemStatus(val, status, failed) {

    	if(failed) {
    		return 'Failed'
    	} else {

	    	var index;
	    	if(val === true) {
	    		index = transStatusValidationArray.indexOf(status);
		    	if(index < 3) {
		    		return 'Payment in progress'
		    	} else {
		    		return status;
		    	}    		
	    	} else {
	    		if(status === 'Renewal in place') {
	    			return 'Completed'
	    		}	    		
	    		index = transStatusArray.indexOf(status);
		    	if(index < 5) {
		    		return 'Payment in progress'
		    	} else {

		    		return status;
		    	}        		
	    	}

    	}

    }

}
// CONCATENATED MODULE: ./app/features/transactions/index.js








/* harmony default export */ var transactions = __webpack_exports__["default"] = (angular_default.a.module('ppApp.transactions', [transactions_serv["a" /* default */]]) //import dashboard view controllers
  	.controller('TransactionsController', TransactionsController)
  	.controller('TransactionItemController', TransactionItemController)
  	.controller('TransactionDetailsController', TransactionDetailsController)
  	.name);

/***/ }),

/***/ "./assets/imgs/app-images/008-payable.jpg":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "4aa1e7fd5f8cbb59593a247b612c6642.jpg";

/***/ }),

/***/ "./assets/imgs/app-images/008-total-payable.jpg":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fec0d34d0dedee5b7fc46afa2cd57674.jpg";

/***/ }),

/***/ "./assets/imgs/app-images/016-payable.jpg":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "cc894639a6c9a40ff472ea0e8e08bdad.jpg";

/***/ }),

/***/ "./assets/imgs/app-images/016-total-payable.jpg":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "d1eb303440aa99c2f000ff57c900df14.jpg";

/***/ }),

/***/ "./assets/imgs/app-images/016e-payable.jpg":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "cd1c0ad3fff9795fac10d35ad4571818.jpg";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/europct/europct.form1200.generated.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"row d-flex flex-grow-1\">\n    <div class=\"col-xl-12 d-flex flex-column\">\n        <div data-ng-if=\"$ctrl.patent.p3sServicesWithFees[0].serviceStatus == 'Epct saved'\" class=\"flex-grow-1\">\n            <p class=\"m-b-xs font-h4\">Your Form 1200 has been generated and is avaialble to check out or review. If you have entered any incorrect information, you can delete the Form 1200 by selecting the 'delete form 1200' button. If you delete the Form 1200, please leave up to 24 hours for these changes to be applied to your portfolio. You must then check the availability of the European action to see whether the Form 1200 can be generated again.</p>\n        </div>\n        <div data-ng-if=\"$ctrl.patent.p3sServicesWithFees[0].serviceStatus == 'Epct rejected'\" class=\"flex-grow-1\">\n            <p class=\"font-h4 m-b-sm\">The answer(s) provided in the questionnaire has resulted in the Form 1200 not being available to check out online. However, The Patent Place can help submit the Form 1200 offline so please contact us via email: support@ip.place, or phone: {{phoneNumber}}.</p>\n            <p class=\"font-h4 m-b-sm\">If you have entered any incorrect information, you can reset the Form 1200 by selecting the 'reset Form 1200' button. If you reset the order, please leave up to 24 hours for these changes to be applied to your portfolio. You must then check the availability of the European action to see whether the Form 1200 can be generated. </p>\n        </div>\n        <div data-ng-if=\"$ctrl.patent.p3sServicesWithFees[0].serviceStatus == 'Epct being generated' || $ctrl.patent.p3sServicesWithFees[0].serviceStatus == 'Await pdf gen start'\" class=\"flex-grow-1\">\n            <p class=\"m-b-xs font-h4\">We are currently generating your Form 1200. When the document is ready, you will be able to access it here.</p> \n            <p class=\"font-h4\">You can view the fees in the 'Fee Breakdown' tab through the panel.</p>                      \n        </div>\n        <div class=\"font-h4 m-b-sm\" data-ng-if=\"$ctrl.patent.p3sServicesWithFees[0].serviceStatus == 'Payment in progress' || $ctrl.patent.p3sServicesWithFees[0].serviceStatus == 'EPO Instructed'\">\n            <p class=\"font-h4\">Your European phase entry (Form 1200) action has been committed to a transaction. Navigate to transactions if you want to download your invoice. Once the EPO has been instructed, the official receipt provided by the EPO will become available online.</p>\n        </div>   \n        <div class=\"row m-t-md\">\n            <div class=\"col-md-12 d-flex flex-wrap justify-content-end align-items-middle\">\n                <button data-ng-if=\"$ctrl.patent.p3sServicesWithFees[0].serviceStatus == 'Epct saved'\" class=\"btn btn-underlined font-weight-medium m-r-sm\" data-ng-click=\"confirmDeleteApplication()\" data-ng-disabled=\"deleteApplicationReq\">Delete Form 1200</button>\n                <button data-ng-if=\"$ctrl.patent.p3sServicesWithFees[0].serviceStatus == 'Epct rejected'\" class=\"btn btn-underlined font-weight-medium m-r-sm\" data-ng-click=\"confirmDeleteApplication()\" data-ng-disabled=\"deleteApplicationReq\">Reset Form 1200</button>\n                <a data-ng-if=\"$ctrl.patent.p3sServicesWithFees[0].serviceStatus == 'Epct saved' || $ctrl.patent.p3sServicesWithFees[0].serviceStatus == 'Payment in progress'\" class=\"btn btn--lg btn--green pill-radius\" href=\"{{$ctrl.patent.form1200PdfUrl}}&download=true\" target=\"_blank\" download>Download Form 1200</a>\n            </div>\n        </div>     \n    </div>\n</div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/europct/europct.form1200.intro.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"row flex-grow-1\">\n\t<div class=\"col-md-12\">\n\t\t<div class=\"m-b-sm flex-grow-1\">\n\t\t    <h3 class=\"font-weight-bold font-h3 m-b-sm\">Form 1200 Questionnaire</h3>\n\t\t    <p>Here you can create a Form 1200 which we can submit to enter the European Phase of the PCT process. You'll be asked a small number of questions, but we get all the remaining information for you from the published data. We'll also calculate all of the fees that need to be paid with the submission.</p>\n\t\t</div>\n\t</div>\n</div>\n<div class=\"row\">\n\t<div class=\"col-md-12 d-flex justify-content-end\">\n\t\t<button class=\"btn btn--green btn--lg pill-radius\" data-ng-click=\"$ctrl.initiateForm1200()\">Start Process</button>\n\t</div>\n</div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/europct/europct.form1200.manual.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"row m-b-sm\">\n\t<div class=\"col-xl-12\">\n\t\t<p class=\"m-b-xs\" data-ng-show=\"$ctrl.urgent\">It is too close to the deadline for processing this Euro-PCT filing online. You can process the Euro-PCT filing offline by contacting one of our patent administrators via either phone: {{phoneNumber}} or email: support@ip.place.</p>\n\t\t<div class=\"m-b-xs offline-processing-panel\" data-ng-hide=\"$ctrl.urgent\">\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-md-2 d-flex justify-content-center align-items-center\">\n\t\t\t\t\t<i class=\"fas fa-exclamation-circle fa-4x txt-phase-amber\"></i>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-md-10\">\n\t\t\t\t\t<p class=\"m-b-xs font-h4 font-weight-bold\" data-ng-bind=\"$ctrl.patent.p3sServicesWithFees[0].manualProcessingUI.title\"></p>\n\t\t\t\t\t<p class=\"m-b-xs\" data-ng-bind=\"$ctrl.patent.p3sServicesWithFees[0].manualProcessingUI.description\"></p>\n\t\t\t\t\t<p>However, one of our patent administrators will be able to assist you offline and help you further regarding the Euro-PCT filing. Please contact us via either phone: {{phoneNumber}} or email: support@ip.place.</p>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t<div>\n\t</div>\n</div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/europct/europct.form1200.questionnaire.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<form name=\"form1200Form\" method=\"get\" post-action=\"form1200Service\" novalidate>    \n    <div id=\"accordion\">\n        <div class=\"card\">\n            <div class=\"card-header\" id=\"headingOne\">\n                <h4 class=\"mb-0\">\n                    <button class=\"btn btn-link font-h3 font-h3--content\" data-toggle=\"collapse\" data-target=\"#collapseOne\" aria-expanded=\"true\" aria-controls=\"collapseOne\">\n                        1. Applicant requirements\n                    </button>\n                </h4>\n            </div>\n\n            <div id=\"collapseOne\" class=\"collapse show\" aria-labelledby=\"headingOne\" data-parent=\"#accordion\">\n                <div class=\"card-body\">\n                    <div class=\"row m-b-lg\">\n                        <div class=\"col-md-12 col-lg-12 col-xl-12\">\n                            <h4 class=\"font-h4 lh-default font-weight-bold\">Question 1.1</h4>\n                            <p class=\"m-b-xs\">The/Each applicant hereby declares that he is an entity or a natural person under Rule 6(4) EPC.</p>\n                            <div class=\"form-check form-check-inline\">\n                                <input type=\"checkbox\" name=\"entityYes\" data-ng-model=\"validate.quesitonOne.yes\" class=\"form-check-input checkbox-square\" data-ng-click=\"validate.entity.no = false\" required>\n                                <label for=\"entityYes\" class=\"form-check-label\">Yes</label>\n                            </div>\n                            <div class=\"form-check form-check-inline\">\n                                <input type=\"checkbox\" name=\"entityNo\" data-ng-model=\"validate.entity.no\" class=\"form-check-input checkbox-square\" data-ng-change=\"$ctrl.checkError('entity', validate.entity.no);\" data-ng-click=\"validate.quesitonOne.yes = false; \">\n                                <label for=\"entityNo\" class=\"form-check-label\">No</label>  \n                            </div>\n                        </div>\n                        <div class=\"col-md-12 col-lg-12 col-xl-12\">\n                            <p data-ng-show=\"validate.entity.no\" class=\"txt-phase-red m-t-xs\">﻿﻿If you are not able to declare that the/each applicant is an entity or natural person, you will be unable to proceed online.</p>\n                        </div>\n                    </div>\n                    <div class=\"row m-b-sm\">\n                        <div class=\"col-xl-12\">\n                            <h4 class=\"font-h4 lh-default font-weight-bold\">Question 1.2</h4>\n                            <div class=\"form-row\">\n                                <label for=\"reference\" class=\"col-md-12 col-lg-12 col-xl-12 col-form-label font-body\">Please enter applicant's or representative's reference: </label>\n                                <div class=\"form-group col-md-12 col-lg-8 col-xl-6\">\n                                    <input type=\"text\" name=\"reference\" class=\"form-control pill-radius\" class=\"m-l-xs\" data-ng-maxlength=\"15\" data-ng-model=\"formData.clientRef\" placeholder=\"Applicant/representative reference\" ref-validate required>\n                                    <p class=\"txt-phase-red\" data-ng-show=\"form1200Form.reference.$error.maxlength && form1200Form.reference.$dirty\">A maximum of 15 characters is allowed for a Client Reference</p>\n                                </div>\n                            </div>\n                        </div>\n                    </div>                \n                </div>\n            </div>\n        </div>\n\n        <div class=\"card\">\n            <div class=\"card-header\" id=\"headingTwo\">\n                <h4 class=\"mb-0 font-h4\">\n                    <button class=\"btn btn-link collapsed font-h3 font-h3--content\" data-toggle=\"collapse\" data-target=\"#collapseTwo\" aria-expanded=\"false\" aria-controls=\"collapseTwo\">\n                        2. Claims\n                    </button>\n                </h4>\n            </div>\n            <div id=\"collapseTwo\" class=\"collapse\" aria-labelledby=\"headingTwo\" data-parent=\"#accordion\">\n                <div class=\"card-body\">\n                    <div class=\"row m-b-lg\">\n                        <div class=\"col-xl-12\">\n                            <h4 class=\"font-h4 lh-default font-weight-bold\">Question 2.1</h4>\n                            <div class=\"form-group row\">\n                                <label for=\"totalClaims\" class=\"col-md-12 col-lg-12 col-xl-12 col-form-label font-body\">How many total claims are being filed?</label>\n                                <div class=\"col-md-6 col-lg-6 col-xl-4 align-items-center\">\n                                    <input type=\"number\" name=\"totalClaims\" class=\"form-control pill-radius\" data-ng-change=\"addToFormData('', formData.totalClaims); $ctrl.excessClaimsCheck(formData.totalClaims)\" data-ng-model=\"formData.totalClaims\" placeholder=\"Total Claims\" validate-numbers required>\n\n                                </div>\n                                <div class=\"col-md-12 col-lg-12 col-xl-12\">\n                                    <p class=\"font-body txt-phase-red\" data-ng-show=\"form1200Form.totalClaims.$error.validNumber && form1200Form.totalClaims.$dirty\">Only numbers are valid charcters in this field.</p>\n                                </div>\n                            </div>\n                            \n                            <div class=\"form-group m-l-md slideDown\" data-ng-show=\"$ctrl.excessClaimsDue\">\n                                <div class=\"border-grey-xs--btm m-b-md m-t-md\"></div>\n                                <h4 class=\"font-h4 lh-default font-weight-bold\">Question 2.1.1</h4>\n                                <p class=\"font-weight-medium m-r-sm font-body m-b-xs\">Do you want to pay excess claims fee on filing?</p>\n                                <div class=\"form-check form-check-inline\">\n                                    <input type=\"checkbox\" name=\"excessclaimsYes\" data-ng-model=\"excessobject.excessclaims.yes\" class=\"form-check-input checkbox-square\" data-ng-change=\"$ctrl.notPayingExcess(excessobject.excessclaims.no);\" data-ng-click=\"excessobject.excessclaims.no = false\" data-ng-required=\"!excessobject.excessclaims.no && $ctrl.excessClaimsDue\">\n                                    <label for=\"excessclaimsYes\" class=\"form-check-label\">Yes</label>\n                                </div>\n                                <div class=\"form-check form-check-inline\">\n                                    <input type=\"checkbox\" name=\"excessclaimsNo\" data-ng-model=\"excessobject.excessclaims.no\" class=\"form-check-input checkbox-square\" data-ng-click=\"excessobject.excessclaims.yes = false\" data-ng-change=\"$ctrl.notPayingExcess(excessobject.excessclaims.no);\" data-ng-required=\"!excessobject.excessclaims.yes && $ctrl.excessClaimsDue\">\n                                    <label for=\"excessclaimsNo\" class=\"form-check-label\">No</label>   \n                                </div>\n                                <div class=\"border-grey-xs--btm m-t-md\"></div>\n                            </div>\n\n                        </div>\n                    </div>\n                    <div class=\"row m-b-lg\">\n                        <div class=\"col-xl-12\">\n                            <div class=\"form-group\">\n                                <h4 class=\"font-h4 lh-default font-weight-bold\">Question 2.2</h4>\n                                <p class=\"font-weight-medium m-r-sm font-body m-b-xs\">Have any amendments been made to the claims?</p>\n                                <div class=\"form-check form-check-inline\">\n                                    <input type=\"checkbox\" name=\"amendmentsYes\" data-ng-model=\"validate.amendments.yes\" class=\"form-check-input checkbox-square\" data-ng-change=\"$ctrl.amendmentsMade(validate.amendments.yes)\" data-ng-click=\"validate.amendments.no = false\" data-ng-required=\"!validate.amendments.no\">\n                                    <label for=\"amendmentsYes\" class=\"form-check-label\">Yes</label>\n                                </div>\n                                <div class=\"form-check form-check-inline\">\n                                    <input type=\"checkbox\" name=\"amendmentsNo\" data-ng-model=\"validate.amendments.no\" class=\"form-check-input checkbox-square\" data-ng-change=\"$ctrl.amendmentsMade(validate.amendments.yes)\" data-ng-click=\"validate.amendments.yes = false\" data-ng-required=\"!validate.amendments.yes\">\n                                    <label for=\"amendmentsNo\" class=\"form-check-label\">No</label>   \n                                </div>\n                            </div>\n\n                            <div class=\"form-group m-l-md slideDown\" data-ng-show=\"$ctrl.amendedOptions\">\n                                <div class=\"border-grey-xs--btm m-b-md m-t-md\"></div>\n                                <h4 class=\"font-h4 lh-default font-weight-bold\">Question 2.2.1</h4>\n                                <p class=\"font-weight-medium m-r-sm font-body m-b-xs\">Are you presenting the amendments on filing, or, have you filed amendments under Article 19 PCT?</p>\n                                <div class=\"form-check form-check-inline\">\n                                    <input type=\"checkbox\" name=\"excessdocsYes\" data-ng-model=\"excessobject.excessdocs.yes\" class=\"form-check-input checkbox-square\" data-ng-change=\"$ctrl.uploadAmended(excessobject.excessdocs.yes);\" data-ng-click=\"excessobject.excessdocs.no = false\" data-ng-required=\"!excessobject.excessdocs.no && $ctrl.amendedOptions\">\n                                    <label for=\"excessdocsYes\" class=\"form-check-label\">Presenting the amendments on filing</label>\n                                </div>\n                                <div class=\"form-check form-check-inline\">\n                                    <input type=\"checkbox\" name=\"excessdocsNo\" data-ng-model=\"excessobject.excessdocs.no\" class=\"form-check-input checkbox-square\" data-ng-click=\"excessobject.excessdocs.yes = false\" data-ng-change=\"$ctrl.uploadAmended(excessobject.excessdocs.yes);\" data-ng-required=\"!excessobject.excessdocs.yes && $ctrl.amendedOptions\">\n                                    <label for=\"excessdocsNo\" class=\"form-check-label\">Filed amendments under Article 19</label>   \n                                </div>\n                                <div class=\"form-group slideDown m-t-md\" data-ng-if=\"$ctrl.displayAmendedUpload\">\n                                    <label for=\"amendmentsAnnotation font-weight-bold font-h4\">Upload copy of amendments with annotations: </label>\n                                    <input type=\"file\" name=\"amendmentsAnnotation\" data-ng-init=\"formData.amended = {};\"  data-ng-model=\"formData.amended.amendedDoc\" class=\"form-control-file m-t-xs font-h4\" accept=\"application/pdf\" select-ng-files required=\"$ctrl.displayAmendedUpload\">\n                                </div>\n                                <div class=\"col-md-12 m-t-xs\" data-ng-show=\"form1200Form.amendmentsAnnotation.$error.pdfIncorrect\">\n                                    <p class=\"font-body txt-phase-red\">Please ensure that the file you have uploaded is saved in a .pdf format.</p>        \n                                </div>\n                                <div class=\"col-md-12 col-lg-12 col-xl-12 m-b-xs m-t-sm d-flex\">\n                                    <p data-ng-click=\"question3.displayHelp = !question3.displayHelp\" class=\"btn btn-underlined font-weight-medium\">Are you making sure the file is Annex F compliant?\n                                    </p>\n                                    <button class=\"btn btn-no-ng d-inline accordion-caret\" data-ng-class=\"{'active': question3.displayHelp}\" data-ng-click=\"question3.displayHelp = !question3.displayHelp\" ><i class=\"fas fa-chevron-right fa-sm\" ></i></button>\n                                </div>\n                                <div class=\"col-md-12\">                        \n                                    <div class=\"expandcollapse-item\" data-ng-init=\"question3.displayHelp = false\">\n                                        <div class=\"slideDown m-b-sm\" data-ng-hide=\"question3.displayHelp === false\">\n                                            <p class=\"font-body m-b-sm\">In order for your application to be processed, the EPO require that your PDF documents are Annex F compliant. If either of your documents are not Annex F compliant, you will be able to upload them here, but they will be rejected when submitted to the EPO. However, at that time, or earlier, we will attempt to make the document Annex F compliant. This will incur a delay. Be aware that if you are applying very late in the timeframe, this delay may cause your application to fail.</p>\n                                        </div>\n                                    </div>\n                                </div>                                \n                                <div class=\"border-grey-xs--btm m-t-md\"></div>\n                            </div>\n\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class=\"card\">\n            <div class=\"card-header\" id=\"headingThree\">\n                <h4 class=\"mb-0 font-h4\">\n                    <button class=\"btn btn-link collapsed font-h3 font-h3--content\" data-toggle=\"collapse\" data-target=\"#collapseThree\" aria-expanded=\"false\" aria-controls=\"collapseThree\">\n                        3. Extension/Validation states\n                    </button>\n                </h4>\n            </div>\n            <div id=\"collapseThree\" class=\"collapse\" aria-labelledby=\"headingThree\" data-parent=\"#accordion\">\n                <div class=\"card-body\">\n                    <div class=\"row\">\n                        <div class=\"col-md-12\">\n                             <h4 class=\"font-h4 lh-default font-weight-bold m-b-sm\">Question 3.1</h4>\n                        </div>\n                    </div>\n                    <div class=\"row m-b-md\">\n                        <div class=\"col-xl-12\">\n                            <h4 class=\"m-b-xs font-weight-medium font-body\">Extension states</h4>\n                            <div class=\"row\">\n                                <div class=\"col-md-6\" data-ng-repeat=\"item in formData.extensionStatesUI track by $index\">\n                                    <div> \n                                        <label for=\"item.abbr\" class=\"m-r-xs\">\n                                            <span class=\"font-weight-medium\">{{item.stateCode}}</span> - {{item.stateName}}\n                                        </label>\n                                        <input type=\"checkbox\" id=\"extensions-{{$index}}'\" data-ng-true-value=\"'{{item.name}}'\" data-ng-change=\"$ctrl.chkExtStates(checkbox.selected, $index);\" data-ng-model=\"checkbox.selected\">\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    </div>  \n                    <div class=\"row m-b-md\">\n                        <div class=\"col-xl-12\">\n                            <h4 class=\"m-b-xs font-weight-medium font-body\">Validation states</h4>\n                            <div class=\"row\">\n                                <div class=\"col-md-6\" data-ng-repeat=\"item in formData.validationStatesUI track by $index\">\n                                    <div class=\"m-b-sm\"> \n                                        <label for=\"item.abbr\" class=\"m-r-xs\">\n                                            <span class=\"font-weight-medium\">{{item.stateCode}}</span> - {{item.stateName}}\n                                        </label>\n                                        <input type=\"checkbox\" id=\"validation-{{$index}}'\" data-ng-true-value=\"'{{item.name}}'\" data-ng-change=\"$ctrl.chkValidStates(checkbox.selected, $index);\" data-ng-model=\"checkbox.selected\">\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                    <div class=\"row m-b-lg\">\n                        <div class=\"col-md-12 col-xl-12 d-flex\">\n                            <p data-ng-init=\"validation.displayHelp = false\" class=\"btn btn-underlined\">Which countries are included? \n                            </p>  \n                            <button class=\"btn btn-no-ng d-inline accordion-caret\" data-ng-class=\"{'active': validation.displayHelp}\" data-ng-click=\"validation.displayHelp = !validation.displayHelp\" >\n                                <i class=\"fas fa-chevron-right fa-sm\" ></i>\n                            </button>      \n                        </div> \n                        <div class=\"col-md-12 col-xl-12 m-t-xs\">             \n                            <div class=\"expandcollapse-item\">\n                                <div class=\"slideDown m-b-sm\" data-ng-show=\"validation.displayHelp\">\n                                    <p class=\"m-b-xs\">The countries that are included by default are:</p>\n                                    <div class=\"d-flex\">\n                                        <ul>\n                                            <li>Albania</li>\n                                            <li>Austria</li>\n                                            <li>Belgium</li>\n                                            <li>Bulgaria</li>\n                                            <li>Switzerland</li>\n                                            <li>Cyprus</li>\n                                            <li>Czech Republic</li>\n                                            <li>Germany</li>\n                                            <li>Denmark</li>\n\n                                        </ul>\n                                        <ul>\n                                            <li>Estonia</li>\n                                            <li>Spain</li>\n                                            <li>Finland</li>\n                                            <li>France</li>                        \n                                            <li>United Kingdom</li>\n                                            <li>Croatia</li>\n                                            <li>Hungary</li>\n                                            <li>Ireland</li>\n                                            <li>Iceland</li>\n\n                                        </ul>\n                                        <ul>\n                                            <li>Netherlands</li>\n                                            <li>Norway</li>\n                                            <li>Poland</li>\n                                            <li>Portugal</li>\n                                            <li>Romania</li>\n                                            <li>Serbia</li>\n                                            <li>Sweden</li>\n                                            <li>Slovenia</li>\n                                            <li>Slovakia</li>\n                                            <li>San Marino</li>\n                                            <li>Turkey</li>\n                                        </ul>\n                                        <ul>\n                                        </ul>                                                    \n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class=\"card\">\n            <div class=\"card-header\" id=\"headingFour\">\n                <h4 class=\"mb-0 font-h4\">\n                    <button class=\"btn btn-link collapsed font-h3 font-h3--content\" data-toggle=\"collapse\" data-target=\"#collapseFour\" aria-expanded=\"false\" aria-controls=\"collapseFour\">\n                        4. Page details\n                    </button>\n                </h4>\n            </div>\n            <div id=\"collapseFour\" class=\"collapse\" aria-labelledby=\"headingFour\" data-parent=\"#accordion\">\n                <div class=\"card-body\">\n                    <div class=\"form-group row\">\n                        <div class=\"col-md-12\">\n                            <h4 class=\"font-h4 lh-default font-weight-bold\">Question 4.1</h4>\n                        </div>\n                        <label class=\"col-md-12 col-lg-12 col-xl-12 col-form-label font-body\">Please enter start and end pages of description</label>\n                        <div class=\"col-md-6 col-lg-6 col-xl-4 align-items-center\">\n                            <input type=\"number\" name=\"descStart\" class=\"form-control pill-radius\" data-ng-change=\"addToFormData('', formData.pageDetailsData.description.typeStart)\" data-ng-model=\"formData.pageDetailsData.description.typeStart\" placeholder=\"Start\" max=\"{{totalPages}}\" validate-numbers required>\n\n                        </div>\n                        <div class=\"col-md-6 col-lg-6 col-xl-4 align-items-center\">\n                            <input type=\"number\" name=\"descEnd\" class=\"form-control pill-radius\" data-ng-change=\"addToFormData('', formData.pageDetailsData.description.typeEnd)\" data-ng-model=\"formData.pageDetailsData.description.typeEnd\" max=\"{{totalPages}}\" placeholder=\"End\" validate-numbers ng-valid-max required>\n                                                  \n                        </div>   \n                        <div class=\"col-md-12 col-lg-12 col-xl-12 m-t-xs\">\n                            <p class=\"font-body txt-phase-red\" data-ng-show=\"form1200Form.descStart.$error.validNumber && form1200Form.descStart.$dirty\">Only numbers are valid charcters in this field.</p>\n                            <p class=\"font-body txt-phase-red\" data-ng-show=\"form1200Form.descStart.$error.max && form1200Form.descStart.$dirty\">The end page exceeds the total number of pages.</p> \n                            <p class=\"font-body txt-phase-red\" data-ng-show=\"form1200Form.descEnd.$error.validNumber && form1200Form.descEnd.$dirty\">Only numbers are valid charcters in this field.</p>\n                            <p class=\"font-body txt-phase-red\" data-ng-show=\"form1200Form.descEnd.$error.max && form1200Form.descEnd.$dirty\">The end page exceeds the total number of pages.</p>\n                        </div>                                     \n                    </div>\n                    <div class=\"form-group row\">\n                        <div class=\"col-md-12\">\n                            <h4 class=\"font-h4 lh-default font-weight-bold\">Question 4.2</h4>\n                        </div>\n                        <label class=\"col-md-12 col-lg-12 col-xl-12 col-form-label font-body\">Please enter the start and end pages of claims</label>\n                        <div class=\"col-md-4 col-lg-4 col-xl-4 align-items-center\">\n                            <input type=\"number\" name=\"claimsStart\" class=\"form-control pill-radius\" data-ng-change=\"addToFormData('', formData.pageDetailsData.clams.typeStart)\" data-ng-model=\"formData.pageDetailsData.claims.typeStart\" placeholder=\"Start\" max=\"{{totalPages}}\" validate-numbers required>\n                        </div>\n                        <div class=\"col-md-4 col-lg-4 col-xl-4 align-items-center\">\n                            <input type=\"number\" name=\"claimsEnd\" class=\"form-control pill-radius\" data-ng-change=\"addToFormData('', formData.pageDetailsData.clams.typeEnd)\" data-ng-model=\"formData.pageDetailsData.claims.typeEnd\" max=\"{{totalPages}}\" placeholder=\"End\" validate-numbers ng-valid-max required>\n                        </div>   \n                        <div class=\"col-md-12 col-lg-12 col-xl-12 m-t-xs\">\n                            <p class=\"font-body txt-phase-red\"  placeholder=\"Start\" data-ng-show=\"form1200Form.claimsStart.$error.validNumber && form1200Form.claimsStart.$dirty\">Only numbers are valid charcters in this field.</p>\n                            <p class=\"font-body txt-phase-red\" data-ng-show=\"form1200Form.claimsStart.$error.max && form1200Form.claimsStart.$dirty\">The end page exceeds the total number of pages.</p>\n                            <p class=\"font-body txt-phase-red\" data-ng-show=\"form1200Form.claimsEnd.$error.validNumber && form1200Form.claimsEnd.$dirty\">Only numbers are valid charcters in this field.</p>    \n                            <p class=\"font-body txt-phase-red\" data-ng-show=\"form1200Form.claimsEnd.$error.max && form1200Form.claimsEnd.$dirty\">The end page exceeds the total number of pages.</p>\n                        </div>                                     \n                    </div>\n                    <div class=\"form-group row\">\n                        <div class=\"col-md-12\">\n                            <h4 class=\"font-h4 lh-default font-weight-bold\">Question 4.3</h4>\n                        </div>\n                        <label for=\"claimsStart\" class=\"col-md-12 col-lg-12 col-xl-12 col-form-label font-body\">Please enter start and end pages of drawings</label>\n                        <div class=\"col-md-4 col-lg-4 col-xl-4 align-items-center\">\n                            <input type=\"number\" name=\"drawingStart\" class=\"form-control pill-radius\" data-ng-change=\"addToFormData('', formData.pageDetailsData.drawings.typeStart)\" data-ng-model=\"formData.pageDetailsData.drawings.typeStart\" placeholder=\"Start\" max=\"{{totalPages}}\" validate-numbers required>\n                        </div>\n                        <div class=\"col-md-4 col-lg-4 col-xl-4 align-items-center\">\n                            <input type=\"number\" name=\"drawingEnd\" class=\"form-control pill-radius\" data-ng-change=\"addToFormData('', formData.pageDetailsData.drawings.typeStart)\" data-ng-model=\"formData.pageDetailsData.drawings.typeEnd\" max=\"{{totalPages}}\" placeholder=\"End\" validate-numbers required>\n\n                        </div>\n                        <div class=\"col-md-12 col-lg-12 col-xl-12 m-t-xs\">\n                            <p class=\"font-body txt-phase-red\" data-ng-show=\"form1200Form.drawingStart.$error.validNumber && form1200Form.drawingStart.$dirty\">Only numbers are valid charcters in this field.</p>\n                            <p class=\"font-body txt-phase-red\" data-ng-show=\"form1200Form.drawingStart.$error.max && form1200Form.drawingStart.$dirty\">The end page exceeds the total number of pages.</p>\n                            <p class=\"font-body txt-phase-red\" data-ng-show=\"form1200Form.drawingEnd.$error.validNumber && form1200Form.drawingEnd.$dirty\">Only numbers are valid charcters in this field.</p>\n                            <p class=\"font-body txt-phase-red\" data-ng-show=\"form1200Form.drawingEnd.$error.max && form1200Form.drawingEnd.$dirty\">The end page exceeds the total number of pages.</p>\n                        </div>                                                           \n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class=\"card\" data-ng-if=\"$ctrl.additionalDocuments\">\n            <div class=\"card-header\" id=\"headingFive\">\n                <h4 class=\"mb-0\">\n                    <button class=\"btn btn-link collapsed font-h3 font-h3--content\" data-toggle=\"collapse\" data-target=\"#collapseFive\" aria-expanded=\"false\" aria-controls=\"collapseFive\">\n                        5. Additional copies\n                    </button>\n                </h4>\n            </div>\n            <div id=\"collapseFive\" class=\"collapse\" aria-labelledby=\"headingFive\" data-parent=\"#accordion\">\n                <div class=\"card-body\">\n                    <div class=\"row m-b-lg\">\n                        <div class=\"col-md-12 col-xl-12\">\n                            <h4 class=\"font-h4 lh-default font-weight-bold\">Question 5.1</h4>\n                            <p class=\"font-weight-medium m-b-xs\">If additional copies of the document cited in the supplementary European search report are requested, enter the total number below. If no additional copies are required, please leave the value of 0</p>\n                        </div>\n                        <div class=\"col-md-3 col-lg-3 col-xl-3 align-items-center\">\n                            <div class=\"form-group\">\n                                <input type=\"number\" name=\"documentsYes\" class=\"form-control\" data-ng-init=\"formData.numAdditionalCopies = 0\" data-ng-model=\"formData.numAdditionalCopies\" data-ng-required=\"!validate.documents.no\" data-ng-change=\"$ctrl.checkError('documents', validate.documents.yes);\" data-ng-click=\"validate.documents.no = false\">\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>        \n        <div class=\"card\"  data-ng-if=\"$ctrl.isYear3RenewalDue\">\n            <div class=\"card-header\" id=\"headingSix\">\n                <h4 class=\"mb-0 font-h4\">\n                    <button class=\"btn btn-link collapsed font-h3 font-h3--content\" data-toggle=\"collapse\" data-target=\"#collapseSix\" aria-expanded=\"false\" aria-controls=\"collapseSix\">\n                        {{$ctrl.additionalDocuments === true ?  6 : 5 }}. Request Renewal\n                    </button>\n                </h4>\n            </div>\n            <div id=\"collapseSix\" class=\"collapse\" aria-labelledby=\"headingSix\" data-parent=\"#accordion\">\n                <div class=\"card-body\">\n                    <div class=\"row m-b-lg\">\n                        <div class=\"col-xl-12\">\n                            <h4 class=\"font-h4 lh-default font-weight-bold\">Question {{$ctrl.additionalDocuments === true ?  6 : 5 }}.1</h4> \n                            <p class=\"m-b-xs\">We can see that the third year renewal can be renewed. Would you like to process the renewal in this transaction?</p>\n                            <div class=\"form-check form-check-inline\">\n                                \n                                <input \n                                type=\"checkbox\" \n                                name=\"renewalYes\" \n                                class=\"form-check-input\" \n                                data-ng-model=\"formData.isYear3RenewalPaying.yes\" \n                                data-ng-click=\"formData.isYear3RenewalPaying.no = false; addToFormData('', formData.isYear3RenewalPaying)\"\n                                data-ng-required=\"!formData.isYear3RenewalPaying.no\"\n                                required\n                                >\n                                <label for=\"renewalYes\" class=\"form-check-label\">Yes</label>\n                              \n                                <input \n                                type=\"checkbox\" \n                                name=\"renewalNo\" \n                                class=\"form-check-input\" \n                                data-ng-model=\"formData.isYear3RenewalPaying.no\" \n                                data-ng-click=\"formData.isYear3RenewalPaying.yes = false; addToFormData('', formData.isYear3RenewalPaying)\"\n                                data-ng-required=\"!formData.isYear3RenewalPaying.yes\"\n                                required\n                                >\n                                <label for=\"renewalNo\" class=\"form-check-label\">No</label>            \n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>            \n    </div>\n    <div class=\"row m-t-sm\">\n        <div class=\"col-xl-12 text-right\">\n            <button type=\"submit\" id=\"submit\" class=\"btn btn--green btn--lg pill-radius\" type=\"button\" data-ng-disabled=\"form1200Form.$invalid || formDataSubmitted\" data-ng-click=\"$ctrl.submitForm1200Data(formData);\">Generate form</button>\n        </div>\n    </div>\n</form>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/grant/grant.intro.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"row m-b-sm\">\n\t<div class=\"col-xl-12\">\t\n\t    <h3 class=\"font-weight-bold font-h3 m-b-sm\">Grant, Rule 71(3), Questionnaire</h3>\n\t    <p class=\"m-b-xs\">You'll be asked a small number of questions, that will help calculate fees and prepare the grant order, Rule 71(3), for instruction to the European Patent Office. When the Grant instruction has been prepared, you can commit it to a transaction.</p>\n\t    <p class=\"font-weight-bold\">Please confirm that you understand the following statements:</p>\n\t</div>\n</div>\n<form name=\"grantInitiate\" class=\"d-flex flex-column flex-grow-1\">\n\t<div class=\"form-group m-b-sm\">\n\t\t<p class=\"font-body m-b-xs font-weight-medium\">The French and German translations of this application are required to be uploaded</p>\n        <div class=\"form-check form-check-inline\">\n            <input type=\"checkbox\" name=\"translations\" data-ng-model=\"initiate.translations\" class=\"form-check-input checkbox-square\" required>\n            <label for=\"translations\" class=\"form-check-label\">I understand</label>\n        </div>\n\t</div>\n\t<div class=\"form-group m-b-sm\">\n\t\t<p class=\"font-body m-b-xs font-weight-medium\">Details of total number of claims and pages are required (if applicable)</p>\n        <div class=\"form-check form-check-inline\">\n            <input type=\"checkbox\" name=\"totals\" data-ng-model=\"initiate.totals\" class=\"form-check-input checkbox-square\" required>\n            <label for=\"totals\" class=\"form-check-label\">I understand</label>\n        </div>\n\t</div>\n\t<div class=\"row d-flex flex-grow-1\">\n\t\t<div class=\"col-xl-12 d-flex justify-content-end align-items-end\">\n\t\t\t<button class=\"btn btn--green btn--lg pill-radius\" data-ng-click=\"$ctrl.initiateGrantOrder()\" data-ng-disabled=\"grantInitiate.$invalid\">Start Process</button>\n\t\t</div>\n\t</div>\t\n</form>\n\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/grant/grant.questionnaire.tpl.htm":
/***/ (function(module, exports, __webpack_require__) {

module.exports = "<form name=\"grantForm\" method=\"get\" post-action=\"grantService\" novalidate>\r\n    <div id=\"accordion\">\r\n        <div class=\"card\">\r\n            <div class=\"card-header\" id=\"headingOne\">\r\n                <h4 class=\"mb-0\">\r\n                    <button class=\"btn btn-link font-h3 font-h3--content\" data-toggle=\"collapse\" data-target=\"#collapseOne\" aria-expanded=\"true\" aria-controls=\"collapseOne\">\r\n                        1. Applicant requirements\r\n                    </button>\r\n                </h4>\r\n            </div>                        \r\n\r\n            <div id=\"collapseOne\" class=\"collapse show\" aria-labelledby=\"headingOne\" data-parent=\"#accordion\">\r\n                <div class=\"card-body\">\r\n                    <div class=\"row m-b-lg\" data-ng-if=\"$ctrl.representativeRequired\">\r\n                        <div class=\"col-md-12 col-lg-12 col-xl-12\">\r\n                            <h4 class=\"font-h4 lh-default font-weight-bold\">Question 1.1</h4>\r\n                            <p class=\"m-b-xs\">IP Place are required to act as your professional representatives in order to file your action. Do you agree to these terms?</p>\r\n                            <div class=\"form-check form-check-inline\">\r\n                                <input type=\"checkbox\" name=\"representativeYes\" data-ng-model=\"validate.representative.yes\" class=\"form-check-input checkbox-square\" data-ng-click=\"validate.representative.no = false\" required>\r\n                                <label for=\"representativeYes\" class=\"form-check-label\">Yes</label>\r\n                            </div>\r\n                            <div class=\"form-check form-check-inline\">\r\n                                <input type=\"checkbox\" name=\"representativeNo\" data-ng-model=\"validate.representative.no\" class=\"form-check-input checkbox-square\" data-ng-change=\"$ctrl.checkError('representative', validate.representative.no);\" data-ng-click=\"validate.representative.yes = false; \">\r\n                                <label for=\"representativeNo\" class=\"form-check-label\">No</label>  \r\n                            </div>\r\n                        </div>\r\n                        <div class=\"col-md-12 col-lg-12 col-xl-12\">                \r\n                            <p data-ng-show=\"validate.representative.no\" class=\"txt-phase-red m-t-xs\">If you do not wish IP Place to act as a professional representative, you will be unable to proceed online.</p>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"row m-b-lg\">\r\n                        <div class=\"col-md-12 col-lg-12 col-xl-12\">\r\n                            <h4 class=\"font-h4 lh-default font-weight-bold\">Question 1.<span>{{$ctrl.representativeRequired ? '2' : '1'}}</span></h4>\r\n                            <p class=\"m-b-xs\">Do you approve the allowed text attached to the article 71(3) communication?</p>\r\n                            <div class=\"form-check form-check-inline\">\r\n                                <input type=\"checkbox\" name=\"approveTextYes\" data-ng-model=\"validate.approveText.yes\" class=\"form-check-input checkbox-square\" data-ng-click=\"validate.approveText.no = false\" required>\r\n                                <label for=\"approveTextYes\" class=\"form-check-label\">Yes</label>\r\n                            </div>\r\n                            <div class=\"form-check form-check-inline\">\r\n                                <input type=\"checkbox\" name=\"approveTextNo\" data-ng-model=\"validate.approveText.no\" class=\"form-check-input checkbox-square\" data-ng-click=\"validate.approveText.yes = false;\" data-ng-change=\"$ctrl.checkError('approveText', validate.approveText.no);\">\r\n                                <label for=\"approveTextNo\" class=\"form-check-label\">No</label>  \r\n                            </div>                        \r\n                        </div>\r\n                        <div class=\"col-md-12 col-lg-12 col-xl-12\">\r\n                            <p data-ng-show=\"validate.approveText.no\" class=\"txt-phase-red m-t-xs\">If you do not approve the allowed text attached to article 71(3) communication, you will be unable to proceed online.</p>    \r\n                        </div>\r\n                    </div>  \r\n                    <div class=\"row m-b-lg\">\r\n                        <div class=\"col-md-12 col-lg-12 col-xl-12\">\r\n                            <h4 class=\"font-h4 lh-default font-weight-bold\">Question 1.<span>{{$ctrl.representativeRequired ? '3' : '2'}}</span></h4>\r\n                            <div class=\"form-group row\">\r\n                                <label for=\"reference\" class=\"col-md-12 col-lg-12 col-xl-12 col-form-label font-body\">Please provide an applicant or representative reference:</label>\r\n                                <div class=\"col-md-8 col-lg-7 col-xl-8 d-flex align-items-center\">\r\n                                    <input type=\"text\" name=\"clientRef\" id=\"clientRef\" class=\"form-control pill-radius\" data-ng-model=\"formData.clientRef\" placeholder=\"Applicant/representative reference\" data-ng-maxlength=\"15\" ref-validate required>                 \r\n                                </div>\r\n                            </div>\r\n                            <p class=\"font-body txt-phase-red\" data-ng-show=\"grantForm.clientRef.$error.required && grantForm.clientRef.$dirty\">Please fill out this field</p>\r\n                            <p class=\"txt-phase-red m-t-xs\" data-ng-show=\"grantForm.clientRef.$error.maxlength && grantForm.clientRef.$dirty\">A maximum of 15 characters is allowed for a Client Reference</p>\r\n                            <div class=\"row m-b-xs m-t-sm\">\r\n                                <div class=\"col-md-8 col-lg-7 col-xl-6  d-flex\">\r\n                                    <p data-ng-click=\"question4.displayHelp = !question4.displayHelp\" class=\"btn btn-underlined font-weight-medium\">Applicant/representative reference? \r\n                                    </p>\r\n                                    <button class=\"btn btn-no-ng d-inline accordion-caret\" data-ng-class=\"{'active': question4.displayHelp}\" data-ng-click=\"question4.displayHelp = !question4.displayHelp\" ><i class=\"fas fa-chevron-right fa-sm\" ></i></button>\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"expandcollapse-item\" data-ng-init=\"question4.displayHelp = false\">\r\n                                <div class=\"slideDown m-b-sm\" data-ng-hide=\"question4.displayHelp === false\">\r\n                                    <p class=\"font-body\">This reference is required when submitting the Form 1038 to the European Patent Office. If you initially provided a Client Reference when adding the patent to your portfolio, it will default to this value, but you can provide any reference of your choice.</p>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                    </div>                                          \r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"card\">\r\n            <div class=\"card-header\" id=\"headingTwo\">\r\n                <h4 class=\"mb-0\">\r\n                    <button class=\"btn btn-link font-h3 font-h3--content\" data-toggle=\"collapse\" data-target=\"#collapseTwo\" aria-expanded=\"false\" aria-controls=\"collapseTwo\">\r\n                        2. Translations\r\n                    </button>\r\n                </h4>                \r\n            </div>\r\n            <div id=\"collapseTwo\" class=\"collapse\" aria-labelledby=\"headingTwo\" data-parent=\"#accordion\">\r\n                <div class=\"card-body\">\r\n                    <div class=\"row m-b-lg\">\r\n                        <div class=\"col-xl-12\">\r\n                            <h4 class=\"font-h4 lh-default font-weight-bold\" data-ng-hide=\"$ctrl.representativeRequired\">Question 2.1</h4>           \r\n                            <p>Please provide both the French and German translations of the claims:</p>\r\n                            <div class=\"form-check form-check-inline m-t-sm\">\r\n                                <label for=\"frenchTranslation\" class=\"form-check-label m-r-xs font-weight-medium\">French: \r\n                                <input type=\"file\" name=\"frenchTranslation\" data-ng-init=\"formData.translations.frenchTranslation = {};\" data-ng-model=\"formData.translations.frenchTranslation\" class=\"form-control-file\" select-ng-files accept=\"application/pdf\" required></label>  \r\n                            </div>                    \r\n                  \r\n                            <div class=\"form-check form-check-inline m-t-sm\">\r\n                                <label for=\"germanTranslation\" class=\"form-check-label m-r-xs font-weight-medium\">German: \r\n                                <input type=\"file\" name=\"germanTranslation\" data-ng-init=\"formData.translations.germanTranslation = {};\" data-ng-model=\"formData.translations.germanTranslation\" class=\"form-control-file\" select-ng-files accept=\"application/pdf\" required></label>           \r\n                            </div>\r\n                        </div>\r\n                        <div class=\"col-md-12 m-t-xs\" data-ng-show=\"grantForm.germanTranslation.$error.pdfIncorrect || grantForm.frenchTranslation.$error.pdfIncorrect\">\r\n                            <p class=\"font-body txt-phase-red\">Please ensure that the file you have uploaded is saved in a .pdf format.</p>        \r\n                        </div>\r\n                        <div class=\"col-md-12 col-lg-12 col-xl-12 m-b-xs m-t-sm d-flex\">\r\n                            <p data-ng-click=\"question3.displayHelp = !question3.displayHelp\" class=\"btn btn-underlined font-weight-medium\">Are you making sure the file is Annex F compliant?\r\n                            </p>\r\n                            <button class=\"btn btn-no-ng d-inline accordion-caret\" data-ng-class=\"{'active': question3.displayHelp}\" data-ng-click=\"question3.displayHelp = !question3.displayHelp\" ><i class=\"fas fa-chevron-right fa-sm\" ></i></button>\r\n                        </div>\r\n                        <div class=\"col-md-12\">                        \r\n                            <div class=\"expandcollapse-item\" data-ng-init=\"question3.displayHelp = false\">\r\n                                <div class=\"slideDown m-b-sm\" data-ng-hide=\"question3.displayHelp === false\">\r\n                                    <p class=\"font-body m-b-sm\">In order for your application to be processed, the EPO require that your PDF documents are Annex F compliant. If either of your documents are not Annex F compliant, you will be able to upload them here, but they will be rejected when submitted to the EPO. However, at that time, or earlier, we will attempt to make the document Annex F compliant. This will incur a delay. Be aware that if you are applying very late in the timeframe, this delay may cause your application to fail.</p>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                    </div>                    \r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"card\">\r\n            <div class=\"card-header\" id=\"headingThree\">\r\n                <h4 class=\"mb-0\">\r\n                    <button class=\"btn btn-link font-h3 font-h3--content\" data-toggle=\"collapse\" data-target=\"#collapseThree\" aria-expanded=\"false\" aria-controls=\"collapseThree\">\r\n                        3. Claims\r\n                    </button>\r\n                </h4>                \r\n            </div>\r\n            <div id=\"collapseThree\" class=\"collapse\" aria-labelledby=\"headingThree\" data-parent=\"#accordion\">\r\n                <div class=\"card-body\">\r\n                    <div class=\"row m-b-lg\">\r\n                        <div class=\"col-md-12 col-lg-12 col-xl-12\">\r\n                            <h4 class=\"font-h4 lh-default font-weight-bold\">Question 3.1</h4>\r\n                            <p>Are there any excess claims payable according to 71(3)?</p>\r\n                            <div class=\"form-check form-check-inline\">\r\n                                <input type=\"checkbox\" name=\"excessClaimsYes\" data-ng-model=\"formData.isExcessClaims.yes\" class=\"form-check-input checkbox-square\" data-ng-change=\"$ctrl.excessClaims(formData.isExcessClaims.yes);\" data-ng-click=\"formData.isExcessClaims.no = false\" data-ng-required=\"!formData.isExcessClaims.no\">\r\n                                <label for=\"excessClaimsYes\" class=\"form-check-label\">Yes</label>\r\n                            </div>\r\n                            <div class=\"form-check form-check-inline\">\r\n                                <input type=\"checkbox\" name=\"excessClaimsNo\" data-ng-model=\"formData.isExcessClaims.no\" class=\"form-check-input checkbox-square\"\r\n                                data-ng-change=\"$ctrl.excessClaims(formData.isExcessClaims.yes);\" data-ng-click=\"formData.isExcessClaims.yes = false; \" data-ng-required=\"!formData.isExcessClaims.yes\">\r\n                                <label for=\"excessClaimsNo\" class=\"form-check-label\">No</label>  \r\n                            </div>                            \r\n                        </div>\r\n                    </div>\r\n\r\n                    <div class=\"m-l-md m-r-md slideDown\" data-ng-show=\"$ctrl.excessClaimsDue\">\r\n                        \r\n                        <div class=\"border-grey-xs--btm m-b-md m-t-md\"></div> \r\n\r\n                        <div class=\"form-group row align-items-center\">\r\n                            <div class=\"col-md-12 col-xl-12\">\r\n                                <h4 class=\"font-h4 lh-default font-weight-bold\">Question 3.1.1</h4>\r\n                            </div>\r\n                            <label class=\"col-md-6 col-xl-6 col-form-label font-body\">Amount payable under fee code 016:</label>\r\n                            <button class=\"btn btn-no-bg\">\r\n                                <i class=\"fas fa-question-circle txt-phase-green cursor-pointer fa-lg\">\r\n                                </i>\r\n                                <md-tooltip md-delay=\"200\" class=\"mdtooltip-md font-body tooltip-image\" md-direction=\"bottom\" md-z-index=\"99999\">\r\n                                    <div class=\"tooltip-content-container m-b-xs\">\r\n                                        At section 2.1 (3) of the rule 71(3), the top number of the second column within the 016 fee section holds the amount payable for 016 fees. Please provide this amount. Check below snippet from a rule 71(3) for an example.\r\n                                    </div>\r\n                                    <div class=\"tooltip-content-container\">\r\n                                        <img src=\"" + __webpack_require__("./assets/imgs/app-images/016-payable.jpg") + "\" alt=\"screen shot of rule 71(3) 016 fee\" class=\"tooltip-content-container__image\">\r\n                                    </div>                                    \r\n                                                                           \r\n                                </md-tooltip>\r\n                            </button>\r\n                            <div class=\"col-md-6 col-xl-4\">\r\n                                <input type=\"text\" name=\"feePayable_016\" class=\"form-control pill-radius\" data-ng-change=\"addToFormData('', formData.feePayable_016)\" data-ng-init=\"formData.feePayable_016 = 0\" data-ng-model=\"formData.feePayable_016\" validate-numbers data-ng-required=\"formData.isExcessClaims.yes\">\r\n                            </div>\r\n                            <div class=\"col-md-12 col-lg-12 col-xl-12\">\r\n                                <p class=\"font-body txt-phase-red\" data-ng-show=\"grantForm.feePayable_016.$error.validNumber && grantForm.feePayable_016.$dirty\">Only numbers are valid characters in this field.</p>\r\n                            </div>\r\n                        </div>\r\n                \r\n                        <div class=\"form-group row align-items-center\">\r\n                            <div class=\"col-md-12 col-xl-12\">\r\n                                <h4 class=\"font-h4 lh-default font-weight-bold\">Question 3.1.2</h4>\r\n                            </div>\r\n                            <label class=\"col-md-6 col-xl-6 col-form-label font-body\">Amount payable under fee code 016e:</label>\r\n                            <button class=\"btn btn-no-bg\">\r\n                                <i class=\"fas fa-question-circle txt-phase-green cursor-pointer fa-lg\">\r\n                                </i>\r\n                                <md-tooltip md-delay=\"200\" class=\"mdtooltip-md font-body tooltip-image\" md-direction=\"bottom\" md-z-index=\"99999\">\r\n                                    <div class=\"tooltip-content-container m-b-xs\">\r\n                                        (If required) At section 2.1 (3) of the rule 71(3), the top number of the second column within the 016e fee section holds the amount payable for 016e fees. Please provide this amount. Check below snippet from a rule 71(3) for an example.\r\n                                    </div>\r\n                                    <div class=\"tooltip-content-container\">\r\n                                        <img src=\"" + __webpack_require__("./assets/imgs/app-images/016e-payable.jpg") + "\" alt=\"screen shot of rule 71(3) 016e fee\" class=\"tooltip-content-container__image\"> \r\n                                    </div>                                    \r\n                                                                           \r\n                                </md-tooltip>\r\n                            </button>                            \r\n                            <div class=\"col-md-6 col-xl-4\">\r\n                                <input type=\"text\" name=\"feePayable_016e\" class=\"form-control pill-radius\" data-ng-change=\"addToFormData('', formData.feePayable_016e)\" data-ng-model=\"formData.feePayable_016e\" data-ng-init=\"formData.feePayable_016e = 0\"  validate-numbers data-ng-required=\"formData.isExcessClaims.yes\">\r\n                            </div>\r\n                            <div class=\"col-md-12 col-lg-12 col-xl-12\">\r\n                                <p class=\"font-body txt-phase-red\" data-ng-show=\"grantForm.feePayable_016e.$error.validNumber && grantForm.feePayable_016e.$dirty\">Only numbers are valid characters in this field.</p>\r\n                            </div>\r\n                        </div>\r\n                   \r\n                        <div class=\"form-group row align-items-center\">\r\n                            <div class=\"col-md-12 col-xl-12\">\r\n                                <h4 class=\"font-h4 lh-default font-weight-bold\">Question 3.1.3</h4>\r\n                            </div>\r\n                            <label class=\"col-md-6 col-xl-6 col-form-label font-body\">Total amount payable:</label>\r\n                            <button class=\"btn btn-no-bg\">\r\n                                <i class=\"fas fa-question-circle txt-phase-green cursor-pointer fa-lg\" data-ng-if=\"!$ctrl.transactionItem.hasFailed\">\r\n                                </i>\r\n                                <md-tooltip md-delay=\"200\" class=\"mdtooltip-md font-body tooltip-image\" md-direction=\"bottom\" md-z-index=\"99999\">\r\n                                    <div class=\"tooltip-content-container m-b-xs\">\r\n                                        At section 2.1 (3) of the rule 71(3), you will find the total amount owed in the second column within the 016 fee section. Please provide this amount. Check below snippet from a rule 71(3) for an example.\r\n                                    </div>\r\n                                    <div class=\"tooltip-content-container\">\r\n                                        <img src=\"" + __webpack_require__("./assets/imgs/app-images/016-total-payable.jpg") + "\" alt=\"screen shot of rule 71(3) total amount payable for excess claims\" class=\"tooltip-content-container__image\"> \r\n                                    </div>                                    \r\n                                                                           \r\n                                </md-tooltip>\r\n                            </button>                              \r\n                            <div class=\"col-md-6 col-xl-4\">\r\n                                <input type=\"text\" name=\"totalClaimsPayable\" class=\"form-control pill-radius\" data-ng-change=\"addToFormData('', formData.totalClaimsPayable)\" data-ng-model=\"formData.totalClaimsAmountPayable\" data-ng-init=\"formData.totalClaimsAmountPayable = 0\"  validate-numbers data-ng-required=\"formData.isExcessClaims.yes\">\r\n                            </div>  \r\n                            <div class=\"col-md-12 col-lg-12 col-xl-12\">\r\n                                <p class=\"font-body txt-phase-red\" data-ng-show=\"grantForm.totalClaimsPayable.$error.validNumber && grantForm.totalClaimsPayable.$dirty\">Only numbers are valid characters in this field.</p>\r\n                            </div>\r\n                        </div>\r\n                  \r\n                        <div class=\"form-group row align-items-center\">\r\n                            <div class=\"col-md-12 col-xl-12\">\r\n                                <h4 class=\"font-h4 lh-default font-weight-bold\">Question 3.1.4</h4>\r\n                            </div>\r\n                            <label class=\"col-md-6 col-xl-6 col-form-label font-body\">Number of claims already paid. If no claims paid before, please enter 0:</label>\r\n                            <button class=\"btn btn-no-bg\">\r\n                                <i class=\"fas fa-question-circle txt-phase-green cursor-pointer fa-lg\">\r\n                                </i>\r\n                                <md-tooltip md-delay=\"200\" class=\"mdtooltip-md font-body tooltip-image\" md-direction=\"bottom\" md-z-index=\"99999\">\r\n                                    <div class=\"tooltip-content-container\">\r\n                                        If any, please state the total number of excess claims that have been paid for prior to the current rule 71(3) communication.\r\n                                    </div>                                                                           \r\n                                </md-tooltip>\r\n                            </button>\r\n                            <div class=\"col-md-6 col-xl-4\">\r\n                                <input type=\"text\" name=\"alreadyPaidClaims\" class=\"form-control pill-radius\" data-ng-change=\"addToFormData('', formData.alreadyPaidClaims)\" data-ng-model=\"formData.numClaimsPaid\" data-ng-init=\"formData.numClaimsPaid = 0\" validate-numbers data-ng-required=\"formData.isExcessClaims.yes\">\r\n                            </div>\r\n                            <div class=\"col-md-12 col-lg-12 col-xl-12\">\r\n                                <p class=\"font-body txt-phase-red\" data-ng-show=\"grantForm.alreadyPaidClaims.$error.validNumber && grantForm.alreadyPaidClaims.$dirty\">Only numbers are valid characters in this field.</p>\r\n                            </div>                              \r\n                        </div>\r\n                        <div class=\"border-grey-xs--btm m-b-md m-t-md\"></div> \r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"card\">\r\n            <div class=\"card-header\" id=\"headingFour\">\r\n                <h4 class=\"mb-0\">\r\n                    <button class=\"btn btn-link font-h3 font-h3--content\" data-toggle=\"collapse\" data-target=\"#collapseFour\" aria-expanded=\"false\" aria-controls=\"collapseFour\">\r\n                        4. Pages\r\n                    </button>\r\n                </h4>                \r\n            </div>\r\n            <div id=\"collapseFour\" class=\"collapse\" aria-labelledby=\"headingFour\" data-parent=\"#accordion\">\r\n                <div class=\"card-body\">\r\n                    <div class=\"row m-b-lg\">\r\n                        <div class=\"col-md-12 col-lg-12 col-xl-12\">\r\n                            <h4 class=\"font-h4 lh-default font-weight-bold\">Question 4.1</h4>\r\n                            <p>Are there any excess pages payable according to 71(3)?</p>\r\n                            <div class=\"form-check form-check-inline\">\r\n                                <input type=\"checkbox\" name=\"excessPagesYes\" data-ng-model=\"formData.isExcessPages.yes\" class=\"form-check-input checkbox-square\" data-ng-change=\"$ctrl.excessPages(formData.isExcessPages.yes);\" data-ng-click=\"formData.isExcessPages.no = false\" data-ng-required=\"!formData.isExcessPages.no\">\r\n                                <label for=\"excessPagesYes\" class=\"form-check-label\">Yes</label>\r\n                            </div>\r\n                            <div class=\"form-check form-check-inline\">\r\n                                <input type=\"checkbox\" name=\"excessPagesNo\" data-ng-model=\"formData.isExcessPages.no\" class=\"form-check-input checkbox-square\" data-ng-change=\"$ctrl.excessPages(formData.isExcessPages.yes);\" data-ng-click=\"formData.isExcessPages.yes = false; \" data-ng-required=\"!formData.isExcessPages.yes\">\r\n                                <label for=\"excessPagesNo\" class=\"form-check-label\">No</label>  \r\n                            </div>                            \r\n                        </div>\r\n                    </div>\r\n\r\n                    <div class=\"m-l-md m-r-md slideDown\" data-ng-show=\"$ctrl.excessPagesDue\">\r\n                        \r\n                        <div class=\"border-grey-xs--btm m-b-md m-t-md\"></div> \r\n\r\n                        <div class=\"form-group row align-items-center\">\r\n                            <div class=\"col-md-12 col-xl-12\">\r\n                                <h4 class=\"font-h4 lh-default font-weight-bold\">Question 4.1.1</h4>\r\n                            </div>\r\n                            <label class=\"col-md-6 col-xl-6 col-form-label font-body\">Amount payable under fee code 008:</label>\r\n                            <button class=\"btn btn-no-bg\">\r\n                                <i class=\"fas fa-question-circle txt-phase-green cursor-pointer fa-lg\">\r\n                                </i>\r\n                                <md-tooltip md-delay=\"200\" class=\"mdtooltip-md font-body tooltip-image\" md-direction=\"bottom\" md-z-index=\"99999\">\r\n                                    <div class=\"tooltip-content-container m-b-xs\">\r\n                                       At section 2.1 (2b) of the rule 71(3), the top number of the second column within the 008 fee section holds the amount payable for 008 fees. Please provide this amount. Check below snippet from a rule 71(3) for an example.\r\n                                    </div>\r\n                                    <div class=\"tooltip-content-container\">\r\n                                        <img src=\"" + __webpack_require__("./assets/imgs/app-images/008-payable.jpg") + "\" alt=\"screen shot of rule 71(3) total amount payable under fee code 008\" class=\"tooltip-content-container__image\"> \r\n                                    </div>                                    \r\n                                                                           \r\n                                </md-tooltip>\r\n                            </button>                            \r\n                            <div class=\"col-md-6 col-xl-4\">\r\n                                <input type=\"text\" name=\"feePayable_008\" class=\"form-control pill-radius\" data-ng-change=\"addToFormData('', formData.PagesDetails.payable016)\" data-ng-model=\"formData.feePayable_008\" data-ng-init=\"formData.feePayable_008 = 0\" validate-numbers data-ng-required=\"formData.isExcessPages.yes\">\r\n                            </div>\r\n                            <div class=\"col-md-12 col-lg-12 col-xl-12\">\r\n                                <p class=\"font-body txt-phase-red\" data-ng-show=\"grantForm.feePayable_008.$error.validNumber && grantForm.feePayable_008.$dirty\">Only numbers are valid characters in this field.</p>\r\n                            </div>                               \r\n                        </div>\r\n                   \r\n                        <div class=\"form-group row align-items-center\">\r\n                            <div class=\"col-md-12 col-xl-12\">\r\n                                <h4 class=\"font-h4 lh-default font-weight-bold\">Question 4.1.2</h4>\r\n                            </div>\r\n                            <label class=\"col-md-6 col-xl-6 col-form-label font-body\">Total amount payable:</label>\r\n                            <button class=\"btn btn-no-bg\">\r\n                                <i class=\"fas fa-question-circle txt-phase-green cursor-pointer fa-lg\">\r\n                                </i>\r\n                                <md-tooltip md-delay=\"200\" class=\"mdtooltip-md font-body tooltip-image\" md-direction=\"bottom\" md-z-index=\"99999\">\r\n                                    <div class=\"tooltip-content-container m-b-xs\">\r\n                                        At section 2.1 (2b) of the rule 71(3), you will find the total amount owed in the second column within the 008 fee section. Please provide this amount. Check below snippet from a rule 71(3) for an example.\r\n                                    </div>\r\n                                    <div class=\"tooltip-content-container\">\r\n                                        <img src=\"" + __webpack_require__("./assets/imgs/app-images/008-total-payable.jpg") + "\" alt=\"screen shot of rule 71(3) total amount payable for excess pages\" class=\"tooltip-content-container__image\"> \r\n                                    </div>                                    \r\n                                                                           \r\n                                </md-tooltip>\r\n                            </button>                            \r\n                            <div class=\"col-md-6 col-xl-4\">\r\n                                <input type=\"text\" name=\"totalPayable\" class=\"form-control pill-radius\" data-ng-change=\"addToFormData('', formData.PagesDetails.totalPayable)\" data-ng-model=\"formData.totalPagesAmountPayable\" data-ng-init=\"formData.totalPagesAmountPayable = 0\" validate-numbers data-ng-required=\"formData.isExcessPages.yes\">\r\n                            </div>\r\n                            <div class=\"col-md-12 col-lg-12 col-xl-12\">\r\n                                <p class=\"font-body txt-phase-red\" data-ng-show=\"grantForm.totalPayable.$error.validNumber && grantForm.totalPayable.$dirty\">Only numbers are valid characters in this field.</p>\r\n                            </div>\r\n                        </div>\r\n                  \r\n                        <div class=\"form-group row align-items-center\">\r\n                            <div class=\"col-md-12 col-xl-12\">\r\n                                <h4 class=\"font-h4 lh-default font-weight-bold\">Question 4.1.3</h4>\r\n                            </div>\r\n                            <label class=\"col-md-6 col-xl-6 col-form-label font-body\">Number of pages already paid. If no pages have been paid for previously, please enter 0:</label>\r\n                            <button class=\"btn btn-no-bg\">\r\n                                <i class=\"fas fa-question-circle txt-phase-green cursor-pointer fa-lg\">\r\n                                </i>\r\n                                <md-tooltip md-delay=\"200\" class=\"mdtooltip-md font-body\" md-direction=\"bottom\" md-z-index=\"99999\">\r\n                                    <div class=\"tooltip-content-container\">\r\n                                        If any, please state the total number of excess pages that have been paid for prior to the current rule 71(3) communication.\r\n                                    </div>                                                                           \r\n                                </md-tooltip>\r\n                            </button>                            \r\n                            <div class=\"col-md-6 col-xl-4\">\r\n                                <input type=\"text\" name=\"alreadyPaidPages\" class=\"form-control pill-radius\" data-ng-change=\"addToFormData('', formData.PagesDetails.alreadyPaidPages)\" data-ng-model=\"formData.numPagesPaid\" data-ng-init=\"formData.numPagesPaid = 0\" validate-numbers data-ng-required=\"formData.isExcessPages.yes\">\r\n                            </div>\r\n                            <div class=\"col-md-12 col-lg-12 col-xl-12\">\r\n                                <p class=\"font-body txt-phase-red\" data-ng-show=\"grantForm.alreadyPaidPages.$error.validNumber && grantForm.alreadyPaidPages.$dirty\">Only numbers are valid characters in this field.</p>\r\n                            </div>                            \r\n                        </div>\r\n                        <div class=\"border-grey-xs--btm m-b-md m-t-md\"></div> \r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>                \r\n    </div> <!-- accordion end-->\r\n    <div class=\"row m-t-md\">\r\n        <div class=\"col-md-12 col-xl-12 d-flex align-items-center justify-content-end\">\r\n       <!-- these two buttons invoke selectQuestion-->\r\n            <div class=\"d-flex align-items-center justify-content-end\">\r\n                <button type=\"button\" id=\"submit\" class=\"btn btn--green btn--lg pill-radius\"  data-ng-click=\"$ctrl.submitGrantData(formData);\" data-ng-disabled=\"grantForm.$invalid || $ctrl.formDataSubmitted\">Save Grant Order</button>\r\n            </div>\r\n        </div>\r\n    </div>    \r\n</form>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/grant/grant.ready.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"row\">\n\t<div class=\"col-md-12\">\n\t\t<p class=\"font-h4 m-b-sm\" data-ng-if=\"$ctrl.patent.p3sServicesWithFees[0].serviceStatus == 'Grant saved'\">Your grant action is ready and you can now add it to the basket. If you need to make amendments to the grant order, reset it and then check the European action availability. If the grant action is still available, the questionnaire will be available again to provide new answers.</p>\n\t\t<p class=\"font-h4 m-b-sm\" data-ng-if=\"$ctrl.patent.p3sServicesWithFees[0].serviceStatus == 'Grant saved'\"> The break down of fees are available to view in the 'Fee Breakdown' tab to the <span class=\"d-md-none d-lg-inline\">left.</span> <span class=\"d-md-inline d-lg-none\">below.</span></p>\n\n\t\t<div class=\"m-b-xs offline-processing-panel\" data-ng-if=\"$ctrl.patent.p3sServicesWithFees[0].serviceStatus == 'Manual processing'\">\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-md-2 d-flex justify-content-center align-items-center\">\n\t\t\t\t\t<i class=\"fas fa-exclamation-circle fa-4x txt-phase-amber\"></i>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-md-10\">\n\t\t\t\t\t<p class=\"m-b-xs font-h4 font-weight-bold\" data-ng-bind=\"$ctrl.patent.p3sServicesWithFees[0].manualProcessingUI.title\"></p>\n\t\t\t\t\t<p class=\"m-b-xs\" data-ng-bind=\"$ctrl.patent.p3sServicesWithFees[0].manualProcessingUI.description\"></p>\n\t\t\t\t\t<p class=\"m-b-xs\">The answer(s) provided in the questionnaire has resulted in the grant action not being available to check out online. However, The Patent Place can help submit the grant action offline so please contact us via email: support@ip.place, or phone: {{phoneNumber}}.</p>\n\t\t\t\t\t<div data-ng-show=\"$ctrl.patent.p3sServicesWithFees[0].manualProcessingUI.canUserReset\">\t\n\t\t\t\t\t\t<p class=\"m-b-sm\">If you have entered any incorrect information, you can reset the grant order by selecting the 'reset grant order' button. If you reset the order, please leave up to 24 hours for these changes to be applied to your portfolio. You must then check the availability of the European action to see whether the grant order can be prepared again.</p>\n\t\t\t\t\t\t<div class=\"text-right\">\t\t\t\t\t\t\n\t\t\t\t\t\t\t<button class=\"btn btn--lg btn--green pill-radius\" data-ng-click=\"$ctrl.uninhibitGrantConfirm()\">Reset Grant Order</button>\t\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t</div>\t\n<!-- \t\n\t\t<p class=\"font-h4 m-b-sm\" data-ng-if=\"$ctrl.patent.p3sServicesWithFees[0].serviceStatus == 'Manual processing'\">The answer(s) provided in the questionnaire has resulted in the grant action not being available to check out online. However, The Patent Place can help submit the grant action offline so please contact us via email: support@ip.place, or phone: {{phoneNumber}}.</p>\n\t\t<p class=\"font-h4 m-b-sm\" data-ng-if=\"$ctrl.patent.p3sServicesWithFees[0].serviceStatus == 'Manual processing'\">If you have entered any incorrect information, you can reset the grant order by selecting the 'reset grant order' button. If you reset the order, please leave up to 24 hours for these changes to be applied to your portfolio. You must then check the availability of the European action to see whether the grant order can be prepared again. </p> -->\n\n\t\t<p class=\"font-h4 m-b-sm\" data-ng-if=\"$ctrl.patent.p3sServicesWithFees[0].serviceStatus == 'Too Late Online'\">We unfortunately are unable to process your Grant order online. However, one of our patent administrators will be able to assist you offline and help you further in regards to the Grant instruction. Please contact us via either phone: {{phoneNumber}} or email: support@ip.place.</p>\n\t\t<p class=\"font-h4 m-b-sm\" data-ng-if=\"$ctrl.patent.p3sServicesWithFees[0].serviceStatus == 'Manual processing mandated'\">The data received from the EPO has resulted in this grant action not being available online. The Patent Place can offer help with this action offline via a Patent Administrator. For further help please contact The Patent Place via email: support@ip.place, or phone: {{phoneNumber}}.</p>\n\t\t<p class=\"font-h4 m-b-sm\" data-ng-if=\"$ctrl.patent.p3sServicesWithFees[0].serviceStatus == 'Payment in progress' || $ctrl.patent.p3sServicesWithFees[0].serviceStatus == 'EPO Instructed'\">Your grant action has been committed to a transaction. Navigate to transactions if you want to download a proforma invoice. Once the transaction is completed, you'll be able to download receipts and final invoice.</p>\n\t</div>\n</div>\n<div class=\"row m-t-sm\">\n\t<div class=\"col-md-12 d-flex justify-content-end\">\n\t\t<button class=\"btn btn--lg btn--red pill-radius\" data-ng-if=\"$ctrl.patent.p3sServicesWithFees[0].serviceStatus == 'Grant saved' && $ctrl.patent.p3sServicesWithFees[0].saleType == 'Online'\" data-ng-click=\"$ctrl.deleteGrantConfirm()\">Reset Grant Order</button>\n<!--         <ngcart-addtocart id=\"{{$ctrl.patent.patentID}}\" class=\"cartbtn m-l-sm\" name=\"service.grant\" price=\"{{$ctrl.patent.p3sServicesWithFees[0].currentStageCostUSD}}\" quantity=\"1\" quantity-max=\"10\" data=\"$ctrl.patent\" data-ng-if=\"$ctrl.patent.p3sServicesWithFees[0].serviceStatus == 'Grant saved' && $ctrl.patent.p3sServicesWithFees[0].saleType == 'Online'\"></ngcart-addtocart> -->\n\t</div>\n</div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.assisted-formality-details.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-stretch\">\r\n\t<p class=\"font-h2 font-weight-bold m-b-xs\">Requesting assisted formality filing</p>\r\n\t<p class=\"m-b-xs\">Please read and understand the two sections below regarding requesting assisted formality filing.</p>\r\n\t<div class=\"row\">\r\n\t\t<div class=\"col-md-6 col-xl-6\">\r\n\t\t\t<p class=\"font-h4 m-b-xs font-weight-bold\">Additional costs</p>\r\n\t\t\t<p>Our team of IP professionals are here ready to prepare and review your cases formalities on your request. As this service requires manual intervention from a member of our team, additional fees are added to the standard self-filing fee. The additional supported fee table is displayed below:</p>\r\n\t\t\t<table class=\"t-data m-t-sm\">\r\n\t\t\t\t<tr class=\"t-data__row\">\r\n\t\t\t\t\t<td class=\"t-data__td t-data__td--no-side-padding font-weight-bold\">Formality</td>\r\n\t\t\t\t\t<td class=\"t-data__td t-data__td--no-side-padding font-weight-bold\">Fee</td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr class=\"t-data__row\">\r\n\t\t\t\t\t<td class=\"t-data__td t-data__td--no-side-padding\">Euro-PCT filing:</td>\r\n\t\t\t\t\t<td class=\"t-data__td t-data__td--no-side-padding\">$ {{$ctrl.feeOject.epctSupportFee}}</td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr class=\"t-data__row\">\r\n\t\t\t\t\t<td class=\"t-data__td t-data__td--no-side-padding\">Grant, Rule 71(3):</td>\r\n\t\t\t\t\t<td class=\"t-data__td t-data__td--no-side-padding\">$ {{$ctrl.feeOject.grantSupportFee}}</td>\r\n\t\t\t\t</tr>\t\t\t\t\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td class=\"t-data__td t-data__td--no-side-padding\">EP Validation:</td>\t\t\t\t\r\n<!-- \t\t\t\t\t<table> -->\r\n\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t<td>- Each London Agreement Country:</td>\r\n\t\t\t\t\t\t\t<td>$ {{$ctrl.feeOject.valLondonSupportFee}}</td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t<td>- Each Non-London Agreement Country:</td>\r\n\t\t\t\t\t\t\t<td>$ {{$ctrl.feeOject.valAnySupportFee}}</td>\r\n\t\t\t\t\t\t</tr>\t\t\t\t\t\t\r\n\t\t\t<!-- \t\t</table>\r\n -->\t\t\t\t</tr>\r\n\t\t\t</table>\r\n\t\t</div>\r\n\t\t<div class=\"col-md-6 col-xl-6\">\r\n\t\t\t<p class=\"font-h4 m-b-xs font-weight-bold\">Accessing your account</p>\r\n\t\t\t<p>In order for Patent Place to manually prepare formalities on your behalf, one of our IP professionals will need to be granted temporary access to your account in order to carry out the necessary work.</p>\r\n\t\t\t<p class=\"m-t-sm\">Once the required formality work has been completed, the temporary access will be removed.</p>\r\n\t\t</div>\t\t\r\n\t</div>\r\n\t<div class=\"row d-flex m-t-sm \">\r\n\t\t<div class=\"col-md-12 col-xl-12 text-center\">\r\n\t\t    <div class=\"d-flex justify-content-center\">    \t\r\n\t\t\t    <button class=\"btn btn--lg btn--red pill-radius m-r-sm\" data-ng-click=\"$ctrl.cancel()\">Cancel</button>\r\n\t\t\t    <button class=\"btn btn--lg btn--green pill-radius\" data-ng-click=\"$ctrl.confirm()\">Confirm</button>\r\n\t\t    </div>\r\n\t\t</div>\r\n\t</div>\r\n</div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.confirm-cancel-1200.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n    <span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"fas fa-exclamation-circle fa-4x txt-phase-red\"></i>   \n    </div>\n    <p class=\"font-h3 font-weight-medium\">Cancel Application</p>\n    <p class=\"font-body w-100 text-center m-b-sm m-t-xs\">It looks like you're trying to cancel the process of generating a Form 1200. If you meant to do this then please carry on, otherwise select 'Cancel'.</p>\n    <div class=\"d-flex\">\n        <button class=\"btn btn--lg btn--red pill-radius m-r-md\" data-ng-click=\"$ctrl.dismissModal()\">Cancel</button>\n        <button class=\"btn btn--lg btn--green pill-radius\" data-ng-click=\"$ctrl.ok()\">Cancel Application</button>\n    </div>\n</div>\n\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.confirm-delete-epct-application-success.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n    <span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"fas fa-exclamation-circle fa-4x txt-phase-red\"></i>   \n    </div>\n\t<p class=\"font-h3 font-weight-medium\">Remove Form 1200 Application</p>\n\t<p class=\"font-body w-100 text-center m-b-sm m-t-xs\">It looks like you're trying to remove this Form 1200 application from the system. If you meant to do this then please carry on, otherwise select 'Cancel' to stop the deletion.</p>\n    <div class=\"d-flex\">\n    \t<button class=\"btn btn--lg btn--red pill-radius m-r-md\" data-ng-click=\"$ctrl.dismissModal()\">Cancel</button>\n    \t<button class=\"btn btn--lg btn--green pill-radius\" data-ng-click=\"$ctrl.confirm($scope.patent.patentID)\">Remove</button>\n    </div>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.confirm-delete-grant-order.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n    <span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"fas fa-exclamation-circle fa-4x txt-phase-red\"></i>   \n    </div>\n    <p class=\"font-h3 font-weight-medium\">Reset Grant Order</p>\n    <p class=\"font-body w-100 text-center m-b-sm m-t-xs\">Do you want to reset your grant order?</p>\n    <div class=\"d-flex\">\n    \t<button class=\"btn btn--lg btn--red pill-radius m-r-md\" data-ng-click=\"$ctrl.dismissModal()\">Cancel</button>\n    \t<button class=\"btn btn--lg btn--green pill-radius\" data-ng-click=\"$ctrl.deleteGrant()\">Yes</button>\n    </div>\n</div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.confirm-delete-patent.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\r\n    <span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\r\n    <div class=\"m-b-sm\">\r\n        <i class=\"fas fa-exclamation-circle fa-4x txt-phase-red\"></i>   \r\n    </div>\r\n\t<p class=\"font-h3 font-weight-medium\">Remove Patent</p>\r\n\t<p class=\"font-body w-100 text-center m-b-sm m-t-xs\">It looks like you're trying to remove this patent from the system. If you meant to do this then please carry on, otherwise select 'Cancel' to stop the deletion.</p>\r\n    <div class=\"d-flex\">\r\n    \t<button class=\"btn btn--lg btn--red pill-radius m-r-md\" data-ng-click=\"$ctrl.cancelDeletion()\">Cancel</button>\r\n    \t<button class=\"btn btn--lg btn--green pill-radius\" data-ng-click=\"$ctrl.deletePatent()\" data-ng-disabled=\"$ctrl.deleteInprogress\">Remove</button>\r\n    </div>\r\n</div>\r\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.confirm-requesting-assitance.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-stretch\">\r\n\t<div class=\"row\">\r\n\t\t<div class=\"col-md-12 col-xl-12\">\r\n\t\t\t<p class=\"font-h3 m-b-sm font-weight-bold\">Requesting assistance for {{$ctrl.epApplicationNumber}}</span></p>\r\n\t\t\t<p class=\"m-b-xs\">You have selected 'Request support' for this case and selected support category:</p>\r\n\t\t\t<ul>\r\n\t\t\t\t<li>{{$ctrl.supportType}}</li>\r\n\t\t\t</ul>\r\n\t\t</div>\r\n\t</div>\r\n\r\n\t<div class=\"row\">\r\n\t\t<div class=\"col-md-12 col-xl-12\">\r\n\t\t\t<p class=\"m-b-xs\">To proceed, click 'Confirm', and you will be automatically navigated to the support form that will be pre-populated with the options you have selected. You will have the opportunity to provide further details to your support enquiry. When you submit your support enquiry, one of our professional team members will be notified who will then be in contact to help you further.</p>\r\n\t\t\t<p>If you do not require support for this case then click 'Cancel'.</p>\r\n\t\t</div>\t\r\n\t</div>\r\n\r\n\t<div class=\"row d-flex m-t-sm \">\r\n\t\t<div class=\"col-md-12 col-xl-12 text-center\">\r\n\t\t    <div class=\"d-flex justify-content-center\">    \t\r\n\t\t\t    <button class=\"btn btn--lg btn--red pill-radius m-r-sm\" data-ng-click=\"$ctrl.cancel()\">Cancel</button>\r\n\t\t\t    <button class=\"btn btn--lg btn--green pill-radius\" data-ng-click=\"$ctrl.confirm()\">Confirm</button>\r\n\t\t    </div>\r\n\t\t</div>\r\n\t</div>\r\n</div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.confirm-uninhibit-grant-order.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n    <span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"fas fa-exclamation-circle fa-4x txt-phase-red\"></i>   \n    </div>\n\t<p class=\"font-h3 font-weight-medium\">Reset Grant Order</p>\n\t<p class=\"font-body w-100 text-center m-b-sm m-t-xs\">Do you want to reset your grant order?</p>\n    <div class=\"d-flex\">\n    \t<button class=\"btn btn--lg btn--red pill-radius m-r-md\" data-ng-click=\"$ctrl.dismissModal()\">Cancel</button>\n    \t<button class=\"btn btn--lg btn--green pill-radius\" data-ng-click=\"$ctrl.uninhibitGrant()\">Yes</button>\n    </div>\n</div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.delete-epct-application-error.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n    <span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"far fa-times-circle fa-4x txt-phase-red\"></i>\n    </div>\n    <p class=\"font-h3 font-weight-medium\">Error</p>\n    <p class=\"font-body w-100 text-center m-b-sm m-t-xs\">We've encoutered a problem updating your profile.  Please try again.  If it's still a problem then please let us know: support@ip.place</p>\n    <button class=\"btn btn--lg btn--green pill-radius\" data-ng-click=\"$ctrl.dismissModal()\">Dismiss</button>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.delete-epct-application-success.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n    <span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"fas fa-check-circle fa-4x txt-phase-green\"></i>\n    </div>\n    <p class=\"font-h3 font-weight-medium\">Success</p>\n    <p class=\"font-body w-100 text-center m-b-sm m-t-xs\">Successfully deleted the Euro-PCT application that was generated for this patent</p>\n    <button class=\"btn btn--green btn--lg pill-radius\" data-ng-click=\"$ctrl.dismissModal()\">Dismiss</button>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.delete-patent-error-trans.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n    <span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"far fa-times-circle fa-4x txt-phase-red\"></i>\n    </div>\n\t<p class=\"font-h3 font-weight-medium\">Error</p>\n\t<p class=\"font-body w-100 text-center m-b-sm m-t-xs\">We've encoutered a problem removing that patent from the system. Please try again. If it's still a problem then please let us know: support@ip.place</p>\n\t<button class=\"btn btn--lg btn--green pill-radius\" data-ng-click=\"$ctrl.dismissModal()\">Dismiss</button>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.delete-patent-error.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n    <span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"far fa-times-circle fa-4x txt-phase-red\"></i>\n    </div>\n    <p class=\"font-h3 font-weight-medium\">Error</p>\n    <p class=\"font-body w-100 text-center m-b-sm m-t-xs\">We've encoutered a problem removing that patent from the system. Please try again. If it's still a problem then please let us know: support@ip.place</p>\n    <button class=\"btn btn--lg btn--green pill-radius\" data-ng-click=\"$ctrl.dismissModal()\">Dismiss</button>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.edit-epct-application-error.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n    <span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"far fa-times-circle fa-4x txt-phase-red\"></i>\n    </div>\n    <p class=\"font-h3 font-weight-medium\">Error</p>\n    <p class=\"font-body w-100 text-center m-b-sm m-t-xs\">We've encoutered a problem updating your application. Please try again. If it's still a problem then please let us know: support@ip.place</p>\n    <button class=\"btn btn--lg btn--green pill-radius\" data-ng-click=\"$ctrl.dismissModal()\">Dismiss</button>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.form1200-generating.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n    <span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"fas fa-check-circle fa-4x txt-phase-green\"></i>   \n    </div>\n    <p class=\"font-h3 font-weight-medium\">Form 1200 will now be generated</p>\n    <p class=\"font-body w-100 text-center m-b-sm m-t-xs\">We're now checking the details you've supplied and generating the form. Once this has been generated it will be available through the Form 1200 tab</p>\n    <button class=\"btn btn--lg btn--green pill-radius\" data-ng-click=\"$ctrl.dismissModal()\">Dismiss</button>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.generate-form1200-error.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n    <span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"far fa-times-circle fa-4x txt-phase-red\"></i>\n    </div>\n    <p class=\"font-h3 font-weight-medium\">Error</p>\n    <p class=\"font-body w-100 text-center m-b-sm m-t-xs\">There was an error processing the informaton provided for the Form 1200. Please check the information you have entered and try again. If it's still a problem then please let us know: support@ip.place</p>\n    <button class=\"btn btn--lg btn--green pill-radius\" data-ng-click=\"$ctrl.dismissModal()\">Dismiss</button>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.grant-first-mismatch.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n    <span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"far fa-times-circle fa-4x txt-phase-red\"></i>\n    </div>\n    <p class=\"font-h3 font-weight-medium\">Values provided do not match</p>\n    <p class=\"font-body w-100 text-left m-b-sm m-t-xs\">We've encountered a problem while calculating the 016/016e/008 fees. The reason could be due to either or both:</p>\n    \t<ul class=\"font-body\">\n    \t\t<li>you might have paid previous excess claims or page fees on a lower rate</li>\n    \t\t<li>you might have entered incorrect values</li>\n    \t</ul>\n\t<p class=\" m-b-sm\">Please check the details and try again. If it's still a problem then please let us know: support@ip.place</p>\n    <button class=\"btn btn--lg btn--green pill-radius\" data-ng-click=\"$ctrl.dismissModal()\">Dismiss</button>\n</div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.grant-order-deleted.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n    <span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"fas fa-check-circle fa-4x txt-phase-green\"></i>\n    </div>\n\t<p class=\"font-h3 font-weight-medium\">Grant Order Reset</p>\n\t<p class=\"font-body w-100 text-center m-b-sm m-t-xs\">The grant order is now in the process of being reset. Please leave up to 24 hours for these changes to be made to your portfolio. Please then check the availability of the European action.</p>\n    <div class=\"d-flex\">\n    \t<button class=\"btn btn--lg btn--green pill-radius m-r-md\" data-ng-click=\"$ctrl.dismissModal()\">Dismiss</button>\n    </div>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.grant-order-not-prepared.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n    <span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"fas fa-exclamation-circle fa-4x txt-phase-red\"></i>   \n    </div>\n\t<p class=\"font-h3 font-weight-medium\">Grant Order Error</p>\n\t<p class=\"font-body w-100 text-center m-b-sm m-t-xs\">We've encoutered a problem creating your grant order. Please try again. If it's still a problem then please let us know: support@ip.place {{$ctrl.phoneNumber}}</p>\n    <div class=\"d-flex\">\n    \t<button class=\"btn btn--lg btn--red pill-radius m-r-md\" data-ng-click=\"$ctrl.dismissModal()\">Dismiss</button>\n    </div>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.grant-order-prepared.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n    <span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"fas fa-check-circle fa-4x txt-phase-green\"></i> \n    </div>\n\t<p class=\"font-h3 font-weight-medium\">Grant Order Prepared</p>\n\t<p class=\"font-body w-100 text-center m-b-sm m-t-xs\">Your grant order has been prepared and is ready to check out</p>\n    <div class=\"d-flex\">\n    \t<button class=\"btn btn--lg btn--green pill-radius m-r-md\" data-ng-click=\"$ctrl.dismissModal()\">Dismiss</button>\n    </div>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.grant-order-uninhibited.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n    <span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"fas fa-check-circle fa-4x txt-phase-green\"></i>\n    </div>\n\t<p class=\"font-h3 font-weight-medium\">Grant Order Reset</p>\n\t<p class=\"font-body w-100 text-center m-b-sm m-t-xs\">The grant order is now in the process of being reset. Please leave up to 24 hours for these changes to be made to your portfolio. Please then check the availability of the European action.</p>\n    <div class=\"d-flex\">\n    \t<button class=\"btn btn--lg btn--green pill-radius m-r-md\" data-ng-click=\"$ctrl.dismissModal()\">Dismiss</button>\n    </div>\n</div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.grant-second-mismatch.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n    <span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"far fa-times-circle fa-4x txt-phase-red\"></i>\n    </div>\n    <p class=\"font-h3 font-weight-medium\">Contact IP Place</p>\n    <p class=\"font-body w-100 text-center m-b-sm m-t-xs\">We've encountered a problem while calculating the 016/016e/008 fees for a second time. Do not worry though, our Patent Administrator can help manually process your instruction. Please contact us on either: support@ip.place or {{$ctrl.phoneNumber}}</p>\n    <button class=\"btn btn--lg btn--green pill-radius\" data-ng-click=\"$ctrl.dismissModal()\">Dismiss</button>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.invalid-page-nos.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n    <span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"far fa-times-circle fa-4x txt-phase-red\"></i>\n    </div>\n\t<p class=\"font-h3 font-weight-medium\">Invalid page start and numbers</p>\n\t<p class=\"font-body w-100 text-center m-b-sm m-t-xs\">It seems incorrect start and end page numbers for descriptions, drawings and claims have been entered. Please check and try again. If it's still a problem then please let us know support@ip.place</p>\n\t<button class=\"btn btn--lg btn--green pill-radius\" data-ng-click=\"$ctrl.dismissModal()\">Dimiss</button>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.not-checking-claims.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n    <span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"fas fa-exclamation-circle fa-4x txt-phase-amber\"></i>\n    </div>\n    <p class=\"font-h3 font-weight-medium\">Uploading amended claims</p>\n    <p class=\"font-body w-100 text-center m-b-sm m-t-xs\">We can submit amended claims to the EPO, though we do not have a professional review them for you. Please ensure that you have had a professional review the claims before uploading them.</p>\n    <button class=\"btn btn--green btn--lg pill-radius\" data-ng-click=\"$ctrl.dismissModal()\">Dismiss</button>\n</div>\n\n\n\n\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.not-paying-excess.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n    <span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"fas fa-exclamation-circle fa-4x txt-phase-amber\"></i>\n    </div>\n    <p class=\"font-h3 font-weight-medium\">Delaying paying excess claims fee</p>\n    <p class=\"font-body w-100 text-center m-b-sm m-t-xs\">If you choose to delay paying excess claim fees on filing, the EPO will issue a 161162 communication that requires a response from the applicant or their representative. You will have a 6-month deadline from the date of receipt of the communication from the EPO. Failure to respond will deem your application withdrawn.</p>\n    <button class=\"btn btn--green btn--lg pill-radius\" data-ng-click=\"$ctrl.dismissModal()\">Dismiss</button>\n</div>\n\n\n\n\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.update-epct-notifications-error.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n    <span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"far fa-times-circle fa-4x txt-phase-red\"></i>\n    </div>\n    <p class=\"font-h3 font-weight-medium\">Error</p>\n    <p class=\"font-body w-100 text-center m-b-sm m-t-xs\">We've encoutered a problem updating your notifications settings. Please try again. If it's still a problem then please let us know: support@ip.place</p>\n    <button class=\"btn btn--lg btn--green pill-radius\" data-ng-click=\"$ctrl.dismissModal()\">Dismiss</button>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.update-epct-notifications-success.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n    <span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"fas fa-check-circle fa-4x txt-phase-green\"></i>   \n    </div>\n    <p class=\"font-h3 font-weight-medium\">Success</p>\n    <p class=\"font-body w-100 text-center m-b-sm m-t-xs\">Successfully updated the notification settings</p>\n    <button class=\"btn btn--lg btn--green pill-radius\" data-ng-click=\"$ctrl.dismissModal()\">Dismiss</button>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.update-patent-error.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n    <span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"far fa-times-circle fa-4x txt-phase-red\"></i>\n    </div>\n    <p class=\"font-h3 font-weight-medium\">Error</p>\n    <p class=\"font-body w-100 text-center m-b-sm m-t-xs\">We cannot currently save your changes made to the application. Please try again later. We apologise for any inconvenience.</p>\n    <button class=\"btn btn--lg btn--green pill-radius\" data-ng-click=\"$ctrl.dismissModal()\">Dismiss</button>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.update-patent-success.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n\t<span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n\t<div class=\"m-b-sm\">\n\t\t<i class=\"fas fa-check-circle fa-4x txt-phase-green\"></i>\t\n\t</div>\n\t<p class=\"font-h3 font-weight-medium\">Success</p>\n\t<p class=\"font-body w-100 text-center m-b-sm m-t-xs\">We've saved the updates you've made to your patent information.</p>\n    <button class=\"btn btn--lg btn--green pill-radius\" data-ng-click=\"$ctrl.dismissModal()\">Dismiss</button>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.validation-confirm-deletion.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n    <span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"fas fa-exclamation-circle fa-4x txt-phase-green\"></i>   \n    </div>\n    <p class=\"font-h3 font-weight-medium\">Request new quote</p>\n    <p class=\"font-body w-100 text-center m-b-sm m-t-xs\">Do you want to request a new quote? If you confirm and click 'yes', the current quote will be deleted. </p>\n    <div class=\"d-flex\">\n    \t<button class=\"btn btn--lg btn--red pill-radius m-r-md\" data-ng-click=\"$ctrl.dismissModal()\">Cancel</button>\n    \t<button class=\"btn btn--lg btn--green pill-radius\" data-ng-click=\"$ctrl.confirmDeletion()\">Yes</button>\n    </div>\n</div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.validation-poas-submitted-error.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n    <span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"far fa-times-circle fa-4x txt-phase-red\"></i>\n    </div>\n    <p class=\"font-h3 font-weight-medium\">Error submitting Power of Attorney documents</p>\n    <p class=\"font-body w-100 text-center m-b-sm m-t-xs\">We've encoutered a problem whilst attempting to submit the PoA document(s). Please try again. If it's still a problem then please let us know: support@ip.place</p>\n    <button class=\"btn btn--lg btn--green pill-radius\" data-ng-click=\"$ctrl.dismissModal()\">Dismiss</button>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.validation-poas-submitted.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n    <span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"fas fa-check-circle fa-4x txt-phase-green\"></i>   \n    </div>\n    <p class=\"font-h3 font-weight-medium\">Power of Attorney Documents submitted</p>\n    <p class=\"font-body w-100 text-center m-b-sm m-t-xs\">You have successfully submitted your signed PoA document(s). When we have received the orignal signed PoA documents, we will forward these on to the appropriate associates who will then carry out the required work.</p>\n    <button class=\"btn btn--lg btn--green pill-radius\" data-ng-click=\"$ctrl.dismissModal()\">Dismiss</button>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.validation-quote-failed.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n    <span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"far fa-times-circle fa-4x txt-phase-red\"></i>\n    </div>\n    <p class=\"font-h3 font-weight-medium\">Error requesting quote</p>\n    <p class=\"font-body w-100 text-center m-b-sm m-t-xs\">We've encoutered a problem whilst attempting to request a quote. Please try again. If it's still a problem then please let us know: support@ip.place<</p>\n    <button class=\"btn btn--lg btn--green pill-radius\" data-ng-click=\"$ctrl.dismissModal()\">Dismiss</button>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/modals/modal.validation-quote-requested.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n    <span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"fas fa-check-circle fa-4x txt-phase-green\"></i>   \n    </div>\n    <p class=\"font-h3 font-weight-medium\">We are fetching your quote</p>\n    <p class=\"font-body w-100 text-center m-b-sm m-t-xs\">We are calculating the fees required to validate your patent in the specified states. It typically takes less than 2 hours to provide you with a quote, but can sometimes take up to three working days. We will notify you via email when the quote is ready.</p>\n    <button class=\"btn btn--lg btn--green pill-radius\" data-ng-click=\"$ctrl.dismissModal()\">Dismiss</button>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/validation/validation-available.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"row m-b-sm\">\n\t<div class=\"col-xl-12 m-b-sm\">\t\n\t    <h3 class=\"font-weight-bold font-h3 m-b-sm\">Validations</h3>\n\t    <p class=\"m-b-xs font-body\">Deadline for requesting quote: <span class=\"font-weight-bold\" data-ng-bind=\"$ctrl.validationInfo.latestDateToRequestQuote | date: 'MMMM d, y'\"></span></p>\n\t</div>\n\t<div class=\"col-xl-12\">\t\n\t\t<p>Displayed below are the available designated states. Select or de-select the states you wish to include in the quote, confirm correspondence details, and click 'request quote'</p>\n\t</div>\n\n</div>\n\n<form name=\"validationForm\" novalidate>\n\t<div class=\"row m-b-xs\">\n\t\t<div class=\"col-xl-12\">\n\t\t\t<input type=\"button\" data-ng-click=\"$ctrl.stateSelection('Select all'); $ctrl.checkStates();\" value=\"Select all\" class=\"font-body btn btn-underlined\"> \n\t\t\t<span class=\"font-h4\">|</span> \n\t\t\t<input type=\"button\" data-ng-click=\"$ctrl.stateSelection('De-select all'); $ctrl.checkStates();\" value=\"De-select all\" class=\"font-body btn btn-underlined\">\n\t\t</div>\n\t</div>\n\t<div class=\"form-group row m-b-md\" data-ng-if=\"$ctrl.validationInfo.designatedStates.length > 0\">\n\t\t<div class=\"col-xl-12\">\n\t\t\t<h4 class=\"font-weight-medium font-h4\">Contracting States</h4>\n\t\t    <div class=\"row\">\n\t\t    \t<div class=\"col-xl-2 m-t-sm text-right\" data-ng-repeat=\"designatedStates in $ctrl.validationInfo.designatedStates\" data-ng-init=\"designatedStates.selected = false;\">\t    \t\t\n\t\t\t\t\t<div class=\"form-check form-check-inline\">\n\t\t\t\t\t  \t<label class=\"form-check-label cursor-pointer\" for=\"designatedStates.stateName\">{{designatedStates.stateCode}}\n\t\t\t\t            <md-tooltip md-delay=\"200\" md-direction=\"right\" md-z-index=\"99999\">\n\t\t\t\t              \t{{designatedStates.stateName}}\n\t\t\t\t            </md-tooltip>\t\t\t\t\t  \t\t\n\t\t\t\t\t  \t</label>\n\t\t\t\t\t  \t<input class=\"form-check-input\" type=\"checkbox\" id=\"{{designatedStates.stateName}}\" data-ng-model=\"designatedStates.selected\"  data-ng-change=\"$ctrl.checkStates(designatedStates.selected, $index, 'designated');\">\n\t\t\t\t\t</div>\n\n\t\t    \t</div>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t<div class=\"form-group row m-b-md\" data-ng-if=\"$ctrl.validationInfo.extensionStates.length > 0\">\n\t\t<div class=\"col-xl-12\">\t\n\t\t    <h4 class=\"font-weight-medium font-h4\">Extension States</h4>\n\t\t    <div class=\"row\">\n\t\t\t    <div class=\"col-xl-2 m-t-sm text-right\" data-ng-repeat=\"extensionStates in $ctrl.validationInfo.extensionStates\" data-ng-init=\"extensionStates.selected = false;\">\n\t\t\t\t\t<div class=\"form-check form-check-inline\">\n\t\t\t\t\t  \t<label class=\"form-check-label cursor-pointer\" for=\"extensionStates.stateName\">{{extensionStates.stateCode}}\n\t\t\t\t            <md-tooltip md-delay=\"300\" md-direction=\"right\" md-z-index=\"99999\">\n\t\t\t\t              \t{{extensionStates.stateName}}\n\t\t\t\t            </md-tooltip>\t\n\t\t\t\t\t  \t</label>\n\t\t\t\t\t  \t<input class=\"form-check-input\" type=\"checkbox\" id=\"{{extensionStates.stateName}}\" data-ng-model=\"extensionStates.selected\"  data-ng-change=\"$ctrl.checkStates(extensionStates.selected, $index, 'extension');\">\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t<div class=\"form-group row m-b-md\" data-ng-if=\"$ctrl.validationInfo.validationStates.length > 0\">\n\t\t<div class=\"col-xl-12\">\t\n\t\t    <h4 class=\"font-weight-medium font-h4\">Validation States</h4>\n\t\t    <div class=\"row\">\n\t\t\t    <div class=\"col-xl-2 m-t-sm text-right\" data-ng-repeat=\"validationStates in $ctrl.validationInfo.validationStates\" data-ng-init=\"validationStates.selected = false;\">\n\t\t\t\t\t<div class=\"form-check form-check-inline cursor-pointer\">\n\t\t\t\t\t  \t<label class=\"form-check-label\" for=\"{{validationStates.stateName}}\">{{validationStates.stateCode}}\n\t\t\t\t            <md-tooltip md-delay=\"300\" md-direction=\"right\" md-z-index=\"99999\">\n\t\t\t\t              \t{{validationStates.stateName}}\n\t\t\t\t            </md-tooltip>\t\n\t\t\t\t\t  \t</label>\n\t\t\t\t\t  \t<input class=\"form-check-input\" type=\"checkbox\" id=\"{{validationStates.stateName}}\" data-ng-model=\"validationStates.selected\"  data-ng-change=\"$ctrl.checkStates(validationStates.selected, $index, 'validation');\">\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t<div class=\"border-grey-xs--top m-b-md m-t-md\"></div>\n\t<div class=\"form-group row m-b-sm\">\n\t\t<div class=\"col-xl-12\">\n\t\t    <h4 class=\"font-weight-medium font-h4 m-b-xs\">Correspondence Details</h4>\n\t\t    <p>Patent Place require correspondence details in case an IP professional is required to make contact in regards to the validation request. Please review and, if required, amend the details below before submitting quote.</p>\n\t\t</div>\n\t</div>\t\n\t<div class=\"form-group row\">\n\t\t<label class=\"col-xl-4 d-flex align-items-center font-body font-weight-medium\" for=\"correspondenceName\">Correspondence Name:</label>\n\t\t<div class=\"col-xl-6\">\n\t\t\t<div class=\"icon-field\">\n\t\t\t\t<input type=\"input\" class=\"form-control\" name=\"correspondenceName\" data-ng-model=\"formData.corresdpondenceName\" data-validate-name required>\n\t\t\t\t<i class=\"far fa-pencil fa-2x icon\"></i>\n\t\t\t</div>\n\t\t\t<p class=\"txt-phase-red m-t-xs\" data-ng-show=\"validationForm.correspondenceName.$error.required && validationForm.correspondenceName.$dirty\">Please fill out this field</p>\t\t\n\t\t\t<p class=\"txt-phase-red m-t-xs\" data-ng-show=\"validationForm.correspondenceName.$dirty && validationForm.correspondenceName.$error.validName\">Only letters, numbers, ' - and spaces are valid charcters in this field.</p>\n\t\t</div>\n\t</div>\n\t<div class=\"form-group row\">\n\t\t<label class=\"col-xl-4 d-flex align-items-center font-body font-weight-medium\" for=\"correspondenceEmail\">Correspondence Email:</label>\n\t\t<div class=\"col-xl-6\">\n\t\t\t<div class=\"icon-field\">\n\t\t\t\t<input type=\"input\" class=\"form-control\" name=\"correspondenceEmail\" data-ng-model=\"formData.corresdpondenceEmailaddress\" data-validate-email required>\n\t\t\t\t<i class=\"far fa-pencil fa-2x icon\"></i>\n\t\t\t</div>\n\t\t\t<p class=\"txt-phase-red m-t-xs\" data-ng-show=\"validationForm.correspondenceEmail.$error.required && validationForm.correspondenceEmail.$dirty\">Please fill out this field</p>\n\t\t\t<p class=\"txt-phase-red m-t-xs\" data-ng-show=\"validationForm.correspondenceEmail.$dirty && validationForm.correspondenceEmail.$error.validEmail\">Please enter a valid email address</p>\n\t\t</div>\n\t</div>\n\t<div class=\"border-grey-xs--top m-b-md m-t-md\"></div>\n\t<div class=\"row\">\n\t\t<div class=\"col-xl-12 text-right\">\n    \t\t<button type=\"submit\" id=\"validationSubmit\" class=\"btn btn--green btn--lg pill-radius\" type=\"button\" data-ng-disabled=\"validationForm.$invalid || formDataSubmitted || !isChecked\" data-ng-click=\"$ctrl.submitValidationData(formData); formDataSubmitted = true\">Request quote</button>\n\t\t</div>\n\t</div>\n</form>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/validation/validation-completed.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"row m-b-sm\">\n\t<div class=\"col-xl-12\">\t\n\t\t<p class=\"m-b-xs font-h4\">Your validation order has been completed.</p>\n\t\t<p class=\"m-b-xs font-h4\">As per your order, your patent has been Validated in the following state(s):</p>\n\t\t<ul>\n\t\t\t<li data-ng-repeat=\"li in $ctrl.statesCompleted\" class=\"font-h4\">\n\t\t\t\t{{li.stateCode}} - {{li.stateName}}\n\t\t\t</li>\n\t\t</ul>\n\t</div>\n</div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/validation/validation-manual.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"row m-b-sm\">\n\t<div class=\"col-xl-12\">\n\t\t<div class=\"m-b-xs offline-processing-panel\">\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-md-2 d-flex justify-content-center align-items-center\">\n\t\t\t\t\t<i class=\"fas fa-exclamation-circle fa-4x txt-phase-amber\"></i>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-md-10\">\n\t\t\t\t\t<p class=\"m-b-xs font-h4 font-weight-bold\">Too close to deadline</p>\n\t\t\t\t\t<p class=\"m-b-xs\">It is too close to the deadline for processing this validation online. You can process this validation instruction offline by contacting one of our patent administrators via either phone: {{phoneNumber}} or email: support@ip.place.</p>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t<div>\t\n\t</div>\n</div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/validation/validation-nopoas-required.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"row m-b-sm\">\n\t<div class=\"col-xl-12\">\t\n\t\t<p class=\"m-b-xs\">The European patent validation work is now in progress. The states in which the patent is being validated in do not require Power of Attorney (PoA) documents to be provided. When the work is completed, you will be notified via email and status updates.</p>\n\t</div>\n</div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/validation/validation-payment-in-progress.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"row m-b-sm\">\n\t<div class=\"col-xl-12\">\t\n\t\t<p class=\"m-b-sm\">Your validation order is in progress. You can find further details about the transaction in the current transactions tab or clicking the 'view transaction' button above.</p>\n\t</div>\n\t<div class=\"col-xl-12\">\t\n\t\t<p class=\"m-b-xs\">Displayed below are the states that were included in the submitted validation quote.</p>\n\t</div>\n</div>\n<div class=\"form-group row m-b-md\" data-ng-if=\"$ctrl.patent.p3sServicesWithFees[0].validationFeeUI.designatedStates.length\">\n\t<div class=\"col-xl-12\">\n\t\t<h4 class=\"font-weight-medium font-h4\">Contracting States</h4>\n\t    <div class=\"row\">\n\t    \t<div class=\"col-xl-2 m-t-sm d-flex justify-content-center\" data-ng-repeat=\"designatedStates in $ctrl.patent.p3sServicesWithFees[0].validationFeeUI.designatedStates\" data-ng-init=\"designatedStates.selected = true;\">\n\t\t\t\t<p class=\"cursor-help\">{{designatedStates.stateCode}}\n\t\t            <md-tooltip md-delay=\"200\" md-direction=\"right\" md-z-index=\"999\">\n\t\t              \t{{designatedStates.stateName}}\n\t\t            </md-tooltip>\n\t\t\t\t</p>\n\t    \t</div>\n\t\t</div>\n\t</div>\n</div>\n<div class=\"form-group row m-b-md\" data-ng-if=\"$ctrl.patent.p3sServicesWithFees[0].validationFeeUI.extensionStates.length > 0\">\n\t<div class=\"col-xl-12\">\t\n\t    <h4 class=\"font-weight-medium font-h4\">Extension States</h4>\n\t    <div class=\"row\">\n\t\t    <div class=\"col-xl-2 m-t-sm d-flex justify-content-center\" data-ng-repeat=\"extensionStates in $ctrl.patent.p3sServicesWithFees[0].validationFeeUI.extensionStates\" data-ng-init=\"extensionStates.selected = true;\">\n\t\t\t\t<p class=\"cursor-help\">{{extensionStates.stateCode}}\n\t\t            <md-tooltip md-delay=\"300\" md-direction=\"right\" md-z-index=\"999\">\n\t\t              \t{{extensionStates.stateName}}\n\t\t            </md-tooltip>\t\n\t\t\t\t</p>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>\n<div class=\"form-group row m-b-md\" data-ng-if=\"$ctrl.patent.p3sServicesWithFees[0].validationFeeUI.validationStates.length > 0\">\n\t<div class=\"col-xl-12\">\t\n\t    <h4 class=\"font-weight-medium font-h4\">Validation States</h4>\n\t    <div class=\"row\">\n\t\t    <div class=\"col-xl-2 m-t-sm d-flex justify-content-center\" data-ng-repeat=\"validationStates in $ctrl.patent.p3sServicesWithFees[0].validationFeeUI.validationStates\" data-ng-init=\"validationStates.selected = true;\">\n\t\t\t\t<p class=\"cursor-help\">{{validationStates.stateCode}}\n\t\t            <md-tooltip md-delay=\"300\" md-direction=\"right\" md-z-index=\"999\">\n\t\t              \t{{validationStates.stateName}}\n\t\t            </md-tooltip>\t\n\t\t\t\t</p>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/validation/validation-poa-available.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"row m-b-sm\">\n\t<div class=\"col-xl-12\">\t\n\t\t<p class=\"m-b-xs\">We have instructed the necessary associates and the states below require Power of Attorney (PoA) documents to be signed, scanned and uploaded to Patent Place. Please find the necessary documents available for download below</p>\n\t</div>\n</div>\n<div class=\"row m-b-sm\">\n\t<div class=\"col-xl-12\">\t\n\t\t<h4 class=\"font-h4 font-weight-medium text-uppercase m-b-xs\">Notice</h4>\n\t\t<p class=\"m-b-sm\">We also require the original signed PoA documents to be sent in the post for all states listed below to:</p>\n\t\t<p class=\"font-h4 text-uppercase m-b-xs\" data-ng-repeat=\"line in $ctrl.patent.postAddress\">{{line}}</p>\n\t</div>\n</div>\n<div class=\"row\">\n\t<div class=\"col-xl-12\">\n\t\t<h4 class=\"font-weight-medium font-h4 m-b-xs d-flex align-items-center\">PoA documents | Download </h4>\n\t\t<a class=\"btn-underlined pill-radius font-h4 txt-phase-green m-b-sm\" data-ng-href=\"{{$ctrl.domain}}rest-validation-downloadPOA/{{$ctrl.patent.patentID}}\" download>Download all PoA documents</a>\n\t\t<h4 class=\"font-weight-medium font-h4  m-b-xs\">PoA documents | Upload</h4>\n\t\t<p>Upload all Power of Attorney documents for the states listed below:</p>\n\t\t<form name=\"validationForm\" novalidate>\n\t\t\t<!-- <input type=\"file\" name=\"testFile\" class=\"form-control-file font-h4\" data-ng-model=\"formData.testFile\" select-ng-validation-files required> -->\n\t\t\t<div data-ng-if=\"$ctrl.patent.p3sServicesWithFees[0].validationFeeUI.designatedStates.length\" data-ng-init=\"formData.designatedStates\">\n\t\t\t\t<div data-ng-repeat=\"states in $ctrl.patent.p3sServicesWithFees[0].validationFeeUI.designatedStates\" data-ng-if=\"states.poaNeeded\"> \n\t\t\t\t\t<div class=\"border-grey-xs--btm m-b-md m-t-md\"></div>\n\t\t            <div class=\"form-group row\">\n\t\t                <label for=\"{{states.stateName}}\" class=\"col-xl-4 col-form-label font-weight-medium font-h4\">{{states.stateName}}: </label>\n\t\t                <div class=\"col-xl-8\">                \t\n\t\t\t                <input type=\"file\" name=\"{{states.stateName}}\" class=\"form-control-file font-h4\" data-ng-model=\"states.signedPoaDoc\" select-ng-validation-files required>\n\t\t                </div>\n\t\t                \n\t\t            </div>    \t\t\t    \t\t\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div data-ng-if=\"$ctrl.patent.p3sServicesWithFees[0].validationFeeUI.extensionStates.length\" data-ng-init=\"formData.extensionStates\">\n\t\t\t\t<div data-ng-repeat=\"states in $ctrl.patent.p3sServicesWithFees[0].validationFeeUI.extensionStates\" data-ng-if=\"states.poaNeeded\"> \n\t\t\t\t\t<div class=\"border-grey-xs--btm m-b-md m-t-md\"></div>\n\t\t            <div class=\"form-group row\">\n\t\t                <label for=\"{{states.stateName}}\" class=\"col-xl-4 col-form-label font-weight-medium font-h4\">{{states.stateName}}: </label>\n\t\t                <div class=\"col-xl-8\">                \t\n\t\t\t                <input type=\"file\" name=\"{{states.stateName}}\" class=\"form-control-file font-h4\"  data-ng-model=\"states.signedPoaDoc\" select-ng-validation-files required>\n\t\t                </div>\n\t\t                \n\t\t            </div>    \t\t\t    \t\t\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div data-ng-if=\"$ctrl.patent.p3sServicesWithFees[0].validationFeeUI.validationStates.length\" data-ng-init=\"formData.validationStates\">\n\t\t\t\t<div data-ng-repeat=\"states in $ctrl.patent.p3sServicesWithFees[0].validationFeeUI.validationStates\" data-ng-if=\"states.poaNeeded\"> \n\t\t\t\t\t<div class=\"border-grey-xs--btm m-b-md m-t-md\"></div>\n\t\t            <div class=\"form-group row\">\n\t\t                <label for=\"{{states.stateName}}\" class=\"col-xl-4 col-form-label font-weight-medium font-h4\">{{states.stateName}}: </label>\n\t\t                <div class=\"col-xl-8\">\n\t\t\t                <input type=\"file\" name=\"{{states.stateName}}\" class=\"form-control-file font-h4\"  data-ng-model=\"states.signedPoaDoc\" select-ng-validation-files required>\n\t\t                </div>\n\t\t                \n\t\t            </div>    \t\t\t    \t\t\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"row m-b-md m-t-md\">\n\t\t\t\t<div class=\"col-md-12 m-b-xs\">\n\t\t\t\t\t<p class=\"font-weight-medium\">I confirm that all the correct PoA documents have been selected for each required state listed above <input type=\"checkbox\" class=\"m-r-xs\" name=\"rightpoas\" data-ng-model=\"rightPoas\"></p>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-md-12\">\n\t\t\t\t\t<p class=\"font-weight-medium\">I confirm that all original PoA documents are in transit to the address provided above <input type=\"checkbox\" name=\"transit\" class=\"m-r-xs\" data-ng-model=\"inTransit\"></p>\n\t\t\t\t</div>\t\t\t\t\n\t\t\t</div>\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-xl-12 text-right\">\n\t        \t\t<button type=\"button\" id=\"submitPoas\" class=\"btn btn--green btn--lg pill-radius\" data-ng-click=\"$ctrl.submitPoaDocuments(formData);\" data-ng-disabled=\"validationForm.$invalid || formDataSubmitted || !rightPoas || !inTransit\">Submit PoA documents</button>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</form>\n\t</div>\n</div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/validation/validation-quote-pending.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"row m-b-sm\">\n\t<div class=\"col-xl-12 m-b-sm\">\t\n\t    <h3 class=\"font-weight-bold font-h3 m-b-sm\">Validations</h3>\n\t    <p class=\"m-b-xs font-body\">Deadline for requesting quote: <span class=\"font-weight-bold\" data-ng-bind=\"$ctrl.patent.requestQuoteDate | date: 'MMMM d, y'\"></span></p>\n\t    <p class=\"font-body\">Deadline for instruction and payment: <span class=\"font-weight-bold\" data-ng-bind=\"$ctrl.patent.purchaseQuoteDate | date: 'MMMM d, y'\"></span></p>\n\t</div>\n\t<div class=\"col-xl-12\">\t\n\t\t<p class=\"m-b-xs\">Displayed below are the states that were included in the submitted validation quote. If you want to request a new quote, you must wait for the pending quote to be provided before requesting a new one.</p>\n\t</div>\n</div>\n<div class=\"form-group row m-b-md\" data-ng-if=\"$ctrl.patent.p3sServicesWithFees[0].validationFeeUI.designatedStates.length\">\n\t<div class=\"col-xl-12\">\n\t\t<h4 class=\"font-weight-medium font-h4\">Contracting States</h4>\n\t    <div class=\"row\">\n\t    \t<div class=\"col-xl-2 m-t-sm d-flex justify-content-center\" data-ng-repeat=\"designatedStates in $ctrl.patent.p3sServicesWithFees[0].validationFeeUI.designatedStates\" data-ng-init=\"designatedStates.selected = true;\">\n\t\t\t\t<p class=\"cursor-help\">{{designatedStates.stateCode}}\n\t\t            <md-tooltip md-delay=\"200\" md-direction=\"right\" md-z-index=\"999\">\n\t\t              \t{{designatedStates.stateName}}\n\t\t            </md-tooltip>\n\t\t\t\t</p>\n\t    \t</div>\n\t\t</div>\n\t</div>\n</div>\n<div class=\"form-group row m-b-md\" data-ng-if=\"$ctrl.patent.p3sServicesWithFees[0].validationFeeUI.extensionStates.length > 0\">\n\t<div class=\"col-xl-12\">\t\n\t    <h4 class=\"font-weight-medium font-h4\">Extension States</h4>\n\t    <div class=\"row\">\n\t\t    <div class=\"col-xl-2 m-t-sm d-flex justify-content-center\" data-ng-repeat=\"extensionStates in $ctrl.patent.p3sServicesWithFees[0].validationFeeUI.extensionStates\" data-ng-init=\"extensionStates.selected = true;\">\n\t\t\t\t<p class=\"cursor-help\">{{extensionStates.stateCode}}\n\t\t            <md-tooltip md-delay=\"300\" md-direction=\"right\" md-z-index=\"999\">\n\t\t              \t{{extensionStates.stateName}}\n\t\t            </md-tooltip>\t\n\t\t\t\t</p>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>\n<div class=\"form-group row m-b-md\" data-ng-if=\"$ctrl.patent.p3sServicesWithFees[0].validationFeeUI.validationStates.length > 0\">\n\t<div class=\"col-xl-12\">\t\n\t    <h4 class=\"font-weight-medium font-h4\">Validation States</h4>\n\t    <div class=\"row\">\n\t\t    <div class=\"col-xl-2 m-t-sm d-flex justify-content-center\" data-ng-repeat=\"validationStates in $ctrl.patent.p3sServicesWithFees[0].validationFeeUI.validationStates\" data-ng-init=\"validationStates.selected = true;\">\n\t\t\t\t<p class=\"cursor-help\">{{validationStates.stateCode}}\n\t\t            <md-tooltip md-delay=\"300\" md-direction=\"right\" md-z-index=\"999\">\n\t\t              \t{{validationStates.stateName}}\n\t\t            </md-tooltip>\t\n\t\t\t\t</p>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/validation/validation-quote-provided.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"row m-b-sm\">\n\t<div class=\"col-xl-12 m-b-sm\">\t\n\t    <h3 class=\"font-weight-bold font-h3 m-b-sm\">Validations</h3>\n\t    <p class=\"font-body\">Deadline for instruction and payment: <span class=\"font-weight-bold\" data-ng-bind=\"$ctrl.patent.purchaseQuoteDate | date: 'MMMM d, y'\"></span></p>\n\t</div>\n\t<div class=\"col-xl-12\">\t\n\t\t<p class=\"m-b-sm\">Your validation quote has been generated and the fees are now available to view through the 'Fee breakdown' tab. Displayed below are the states that are included in the quote. If you want to request a new quote, click 'Request new quote'.</p>\n\t\t<p class=\"font-h4\">This generated quote will expire on: <span lass=\"font-weight-bold\" data-ng-bind=\"$ctrl.patent.validationQuoteUI.quoteExpiryDate | date: 'MMMM d, y'\"></span></p>\n\t</div>\n</div>\n<div class=\"form-group row m-b-md\" data-ng-if=\"$ctrl.patent.p3sServicesWithFees[0].validationFeeUI.designatedStates.length\">\n\t<div class=\"col-xl-12\">\n\t\t<h4 class=\"font-weight-medium font-h4\">Contracting States</h4>\n\t    <div class=\"row\">\n\t    \t<div class=\"col-xl-2 m-t-sm d-flex justify-content-center\" data-ng-repeat=\"designatedStates in $ctrl.patent.p3sServicesWithFees[0].validationFeeUI.designatedStates\" data-ng-init=\"designatedStates.selected = true;\">\n\t\t\t\t<p class=\"cursor-help\">{{designatedStates.stateCode}}\n\t\t            <md-tooltip md-delay=\"200\" md-direction=\"right\" md-z-index=\"999\">\n\t\t              \t{{designatedStates.stateName}}\n\t\t            </md-tooltip>\n\t\t\t\t</p>\n\t    \t</div>\n\t\t</div>\n\t</div>\n</div>\n<div class=\"form-group row m-b-md\" data-ng-if=\"$ctrl.patent.p3sServicesWithFees[0].validationFeeUI.extensionStates.length > 0\">\n\t<div class=\"col-xl-12\">\t\n\t    <h4 class=\"font-weight-medium font-h4\">Extension States</h4>\n\t    <div class=\"row\">\n\t\t    <div class=\"col-xl-2 m-t-sm d-flex justify-content-center\" data-ng-repeat=\"extensionStates in $ctrl.patent.p3sServicesWithFees[0].validationFeeUI.extensionStates\" data-ng-init=\"extensionStates.selected = true;\">\n\t\t\t\t<p class=\"cursor-help\">{{extensionStates.stateCode}}\n\t\t            <md-tooltip md-delay=\"300\" md-direction=\"right\" md-z-index=\"999\">\n\t\t              \t{{extensionStates.stateName}}\n\t\t            </md-tooltip>\t\n\t\t\t\t</p>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>\n<div class=\"form-group row m-b-md\" data-ng-if=\"$ctrl.patent.p3sServicesWithFees[0].validationFeeUI.validationStates.length > 0\">\n\t<div class=\"col-xl-12\">\t\n\t    <h4 class=\"font-weight-medium font-h4\">Validation States</h4>\n\t    <div class=\"row\">\n\t\t    <div class=\"col-xl-2 m-t-sm d-flex justify-content-center\" data-ng-repeat=\"validationStates in $ctrl.patent.p3sServicesWithFees[0].validationFeeUI.validationStates\" data-ng-init=\"validationStates.selected = true;\">\n\t\t\t\t<p class=\"cursor-help\">{{validationStates.stateCode}}\n\t\t            <md-tooltip md-delay=\"300\" md-direction=\"right\" md-z-index=\"999\">\n\t\t              \t{{validationStates.stateName}}\n\t\t            </md-tooltip>\n\t\t\t\t</p>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>\n<div class=\"row\">\n\t<div class=\"col-md-12 text-right\">\n\t\t<button class=\"btn btn--green btn--lg pill-radius m-t-sm\" data-ng-click=\"$ctrl.requestNewQuote()\">Request new quote</button>\n\t</div>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/validation/validation-wip.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"row m-b-sm\">\n\t<div class=\"col-xl-12\">\t\n\t\t<p class=\"m-b-xs\">The European patent validation work is now in progress. When the work is completed, you will be emailed a notification and the status of the transaciton and European patent action will be updated.</p>\n\t</div>\n</div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/checkout/html/modals/modal.cancel-transaction.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header m-b-xs d-flex flex-column align-items-center justify-content-center\">\n\t<span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n\t<div class=\"m-b-sm\">\n\t\t<i class=\"fas fa-exclamation-circle fa-4x txt-phase-red\"></i>\n\t</div>\n\t<p class=\"font-h3 font-weight-medium\">Cancel Transaction</p>\n\t<p class=\"font-body w-100 text-center m-b-sm m-t-xs\">It looks like you're trying to cancel this transaction.  If you meant to do this select 'Yes', otherwise select 'No', and then 'Place this order' to confirm this order.</p>\n    <div class=\"d-flex\">\n        <button class=\"btn btn--lg btn--red pill-radius m-r-md\" data-ng-click=\"$ctrl.dismissModal()\">No</button>\n    \t<button class=\"btn btn--lg btn--green pill-radius \" data-ng-click=\"$ctrl.cancelTrans()\">Yes</button>\n    </div>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/checkout/html/modals/modal.commit-error-price.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n    <span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"far fa-times-circle fa-4x txt-phase-red\"></i>\n    </div>\n    <p class=\"font-h3 font-weight-medium\">Price change</p>\n    <p class=\"font-body w-100 text-center m-b-sm m-t-xs\">The exchange rate changes constantly, and we update prices to ensure you get the best rate on the day.  The cost of this item has changed since you added in to the basket so please add it again to ensure you’re getting the right rate. </p>\n    <div class=\"d-flex\">\n        <button class=\"btn btn--lg btn--green pill-radius\" data-ng-click=\"$ctrl.dismissModal()\">Dismiss</button>\n    </div>\n</div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/checkout/html/modals/modal.commit-error.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n    <span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"far fa-times-circle fa-4x txt-phase-red\"></i>\n    </div>\n\t<p class=\"font-h3 font-weight-medium\">Processing Error</p>\n\t<p class=\"font-body w-100 text-center m-b-sm m-t-xs\">We've encoutered a problem and were unable to process this transaction. Please try again. If it's still a problem then please let us know support@ip.place</p>\n\t<button class=\"btn btn--lg btn--green pill-radius\" data-ng-click=\"$ctrl.dismissModal()\">Dimiss</button>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/forgot-password/html/modals/modal.forgot-password-error.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n\t<span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"fas fa-exclamation-circle fa-4x txt-phase-red\"></i>   \n    </div>\n\t<p class=\"font-h3 font-weight-medium\">We were unable to submit your request</p>\n\t<p class=\"font-body w-100 text-center m-b-sm m-t-xs\">We are sorry but there was an error when attempting submitting your request to reset your password. Please check and try again. If it's still a problem then please let us know: support@ip.place</p>\n    <div class=\"d-flex\">\n    \t<button class=\"btn btn--lg btn--green pill-radius m-r-md\" data-ng-click=\"$ctrl.dismissModal()\">Dismiss</button>\n    </div>\n</div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/forgot-password/html/modals/modal.forgot-password-success.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\r\n\t<span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\r\n    <div class=\"m-b-sm\">\r\n        <i class=\"fas fa-check-circle fa-4x txt-phase-green\"></i>\r\n    </div>\r\n\t<p class=\"font-h3 font-weight-medium\">Your verification email has been sent</p>\r\n\t<p class=\"font-body w-100 text-center m-b-sm m-t-xs\">Go to your inbox and open the email we have sent you. Click on the link to verify your account and you be directed to a page to reset your password</p>\r\n    <div class=\"d-flex\">\r\n    \t<button class=\"btn btn--lg btn--green pill-radius m-r-md\" data-ng-click=\"$ctrl.dismissModal()\">Dismiss</button>\r\n    </div>\r\n</div>\r\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/forgot-password/html/modals/modal.reset-password-error.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n\t<span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"fas fa-exclamation-circle fa-4x txt-phase-red\"></i>   \n    </div>\n\t<p class=\"font-h3 font-weight-medium\">We were unable to reset your password</p>\n\t<p class=\"font-body w-100 text-center m-b-sm m-t-xs\">We are sorry but there was an error when attempting to reset your password. Please check and try again. If it's still a problem then please let us know: support@ip.place</p>\n    <div class=\"d-flex\">\n    \t<button class=\"btn btn--lg btn--green pill-radius m-r-md\" data-ng-click=\"$ctrl.dismissModal()\">Dismiss</button>\n    </div>\n</div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/forgot-password/html/modals/modal.reset-password-success.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n\t<span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"fas fa-check-circle fa-4x txt-phase-green\"></i>\n    </div>\n\t<p class=\"font-h3 font-weight-medium\">Successfully reset your password</p>\n\t<p class=\"font-body w-100 text-center m-b-sm m-t-xs\">You can now login using your new password</p>\n    <div class=\"d-flex\">\n    \t<button class=\"btn btn--lg btn--green pill-radius m-r-md\" data-ng-click=\"$ctrl.dismissModal()\">Dismiss</button>\n    </div>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/portfolio/html/add-patent.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<!-- <div class=\"modal-backdrop\"></div> -->\n<div class=\"container-add-patent d-flex\" data-ng-class=\"{'active': foundPatent}\">\n    <div class=\"recently-added-panel\" data-ng-show=\"recently.added.length\" data-ng-class=\"{'active': recently.added.length}\">\n        <div class=\"p-t-4 p-b-4 p-l-3\">\n            <div class=\"row\">\n                <div class=\"col-md-12 border-grey-xs--right\">\n                    <p class=\"font-h4 font-weight-medium m-b-xs\">Recently Added</p>\n                    <p data-ng-repeat=\"item in recently.added\" class=\"m-b-xs\">\n                        <a data-ui-sref=\"portfolio.modal.case({caseId: item.id})\" class=\"inline-link blue\">{{item.ep_ApplicationNumber}}</a>\n                    </p>\n                </div>\n            </div>\n        </div>\n    </div>\n    <div class=\"add-patent-panel\" role=\"dialog\">\n        <div class=\"p-t-4 p-r-3 p-l-3\">\n            <div class=\"row\">\n                <div class=\"col-md-12 col-lg-7 col-xl-12\">\n                    <p class=\"font-body font-weight-medium m-b-xs\">Please enter the application number (including check digit) :</p>\n                    <form class=\"form\" name=\"searchPatentForm\" novalidate>\n                        <div class=\"form-group m-b-none d-flex align-items-center\">\n                            <input type=\"text\" name=\"searchPatent\" id=\"searchPatent\" data-ng-model=\"searchPatent\" class=\"form-control form-control-lg pill-radius m-r-sm\" placeholder=\"Patent Application No. ...\" focus-me=\"true\" data-validate-search data-ng-disabled=\"loadingPatent || foundPatent\">\n                            <button type=\"submit\" data-ng-hide=\"loadingPatent\" data-ng-click=\"findPatent(searchPatent);\" class=\"btn-reset\">\n                                <span class=\"fa-stack fa-2x cursor-pointer\">\n\n                                    <i class=\"fas fa-circle fa-stack-2x txt-phase-green\"></i>\n                                    <i class=\"far fa-search fa-stack-1x fa-inverse\"></i>\n                 \n                                </span>\n                            </button>\n                            <span class=\"fa-stack fa-2x\" data-ng-show=\"loadingPatent\">\n                                <i class=\"fas fa-circle fa-stack-2x txt-phase-green\"></i>\n                                <i class=\"far fa-cog fa-spin fa-stack-1x fa-inverse\"></i>\n                            </span>                    \n                        </div>\n                    </form>\n                     \n                </div>\n                <div class=\"col-md-12 col-lg-12 col-xl-12 m-t-sm\" data-ng-show=\"error\">\n                    <p class=\"font-body font-weight-medium txt-phase-red\" data-ng-bind=\"searchError\"></p>\n                </div>             \n            </div>\n\n        </div>\n        <div class=\"p-r-3 p-b-3 p-l-3\">    \n            <div class=\"row found-patent-panel\" data-ng-show=\"foundPatent\">\n                    <div class=\"col-md-12\">\n                        <div class=\"found-patent-panel__content\">\n                      \n                        <div class=\"border-grey-xs--btm m-t-sm m-b-sm\"></div> \n                            <form name=\"addPatentForm\">\n                                <div class=\"row\">\n                                    <div class=\"col-md-12 col-lg-12 col-xl-12 m-b-sm\">\n\n                                        <div class=\"form-group row\">\n                                            <label class=\"col-form-label font-body col-xl-4 font-weight-medium\">Client Reference:</label>\n                                            <div class=\"col-xl-8\">                            \n                                                <input type=\"text\" name=\"patentClientRef\" class=\"form-control\" data-ng-maxlength=\"15\" data-ng-model=\"foundPatent.clientRef\" ref-validate>\n                                            </div>\n                                            <div class=\"col-md-12 m-t-xs\">                                            \n                                                <p class=\"txt-phase-red\" data-ng-show=\"addPatentForm.patentClientRef.$error.validRef && addPatentForm.patentClientRef.$dirty\">Special characters &, > and < are not permitted to be included in the Client Reference.</p>\n                                                <p class=\"txt-phase-red\" data-ng-show=\"addPatentForm.patentClientRef.$error.maxlength && addPatentForm.patentClientRef.$dirty\">The field exceeds the maximum value of 15 characters</p>\n                                            </div>\n                                        </div>\n                                        <div class=\"form-group row\">\n                                            <label class=\"col-form-label font-body col-xl-4 font-weight-medium\">Client Description:</label>\n                                            <div class=\"col-xl-8\">                            \n                                                <input type=\"text\" name=\"patentShortTitle\" class=\"form-control\" data-ng-maxlength=\"25\" data-ng-model=\"foundPatent.shortTitle\">\n                                            </div>\n                                            <div class=\"col-md-12 m-t-xs\">   \n                                                <p class=\"txt-phase-red\" data-ng-show=\"addPatentForm.patentShortTitle.$error.maxlength && addPatentForm.patentShortTitle.$dirty\" required>The field exceeds the maximum value of 25 characters</p>\n                                            </div>\n                                        </div>\n\n\n                                        <div class=\"form-group row\">\n                                            <label class=\"col-form-label font-body col-xl-4 font-weight-medium\">Primary Applicant Name:</label>\n                                            <div class=\"col-xl-8\">                            \n                                                <input type=\"text\" name=\"primaryApplicantName\" class=\"form-control border-none\" data-ng-model=\"foundPatent.primaryApplicantName\" required readonly>\n                                            </div>\n                                        </div>\n\n                                        <div class=\"form-group row\">\n                                            <label class=\"col-form-label font-body col-xl-4 font-weight-medium\">Application No:</label>\n                                            <div class=\"col-xl-8\">                            \n                                                <input type=\"text\" name=\"filingDateUI\" class=\"form-control border-none\" data-ng-model=\"foundPatent.patentApplicationNumber\" required readonly>\n                                            </div>\n                                        </div>\n\n                                        <div class=\"form-group row\">\n                                            <label class=\"col-form-label font-body col-xl-4 font-weight-medium\">Publication No:</label>\n                                            <div class=\"col-xl-8\">                            \n                                                <input type=\"text\" name=\"title\" class=\"form-control border-none\" data-ng-model=\"foundPatent.patentPublicationNumber\" required readonly>\n                                            </div>\n                                        </div>\n\n                                        <div class=\"form-group row\">\n                                            <label class=\"col-form-label font-body col-xl-4 font-weight-medium\">Title:</label>\n                                            <div class=\"col-xl-8\">                            \n                                                <input type=\"text\" name=\"title\" class=\"form-control border-none\" data-ng-model=\"foundPatent.title\" required readonly>\n                                            </div>\n                                        </div>\n\n                                        <div class=\"form-group row\">\n                                            <label class=\"col-form-label font-body col-xl-4 font-weight-medium\">Filing Date:</label>\n                                            <div class=\"col-xl-8\">                            \n                                                <input type=\"text\" name=\"title\" class=\"form-control border-none\" data-ng-model=\"foundPatent.filingDateUI\" required readonly>\n                                            </div>\n                                        </div>\n                                    </div>\n                                </div>\n                                <div class=\"border-grey-xs--btm m-t-sm m-b-sm\"></div> \n                                <div class=\"row m-t-sm\">\n                                    <div class=\"col-md-12 col-lg-12 col-xl-12\">\n                                        <div class=\"d-flex justify-content-end align-items-center\">\n                                            <button class=\"btn btn-underlined font-weight-medium m-r-sm txt-phase-red\" type=\"button\" data-ng-click=\"foundPatent = null; searchPatent = null\">Cancel</button>\n                                            <button class=\"btn btn--lg btn--green pill-radius\" data-ng-click=\"openConfirmModal(foundPatent)\" data-ng-disabled=\"!searchPatentForm.$valid || $ctrl.addingPatent || addPatentForm.patentClientRef.$error.validRef || addPatentForm.patentClientRef.$error.maxlength || addPatentForm.patentShortTitle.$error.maxlength\" type=\"submit\">Add patent</button>\n                                        </div>      \n                                    </div>\n                                </div>\n                            </form>\n                        </div>\n                    </div>\n                     \n                </div>\n            </div>\n        </div>\n</div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/portfolio/html/modals/modal.confirm-found-patent.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n    <span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"fas fa-check-circle fa-4x txt-phase-green\"></i>   \n    </div>\n\t<p class=\"font-h3 font-weight-medium\">Adding Patent</p>\n\t<p class=\"font-body w-100 text-center m-b-sm m-t-xs\">Add Patent Application?</p>\n    <div class=\"d-flex\">\n    \t<button class=\"btn btn--lg btn--red pill-radius m-r-md\" data-ng-click=\"$ctrl.cancelAdd()\">No</button>\n    \t<button class=\"btn btn--lg btn--green pill-radius \" data-ng-click=\"$ctrl.addPatent()\">Yes</button>\n    </div>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/profile/html/modals/modal.update-profile-error.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n    <span class=\"modal-cross cursor-pointer\" data-ng-click=\"dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"far fa-times-circle fa-4x txt-phase-red\"></i>\n    </div>\n    <p class=\"font-h3 font-weight-medium\">Error</p>\n    <p class=\"font-body w-100 text-center m-b-sm m-t-xs\">We've encoutered a problem updating your profile. Please try again. If it's still a problem then please let us know: support@ip.place</p>\n    <button class=\"btn btn--lg btn--green pill-radius\" data-ng-click=\"dismissModal()\">Dismiss</button>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/profile/html/modals/modal.update-profile-success.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n    <span class=\"modal-cross cursor-pointer\" data-ng-click=\"dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"fas fa-check-circle fa-4x txt-phase-green\"></i>   \n    </div>\n\t<p class=\"font-h3 font-weight-medium\">Success</p>\n\t<p class=\"font-body w-100 text-center m-b-sm m-t-xs\">We've saved the updates you've made to your profile.</p>\n\t<button class=\"btn btn--lg btn--green pill-radius\" data-ng-click=\"dismissModal()\">Dismiss</button>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/profile/html/modals/modal.upload-avatar-pic.tpl.htm":
/***/ (function(module, exports, __webpack_require__) {

module.exports = "<div class=\"bg-white d-flex flex-column p-5 br-1\">\n\t<div data-ng-hide=\"avatarImgUploaded\">\n\t\t<span class=\"modal-cross cursor-pointer\" data-ng-click=\"dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n\t\t<div class=\"row\" data-ng-show=\"uploadImg\">\n\t\t\t<div class=\"col-md-12 text-center d-flex flex-column\">\n\t\t\t\t<h4 class=\"font-h2 font-weight-bold\">Change Profile Picture</h4>\n\t\t\t\t<div class=\"m-t-xl m-b-xl\">\n\t\t\t\t\t<img src=\"" + __webpack_require__("./app/global/directives/media/avatar-default.png") + "\">\n\t\t\t\t</div>\n\t\t\t\t\n\t\t\t\t<input data-select-avatar id=\"avatarFileUpload\" type=\"file\" name=\"avatarFileUpload\" accept=\"image/*\">\n\t\t\t\t<div>\t\t\t\t\n\t\t\t\t\t<label for=\"avatarFileUpload\" class=\"btn btn--lg btn--green pill-radius m-b-md\">\n\t\t\t\t\t    Select file\n\t\t\t\t\t</label>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t \t<div class=\"row\" data-ng-show=\"imgSelected\">\n\t \t\t<div class=\"col-md-12 d-flex flex-column\">\n\t \t\t\t<h4 class=\"font-h2 font-weight-bold text-center\">Adjust Profile Picture</h4>\n\t \t\t\t<croppie  src=\"cropped.source\" data-ng-model=\"cropped.image\" options=\"{boundary:{width:400,height:350}}\" class=\"br-1 m-t-xl m-b-xl\"></croppie>\n\t \t\t\t<div class=\"d-flex justify-content-between\">\n\t \t\t\t\t<button class=\"btn btn--lg pill-radius btn--red\" data-ng-click=\"uploadImg = true; imgSelected = false;\">Cancel</button>\n\t \t\t\t\t<button class=\"btn btn--lg pill-radius btn--green\" data-ng-click=\"imgSelected = false; imgConfirmed = true;\">Crop Image</button>\n\t \t\t\t</div>\n\t \t\t</div>\n\t \t</div>\n\t \t<div data-ng-show=\"imgConfirmed\"> \t\t\n\t \t\t<div class=\"col-md-12 text-center d-flex flex-column\">\n\t\t\t\t<p class=\"font-h2 font-weight-bold\">Do you like your profile picture?</p>\n\t\t\t\t<div class=\"flex-grow-1 d-flex justify-content-center align-items-center\">\n\t\t\t\t\t<div class=\"avatar-cropped m-t-xl m-b-xl\">\n\t\t\t\t\t\t<img class=\"avatar-img\" data-ng-src=\"{{cropped.image}}\">\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t \t\t\t\t<button type=\"button\" name=\"avatarUpload\" data-ng-click=\"uploadAvatar()\" class=\"btn btn--lg btn--green pill-radius m-b-lg\">Confirm Image</button>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t \t\t\t\t<button type=\"button\" name=\"avatarUpload\" data-ng-click=\"imgSelected = true; imgConfirmed = false;\" class=\"btn btn--lg btn--red pill-radius m-b-lg\">Try another image</button>\n\t\t\t\t</div>\t\t\t\t\n\t\t \t</div>\n\t \t</div>\n\t</div>\n\t<div data-ng-show=\"avatarImgUploaded\" class=\"d-flex flex-column align-items-center justify-content-center\">\n\t\t<span class=\"modal-cross cursor-pointer\" data-ng-click=\"dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n\t\t<div class=\"m-b-sm\">\n\t\t\t<i class=\"fas fa-check-circle fa-4x txt-phase-green\"></i>\t\n\t\t</div>\n\t\t<p class=\"font-h3 font-weight-medium\">Success</p>\n\t\t<p class=\"font-body w-100 text-center m-b-sm m-t-xs\">Your new profile picture has been saved!</p>\n\t    <button class=\"btn btn--lg btn--green pill-radius\" data-ng-click=\"dismissModal()\">Dismiss</button>\n\t</div>\n\n</div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/support/general/html/modals/modal.add-information-for-case.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-stretch\">\r\n    <span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\r\n    <p class=\"font-h2 font-weight-bold m-b-sm\">Support details</p>\r\n    <p class=\"font-h3 m-b-sm\"><span class=\"font-weight-bold\">Application No. :</span> {{$ctrl.applicationNo}}</span></p>\r\n    <p class=\"font-h3 m-b-sm\">\r\n        <span class=\"font-weight-bold\">Formality type:</span>\r\n        <span data-ng-if=\"$ctrl.formalityType == 'epct'\">Euro-PCT</span>\r\n        <span data-ng-if=\"$ctrl.formalityType == 'postvalidation' || $ctrl.formalityType == 'postgrant'\">----</span>\r\n        <span class=\"text-capitalize\" data-ng-if=\"$ctrl.formalityType !== 'postvalidation' && $ctrl.formalityType !== 'postgrant' && $ctrl.formalityType !== 'epct'\">{{$ctrl.formalityType}}</span>    \r\n    </p>\r\n    <form name=\"caseDetailsForm\" novalidate>    \r\n        <textarea name=\"message\" id=\"message\" class=\"form-control br-1 m-b-sm\" rows=\"10\" data-ng-model=\"caseFormData.message\" maxlength=\"5000\" placeholder=\"Message..\" validate-text-field data-ng-required=\"!$ctrl.assistedFiling\"></textarea>\r\n        <div class=\"form-group row\">\r\n            <div class=\"col-md-12 col-xl-12\">\r\n                <p class=\"font-h4 font-weight-bold m-b-xs\">Supporting documents</p>\r\n                <p class=\"font-body\">If you have any documents that will help our team with your enquiry, please upload them here.</p>\r\n                <div data-ng-show=\"fileUploading\" class=\"m-t-xs d-flex align-items-center\">\r\n                    \r\n                        <i class=\"fa fa-spinner fa-spin fa-lg m-r-xs\" ></i>\r\n                        <span class=\"font-body font-weight-bold txt-phase-green\">                               \r\n                        Uploading file\r\n                    </span>\r\n                </div>                      \r\n                <div  class=\"m-t-xs\" data-ng-if=\"caseFormData.uploadedDocs.length > 0\">                            \r\n                    <p class=\"font-body m-b-xs\">Files uploaded:</p>\r\n                    <div data-ng-repeat=\"file in caseFormData.uploadedDocs\" class=\"btn btn--lg btn--plain br-1 btn-file-upload m-r-sm m-b-xs\" data-ng-click=\"removeSpecificFile(file.name)\">\r\n                        <span class=\"m-r-sm\" title=\"{{file.name}}\">{{file.name}}</span>\r\n                        <span ><i class=\"fas fa-times fa-lg action-icon btn-close\"></i></span>\r\n                    </div>              \r\n                </div>\r\n            </div>\r\n        </div> \r\n        <div class=\"form-group row\"  data-ng-if=\"caseDetailsForm.uploadedDocs.$error.validfile\">\r\n            <div class=\"col-md-12 col-xl-7m-b-sm\">\r\n                <p class=\"txt-phase-red font-body\" data-ng-show=\"fileStore.maxSizeError\">You cannot upload a document with a file size of 0KB.</p>\r\n                <div ng-messages=\"caseDetailsForm.uploadedDocs.$error\" data-ng-if=\"caseDetailsForm.uploadedDocs.$error.validfile\">\r\n                    <p class=\"txt-phase-red m-t-xs\" ng-message=\"validfile\">Invalid file format uploaded. Only the following file formats are permitted (not case sensitive): .pdf, .docx, .png, .gif, .jpg, .jpeg, .pptx, .csv, .xlsx, .zip</p> \r\n                </div>   \r\n            </div>              \r\n        </div>        \r\n        <div class=\"row m-t-md\">\r\n            <div class=\"col-md-6 col-xl-6 text-left\"><!--fileStore.file-->\r\n                <input type=\"file\" name=\"uploadedDocs\" id=\"uploadedDocs\" class=\"d-none\" data-ng-model=\"caseFormData.files\" support-file-upload onchange=\"angular.element(this).scope().getFileDetails(this, true)\" accept=\".pdf, .PDF, .docx, .DOCX, .png, .PNG, .gif, .GIF, ,.jpg, .JPG, .jpeg, .JPEG, .pptx, .PPTX, .csv, .CSV, .xlsx, .XLSX, .zip, .ZIP\" multiple>\r\n                <label for=\"uploadedDocs\" class=\"btn btn--lg pill-radius btn--plain\">Attach file(s)</label>\r\n             \r\n            </div>\r\n            <div class=\"col-md-6 col-xl-6 text-right\">\r\n                <button type=\"submit\" class=\"btn btn--green btn--lg pill-radius\" data-ng-disabled=\"caseDetailsForm.$invalid || fileUploading\" data-ng-click=\"$ctrl.add(caseFormData, patent)\">\r\n                    Add\r\n                </button>\r\n            </div>        \r\n        </div> \r\n    </form>\r\n</div>\r\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/support/general/html/modals/modal.assisted-formality-details.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-stretch\">\r\n\t<p class=\"font-h2 font-weight-bold m-b-xs\">Requesting assisted formality filing</p>\r\n\t<p class=\"m-b-xs\">Please read and understand the two sections below regarding requesting assisted formality filing.</p>\r\n\t<div class=\"row\">\r\n\t\t<div class=\"col-md-6 col-xl-6\">\r\n\t\t\t<p class=\"font-h4 m-b-xs font-weight-bold\">Additional costs</p>\r\n\t\t\t<p>Our team of IP professionals are here ready to prepare and review your cases formalities on your request. As this service requires manual intervention from a member of our team, additional fees are added to the standard self-filing fee. The additional supported fee table is displayed below:</p>\r\n\t\t\t<table class=\"t-data m-t-sm\">\r\n\t\t\t\t<tr class=\"t-data__row\">\r\n\t\t\t\t\t<td class=\"t-data__td t-data__td--no-side-padding font-weight-bold\">Formality</td>\r\n\t\t\t\t\t<td class=\"t-data__td t-data__td--no-side-padding font-weight-bold\">Fee</td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr class=\"t-data__row\">\r\n\t\t\t\t\t<td class=\"t-data__td t-data__td--no-side-padding\">Euro-PCT filing:</td>\r\n\t\t\t\t\t<td class=\"t-data__td t-data__td--no-side-padding\">$ {{$ctrl.feeOject.epctSupportFee}}</td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr class=\"t-data__row\">\r\n\t\t\t\t\t<td class=\"t-data__td t-data__td--no-side-padding\">Grant, Rule 71(3):</td>\r\n\t\t\t\t\t<td class=\"t-data__td t-data__td--no-side-padding\">$ {{$ctrl.feeOject.grantSupportFee}}</td>\r\n\t\t\t\t</tr>\t\t\t\t\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td class=\"t-data__td t-data__td--no-side-padding\">EP Validation:</td>\t\t\t\t\r\n<!-- \t\t\t\t\t<table> -->\r\n\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t<td>- Each London Agreement Country:</td>\r\n\t\t\t\t\t\t\t<td>$ {{$ctrl.feeOject.valLondonSupportFee}}</td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t<td>- Each Non-London Agreement Country:</td>\r\n\t\t\t\t\t\t\t<td>$ {{$ctrl.feeOject.valAnySupportFee}}</td>\r\n\t\t\t\t\t\t</tr>\t\t\t\t\t\t\r\n\t\t\t<!-- \t\t</table>\r\n -->\t\t\t\t</tr>\r\n\t\t\t</table>\r\n\t\t</div>\r\n\t\t<div class=\"col-md-6 col-xl-6\">\r\n\t\t\t<p class=\"font-h4 m-b-xs font-weight-bold\">Accessing your account</p>\r\n\t\t\t<p>In order for Patent Place to manually prepare formalities on your behalf, one of our IP professionals will need to be granted temporary access to your account in order to carry out the necessary work.</p>\r\n\t\t\t<p class=\"m-t-sm\">Once the required formality work has been completed, the temporary access will be removed.</p>\r\n\t\t</div>\t\t\r\n\t</div>\r\n\t<div class=\"row d-flex m-t-sm \">\r\n\t\t<div class=\"col-md-12 col-xl-12 text-center\">\r\n\t\t\t<button class=\"btn btn--green btn--lg pill-radius\" data-ng-click=\"$ctrl.dismissModal()\">Dismiss</button>\r\n\t\t</div>\r\n\t</div>\r\n</div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/support/general/html/modals/modal.duplicate-file.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n    <span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"fas fa-exclamation-circle fa-4x txt-phase-amber\"></i>\n    </div>\n    <p class=\"font-h3 font-weight-medium\">Duplicate file</p>\n    <p class=\"font-body w-100 text-center m-b-sm m-t-xs\">It seems you are attempting to upload a duplicate file. Please check and try again.</p>\n    <button class=\"btn btn--green btn--lg pill-radius\" data-ng-click=\"$ctrl.dismissModal()\">Dismiss</button>\n</div>\n\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/support/general/html/modals/modal.loss-of-data.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n    <span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"far fa-times-circle fa-4x txt-phase-red\"></i>\n    </div>\n    <p class=\"font-h3 font-weight-medium\">Selection will result loss of information</p>\n    <p class=\"font-body w-100 text-center m-b-sm m-t-xs\">If you change your selection as to whether or not your enquiry is case specific, all information provided will be lost. If you do not wish to lose this information, please select 'cancel' below. Otherwise, click 'confirm' and you can start a new support enquiry.</p>\n    <div class=\"d-flex justify-content-center\">    \t\n    <button class=\"btn btn--lg btn--red pill-radius m-r-sm\" data-ng-click=\"$ctrl.cancel()\">Cancel</button>\n    <button class=\"btn btn--lg btn--green pill-radius\" data-ng-click=\"$ctrl.confirm()\">Confirm</button>\n    </div>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/support/general/html/modals/modal.support-error.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n    <span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"far fa-times-circle fa-4x txt-phase-red\"></i>\n    </div>\n    <p class=\"font-h3 font-weight-medium\">Issue requesting support</p>\n    <p class=\"font-body w-100 text-center m-b-sm m-t-xs\">We've encoutered a problem whilst submitting your request for support. Please try again. If it's still a problem then please email us at support@ip.place or call us on {{$ctrl.phoneNumber}}</p>\n    <button class=\"btn btn--lg btn--green pill-radius\" data-ng-click=\"$ctrl.dismissModal()\">Dismiss</button>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/support/general/html/modals/modal.support-success.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n    <span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"fas fa-check-circle fa-4x txt-phase-green\"></i>\n    </div>\n    <p class=\"font-h3 font-weight-medium\">Request for support</p>\n    <p class=\"font-body w-100 text-center m-b-sm m-t-xs\">Your request for support has been successfully submitted. A member of our support team will aim to reply within three working days. If you have any other queries or issues, please do not hesitate to submit another enquiry, or email us at support@ip.place</p>\n    <button class=\"btn btn--lg btn--green pill-radius\" data-ng-click=\"$ctrl.dismissModal()\">Dismiss</button>\n</div>\n";

/***/ })

}]);