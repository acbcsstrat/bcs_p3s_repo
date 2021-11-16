(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[3],{

/***/ "./app/app.config.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return appConfig; });
//  
//   Pat's workflow process involves a specific file : /webapp/app/app.config.js
//  
//   Pat's process needs that file to exist, but once the FE is delivered for merging with BE, the file is unused.
//  
//   That file causes the BE developer�s Eclipse to report 14 errors. Whilst not affecting P3S operation, these errors could cause real errors to be overlooked.
//  
//   So - once the FE code is delivered to the BE team, it�s desirable that that file is removed, or its errant content removed. Preferably automatically.
//  
//   Attempts to automatically delete the file using maven-antrun-plugin have failed. But file copy (inc. overwrite) using maven-resources-plugin, work.
//  
//   Hence THIS file, stored in /resources, is used to overwrite the errant file in webapp/app
//  
//   The copy is implemented by a plugin in pom.xml. Any operation (inc. �refresh�) causes the copy to execute. 
//   So it�s not even necessary to perform clean, build or maven/update to remove the errant file.
//  
//   Andy Chapman
//   11th September 2020
//  

appConfig.$inject = ['$httpProvider', '$urlRouterProvider', '$uibModalProvider', '$compileProvider' ,'$qProvider', 'KeepaliveProvider', 'IdleProvider', 'localStorageServiceProvider', '$mdIconProvider', '$mdPanelProvider', '$stateProvider'];

function appConfig($httpProvider, $urlRouterProvider, $uibModalProvider, $compileProvider, $qProvider, KeepaliveProvider, IdleProvider, localStorageServiceProvider, $mdIconProvider, $mdPanelProvider, $stateProvider) {

    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};    
    }    

    window.ppdomain = "http://localhost:8080/p3sweb/";

    $urlRouterProvider 

        .when('/prelogin/reset-password', '/prelogin/reset-password')
        .when('/prelogin/new-user-verify', '/prelogin/new-user-verify/')
        .otherwise("/login")

    $stateProvider
    .state('login', {
        url: '/login',
        template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/login/html/login.tpl.htm"),
        controller: 'LoginController',
        controllerAs: '$ctrl',
        lazyLoad: function($transition$) {

            const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");
            
            // !!! Dynamic import !!!
            return __webpack_require__.e(/* import() | index */ 6).then(__webpack_require__.bind(null, "./app/features/login/index.js"))
            .then(function(mod) {
                $ocLazyLoad.inject(mod.default)
            })
            .catch(err => {
                throw new Error("Ooops, something went wrong, " + err);
            });
        }
    }) 
    .state('forgot-password', {
        url: '/forgot-password',
        template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/forgot-password/html/forgot-password.tpl.htm"),
        controller: 'ForgotPasswordController',
        controllerAs: '$ctrl',
        lazyLoad: function($transition$) {
            const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");
            
            // !!! Dynamic import !!!
            return __webpack_require__.e(/* import() | index */ 6).then(__webpack_require__.bind(null, "./app/features/forgot-password/index.js"))
            .then(function(mod) {
                $ocLazyLoad.inject(mod.default)
            })
            .catch(err => {
                throw new Error("Ooops, something went wrong, " + err);
            });
        }
    })    
    .state('reset-password', {
        url: '/prelogin/reset-password/{path:.*}',
        template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/forgot-password/html/reset-password.tpl.htm"),
        controller: 'ResetPasswordController',
        controllerAs: '$ctrl',
        resolve: {
            verification: ['$http', '$state', '$location', '$timeout', '$uibModal', function($http, $state, $location, $timeout, $uibModal) {

                var location = $location.url();
                var link = location.match(/^\d+|\d+\b|\d+(?=\w)/g)[0];
                var email = location.split('=')[1];

                var params = {
                    verifyLink: link,
                    emailAddress: email
                }

                $http({
                    method: 'POST',
                    url: ppdomain + 'prelogin/rest-reset-password/',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    params: params
                })
                .then(
                    function(response){
                        return;
                    },
                    function(errResponse){

                        console.error('Error submitting request. Error : ', errResponse)

                        var modalInstance = $uibModal.open({
                            template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/forgot-password/html/modals/modal.reset-password-verification-error.tpl.htm"),
                            appendTo: undefined,
                            controllerAs: '$ctrl',
                            controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                                this.dismissModal = function() {
                                    $uibModalInstance.close();
                                };

                            }]
                        });

                        $state.go('login', {})

                    }
                )
            }]
        },
        lazyLoad: function($transition$) {
            const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");
            
            // !!! Dynamic import !!!
            return __webpack_require__.e(/* import() | index */ 6).then(__webpack_require__.bind(null, "./app/features/forgot-password/index.js"))
            .then(function(mod) {
                $ocLazyLoad.inject(mod.default)
            })
            .catch(err => {
                throw new Error("Ooops, something went wrong, " + err);
            });
        }
    })     
    .state('register', {
        url: '/register',
        template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/register/html/register.tpl.htm"),
        controller: 'RegisterController',
        controllerAs: '$ctrl',
        lazyLoad: function($transition$) {

            const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");
            
            // !!! Dynamic import !!!
            return __webpack_require__.e(/* import() | index */ 6).then(__webpack_require__.bind(null, "./app/features/register/index.js"))
            .then(function(mod) {
                $ocLazyLoad.inject(mod.default)
            })
            .catch(err => {
                throw new Error("Ooops, something went wrong, " + err);
            });

        }
    })
    .state('new-user-verify', {
        url: '/prelogin/new-user-verify/{path:.*}',
        template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/register/html/verification.tpl.htm"),
        controller: 'VerifyAccountController',
        controllerAs: '$ctrl',
        lazyLoad: function($transition$) {

            const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");
            
            // !!! Dynamic import !!!
            return __webpack_require__.e(/* import() | index */ 6).then(__webpack_require__.bind(null, "./app/features/register/index.js"))
            .then(function(mod) {
                $ocLazyLoad.inject(mod.default)
            })
            .catch(err => {
                throw new Error("Ooops, something went wrong, " + err);
            });
        },
        resolve: {        
            verification: ['$http', '$state', '$location', '$timeout', '$uibModal', function($http, $state, $location, $timeout, $uibModal) {
 
                var location = $location.url()
                var link = location.match(/^\d+|\d+\b|\d+(?=\w)/g)[0];
                var email = location.split('=')[1];

                var params = {
                    verifyLink: link,
                    emailAddress: email
                }

                if(link !== "" && email !== undefined) {                
                    $http({
                        method: 'POST',
                        url: ppdomain+'prelogin/rest-new-user-verify/',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        params: params
                    })
                    .then(
                        function(response){
                            var modalInstance = $uibModal.open({
                                template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/register/html/modals/modal.verify-success.tpl.htm"),
                                appendTo: undefined,
                                controllerAs: '$ctrl',
                                controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                                    this.dismissModal = function() {
                                        $uibModalInstance.close();
                                    };

                                }]
                            });                            
                            $state.go('login', {})
                            return;
                        },
                        function(errResponse){
                            console.error('Error verifying account. Error : ', errResponse)

                            
                            var modalInstance = $uibModal.open({
                                template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/register/html/modals/modal.verify-error.tpl.htm"),
                                appendTo: undefined,
                                controllerAs: '$ctrl',
                                controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                                    this.dismissModal = function() {
                                        $uibModalInstance.close();
                                    };

                                }]
                            });

                            $state.go('login', {})

                        }
                    )
                } else {
                    var modalInstance = $uibModal.open({
                        template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/register/html/modals/modal.verify-error.tpl.htm"),
                        appendTo: undefined,
                        controllerAs: '$ctrl',
                        controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                            this.dismissModal = function() {
                                $uibModalInstance.close();
                            };

                        }]
                    });

                    $state.go('login', {})
                }
            }]        
        }
    })    
    .state('profile', {
        url: '/profile',
        template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/profile/html/profile.tpl.htm"),
        controller: 'ProfileController',
        controllerAs: '$ctrl',
        lazyLoad: function($transition$) {
            const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");
            
            // !!! Dynamic import !!!
            return __webpack_require__.e(/* import() | index */ 6).then(__webpack_require__.bind(null, "./app/features/profile/index.js"))
            .then(function(mod) {
                $ocLazyLoad.inject(mod.default)
            })
            .catch(err => {
                throw new Error("Ooops, something went wrong, " + err);
            });
        },
        data: {
            authorisation: true,
            redirectTo: 'login'
        }
    })    
    .state('dashboard', {
        url: '/dashboard',
        template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/dashboard/html/dashboard.tpl.htm"),
        controller: 'DashboardController',
        controllerAs: '$ctrl',
        lazyLoad: function($transition$) {
            const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");
            
            // !!! Dynamic import !!!
            return __webpack_require__.e(/* import() | index */ 6).then(__webpack_require__.bind(null, "./app/features/dashboard/index.js"))
            .then(mod =>    {
                $ocLazyLoad.inject(mod.default)
            } 
            )
            .catch(err => {
                throw new Error("Ooops, something went wrong, " + err);
            });
        },
        data: {
            authorisation: true,
            redirectTo: 'login'
        }             
    })    
    .state('dashboard.content', {
        params: {
            patents: null
        },
        resolve: {
            fxRatesMonth: ['FxService', function(FxService) {
                return FxService.fetchFxMonth();
            }]                    
        },
        views: {
            'actionsavailable@dashboard': {
                controller: 'AvailableActionsController',
                controllerAs: '$ctrl',
                template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/dashboard/html/dashboard.actions-available.tpl.htm")
            },           
            'fxchartwidget@dashboard': {
                controller: 'DbFxChartController',
                controllerAs: '$ctrl',
                template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/dashboard/html/dashboard.fxchart-widget.tpl.htm")
            },
            'europctsgraph@dashboard': {
                controller: 'EuropctsDonutController',
                controllerAs: '$ctrl',
                template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/dashboard/html/dashboard.europcts-graph.tpl.htm")     
            },
            'renewalsgraph@dashboard': {
                controller: 'RenewalsDonutController',
                controllerAs: '$ctrl',
                template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/dashboard/html/dashboard.renewals-graph.tpl.htm")
            },                
            'grantsgraph@dashboard': {
                controller: 'GrantsDonutController',
                controllerAs: '$ctrl',
                template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/dashboard/html/dashboard.grants-graph.tpl.htm")
            },
            'validationsgraph@dashboard': {
                controller: 'ValidationsDonutController',
                controllerAs: '$ctrl',
                template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/dashboard/html/dashboard.validations-graph.tpl.htm")
            }                          
        }
    })
    .state('portfolio', {
        url: '/portfolio',
        template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/portfolio/html/portfolio.tpl.htm"),
        controller: 'PortfolioController',
        controllerAs: '$ctrl',
        lazyLoad: function($transition$) {
            const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");

            return __webpack_require__.e(/* import() | index */ 6).then(__webpack_require__.bind(null, "./app/features/portfolio/index.js"))
            .then(function(mod) {
                $ocLazyLoad.inject(mod.default)

            })
            .catch(err => {
                throw new Error("Ooops, something went wrong, " + err);
            });
        },
        data: {
            authorisation: true,
            redirectTo: 'login'
        }        
    })    
    .state('portfolio.modal', {
        abstract: true,
        views: {
            "modal": {
                template: __webpack_require__("./app/features/case/html/modal.html")
            }
        }
    })
    .state('portfolio.modal.case', {
        url: '/:caseId',
        resolve: {
            caseSelected: ['$stateParams', 'CasesRestService', '$state', function($stateParams, CasesRestService, $state) {
                return CasesRestService.fetchCase($stateParams.caseId)
                .then(
                    function(response){
                        return response;
                    },
                    function(errResponse){
                        $state.go('portfolio', {}, {reload: true})
                    }
                )
                
                
            }],
            ca: ['CostAnalysisService', 'caseSelected', function(CostAnalysisService,  caseSelected) {
                return CostAnalysisService.fetchCa(caseSelected.patentID, caseSelected.p3sServicesWithFees);  
            }]
        },
        lazyLoad: function($transition$) {
            const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");
            return __webpack_require__.e(/* import() | index */ 6).then(__webpack_require__.bind(null, "./app/features/case/index.js"))
            .then(function(mod) {
                $ocLazyLoad.inject(mod.default);
            })
            .catch(err => {
                throw new Error("Ooops, something went wrong, " + err);
            });
        },      
        views:{
            "": {
                template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/case.overview.tpl.htm"),
                controller: 'CaseOverviewController',
                controllerAs: '$ctrl',
            },
            "details@portfolio.modal.case": {
                template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/details/case-details.tpl.htm"),
                controller: 'CaseDetailsController',
                controllerAs: '$ctrl'              
            },
            "reminders@portfolio.modal.case": {
                template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/notifications/notifications.tpl.htm"),
                controller: 'RemindersController',
                controllerAs: '$ctrl',                 
            },
            "form1200@portfolio.modal.case": {
                template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/europct/europct.form1200.tpl.htm"),
                controller: 'Form1200ReadyController',
                controllerAs: '$ctrl'                

            },           
            "renewalhistory@portfolio.modal.case": {
                template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/renewal/renewal.history.tpl.htm"),
                controller: 'RenewalHistoryController',
                controllerAs: '$ctrl'                

            },        
            "grantandpublishing@portfolio.modal.case": {
                template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/grant/grant.tpl.htm"),
                controller: 'GrantController',
                controllerAs: '$ctrl'                
            },      
            "validation@portfolio.modal.case": {
                template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/validation/validation.tpl.htm"),
                controller: 'ValidationController',
                controllerAs: '$ctrl'                
            },                                                
            "fee-breakdown@portfolio.modal.case": {
                template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/feebreakdown/fee-breakdown.tpl.htm"),
                controller: 'FeeBreakDownController',
                controllerAs: '$ctrl'                
            },
            "fxchart@portfolio.modal.case": {
                template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/fxchart/fxchart.tpl.htm"),
                controller: 'FxChartController',
                controllerAs: '$ctrl'  
            },
            "costchart@portfolio.modal.case": {
                template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/case/html/costchart/costchart.tpl.htm"),
                controller: 'CostChartController',
                controllerAs: '$ctrl'                
            }
        },
        params: {
            caseId: null,
            prepareGrant: null,
            form1200generate: null
        },
        data: {
            authorisation: true,
            redirectTo: 'login'
        }           
    })
    .state('transactions', {
        url: '/transactions',
        template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/transactions/html/transactions.tpl.htm"),
        controller: 'TransactionsController',
        controllerAs: '$ctrl',
        lazyLoad: function($transition$) {
            const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");
            
            // !!! Dynamic import !!!
            return __webpack_require__.e(/* import() | index */ 6).then(__webpack_require__.bind(null, "./app/features/transactions/index.js"))
            .then(function(mod) {
                $ocLazyLoad.inject(mod.default)
            })
            .catch(err => {
                throw new Error("Ooops, something went wrong, " + err);
            });
        },
        data: {
            authorisation: true,
            redirectTo: 'login'
        }               
    })
    .state('transactions.modal', {
        abstract: true,
        views: {
            "modal": {
                template: __webpack_require__("./app/features/transactions/html/modal.html")
            }
        },
        data: {
            authorisation: true,
            redirectTo: 'login'
        }           
    })        
    .state('transactions.modal.transaction-item', {
        url: '/:transId',
        lazyLoad: function($transition$) {
            const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");
            
            // !!! Dynamic import !!!
            return __webpack_require__.e(/* import() | index */ 6).then(__webpack_require__.bind(null, "./app/features/transactions/index.js"))
            .then(function(mod) {
                $ocLazyLoad.inject(mod.default)
            })
            .catch(err => {
                throw new Error("Ooops, something went wrong, " + err);
            });
        },        
        views: {
            "" : {
                template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/transactions/html/transaction-item.tpl.htm"),
                controller: 'TransactionItemController',
                controllerAs: '$ctrl',                    
            },
            "details@transactions.modal.transaction-item" : {
                template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/transactions/html/transaction-item.details.tpl.htm"),
                controller: 'TransactionDetailsController',
                controllerAs: '$ctrl',                    
            }                               

        },
        params: {
            transId: null
        },
        data: {
            authorisation: true,
            redirectTo: 'login'
        }           
    })
    .state('general-support', {
        url: '/support',
        template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/support/general/html/general-support.tpl.htm"),
        controller: 'GeneralSupportController',
        controllerAs: '$ctrl',
        params: {
            supportObj: null
        },        
        lazyLoad: function($transition$) {
            const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");
            
            // !!! Dynamic import !!!
            return __webpack_require__.e(/* import() | index */ 6).then(__webpack_require__.bind(null, "./app/features/support/general/index.js"))
            .then(function(mod) {
                $ocLazyLoad.inject(mod.default)
            })
            .catch(err => {
                throw new Error("Ooops, something went wrong, " + err);
            });   
        }
    })
    .state('basket', {
        url: '/basket',
        template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/checkout/html/checkout.basket.tpl.htm"),
        controller: 'BasketController',
        controllerAs: '$ctrl',
        lazyLoad: function($transition$) {
            const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");
            
            // !!! Dynamic import !!!
            return __webpack_require__.e(/* import() | index */ 6).then(__webpack_require__.bind(null, "./app/features/checkout/index.js"))
            .then(function(mod) {
                $ocLazyLoad.inject(mod.default)
            })
            .catch(err => {
                throw new Error("Ooops, something went wrong, " + err);
            });
        },
        data: {
            authorisation: true,
            redirectTo: 'login'
        }
    })
    .state('bank-transfer-preparation', {
        url: '/bank-transfer-preparation',
        template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/checkout/html/checkout.bank-transfer-preparation.tpl.htm"),
        controller: 'BankTransferPrepController',
        controllerAs: '$ctrl',
        lazyLoad: function($transition$) {
            const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");
            
            // !!! Dynamic import !!!
            return __webpack_require__.e(/* import() | index */ 6).then(__webpack_require__.bind(null, "./app/features/checkout/index.js"))
            .then(function(mod) {
                $ocLazyLoad.inject(mod.default)
            })
            .catch(err => {
                throw new Error("Ooops, something went wrong, " + err);
            });
        },
        params: {
            orderObj: null,
            details: null
        },
        data: {
            authorisation: true,
            redirectTo: 'login'
        }        
    })
    .state('bank-transfer-success', {
        url: '/bank-transfer-success',
        template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/checkout/html/checkout.bank-transfer-success.tpl.htm"),            
        controller: 'BankTransferSuccessController',
        controllerAs: '$ctrl',
        lazyLoad: function($transition$) {
            const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");
            
            // !!! Dynamic import !!!
            return __webpack_require__.e(/* import() | index */ 6).then(__webpack_require__.bind(null, "./app/features/checkout/index.js"))
            .then(function(mod) {
                $ocLazyLoad.inject(mod.default)
            })
            .catch(err => {
                throw new Error("Ooops, something went wrong, " + err);
            });
        },        
        params: {
            orderObj: null,
            details: null
        },
        data: {
            authorisation: true,
            redirectTo: 'login'
        }        
    })


    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';

    $mdIconProvider
        .defaultFontSet('FontAwesome')
        .fontSet('fa', 'FontAwesome');


    IdleProvider.idle(600);
    IdleProvider.timeout(30);
    KeepaliveProvider.interval(20);



    $qProvider.errorOnUnhandledRejections(false);

    localStorageServiceProvider
        .setStorageType('sessionStorage')
        .setDefaultToCookie(false)
        .setNotify(true, true)

}

/***/ }),

/***/ "./app/features/case/html/modal.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"caseoverview-modal-backdrop fade\"></div>\n<div ui-view autoscroll=\"false\"></div>";

/***/ }),

/***/ "./app/features/dashboard/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/angular/index.js
var node_modules_angular = __webpack_require__("./node_modules/angular/index.js");
var angular_default = /*#__PURE__*/__webpack_require__.n(node_modules_angular);

// CONCATENATED MODULE: ./app/features/dashboard/services/dashboard.serv.js


/* harmony default export */ var dashboard_serv = (angular_default.a.module('services.DashboardService', []).factory('DashboardService', DashboardService).name);

DashboardService.$inject = ['$http', '$q', 'CasesRestService']

function DashboardService($http, $q, CasesRestService) {

    var factory = {
        sortPatents: sortPatents,
        getPatents: {},
    };

    return factory;



    function sortPatents(patents) {

        var obj = {
            epct: {           
                Green: [],
                Amber: [],
                Red: [],
                Grey: []
            },
            renewal: {           
                Green: [],
                Amber: [],
                Red: [],
                Blue: [],
                Black: [],
                Grey: []
            },
            grant: {           
                Green: [],
                Amber: [],
                Red: [],
                Grey: []
            },
            validation: {
                Green: [],
                Grey: []
            }
        }

        var newPatents = patents.map(function(patent){
            return patent.p3sServices.map(function(serv){
                return {                
                    patentID: patent.patentID,
                    ep_ApplicationNumber: patent.ep_ApplicationNumber,
                    clientRef: patent.clientRef,
                    p3sServices: [serv]
                }
            })
        })


        var result = [].concat.apply([], newPatents);

        result.forEach(function(patent){
            patent.p3sServices.forEach(function(action, idx){
                var string = action.currentStageColour.toLowerCase();
                var capitalized = string.charAt(0).toUpperCase() + string.slice(1);     
                if(action.serviceType == 'validation') {
                    obj.validation.Green.push(patent); //handle validation manual processing
                }
                if(action.serviceType !== 'postgrant' && action.serviceType !== 'validation' && action.serviceType !== '----') { //validated changed fro postvalidation
                    obj[action.serviceType][capitalized].push(patent);
                }
                
            })
        })
        
        factory.getPatents = obj;
    }
    

};
// CONCATENATED MODULE: ./app/global/services/app.fx.serv.js
/* harmony default export */ var app_fx_serv = (angular.module('services.fx-service', []).factory('FxService', FxService).name);

FxService.$inject = ['$q', '$http'];

function FxService($q, $http) {
	
	var factory = {
		fetchFxWeek: fetchFxWeek,
		fetchFxMonth: fetchFxMonth,
		fetchFx: fetchFx
	};

	return factory;	

	function fetchFx() {

		var deferred = $q.defer()

		$http.get(ppdomain+'rest-fxrate/')
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

	function fetchFxWeek() {

		var deferred = $q.defer()

		$http.get(ppdomain+'rest-fxrates/week')
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


	function fetchFxMonth() {

		var deferred = $q.defer()

		$http.get(ppdomain+'rest-fxrates/month')
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
}
// EXTERNAL MODULE: ./app/features/portfolio/services/portfolio.cases.serv.js + 1 modules
var portfolio_cases_serv = __webpack_require__("./app/features/portfolio/services/portfolio.cases.serv.js");

// CONCATENATED MODULE: ./app/global/services/app.calculate.serv.js
/* harmony default export */ var app_calculate_serv = (angular.module('services.calculate-service', []).factory('CalculateService', CalculateService).name);

CalculateService.$inject = ['$q', '$timeout'];

function CalculateService($q, $timeout) {

	var factory = {
		calculateHours: calculateHours,
		recentActivity: recentActivity
	};

	return factory;

	function calculateHours(costband, response) {

		var date = new Date().getTime();
		var hours = '';

        switch(costband) {
            case 'Green':
            	hours =  date - response.greenStartDate;
			break;
			case 'Amber':
				hours =  date - response.amberStartDate;
			break;
			case 'Red':
				hours =  date - response.redStartDate;
			break;
			case 'Blue':
				hours =  date - response.blueStartDate;
			break;
			case 'Black':
				if(data.renewalStatus == 'Show price') {
					hours =  date - response.blackStartDate;
				} 							
		} //switch end

		return hours;		
	}

	function recentActivity(millisec) {
		
        var seconds = (millisec / 1000).toFixed(0);
        var minutes = Math.floor(seconds / 60);
        var hours = "";

        if (minutes > 59) {
            hours = Math.floor(minutes / 60);
            hours = (hours >= 10) ? hours : "0" + hours;
            minutes = minutes - (hours * 60);
            minutes = (minutes >= 10) ? minutes : "0" + minutes;
        }

        seconds = Math.floor(seconds % 60);
        seconds = (seconds >= 10) ? seconds : "0" + seconds;

        if (hours !== '' && hours < 48) { //if within 48 hours
            return true;
        }

    } //recentActivity end

}
// CONCATENATED MODULE: ./app/global/services/app.cost-analysis.serv.js
/* harmony default export */ var app_cost_analysis_serv = (angular.module('services.cost-analysis', []).factory('CostAnalysisService', CostAnalysisService).name);

CostAnalysisService.$inject = ['$http', '$q'];

function CostAnalysisService($http, $q) {

    var factory = {
        fetchCa: fetchCa
    }

    function fetchCa(patentID, services) {

        var array = [];
        var deferred = $q.defer();

        var obj = {};

        services.forEach(function(data){ //for multiple services for single patent
            if(data.saleType == 'Not In Progress') { return; }
            obj[data.serviceType] = data; 
            if(data.serviceType == 'epct') {      
                array.push($http.get(ppdomain+'rest-form1200-cost-analysis/'+patentID))

            }
            if(data.serviceType == 'renewal') {
                array.push($http.get(ppdomain+'rest-cost-analysis/'+patentID))
            }
            if(data.serviceType == 'grant') {
                array.push($http.get(ppdomain+'rest-grant-cost-analysis/'+patentID))
            }            
        })

        $q.all(array)
        .then(
            function(response){
                response.map(function(action, idx){
                    action.info = Object.keys(obj)[idx]
                    return action;
                })
                deferred.resolve(response);
            },
            function(errResponse){
                console.error('Error: Unable to fetch cost analysis')
                deferred.reject(errResponse)
            }
        )

        return deferred.promise;

        // return 
    }

    return factory;

}
// EXTERNAL MODULE: ./app/features/transactions/services/transactions.serv.js
var transactions_serv = __webpack_require__("./app/features/transactions/services/transactions.serv.js");

// CONCATENATED MODULE: ./app/features/dashboard/controllers/dashboard.controller.js
DashboardController.$inject = ['$state',  '$timeout', '$scope','$rootScope', '$cookies', '$uibModal', 'DashboardService', 'CasesRestService'];

function DashboardController($state, $timeout, $scope, $rootScope, $cookies, $uibModal, DashboardService, CasesRestService) {

    var vm = this;

    $scope.formalityData = {}
    $scope.dashboardLoaded = false;
    $scope.graphsLoaded = false;
    $scope.promise = CasesRestService.fetchAllCases();
    $scope.promise
    .then(function(response) {
        if ($scope.$$destroyed) throw "Scope destroyed";
        return response;
    })
    .then(
        function(response){

            if(response.length) {
                DashboardService.sortPatents(response);
                $scope.formalityData = DashboardService.getPatents;
            }            

            if($state.current.name === 'dashboard' || $state.current.name === 'dashboard.content') {
                if($state.current.name === 'dashboard') {
                    $state.go('dashboard.content', {patents: response}, {reload: false});
                }
                $scope.dashboardLoaded = true;
            }
        }
    )



}
// CONCATENATED MODULE: ./app/features/dashboard/controllers/dashboard.actions-available.controller.js
ActionsAvailableController.$inject = ['$scope', '$timeout', '$cookies']

function ActionsAvailableController($scope, $timeout, $cookies) {

	var vm = this;

	$scope.filter = {};

	var displayHelpTimeout;

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


	$scope.$parent.promise
	.then(
		function(response){
            var dashboardLoaded = $cookies.get('dashboardLoaded');
            if($scope.firstTime && dashboardLoaded == undefined) {
            	displayHelpTimeout = $timeout(function(){
            		$scope.displayHelp = true;
            		$cookies.put('dashboardLoaded', 'hasloaded'); 
            	}, 5000)

            } else {
            	$scope.displayHelp = false;
            	$scope.tooltip1 = true;
            }

            if(response.length) {

		        response = response.map(function(patent){
		            return patent.p3sServices.map(function(serv){
		                return {                
		                    patentID: patent.patentID,
		                    ep_ApplicationNumber: patent.ep_ApplicationNumber,
		                    clientRef: patent.clientRef,
		                    p3sServices: [serv]
		                }
		            })
		        })

		        var result = [].concat.apply([], response);

				$scope.availableActions = result.filter(function(item){
					return item.p3sServices[0].saleType == 'Online' || item.p3sServices[0].saleType == 'Offline';
				})
				
				vm.chipOptions = [];
				vm.showFilter = showFilter;

	            $scope.displayFirstHelp = displayFirstHelp;

	            function displayFirstHelp(value) {
	                $scope.displayHelp = value;
	            }				

			    function showFilter(mdMenu, $event) {
			 
			        mdMenu.open($event)
			        $scope.categories = ['saleType', 'currentStageColour', 'nextStageColour', 'serviceType'];     

			        //return items to filter panel
			        $scope.getItems = function (obj, array) { //obj is cat currentStageColour or serviceType
			            return (array || []).map(function (w) {
			                return w.p3sServices[0][obj]; //select property in p3sservices 
			            }).filter(function (w, idx, arr) {
			                if (typeof w === 'undefined' || w === null) {
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
            }

			$scope.$on('$destroy', function(){
				$timeout.cancel(displayHelpTimeout);
			})
            
		}



	)
    
}
// CONCATENATED MODULE: ./app/features/dashboard/controllers/dashboard.fx-chart.controller.js
DbFxChartController.$inject = ['$scope', '$timeout', 'fxRatesMonth'];

function DbFxChartController($scope, $timeout, fxRatesMonth) {

    var vm = this;
    var fxChartTimeout;

    $scope.$parent.promise
    .then(
        function(response){

            fxChartTimeout = $timeout(function() { 
                vm.lineData = lineData;
                vm.lineOptions = {
                    chart: {
                        type: 'lineChart',
                        height: 450,
                        margin : {
                            top: 20,
                            right: 20,
                            bottom: 55,
                            left: 55
                        },
                        clipEdge: false,
                        tooltip: {
                          hideDelay: 0
                        },                      
                        showLegend: false,
                        x: function(d, i){ 
                            return d[0]},
                        y: function(d){ return d[1]; },
                        useInteractiveGuideline: true,
                        xAxis: {
                            tickFormat: function (d, i) {
                                return d3.time.format('%x')(new Date(d));
                            },

                            showMaxMin: false,
                            rotateLabels: -30,
                            ticks: 24        
                        },
                        xScale: d3.time.scale(),
                        yAxis: {
                            tickFormat: function(d){
                                return d3.format('.04f')(d);
                            },
                            axisLabelDistance: -10,
                            ticks: 10,
                            showMaxMin: false
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
                        showYAxis: true,
                        // forceY: [0],            
                        callback: function(chart){

                        }
                    }
                }
                
            }, 300)
            vm.fxChartLoaded = true;
    })

    function lineData() {

        var chartValueArrs = [];

        for(var i = 0; i < fxRatesMonth.length; i++) {
            chartValueArrs.push([fxRatesMonth[i].rateActiveDate, fxRatesMonth[i].rate]);
        }

        return [
            {
                values: chartValueArrs.reverse(),
                color: '#2ca02c'
            }
        ]

    } //function end

    $scope.$on('$destroy', function(){
        $timeout.cancel(fxChartTimeout)
    })

}

// CONCATENATED MODULE: ./app/features/dashboard/controllers/dashboard.europcts-graph.controller.js
EuropctsDonutController.$inject = ['$stateParams', '$scope', '$timeout'];

function EuropctsDonutController($stateParams, $scope, $timeout) {

	var vm = this;
	var epctGraphTimeout;

	$scope.$parent.promise
	.then(
		function(response){

			if(response.length) {

				epctGraphTimeout = $timeout(function() { //required to load correct size of donut graph in view
		      		vm.donutOptions = {
			            chart: {
			                type: 'pieChart',	
			                height: 200,
			                donut: true,
			                margin: { top: 0, right: 0, bottom: 0, left: 0 },
			                tooltip: {
							  hideDelay: 0
							},
			                x: function(d){
			                	return d.key;
			                },
			                y: function(d){
			                	return d.y;
			                },
			                donutRatio: 0.60,
							duration: 500,
			                showLabels: false,
			                showLegend: false,
			                valueFormat: function(d) {
			                	return d;
			                }
			            }
			        };

			        var formalityTotal = function() {
			        	var counter = 0;
			        	Object.keys($scope.formalityData.epct).forEach(function(item){
			        		counter += $scope.formalityData.epct[item].length;
			        	})
			        	return counter;

			        }		        

			        vm.donutData = {
			        	phases: [
				        	{
				        		key: 'Green', 
				        		y: $scope.formalityData.epct.Green.length,
				        		color: '#53ab58'
				        	},
				        	{
				        		key: 'Amber', 
				        		y: $scope.formalityData.epct.Amber.length,
				        		color: '#f9b233'
				        	},
				        	{
				        		key: 'Red', 
				        		y: $scope.formalityData.epct.Red.length,
				        		color: '#e30613'
				        	},
				        	{
				        		key: 'Grey', 
				        		y: $scope.formalityData.epct.Grey.length,
				        		color: '#dbdbdb'
				        	}
				        ],
			        	total: formalityTotal()
			        }
			        	

		            var evt = document.createEvent('UIEvents');
		            evt.initUIEvent('resize', true, false, window, 0);
		            window.dispatchEvent(evt);
		           
		  		}, 300);
			}

		} //if patents end	
	)

	$scope.$on('$destroy', function(){
		$timeout.cancel(epctGraphTimeout);
	})
}
// CONCATENATED MODULE: ./app/features/dashboard/controllers/dashboard.grants-graph.controller.js
GrantsDonutController.$inject = ['$stateParams', '$scope', '$timeout'];

function GrantsDonutController($stateParams, $scope, $timeout) {

	var vm = this;
	var grantGraphTimeout;

	$scope.$parent.promise
	.then(
		function(response){

			if(response.length) {

				grantGraphTimeout = $timeout(function() { //required to load correct size of donut graph in view
		      		vm.donutOptions = {
			            chart: {
			                type: 'pieChart',	
			                height: 200,
			                donut: true,
			                margin: { top: 0, right: 0, bottom: 0, left: 0 },
			                tooltip: {
							  hideDelay: 0
							},
			                x: function(d){
			                	return d.key;
			                },
			                y: function(d){
			                	return d.y;
			                },
			                donutRatio: 0.60,
							duration: 500,
			                showLabels: false,
			                showLegend: false,
			                valueFormat: function(d) {
			                	return d;
			                }
			            }
			        };

			        var formalityTotal = function() {
			        	var counter = 0;
			        	Object.keys($scope.formalityData.grant).forEach(function(item){
			        		counter += $scope.formalityData.grant[item].length;
			        	})
			        	return counter;

			        }

			        vm.donutData = {
			        	phases: [
				        	{
				        		key: 'Green', 
				        		y: $scope.formalityData.grant.Green.length,
				        		color: '#53ab58'
				        	},
				        	{
				        		key: 'Amber', 
				        		y: $scope.formalityData.grant.Amber.length,
				        		color: '#f9b233'
				        	},
				        	{
				        		key: 'Red', 
				        		y: $scope.formalityData.grant.Red.length,
				        		color: '#e30613'
				        	},
				        	{
				        		key: 'Grey', 
				        		y: $scope.formalityData.grant.Grey.length,
				        		color: '#dbdbdb'
				        	},
			        	],
			        	total: formalityTotal()
		        	}		        	
			        
		            var evt = document.createEvent('UIEvents');
		            evt.initUIEvent('resize', true, false, window, 0);
		            window.dispatchEvent(evt);

		  		}, 300);

			}

		} //if patents end	
	)

	$scope.$on('$destroy', function(){
		$timeout.cancel(grantGraphTimeout);
	})
}
// CONCATENATED MODULE: ./app/features/dashboard/controllers/dashboard.renewals-graph.controller.js
RenewalsDonutController.$inject = ['$stateParams', '$scope', '$timeout', '$cookies'];

function RenewalsDonutController($stateParams, $scope, $timeout, $cookies) {

	var vm = this;
	var renewalGraphTimeout, dispayHelpTimeout;

	$scope.$parent.promise
	.then(
		function(response){
			var dashboardLoaded = $cookies.get('dashboardLoaded');

            if($scope.firstTime && dashboardLoaded == undefined) {
	        	dispayHelpTimeout = $timeout(function(){
	        		$scope.displayHelp = true;
	        	}, 5000)
            } else {
            	$scope.displayHelp = false;
            	$scope.tooltip1 = true;
            }
            if(response.length) {
				renewalGraphTimeout = $timeout(function() { //required to load correct size of donut graph in view
		      		vm.donutOptions = {
			            chart: {
			                type: 'pieChart',	
			                height: 200,
			                donut: true,
			                margin: { top: 0, right: 0, bottom: 0, left: 0 },
			                tooltip: {
							  hideDelay: 0
							},
			                x: function(d){
			                	return d.key;
			                },
			                y: function(d){
			                	return d.y;
			                },
			                donutRatio: 0.60,
							duration: 500,
			                showLabels: false,
			                showLegend: false,
			                valueFormat: function(d) {
			                	return d;
			                }
			            }
			        };

			        var formalityTotal = function() {
			        	var counter = 0;
			        	Object.keys($scope.formalityData.renewal).forEach(function(item){
			        		counter += $scope.formalityData.renewal[item].length;
			        	})
			        	return counter;

			        }

			        vm.donutData = {
			        	phases: [
				        	{
				        		key: 'Green', 
				        		y: $scope.formalityData.renewal.Green.length,
				        		color: '#53ab58'
				        	},
				        	{
				        		key: 'Amber', 
				        		y: $scope.formalityData.renewal.Amber.length,
				        		color: '#f9b233'
				        	},
				        	{
				        		key: 'Red', 
				        		y: $scope.formalityData.renewal.Red.length,
				        		color: '#e30613'
				        	},
				        	{
				        		key: 'Blue',
				        		y: $scope.formalityData.renewal.Blue.length,
				        		color: '#0097ce'
				        	},
				        	{
				        		key: 'Black', 
				        		y: $scope.formalityData.renewal.Black.length,
				        		color: '#3c3c3b'
				        	},
				        	{
				        		key: 'Grey', 
				        		y: $scope.formalityData.renewal.Grey.length,
				        		color: '#dbdbdb'
				        	}
			        	],
			        	total: formalityTotal()

			       	}	        

		            var evt = document.createEvent('UIEvents');
		            evt.initUIEvent('resize', true, false, window, 0);
		            window.dispatchEvent(evt);

		  		}, 300);
            }

            $scope.displayFirstHelp = displayFirstHelp;

            function displayFirstHelp(value) {
                $scope.displayHelp = value;
            }            

			$scope.$on('$destroy', function(){
				$timeout.cancel(renewalGraphTimeout, dispayHelpTimeout);
			})

		}
	)

}
// CONCATENATED MODULE: ./app/features/dashboard/controllers/dashboard.validations-graph.controller.js
VaidationsDonutController.$inject = ['$stateParams', '$scope', '$timeout'];

function VaidationsDonutController($stateParams, $scope, $timeout) {

	var vm = this;
	var validationGraphTimeout;

	$scope.$parent.promise
	.then(
		function(response){

			if(response.length) {

				validationGraphTimeout = $timeout(function() { //required to load correct size of donut graph in view
		      		vm.donutOptions = {
			            chart: {
			                type: 'pieChart',	
			                height: 200,
			                donut: true,
			                margin: { top: 0, right: 0, bottom: 0, left: 0 },
			                tooltip: {
							  hideDelay: 0
							},
			                x: function(d){
			                	return d.key;
			                },
			                y: function(d){
			                	return d.y;
			                },
			                donutRatio: 0.60,
							duration: 500,
			                showLabels: false,
			                showLegend: false,
			                valueFormat: function(d) {
			                	return d;
			                }
			            }
			        };

			        var formalityTotal = function() {
			        	var counter = 0;
			        	Object.keys($scope.formalityData.validation).forEach(function(item){
			        		counter += $scope.formalityData.validation[item].length;
			        	})
			        	return counter;

			        }

			        vm.donutData = {
			        	phases: [
				        	{
				        		key: 'Green', 
				        		y: $scope.formalityData.validation.Green.length,
				        		color: '#53ab58'
				        	},
				        	{
				        		key: 'Grey', 
				        		y: $scope.formalityData.validation.Grey.length,
				        		color: '#dbdbdb'
				        	}

			        	],
			        	total: formalityTotal()

			        }

		            var evt = document.createEvent('UIEvents');
		            evt.initUIEvent('resize', true, false, window, 0);
		            window.dispatchEvent(evt);

		  		}, 300);
			}
		}

	)

	$scope.$on('$destroy', function(){
		$timeout.cancel(validationGraphTimeout);
	})
}
// CONCATENATED MODULE: ./app/features/dashboard/index.js
// import './_dashboard.scss';


















/* harmony default export */ var dashboard = __webpack_exports__["default"] = (angular_default.a.module('ppApp.dashboard', [dashboard_serv, portfolio_cases_serv["a" /* default */], app_calculate_serv, app_cost_analysis_serv, transactions_serv["a" /* default */], app_fx_serv]) //import dashboard view controllers
  	.controller('DashboardController', DashboardController)
  	.controller('AvailableActionsController', ActionsAvailableController)
  	.controller('DbFxChartController', DbFxChartController)
  	.controller('EuropctsDonutController', EuropctsDonutController)
  	.controller('GrantsDonutController', GrantsDonutController)
  	.controller('RenewalsDonutController', RenewalsDonutController)
  	.controller('ValidationsDonutController', VaidationsDonutController)
  	.name);


/***/ }),

/***/ "./app/features/login/services/authorisation.serv.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (angular.module('services.authorisation', []).service('AuthorisationService', AuthorisationService).name);

AuthorisationService.$inject = ['$rootScope', '$cookies', '$http', '$state', '$timeout', '$q'];

function AuthorisationService($rootScope, $cookies, $http, $state, $timeout, $q) {

    var service = {};

    service.Login = Login;
    service.ClearCredentials = ClearCredentials;
    service.SetCredentials = SetCredentials;
    service.SubmitForgottenEmail = SubmitForgottenEmail;
    service.ResetPassword = ResetPassword;

    return service;

    function Login(params) {

        var deferred = $q.defer();

        $http({
            method: 'POST',
            url: ppdomain+'resources/j_spring_security_check',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            params: params
        })
        .then(function(data){
            deferred.resolve(data)
        })

        return deferred.promise;

    }

    function SetCredentials(username, password) {

        var authdata = Base64.encode(username + ':' + password);

        $rootScope.globals = {
            currentUser: {
                username: username,
                authdata: authdata
            }
        };

        $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;

        // store user details in globals cookie that keeps user logged in for 1 week (or until they logout)
        var cookieExp = new Date();
        cookieExp.setDate(cookieExp.getDate() + 7);
        $cookies.putObject('globals', $rootScope.globals, { expires: cookieExp });

    }

    function ClearCredentials() {
        $rootScope.globals = {};
        $cookies.remove('globals');
        $http.defaults.headers.common.Authorization = 'Basic';
    }

    function SubmitForgottenEmail(params) {

        var deferred = $q.defer();

        $http({
            method: 'POST',
            url: ppdomain+'prelogin/rest-forgot-password/',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            params: params
        })
        .then(
            function(response){
                deferred.resolve(response)
            },
            function(errResponse){
                console.error('Error submitting request. Error : ', errResponse)
                deferred.reject(errResponse)
            }
        )

        return deferred.promise;

    }

    function ResetPassword(params) {

        var deferred = $q.defer();

        $http({
            method: 'POST',
            url: ppdomain+'prelogin/rest-reset-password-submit/',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            params: params
        })
        .then(
            function(response){
                deferred.resolve(response)
            },
            function(errResponse){
                console.error('Error submitting request. Error : ', errResponse)
                deferred.reject(errResponse)
            }
        )

        return deferred.promise;
    }
}

    // Base64 encoding service used by AuthenticationService
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



/***/ }),

/***/ "./app/features/portfolio/services/portfolio.cases.serv.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./app/global/services/app.organiseColour.serv.js
/* harmony default export */ var app_organiseColour_serv = (angular.module('services.organise-colour-service', []).factory('OrganiseColourService', OrganiseColourService).name);

OrganiseColourService.$inject = ['$http', '$q'];

function OrganiseColourService($http, $q) {

    var factory = {
        getNextColour:  getNextColour,
        getCurrColour:  getCurrColour

    }

    function getCurrColour(colour, item) {

        var color;

        if(item === 'text') {
            switch(colour) {
                case 'Green':
                    color =  'txt-phase-green-phase'
                break;
                case 'Amber':
                    color =  'txt-phase-amber'
                break;
                case 'Red':
                    color = 'txt-phase-red'
                break;
                case 'Blue':
                    color =  'txt-phase-blue'
                break;
                case 'Black':
                    color = 'txt-phase-black'
            } //switch end

        }

        if(item === 'bg') {
            switch(colour) {
                case 'Green':
                    color =  'bg-phase-green-phase'
                break;
                case 'Amber':
                    color =  'bg-phase-amber'
                break;
                case 'Red':
                    color = 'bg-phase-red'
                break;
                case 'Blue':
                    color =  'bg-phase-blue'
                break;
                case 'Black':
                    color = 'bg-phase-black'
            } //switch end
           
        }

        return color
    }

    function getNextColour(colour, item) {
        var color;

        if(item === 'bg') {
            switch(colour) {
                case 'Green':
                    color =  'bg-phase-amber'
                break;
                case 'Amber':
                    color =  'bg-phase-red'
                break;
                case 'Red':
                    color = 'bg-phase-blue'
                break;
                case 'Blue':
                    color =  'bg-phase-black'
                break;
                case 'Black':
                    color = 'bg-white'
            } //switch end
           
        }
         return color
    }    

    return factory;

}
// CONCATENATED MODULE: ./app/features/portfolio/services/portfolio.cases.serv.js


/* harmony default export */ var portfolio_cases_serv = __webpack_exports__["a"] = (angular.module('services.patents-rest-service', [app_organiseColour_serv]).factory('CasesRestService', CasesRestService).name);

CasesRestService.$inject = ['$http', '$q', 'OrganiseColourService'];

function CasesRestService($http, $q, OrganiseColourService) {

    var REST_SERVICE_URI = ppdomain+'rest-patents/'; 

    var factory = {
        fetchAllCases: fetchAllCases,
        updatePatent: updatePatent,
        savePatent: savePatent,
        deletePatent: deletePatent,
        fetchCase: fetchCase
    };

    return factory;

    var actionsArray = [];

    function fetchAllCases() {

        var deferred = $q.defer();
         $http.get(ppdomain+'rest-patents-portfolio/')
            .then(
            function (response) {

                var generateId = function(service) {
                    var number = '';
                    for (var i = 0; i < service.length; i++) {
                        number += service.charCodeAt(i).toString();
                    }
                    return parseInt(number.substring(2, 9)); //skip decimal
                }

                response.data.map(function(patent){
                    return patent.p3sServices.map(function(property){
                        
                        if(property.serviceType === 'postvalidation') {
                            property.serviceType = '----';
                            property.serviceStatusUI = 'N/A';

                        }
                        if(property.serviceType == 'postgrant') {
                            property.serviceType = '----';
                        }

                        property.actionID = patent.patentID + generateId(property.serviceType); //generate unique id based on patent id and service type (get char codes)
                        if(property.currentStageColour) {
                            property.cssCurrent = OrganiseColourService.getCurrColour(property.currentStageColour, 'text')
                        }
                        if(property.nextStageColour) {
                            property.cssNext = OrganiseColourService.getCurrColour(property.nextStageColour, 'text')
                        }
                        return property;
                    })
                })

                actionsArray = response.data.map(function(patent){
                    return patent.p3sServices.map(function(action){
                        var obj = {};
                        obj.patentID = patent.patentID;
                        obj.serviceType = action.serviceType;
                        obj.actionID = action.actionID
                        return obj;
                    })
                })

                deferred.resolve(response.data);

            },
            function(errResponse){
                console.error('Error: Unable to fetch all patents. Error Response:', errResponse)
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    };

    function fetchCase(id) {
        var deferred = $q.defer();
        $http.get(ppdomain+'rest-patent/'+ id)
            .then(
            function (response) {

                if(actionsArray === undefined || typeof actionsArray === 'undefined') {
                    deferred.reject(response.data);
                }
                if(actionsArray.length) {
                     
                    var merged = [].concat.apply([], actionsArray); //dont use flat() method because of IE. This is alternative
                    response.data.p3sServicesWithFees.map(function(property){
                        property.serviceType = property.serviceType == 'postvalidation' ? 'N/A' : property.serviceType;
                        property.serviceStatus = property.serviceType == 'postvalidation' ? 'validated' : property.serviceStatus;
                        var item = merged.filter(function(action){
                            return action.serviceType === property.serviceType && id == action.patentID;
                        }).map(function(filtered){
                            return filtered.actionID
                        })

                        property.actionID = item[0];

                        if(property.currentStageColour) {
                            property.cssCurrent = OrganiseColourService.getCurrColour(property.currentStageColour, 'text');
                        }
                        if(property.nextStageColour) {
                            property.cssNext = OrganiseColourService.getCurrColour(property.nextStageColour, 'text');
                        }
                        return property;
                    
                    })

                     deferred.resolve(response.data);
                }

               
            },
            function(errResponse){
                console.error('Error: Unable to fetch patent. Error Response:', errResponse)
                deferred.reject(errResponse);
            }
        );

        return deferred.promise;
    };    

    function updatePatent(patent, id) {
        //quick fix for resolving issues with converting circule structure to JSON(loop) 
        patent.p3sServicesWithFees.map(function(action){
            action.form1200FeeUI = null;
            action.grantFeeUI = null;
            action.validationFeeUI = null;
            action.renewalFeeUI = null;
        })
   
        var deferred = $q.defer();
        $http.put(REST_SERVICE_URI+id, patent)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error: Unable to update patent. Error Response:', errResponse)
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    };

    function savePatent(patent) {
        var deferred= $q.defer();
        $http.post(ppdomain+'rest-patents/', patent)
            .then(function(response){
                deferred.resolve(response.data);
            }, function(errResponse) {
                console.error('Error: Unable to save patent. Error Response:', errResponse)
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    };

    function deletePatent(id) {
        var deferred = $q.defer();
        $http.delete(REST_SERVICE_URI+id)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error: Unable to delete patent. Error Response:', errResponse)
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    };


}



/***/ }),

/***/ "./app/features/profile/services/profile.details.serv.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (angular.module('services.user-service', []).factory('ProfileService', ProfileService).name);

ProfileService.$inject = ['$http', '$q']; 

function ProfileService($http, $q) {

    var REST_SERVICE_URI = ppdomain+'rest-user/'; //variable declared before function are initiated

    var factory = {
        fetchUser: fetchUser,
        updateUser: updateUser,
        listUsers: listUsers

    };

    return factory;

    function fetchUser() {
    
        var deferred = $q.defer();
         $http.get(REST_SERVICE_URI)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while fetching user');
                deferred.reject(errResponse);
            }
        );

        return deferred.promise;
    };

    var config = {headers:  {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };

    function updateUser(user) {

        var deferred = $q.defer();
        $http.put(REST_SERVICE_URI, user, config)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    };

    function listUsers() {

        var deferred = $q.defer();

        $http.get(ppdomain+'rest-users/')
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    };

}



/***/ }),

/***/ "./app/features/register/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/angular/index.js
var node_modules_angular = __webpack_require__("./node_modules/angular/index.js");
var angular_default = /*#__PURE__*/__webpack_require__.n(node_modules_angular);

// EXTERNAL MODULE: ./node_modules/zxcvbn/lib/main.js
var main = __webpack_require__("./node_modules/zxcvbn/lib/main.js");
var main_default = /*#__PURE__*/__webpack_require__.n(main);

// CONCATENATED MODULE: ./app/features/register/controllers/register.controller.js


RegisterController.$inject = ['$scope', '$state', '$http', '$uibModal','$timeout', 'RegisterService', '$location', '$rootScope', 'vcRecaptchaService', 'TimezoneService'];

function RegisterController($scope, $state, $http, $uibModal, $timeout, RegisterService, $location, $rootScope, vcRecaptchaService, TimezoneService) {

    var vm = this;
    var timezomeTimeout;

    vm.formData = {};
    vm.recap = {};
    vm.displayBusinessDetail = false;
    vm.notSelectedCompanyReg = true;
    vm.checkFetchBusiness = checkFetchBusiness;
    vm.register = register;
    vm.searchCompany = searchCompany;
    vm.copyBusinessAddress = copyBusinessAddress;
    vm.companyPinLoading = false;
    vm.recap.publicKey = '6LezdHEUAAAAABvniybP4wWGWWztRMQXT5r0_WMs';
    vm.searchCompanyresponse;
    vm.next = next;
    vm.back = back;
    vm.business = {}
    vm.stage = "";
    vm.formValidation = false;
    vm.passwordUpdate = passwordUpdate;

    function init() {
        Idle.unwatch()
    }

    init();    
  
    function passwordUpdate(password) {

        if(password !== undefined) {
            if(vm.formData.password.length < 8){ //https://stackoverflow.com/questions/56314220/angularjs-minlength-validation-stop-characters-counter
                $scope.registrationForm.password.$setValidity('minlength', false);
            } else{
                $scope.registrationForm.password.$setValidity('minlength', true);
            }

            if(vm.formData.password.length > 20){
                $scope.registrationForm.password.$setValidity('maxlength', false);
            } else{
                $scope.registrationForm.password.$setValidity('maxlength', true);
            }

            vm.passwordStrength = main_default()(password);
        }
        
    }

    vm.toggleTableState = function() {
        if (vm.isCollapsed) {
          vm.isCollapsed = false;
          vm.tableText = "Hide Table";
        } else {
          vm.isCollapsed = true;
          vm.tableText = "Show Table";
        }
    };

  // Navigation functions
    function next(stage) { //https://codepen.io/jaa2015/pen/GqparY
        vm.formValidation = true;
        if($scope.registrationForm.$valid) {
            vm.direction = 1;
            vm.stage = stage;
            vm.formValidation = false;
        }
    };

    function back(stage) {
        vm.direction = 0;
        vm.stage = stage;
    }; 
  
    $scope.reset = function() {
        // Clean up scope before destorying
        vm.stage = "";
    }

    function init() {
        vm.stage1 =  false;
        vm.stage2 = false;
        vm.companyDetailsRequired = false;
        TimezoneService.fetchUsaTimeZones()
        .then(
            function(response){
                timezomeTimeout = $timeout(function(){
                    vm.ustimezones = response;
                }, 300)
                
            }
        )        
    }

    init()

    function copyBusinessAddress(value) {

        if(value === true) {
            vm.formData.billingStreet = vm.formData.street;
            vm.formData.billingCity = vm.formData.city;
            vm.formData.billingState = vm.formData.USstate;
            vm.formData.billingZip = vm.formData.zip;
        } else {
            vm.formData.billingStreet = '';
            vm.formData.billingCity = '';
            vm.formData.billingState = '';
            vm.formData.billingZip = '';  
        }

    }

    function checkFetchBusiness(type, obj) {
        if(type == 'registered' && obj[type].yes == undefined) { //if user has selected that the company is already registered

            vm.companyDetailsRequired = true;
            vm.displayBusinessDetails = false; //hide business form until they have fetched detgails of company
            vm.displayCompanyPIN = true; //display company fields to fetch company details
        } else {  //if user has indicated that is is the first person from the firm to register
            vm.companyDetailsRequired = false;            
            vm.displayBusinessDetails = true;
            vm.displayCompanyPIN = false; //hide company fields to fetch company details
        }
    }

    function searchCompany(pin, number) {

        vm.companyPinLoading = true;

        var params = {
            businessNumber: number,
            businessPin: pin
        }

        RegisterService.SearchCompany(params)
        .then(
            function(response){

                vm.companyPinLoading = false;
                vm.noCompany = false;
                vm.searchCompanyresponse = response;
                vm.hideSearchBtn = true;
                vm.acceptDetails = function() {
                    vm.displayBusinessDetails = true;
                    vm.displayCompanyPIN = false;
                    Object.keys(response).map(function(o, k){
                        vm.formData[o] = response[o];
                    })
                    vm.formData.USstate = vm.formData.usstate;
                    delete vm.formData.usstate;
                    $scope.selectedItemvalue = response.timezone;
                }

                vm.declineDetails = function() {
                    vm.business.company.yes = false; //reset checkboxes
                    vm.business.notcompany.yes = false;
                    vm.searchCompanyresponse = undefined;
                    vm.displayBusinessDetails = false;
                    vm.displayCompanyPIN = true;
                    vm.hideSearchBtn = false;                
                }
                
            
            },
            function(errResponse) {
                vm.searchCompanyresponse = null;
                vm.companyPinLoading = false;
                vm.noCompany = true;
            }
        )

    }

    function register() {
        var type;

        if(vm.searchCompanyresponse !== null && vm.searchCompanyresponse !== undefined) {
            type = 'subsequent'
        } 

        vm.dataLoading = true;
        if($scope.registrationForm.$valid) {
            vm.formValidation = false;
            delete vm.formData.confirmPassword;
            delete vm.formData.tandc;
            RegisterService.Create(vm.formData, type)
            .then(
                function(data) {

                    vm.dataLoading = false;
                    if(data.response === 'success') {
                        var modalInstance = $uibModal.open({
                            template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/register/html/modals/modal.register-success.tpl.htm"),
                            appendTo: undefined,
                            controllerAs: '$ctrl',
                            controller: ['$uibModalInstance', '$location', '$anchorScroll', function($uibModalInstance, $location, $anchorScroll) {

                               
                                this.dismissModal = function () {
                                    $uibModalInstance.close();
                                };


                            }]
                        })
                        $state.go('login');
                    } else {
                        vm.dataLoading = false;
                        $state.go($state.current, {}, {reload: true});
                        var modalInstance = $uibModal.open({
                            template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/register/html/modals/modal.register-error.tpl.htm"),
                            appendTo: undefined,
                            controllerAs: '$ctrl',
                            controller: ['$uibModalInstance', '$location', '$anchorScroll', function($uibModalInstance, $location, $anchorScroll) {

                               
                                this.dismissModal = function () {
                                    $uibModalInstance.close();
                                };


                            }]
                        })                            
                    }


                },
                function(errResponse){
                    vm.dataLoading = false;
                    $state.go($state.current, {}, {reload: true});
                    var modalInstance = $uibModal.open({
                        template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/register/html/modals/modal.register-error.tpl.htm"),
                        appendTo: undefined,
                        controllerAs: '$ctrl',
                        controller: ['$uibModalInstance', '$location', '$anchorScroll', function($uibModalInstance, $location, $anchorScroll) {

                           
                            this.dismissModal = function () {
                                $uibModalInstance.close();
                            };


                        }]
                    })        
                }
            );

        }

    }

    $scope.$on('$destroy', function(){
        $timeout.cancel(timezomeTimeout)
    })
}
// CONCATENATED MODULE: ./app/features/register/controllers/verify-account.controller.js
VerifyAccountController.$inject = [];

function VerifyAccountController() {
	

}
// CONCATENATED MODULE: ./app/features/register/services/register-service.serv.js
/* harmony default export */ var register_service_serv = (angular.module('services.register-service', []).factory('RegisterService', register_service_serv_RegisterService).name);

register_service_serv_RegisterService.$inject = ['$http', '$q']

function register_service_serv_RegisterService($http, $q) {

    var service = {};

    service.SearchCompany = SearchCompany;
    service.Create = Create;

    return service;

    function Create(formData, type) {

    	var url;
        var deferred = $q.defer();

        var newFormData = new FormData();

        Object.keys(formData).forEach(function(o, k){
            newFormData.append(o, formData[o])
        })

        if(type == 'subsequent') {
        	url = '../register/rest-subsequent-user-step2/';
        } else {
        	url = '../register/rest-user/';
        }


        var req = {
             method: 'POST',
             url: url,
             headers: {
               'Content-Type': undefined
             },
             data: newFormData
        }


        $http(req)
        .then(
            function(response){
                deferred.resolve(response.data)
            },
            function(errResponse){
                console.error('Error creating account. Error details:  ', errResponse)
                deferred.reject(errResponse)
            }
        )

        return deferred.promise;

    }

    function SearchCompany(params) {

        var deferred = $q.defer();

        var req = {
            method: 'POST',
            url: '../register/rest-subsequent-user-step1/',
            headers: {
               'Content-Type': undefined
            },
            params: params
            
        }

        $http(req)
        .then(
            function(response){
                deferred.resolve(response.data);
                
            },
            function(errResponse){
                console.error('Error fetch company details. Error : ', errResponse)
                deferred.reject(errResponse)
            }
        )




        return deferred.promise

    }

}
// EXTERNAL MODULE: ./app/global/services/app.timezone.serv.js
var app_timezone_serv = __webpack_require__("./app/global/services/app.timezone.serv.js");

// EXTERNAL MODULE: ./app/global/directives/confirm-password-check.directive.js
var confirm_password_check_directive = __webpack_require__("./app/global/directives/confirm-password-check.directive.js");

// EXTERNAL MODULE: ./app/global/directives/zx-password-meter.directive.js
var zx_password_meter_directive = __webpack_require__("./app/global/directives/zx-password-meter.directive.js");

// CONCATENATED MODULE: ./app/features/register/index.js












/* harmony default export */ var features_register = __webpack_exports__["default"] = (angular_default.a.module('ppApp.register', [register_service_serv, confirm_password_check_directive["a" /* default */], zx_password_meter_directive["a" /* default */], app_timezone_serv["a" /* default */]])
	.controller('RegisterController', RegisterController)
	.controller('VerifyAccountController', VerifyAccountController)
	.name);

/***/ }),

/***/ "./app/features/sidenav/avatarDefault.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "b9625454d169d25b55ebcc10d4c944d5.png";

/***/ }),

/***/ "./app/features/sidenav/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: ./node_modules/angular/index.js
var node_modules_angular = __webpack_require__("./node_modules/angular/index.js");
var angular_default = /*#__PURE__*/__webpack_require__.n(node_modules_angular);

// CONCATENATED MODULE: ./app/features/sidenav/services/sidenav.service.js
/* harmony default export */ var sidenav_service = (angular.module('services.sidenav', []).factory('SidenavService', SidenavService).name);

function SidenavService(){

		var sections = [{
  		name: 'Dashboard',
  		type: 'link',
  		state: 'dashboard.content',
  		icon: 'far fa-tachometer-alt'
		}];    
  	sections.push({
  		name: 'Portfolio',
  		type: 'link',
      state: 'portfolio',
		  icon: 'far fa-folders'
    })

  	sections.push({
  		
    		name: 'Transactions',
    		type: 'link',
        state: 'transactions',
        icon: 'far fa-money-check-alt'
      
	  })

    sections.push({
        name: 'Support',
        type: 'link',
        state: 'general-support',
        icon: 'fal fa-user-headset'
    })    

 	var self;

    return self = {
      sections: sections,

    	toggleSelectSection: function (section) {
      	self.openedSection = (self.openedSection === section ? null : section);
    	},
      	isSectionSelected: function (section) {
       		return self.openedSection === section;
      	},
      	selectPage: function (section, page) {
        	page && page.url && $location.path(page.url);
          self.currentSection = section;
          self.currentPage = page;
      	}
    };

};
// CONCATENATED MODULE: ./app/features/sidenav/directives/menu-toggle.directive.js


/* harmony default export */ var menu_toggle_directive = (angular_default.a.module('directives.sidenav.menutoggle', []).directive('menuToggle', menuToggle).name);

function menuToggle() {

    return {
        scope: {
            section: '=',
            context: '='
        },
        template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/sidenav/html/sidenav-nav-li.tpl.htm"),
        link: function($scope, $element) {
            var controller = $scope.context

            $scope.isOpen = function() {
                 return controller.isOpen($scope.section);
            };
            $scope.toggle = function() {
                controller.toggleOpen($scope.section);
            };
        }
    };

}





// CONCATENATED MODULE: ./app/features/sidenav/directives/menu-link.directive.js
/* harmony default export */ var menu_link_directive = (angular.module('directives.sidenav.menuLink', []).directive('menuLink', menuLink).name);

function menuLink() {
    return {
        scope: {
            section: '='
        },
        template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/sidenav/html/sidenav-li-item.tpl.htm"),
        link: function ($scope, $element) {
            var controller = $element.parent().controller();
            // $scope.focusSection = function () {
            //     // set flag to be used later when
            //     // $locationChangeSuccess calls openPage()
            //     controller.autoFocusContent = true;
            // };
        }
    };
};


// CONCATENATED MODULE: ./app/features/sidenav/components/sidenav.component.js
/* harmony default export */ var sidenav_component = (angular.module('components.sidenav', []).component('sidenav', {
		template: __webpack_require__("./node_modules/html-loader/index.js!./app/features/sidenav/html/sidenav.tpl.htm"),
		controller: ['$scope', '$rootScope', '$mdSidenav', '$timeout', '$http', '$state',  'ProfileService', 'SidenavService',  'ngCart', 'moment', 'FxService', 'AuthorisationService', '$cookies', function($scope, $rootScope, $mdSidenav, $timeout, $http, $state, ProfileService, SidenavService, ngCart, moment, FxService, AuthorisationService, $cookies){

		var vm = this;

	 	vm.toggleLeft = buildToggler('left');
	    vm.toggleRight = buildToggler('right');
	    // vm.openGuide = openGuide;
		vm.isOpen = isOpen;
      	vm.toggleOpen = toggleOpen;
      	vm.autoFocusContent = false;
      	vm.menu = SidenavService;
      	vm.status = {
        	isFirstOpen: true,
        	isFirstDisabled: false
      	};

        vm.utc = moment.tz("Etc/UTC").format('HH:mm MM/DD/YYYY');
        vm.est = moment.tz("America/New_York").format('HH:mm MM/DD/YYYY');

      	$rootScope.$on('refreshAvatar', function(){
	        var timestamp = new Date().getTime();
	        vm.avatarimage = '../avatar-image/' + '?' + timestamp;
      	})

      	function init() {

      		$http.get('../avatar-image/')
      		.then(
      			function(response){
      				if(response.data !== '') {
      					vm.avatarimage = '../avatar-image/';
      				}
      			}
      		)

			ProfileService.fetchUser()
			.then(
				function(response){
					vm.user = response;
				}
			)
	    	FxService.fetchFx()
	    	.then(
	    		function(response){
	    			vm.fxRate = response.currentFXRate.rate
	    		},
	    		function(errResponse){
	    			console.error('Error fetching fx: ', errResponse)
	    		}
	    	)	

		    setInterval(function() {
		    	timeZoneClocks();
		    }, 1000)

      	}


      	init()

      	function isOpen(section) {
        	return vm.menu.isSectionSelected(section);
      	}
      	function toggleOpen(section) {
        	vm.menu.toggleSelectSection(section);
      	}


	    function buildToggler(componentId) {
	      	return function() {
	        	$mdSidenav(componentId).toggle();
	      	};
	    }

	    function timeZoneClocks() {
	        vm.utc = moment.tz("Etc/UTC").format('HH:mm MM/DD/YYYY');
	        vm.est = moment.tz("America/New_York").format('HH:mm MM/DD/YYYY');
	    }

		vm.logout = function() {
	    	$http.post(ppdomain+'resources/j_spring_security_logout')
	      	.then(
	      		function(response){
					AuthorisationService.ClearCredentials();
					$cookies.remove("grantAttempts");
	  				$state.go('login', { reload: false })
	      		},
	          	function(errResponse) {
	            	console.error('Error when logging out. Error: ', errResponse);
	          	}    
			)
		}

		vm.empty = function() {
			ngCart.empty();
		}

		}]
}).name);

// CONCATENATED MODULE: ./app/features/sidenav/index.js












/* harmony default export */ var sidenav = __webpack_exports__["a"] = (angular_default.a.module('ppApp.sidenav', [sidenav_service, sidenav_component, menu_toggle_directive,  menu_link_directive]) //import dashboard view controllers
  	.name);

/***/ }),

/***/ "./app/features/sidenav/ppIcon-lg.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fe26dcfb214cf0e5ece3f94527b3dd73.png";

/***/ }),

/***/ "./app/features/sidenav/ppIcon.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "6262a6319e9c9bc242704aae9478366b.png";

/***/ }),

/***/ "./app/features/transactions/html/modal.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"caseoverview-modal-backdrop fade\"></div>\n<div ui-view autoscroll=\"false\"></div>";

/***/ }),

/***/ "./app/features/transactions/services/transactions.serv.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (angular.module('services.TransactionService', []).factory('TransactionService', TransactionService).name);

TransactionService.$inject = ['$http', '$q'];

function TransactionService($http, $q) {

	var REST_SERVICE_URI_CURRENT = ppdomain+'rest-current-transactions/';

	var factory = {
		fetchCurrentTransactions:fetchCurrentTransactions,
		fetchAllTransactions: fetchAllTransactions,
		actionProgress: actionProgress
	};

	return factory;

  	function transactionProgress(val, status) { //assigned to scope for child scope to access
	    var transStatusArray = ['Initiated', 'Awaiting Funds', 'Funds Received', 'Funds Sent', 'EPO Received', 'EPO Instructed', 'Completed'];
	    var transStatusValidationArray = ['Initiated', 'Awaiting Funds', 'Funds Received', 'Processing Funds', 'Processing', 'Completed'];
  		var arrayType;
  		if(val == true) {
  			arrayType = transStatusValidationArray;
  		} else {
  			arrayType = transStatusArray;
  		}
		var index = arrayType.indexOf(status);
		var length = arrayType.length;
		var percentage = Math.round(((index+1) * 100) / length);

		return percentage;
  	}


	function fetchAllTransactions() {

		var deferred = $q.defer();

		$http.get(ppdomain+'rest-all-transactions/')
		.then(
			function(response){

				response.data.map(function(data){	
      	
                	if(data.renewalV4UIs.length) {
	                	data.renewalV4UIs.map(function(o){ 
	                		o.newType = 'Renewal';
	                	})
                	}
                	if(data.grantUIs.length) {
	                	data.grantUIs.map(function(o){ 
	                		o.newType = 'Grant';
	                	})
                	}
                	if(data.epctUIs.length) {
	                	data.epctUIs.map(function(o){ 
	                		o.newType = 'Euro-PCT';
	                	})
                	}
                	if(data.validationUIs.length) {
	                	data.validationUIs.map(function(o){ 
	                		o.newType = 'Validation';
	                	})
                	}                	
                    data.serviceUIs = [];
                    data.serviceUIs = data.serviceUIs.concat(data.renewalV4UIs, data.grantUIs, data.epctUIs, data.validationUIs)

					data.transTypeUI = data.historic === true ? 'Historic' : 'Current';
	                var isValidation = data.serviceUIs.some(function(item){
	                    return item.newType == 'Validation' ? true : false;
	                })

	                if(isValidation === true) {
	                	var valStatus = data.serviceUIs[0].validationStatus;
	                    if((data.latestTransStatus === 'Funds Sent' && valStatus == 'Payment in progress' )|| (valStatus == 'Payment in progress' && data.latestTransStatus === 'EPO Received') || (valStatus == 'PA instructed' && data.latestTransStatus === 'EPO Received') ) {
	                        data.latestTransStatus = 'Processing Funds';
	                    }
	                    if((valStatus !== 'Payment in progress' && data.latestTransStatus === 'EPO Received') || data.latestTransStatus === 'Associates Instructed') {
	                        data.latestTransStatus = 'Processing';
	                    }
	                }

					data.actionProgress = transactionProgress(isValidation, data.latestTransStatus);

					data.serviceUIs.map(function(o, i){ 
						o.appAndType = o.patentApplicationNumber + ' (' + o.newType +')';	
						if(o.clientRef == '') {
							o.clientRef = '[No Client Reference Provided]'
						}
						return o;
					})
					return data;		
				})
				deferred.resolve(response.data);
			},
			function(errResponse){
				console.error('Error fetching all transactions. Error: ', errResponse);
				deferred.reject(errResponse);
			}
		)

		return deferred.promise;

	}


	function fetchCurrentTransactions() {

		var deferred = $q.defer();
		$http.get(REST_SERVICE_URI_CURRENT)
		.then(
			function(response){
                response.data.map(function(el){
                	if(el.renewalUIs.length) {
	                	el.renewalUIs.map(function(o){ 
	                		o.newType = 'Renewal';
	                	})
                	}
                	if(el.grantUIs.length) {
	                	el.grantUIs.map(function(o){ 
	                		o.newType = 'Grant';
	                	})
                	}
                	if(el.epctUIs.length) {
	                	el.epctUIs.map(function(o){ 
	                		o.newType = 'Euro-PCT';
	                	})
                	}
                	if(el.validationUIs.length) {
	                	el.validationUIs.map(function(o){ 
	                		o.newType = 'Validation';
	                	})
                	}                	
                    el.serviceUIs = [];
                    el.serviceUIs = el.serviceUIs.concat(el.renewalUIs, el.grantUIs, el.epctUIs, el.validationUIs)
                    return el;
   
                })
				deferred.resolve(response.data);
			},
			function(errResponse){
				console.error('Error: unable to fetch current transactions: Error msg: ', errResponse)
				deferred.reject(errResponse);
			}
		);

		return deferred.promise;

	};

	function actionProgress(currTransStatus) {

		var progress = 0;
		
		switch(currTransStatus) {
    		case 'Initiated':
    			progress = 14;
    		break;
    		case 'Awaiting Funds':
    			progress = 28;
			break;
    		case 'Funds Received':
    			progress = 42;
			break;	
    		case 'Funds Sent':
    			progress = 56;
			break;	
    		case 'EPO Received':
    			progress = 70;
			break;	
    		case 'EPO Instructed':
    			progress = 84;
			break;
    		case 'Completed':
    			progress = 100;
			break;	       					    			    			    			

		}

		return progress;

	};

}

/***/ }),

/***/ "./app/global/controllers/core.ctrl.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _services_app_core_serv_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./app/global/services/app.core.serv.js");
/* harmony import */ var _features_portfolio_services_portfolio_cases_serv_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./app/features/portfolio/services/portfolio.cases.serv.js");



/* harmony default export */ __webpack_exports__["a"] = (angular.module('ppApp.core', [_services_app_core_serv_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"], _features_portfolio_services_portfolio_cases_serv_js__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"]]).controller('coreCtrl', coreCtrl).name);

coreCtrl.$inject = ['$uibModal', '$scope', '$state', '$timeout', '$http', '$cookies', '$location', '$rootScope','CoreService', 'localStorageService', 'ngCart', 'CasesRestService', 'Idle', 'Keepalive',  'AuthorisationService', '$transitions'];

function coreCtrl($uibModal, $scope,  $state, $timeout, $http, $cookies, $location, $rootScope, CoreService, localStorageService, ngCart,  CasesRestService, Idle, Keepalive,  AuthorisationService, $transitions) {

	var vm = this;

	var urgentResponse = [];
	var systemResponse = [];
	var patentsFound = true;
	var userTimedOut = false;
	var messageArr = []

	$transitions.onSuccess({}, function(transition) {
		var dashboardLoaded = $cookies.get('dashboardLoaded');
	    if($scope.firstTime && transition.to().name == 'dashboard.content') {
	    	var sessionLoggedin = $cookies.get('loggedin');
	    	if(!sessionLoggedin) {    		
		        welcomeMessageModal();
		        var cookieExp = new Date();
		        cookieExp.setDate(cookieExp.getDate() + 1)		        
		        $cookies.putObject('loggedin', 'loggedin', { expires: cookieExp });
	    	}

	    }	

	});

    function welcomeMessageModal() {

        var modalInstance = $uibModal.open({
            template: __webpack_require__("./node_modules/html-loader/index.js!./app/global/html/modals/modal.welcome-message.tpl.htm"),
            scope: $scope,
            controllerAs:'$ctrl',
            controller: ['$uibModalInstance', function($uibModalInstance) {

                this.dismissModal = function () {
                    $uibModalInstance.close();
                };
            }]
        });
    }


	$scope.$on('Keepalive', function() {
		$http.get(ppdomain+'keep-session-alive/')
	});

	$scope.$on('IdleStart', function() {

	  	closeModals();

	  	$scope.warning = $uibModal.open({
		  	template: __webpack_require__("./node_modules/html-loader/index.js!./app/global/html/modals/modal.idle.tpl.htm"),
	  		windowClass: 'modal-danger',
			appendTo: undefined
	    });
	});

  	$scope.$on('IdleEnd', function() {
	  	closeModals();
	});

	$scope.$on('IdleTimeout', function() {


    	$http.post(ppdomain+'resources/j_spring_security_logout')
      	.then(
      		function(response){
      			$state.go('login', { reload: false })
			  	closeModals();
		     	ngCart.empty();      			
	            AuthorisationService.ClearCredentials();
	            $cookies.remove("grantAttempts");
      		},
          	function(errResponse) {
            	console.error('Error with idle timeout. Error: ', errResponse);
          	}    
		)
      	
	});

	function closeModals() {
	    if ($scope.warning) {
	      	$scope.warning.close();
	      	$scope.warning = null;
	    }

	    if ($scope.timedout) {
	      $scope.timedout.close();
	      $scope.timedout = null;
	    }
	}

}

/***/ }),

/***/ "./app/global/directives/avatar.directive.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
avatarImg.$inject = ['$http'];

function avatarImg($http) {
	return {
		restrict: 'AE',
		template: __webpack_require__("./node_modules/html-loader/index.js!./app/global/directives/html/avatar.tpl.htm"),
		link: function(scope, elem, attr) {

			$http.get('../avatar-image/')
			.then(
				function(response){
					if(response.data == '' || response.data == undefined) {
						scope.avatarImg = null;
					}
					else {
						scope.avatarImg = '../avatar-image/';
					}
				}
			)

		}
	}
}

function selectAvatar() {

    return {
        restrict: 'A',
        link: function (scope, element, attr) {

            element.bind('change', function(event) { //2/3

                scope.uploadImg = false;
                scope.imgSelected = true;

                var input = this;

                if(input.files && input.files[0]) { //source: https://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata/5100158
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        scope.$apply(function () {
                            scope.cropped.source = e.target.result; //2/3
                        });

                    }

                    reader.readAsDataURL(input.files[0]);

                }

            });
        }
    };

};

function ppTooltip() {

    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            var id = attrs['ppTooltip'].match(/#?(.+)/)[1];
            if (!id) throw "bad id";
            
            var $tooltip = angular.element(document.getElementById(id));
            if (!$tooltip[0]) throw "tooltip '"+id+"' not found";
            
            // the root html element. For window dimensions
            var html = document.getElementsByTagName('html')[0];
            
            // get the tooltip border width
            var getBorderWidth = function() {
                // IE lte 8 case
                if (!window.getComputedStyle) return 1; // EAT THIS AND LIKE IT, IE.
                
                var s = getComputedStyle($tooltip[0]);
                
                // if the border is none, the border-width is 0
                if (s.getPropertyValue('border') == 'none') {
                    return 0;
                }
                else {
                    return parseInt(s.getPropertyValue('border-width'), 10);
                }
                
            };
            
            // spacing values
            // margin so that the tooltip is not touching any edges
            var margin = 1;
            // tooltip border width
            var bdw = getBorderWidth();
            // the size of the caret
            var caretSize = 5;
            // caret overlap on the target
            var caretOvr = 0;
            if (caretOvr>0) caretOvr = caretOvr + margin + bdw;
            // the left offset from the caret midpoint, if the tooltip is wide enough
            var leftOffset = -30;
            
            $tooltip.show = function() {
                this.css('display', 'inline-block');
            };
            $tooltip.hide = function() {
                this.css('display', 'none');
            };
            $tooltip.hide();
            // position the tooltip and make it visible
            $tooltip.positionAndShow = function() {
                
                // reset tooltip styles
                $tooltip.css({
                   'position': 'fixed',
                   'z-index': '9999999',
                   'box-sizing': 'border-box',
                   'width': 'auto'
                });
                
                // show the tooltip now. Must be visible to get dimensions.
                $tooltip.show();
                
                // get tooltip element's metrics
                var tt = getMetrics($tooltip[0]);
                // get the target element's metrics
                var tgt = angular.copy(element[0].getBoundingClientRect());
                if (!tgt.width) {
                    tgt.width = tgt.right - tgt.left;
                    tgt.height = tgt.top - tgt.bottom;
                }
                tgt.mid_x = tgt.right - (tgt.width/2);
                tgt.mid_y = tgt.bottom - (tgt.height/2);
                
                // the window's screen dimensions
                var screen = {
                    width: html.clientWidth,
                    height: html.clientHeight
                };
                
                // if the target element is wider than the leftOffset,
                if (leftOffset < tgt.width/2) {
                    // make leftOffset bigger
                    leftOffset = -tgt.width/2
                }
                
                // if the tooltip width is too small for the leftOffset
                if (tt.width/2 < -leftOffset) {
                    // reduce leftOffset
                    leftOffset = -tt.width/2;
                }
                
                // Position left
                
                // if the tooltip is too wide for the screen
                if (margin + tt.width + margin > screen.width) {
                    // make the tooltip full-width
                    tt.left = 0 + margin;
                    tt.width = screen.width - margin - margin;
                }
                // if the tooltip is less wide than the screen
                else {
                    // if there isn't enough space to the right
                    if (tgt.mid_x + leftOffset + tt.width + margin > screen.width) {
                        tt.left = screen.width - margin - tt.width;
                    }
                    // if there isn't enough space to the left
                    else if (tgt.mid_x + leftOffset < 0 + margin) {
                        // place tooltip at left edge
                        tt.left = 0 + margin;
                        //tt.width = 'auto';
                    }
                    // if there are no overflow problems
                    else {
                        // place tooltip at middle of target, offset
                        tt.left = tgt.mid_x + leftOffset;
                        //tt.width = 'auto';
                    }
                    
                }
                $tooltip.css({
                    'left': tt.left + 'px',
                    'width': tt.width + 'px'
                })
                // recompute the metrics for the tooltip, since we may have changed its width
                tt = getMetrics($tooltip[0]);
                
                // Position top
                
                // if there's space above
                if (tgt.top > margin + tt.height + caretSize + margin) {
                    // put it above
                    tt.top = tgt.top /* - margin*/ - caretSize - tt.height + caretOvr;
                    $tooltip.css('top', tt.top + 'px');
                    // caret arrow goes below
                    $tooltip.removeClass('arr-above');
                    $tooltip.addClass('arr-below');
                }
                else {
                    // put it below. If there's not enough space there either, then too bad
                    tt.top = tgt.top + tgt.height /* + margin*/ + caretSize - caretOvr;
                    $tooltip.css('top', tt.top + 'px');
                    // caret arrow goes below
                    $tooltip.addClass('arr-above');
                    $tooltip.removeClass('arr-below');
                }
                
                // position the caret at the middle of the target
                setupCaret(tt, -tt.left + tgt.mid_x);
                
            };
            
            element.on('mouseover click', function(){
                //scope.$apply(function(){ // not really necessary yet
                    $tooltip.positionAndShow();
                //});
            })
            element.on('mouseout blur', function(){
                //scope.$apply(function(){ // not really necessary yet
                    $tooltip.hide();
                //});
            });
            
            var getMetrics = function(el) {
                var area = getOffset(el);
                return area;
            };
            
            // caret (can't be css. must be linked to JS for positioning)
            var $caret, $caretborder;
            $tooltip.append($caret).append($caretborder);
            
            // Set the caret styles to match the computedStyle colors from the tooltip
            // @param xpos the position of the caret midpoint, relative to the tooltip
            var setupCaret = function (tt, xpos) {
                if (!window.getComputedStyle) return; // NO CARET FOR YOU, IE lte 8!
                
                // create or grab the carets
                if ($tooltip.find('mark').length == 2) {
                    $caret = $tooltip.find('mark').eq(0);
                    $caretborder = $tooltip.find('mark').eq(1);
                }
                else {
                    $caret = angular.element('<mark class="caret">');
                    $caretborder = angular.element('<mark class="caret-border">');
                }
                
                $tooltip.append($caret).append($caretborder);
                
                // min corner. If the caret is by the corner, enforce this min distance
                var mc = 3;
                
                // make the caret fit on the right side
                if (xpos + caretSize + bdw > tt.width) xpos = tt.width - bdw - caretSize - mc - 1; // -1 for pixel sync
                // make the caret fit on the left side
                if (xpos < caretSize) xpos = caretSize + mc;
                
                var generalStyles = {
                    'display': 'block',
                    'width': 0,
                    'height': 0,
                    'position': 'absolute',
                    'top': 'auto',
                    'left': xpos - caretSize + 'px',
                    'border': caretSize + 'px solid transparent',
                    'background': 'transparent',
                    'z-index': 2
                };
                $caret.css(generalStyles);
                $caretborder.css(generalStyles);
                
                if (bdw == 0) {
                    $caretborder.css('display','none');
                }
                
                var ttstyles = getComputedStyle($tooltip[0]);
                var bgcolor = ttstyles.getPropertyValue('background-color');
                var bordercolor = ttstyles.getPropertyValue('border-color');
                
                // set top absolute position
                if ($tooltip.hasClass('arr-above')) {
                    $caret.css({
                        'top': 0 - caretSize + 'px',
                        'bottom': 'auto',
                        'border-top': 'none',
                        'border-bottom': caretSize + 'px solid ' + bgcolor,
                        'z-index': 3
                    });
                    $caretborder.css({
                        'top': 0 - caretSize - bdw + 'px', // overlap the tooltip border
                        'bottom': 'auto',
                        'border-top': 'none',
                        'border-bottom': caretSize + 'px solid ' + bordercolor
                    });
                }
                else {
                    $caret.css({
                        'top': 'auto',
                        'bottom': 0 - caretSize + 'px',
                        'border-top': caretSize + 'px solid ' + bgcolor,
                        'border-bottom': 'none',
                        'z-index': 3
                    });
                    $caretborder.css({
                        'top': 'auto',
                        'bottom': 0 - caretSize - bdw + 'px', // overlap the tooltip border
                        'border-top': caretSize + 'px solid ' + bordercolor,
                        'border-bottom': 'none'
                    });
                }
            };
            
            var getOffset = function(el) {
                var x = el.offsetLeft, 
                    y = el.offsetTop,
                    w = el.offsetWidth,
                    h = el.offsetHeight;
                while (el = el.offsetParent) {
                    x += el.offsetLeft;
                    y += el.offsetTop;
                }
                return {
                    left: x,
                    top: y,
                    width: w,
                    height: h,
                    mid_x: x + (w/2),
                    mid_y: y + (h/2)
                }
            };
            
        }
    };

};

/* harmony default export */ __webpack_exports__["a"] = (angular.module('directives.select-avatar', [])
    .directive('selectAvatar', selectAvatar)
    .directive('avatarImg', avatarImg)    
    .directive('ppTooltip', ppTooltip)    
    .name);

/***/ }),

/***/ "./app/global/directives/confirm-password-check.directive.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function confrimPwTo() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=confrimPwTo"
        },
        link: function(scope, element, attributes, ngModel) {

            ngModel.$validators.confrimPwTo = function(modelValue) {
                if(!modelValue) {
                    return true;
                }
                return modelValue == scope.otherModelValue;
            };
 
            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
}

/* harmony default export */ __webpack_exports__["a"] = (angular.module('directives.confirm-pw-to', [])
    .directive('confrimPwTo', confrimPwTo)
    .name);

/***/ }),

/***/ "./app/global/directives/dynamic.directive.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
dynamic.$inject = ['$compile'];

function dynamic($compile) {
    return {
        restrict: 'A',
        replace: true,
        link: function (scope, ele, attrs) {
          scope.$watch(attrs.dynamic, function(html) {
            ele.html(html);
            $compile(ele.contents())(scope);
          });
        }
    }
}
 
/* harmony default export */ __webpack_exports__["a"] = (angular.module('directives.dynamic', [])
    .directive('dynamic', dynamic)
    .name);


/***/ }),

/***/ "./app/global/directives/media/avatar-default.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "b9625454d169d25b55ebcc10d4c944d5.png";

/***/ }),

/***/ "./app/global/directives/mobile-redirect.directive.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
mobileRedirect.$inject = ['$window', '$interval'];

function mobileRedirect($window, $interval) {

	return {
		restrict: 'A',
		link: function(scope, elem, attr) {

			var smInterval, mdInterval;

			var rtime;
			var timeout = false;
			var delta = 200;

			function resizeend() {
			    if (new Date() - rtime < delta) {
			        setTimeout(resizeend, delta);
			    } else {
			        timeout = false;
					if($window.innerWidth < 769) {
						scope.smallDevice = true;
						mdInterval = $interval(function(){
							if(angular.element(document.querySelector("#mobileRedirectId")).hasClass('d-none')) {
								angular.element(document.querySelector("#mobileRedirectId")).removeClass('d-none');
							}
						}, 500)
					} 

					if($window.innerWidth >= 769) {
						scope.smallDevice = false;
					}
			    }               
			}

			angular.element(function(){
				if($window.innerWidth < 769) {
					scope.smallDevice = true;
					smInterval = $interval(function(){
						if(angular.element(document.querySelector("#mobileRedirectId")).hasClass('d-none')) {
								angular.element(document.querySelector("#mobileRedirectId")).removeClass('d-none');
						}
					}, 500)
				} 

				if($window.innerWidth >= 769) {
					scope.smallDevice = false
				} 					
			})

			angular.element($window).bind('resize', function(e){
			    rtime = new Date();
			    if (timeout === false) {
			        timeout = true;
			        setTimeout(function(){
			        	resizeend()
			        	scope.$apply()
			        }, delta);
			    }	

				// scope.$apply();// manuall $digest required as resize event is outside of angular
			})

		}
	}

}

/* harmony default export */ __webpack_exports__["a"] = (angular.module('directives.mobile-redirect', [])
	.directive('mobileRedirect', mobileRedirect)
	.name);

/***/ }),

/***/ "./app/global/directives/open-help.directive.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./app/global/services/app.helpInfo.serv.js
/* harmony default export */ var app_helpInfo_serv = (angular.module('services.fetch-help-service', []).factory('FetchHelpService', FetchHelpService).name);

function FetchHelpService() {

	var factory = {
		getSelectedInformation: getSelectedInformation,
		getAllInformation: getAllInformation
	}

	var helpList = [
		{	
			category: 'Portfolio',
			titles: [
				{
					index: 0, 
					title: 'What is the portfolio?',
					info: [
						{
							title: 'Portfolio page',
							content: 'From this page you can add patents and view them in the Portfolio table. The concept of the Portfolio page is to be able to access all Patent Details and available European actions from a single  location. A user can select a patent  from the Portfolio table, which will display all relevant content below in the case-overview panel'
						}
					]
				},
				{ 
					index: 1, 
					title: 'Portfolio table',
					info: [
						{
							title: 'Client Ref',
							content: 'This is a user defined reference allowing for easier portfolio management. These can be altered at any time.'
						},
						{
							title: 'Client Description',
							content: 'This is intended for users to provide a short description of the invention, typically a shortended version of the application title.'
						},
						{
							title: 'European Action',
							content: 'This value indicates to user what European action is available for the patent.'
						},
						{
							title: 'Patent Place Status',
							content: 'This is a status assigned by Patent Place that indicates the current progress of a European action and what features are or are not available. If the European action has been committed to a transaction via Patent Place then a it will display a transactional status.'
						},													
						{
							title: 'European action (EP formality)',
							content: 'This column displays what European action is available for each European patent case. (Renewal, Euro-PCT, Grant, Validation). If the application has been validated and/or there are no more actions available, this will be signifed by the symbols \'----\''
						},
						{
							title: 'Current and next phases',
							content: 'If the window for an EP formality has opened and an action is available, Patent Place will provide the current and next color phase, including the costs. Some EP formalities require steps to be taken to be able to view the phases and their costs. For example, a validation order requires the user to request a quote, providing the states in which they wish to validate the patent.'
						}						
					]
				},
				{ 
					index: 2, 
					title: 'Adding patent applications',
					info: [
						{
							title: 'Adding patent applications',
							content: 'To add a patent, click the add symbol on the portfolio page and enter the required EP Application number (please ensure the check digit is correct while adding the patent). Upon search, the system will provide you with the Euopean patent case, where you have the option to add a client reference and/or description '
						}
					]					
				},
				{ 
					index: 3, 
					title: 'Case-overview',
					info: [
						{
							title: 'Case-overview',
							content: 'This panel provides the user with all informatin relevant to the patent selected from the Portoflio table. From this panel the user can access basic details, notification settings, fee breakdown and any functions required for processing a European action.  From here the user can also add the action to the basket or remove the patent from the system'
						},
						{
							title: 'Notifications',
							content: 'Patent Place provide notifications via email. The user can configure when they receive these notifications via the Case-overview, though default notification settings are initially applied when the patent is added to the system. Notiications are there to help users keep track of what stage of a color phase the european action is at.'
						},
						{
							title: 'Renewal History',
							content: 'This tab provides the history of renewals that have been processed via The Patent Place. All relevant documents such as the Renewal certificate, receipt and invoice are avaiable for download.'
						},
						{
							title: 'Cost Chart',
							content: 'The cost chart illustrates the cost of a European action at the various color phases. The total cost can vary depending on FX fluctuation, color phase and EPO fees. Hovering over the chart displays the cost and due date.'
						},
						{
							title: 'FX Chart',
							content: 'This chart shows the price variation depending on FX rate for the last 7 weeks. Hovering over the chart shows the total transaction cost on that day.'
						},
						{
							title: 'Fee Breakdown',
							content: 'This displays the breakdown of the total cost, split between the official EPO fees and Patent Place fees. It also provides further details relevant to the action such as the current color phase, next color phase, how much money can be saved by processing the action now and when the deadline is.'
						},
						{
							title: 'EP formality tabs',
							content: 'Dynamic tabs are provided witih varying information and tools, depending on the progress of the European patent application, and the status of the oustanding European patent formality. The purpose of these tabs are to help prepare instructions for either Grant (rule 71(3)), European phase entry (Form 1200) or validation.'
						},						
					]	
				}
			]
		},
		{
			category: 'Transactions',
			titles: [
				{
					index: 0,
					title: 'Transaction list',
					info: [
						{
							title: 'Transaction list',
							content: 'All transactions whether current or historic are available from one location under the transactions page. If required, to help filter and find a specific transaction, users are provided with filtering and sorting tools in the transaction table. If you would like find further information on a transaction, such as the fee breakdown, select one of the transactions from the table and a transaction overview modal will be displayed. Any invoices or other documents, such as receipts from the EPO, can be found in the transaction overview panel, where they can be downloaded and printed off.'
						}
					]
				},
				{
					index: 2,
					title: 'Transaction ID',
					info: [
						{						
							title: 'Transaction ID',
							content: 'A Patent Place assigned unique ID for each transaction.'
						}
					]
				},
				{
					index: 3,
					title: 'Trans Initiated',
					info: [
						{						
							title: 'Trans Initiated',
							content: 'The date the transaction was inititated.'
						}
					]
				},
				{
					index: 4,
					title: 'Cost',
					info: [
						{
							title: 'Cost',
							content: 'This column displays the total cost of the transaction.'
						}
					]
				},
				{
					index: 5,
					title: 'Trans Status',
					info: [
						{
							title: 'Trans Status',
							content: 'The Patent Place assigns a status to help users keep track of progress of transactions.'
						}
					]
				}	
			]
		},
		{
			category: 'Dashboard',
			titles: [
				{
					index: 0,
					title: 'Actions available',
					info: [
						{
							title: 'Actions available',
							content: 'This widget displays all patents that have an European action availale tp process. Clicking on these items will display further details of the cost in the \'Action cost\' widget.'

						}
					]
				},
				{
					index: 1,
					title: 'EP Formality totals',
					info: [
						{
							title: 'EP Formality totals',
							content: 'Patent Place provide pie charts to help summarize each EP formality type, representing the total formalities in each color phase.'

						}
					]
				},
				{
					index: 2,
					title: 'FX Chart',
					info: [
						{
							title: 'FX Chart',
							content: 'The FX chart displays a months history of daily foreign exchange rates of USD to EUR provided by Money Corp.'

						}
					]
				}

			]
		},
		{	
			category: 'Account',
			titles: [
				{ 
					index: 0, 
					title: 'Email Notifications',
					info: [
						{
							title: 'Email Notifications',
							content: 'Users can turn notifications on or off via the switch. Turning them off results in no notifciation emails being sent when European actions are transitioning through the colour phases.'
						}
					]					
				},
				{ 
					index: 1, 
					title: 'Company Users',
					info: [
						{
							title: 'Company Users',
							content: 'The is a list of all users registered to the company.'
						},
					]
				},
				{ 
					index: 2, 
					title: 'Account Details',
					info: [
						{
							title: 'Account Details',
							content: 'This page displays both user and business details provided by the user when registering. The fields that are edtiable are indidcated by an edit icon in the input field.'
						}
					]	
				},
				{ 
					index: 3, 
					title: 'Business Address',
					info: [
						{
							title: 'Business Address',
							content: 'This page displays both user and business details provided by the user when registering. The fields that are edtiable are indidcated by an edit icon in the input field.'
						}
					]	
				},
				{ 
					index: 4, 
					title: 'Billing Address',
					info: [
						{
							title: 'Billing Address',
							content: 'This segment displays the company account billing address. These fields are editable.'
						}
					]	
				}				
			]
		}			

	]

	function getAllInformation() {
		return helpList;
	}

	function getSelectedInformation(cat, item) {

		var index = helpList.findIndex(function(elem){
			return elem.category === cat;
		})

		var info = helpList[index].titles.find(function(elem){
			return elem.index === item;
		})

		return info

	}

	return factory;

}
// CONCATENATED MODULE: ./app/global/directives/open-help.directive.js


openHelpPanel.$inject = ['$rootScope', '$timeout', '$cookies'];

function openHelpPanel($rootScope, $timeout, $cookies) { //1st opens panel

	return {
		restrict: 'E',
		template: __webpack_require__("./node_modules/html-loader/index.js!./app/global/directives/html/open-help-button.tpl.htm"),
		link: function(scope, elem, attr) {

            scope.displayFirstHelp = displayFirstHelp;

            function displayFirstHelp(value) {
                scope.displayHelp = value;
            }

            $timeout(function(){
                var dashboardLoaded = $cookies.get('dashboardLoaded');
                if(scope.firstTime && dashboardLoaded == undefined) {
                    scope.displayHelp = true;
                }  else {
                    scope.displayHelp = false;
                    scope.tooltip1 = true;
                }
            }, 5000);     
			elem.bind('click', function(what, you){	
				scope.$broadcast('helpRequired', true)
			})
			
		}
	}

}


helpPanel.$inject = ['$rootScope', 'FetchHelpService'];

function helpPanel($rootScope, FetchHelpService) { //2nd

    return {
        restrict: 'AE',
        transclude: true,
        template: __webpack_require__("./node_modules/html-loader/index.js!./app/global/directives/html/help-panel.tpl.htm"),
        link: function(scope, elem, attr) {
           
            var panel = elem[0].querySelector('.help-panel-default');

            function displayPanel(open) {
                if(open) {
                    angular.element(elem[0]).addClass('active');
                    return
                }
                angular.element(elem[0]).removeClass('active');

            }

            scope.$on('helpRequired', function(event, value ) {
                displayPanel(value);
            })

            scope.closeHelpPanel = function() {
                displayPanel(false);
            }

            scope.helpList = FetchHelpService.getAllInformation();

            scope.backOut = function() {
                $rootScope.$broadcast('backOut');
                angular.element(panel).removeClass('hide-help-panel') 
            }

            scope.helpItemSelected = function(category, item) {
                var helpInfo = FetchHelpService.getSelectedInformation(category, item);
                $rootScope.$broadcast('itemSeleted', helpInfo, category); 
                var panel = elem[0].querySelector('.help-panel-default');
                angular.element(panel).addClass('hide-help-panel')              
            }

        },
    }

}

helpPanelGroup.$inject = ['$rootScope']

function helpPanelGroup($rootScope) {

    return {
        restrict: 'AE',
        template: __webpack_require__("./node_modules/html-loader/index.js!./app/global/directives/html/help-panel-group.tpl.htm"),
        transclude: true, //transclude makes the contents of a directive with this option have access to the scope outside of the directive rather than inside.
        scope: {
          heading: '@' //use &attr in the scope option when you want your directive to expose an API for binding to behaviors
        }
    }

}

helpInformation.$inject = ['$rootScope', '$compile']

function helpInformation($rootScope, $compile) {

    return {
        restrict: 'AE',
        transclude: true, //transclude makes the contents of a directive with this option have access to the scope outside of the directive rather than inside.
        scope: {
          heading: '@' //use &attr in the scope option when you want your directive to expose an API for binding to behaviors
        },
        link: function(scope, elem, attr) { //helpInformation access

            $rootScope.$on('itemSeleted', function(event, data, cat) {
                compileTemplate(data, cat);
                angular.element(document).find('.help-panel-default').css("margin-left", "-50%")
            })

            var setIndex, setTitle;

            function compileTemplate(data, cat) {

                if((setIndex === undefined && setTitle === undefined) || (setTitle !== data.title)) {
                    setIndex = data.index; 
                    setTitle = data.title;

                    elem.empty();

                    var template = '';

                    template += '<h3 class="font-h3 font-weight-bold m-b-md">' + cat + ' | ' + data.title + '</h3>';

                    for(var i = 0; i < data.info.length; i++) { //loop through the info items and create a template
                        template += '<div class="m-b-sm">\
                        <h4 class="font-h4 lh-default font-weight-bold">' + data.info[i].title + '</h4>\
                        <p class="font-body font-body--content">' + data.info[i].content + '</p>\
                        </div>'
                    }

                    var el = $compile(template)(scope);//Compiles an HTML string or DOM into a template and produces a template function, which can then be used to link scope
                    elem.append(el)
                    return;
                }


            }

        }
    }
}

/* harmony default export */ var open_help_directive = __webpack_exports__["a"] = (angular.module('directives.help-panel', [app_helpInfo_serv])
	.directive('openHelpPanel', openHelpPanel)
	.directive('helpPanelGroup', helpPanelGroup)
	.directive('helpPanel', helpPanel)
    .directive('helpInformation', helpInformation)    
	.name);

/***/ }),

/***/ "./app/global/directives/transactions.directive.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {transactionLink.$inject = ['$anchorScroll','$state', '$location', 'TransactionService'];

function transactionLink($anchorScroll, $state, $location, TransactionService) {
    return {
        transclude: true,
        scope: {},
        template: __webpack_require__("./node_modules/html-loader/index.js!./app/global/directives/html/transaction-link.tpl.htm"),
        link: function(scope, elem, attrs) {

            $(elem).click(function() {

                var id = attrs.transId;
                var type = attrs.transServicetype;

                TransactionService.fetchAllTransactions()
                .then(
                    function(response) {

                        var match = response.filter(function(el){ //find transations containign patent ID (Ccan be multiple)
                            return el.serviceUIs.find(function(item){
                                if(item.patentId) {
                                    return item.patentId == parseInt(id);
                                } else {
                                    return item.patentID == parseInt(id);                        
                                }
                            })
                        }).filter(function(el){ //find which transactionc contains the action type (requried for grants with accompanied renewal)

                            if(el.transStatusUI !== 'Completed') { //handles issue with a patent with a renewal history. directs the user to the 'in progress one', rather than completed one.                      
                                return el.serviceUIs.find(function(item){
                                    if(item.newType.toLowerCase() === type.toLowerCase()) { //if matched with directive attr value
                                        if(item.patentId) {
                                            return item.patentId == parseInt(id);
                                        } else {
                                            return item.patentID == parseInt(id);                        
                                        }
                                    } 
                                })
                            }
                        })

                        if(match !== undefined || typeof match !== 'undefined') {
                            $state.go('transactions.modal.transaction-item',{transId: match[0].p3s_TransRef}) //if match, go current-transaction-item
                            .then(
                                function(response){
                                    elem.on('$destroy', function(){
                                        $location.hash('currTransAnchor'); 
                                        $anchorScroll();  //scroll to anchor href
                                    })                                
                                },
                                function(errResponse){
                                    console.error('Error in transitioning : ', errResponse);
                                }
                            );
                        }

                    }
                );   
            })  

        }

    }
}

/* harmony default export */ __webpack_exports__["a"] = (angular.module('directives.transaction-link', [])
    .directive('transactionLink', transactionLink)
    .name);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ "./app/global/directives/validations.directive.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
supportFileUpload.$inject = ['$parse'];

function supportFileUpload($parse) {

        return {
            require: 'ngModel',
            restrict: 'A',
            link: function(scope, el, attrs, ngModel) {

                //maxFile variables
                var model = $parse(attrs.ngModel);
                var modelSetter = model.assign;
                var maxSize = 2000; //2000 

                //valid format variables
                var validFormats = ['pdf', 'PDF', 'doc', 'DOC', 'docx', 'DOCX', 'jpg', 'JPG', 'jpeg', 'JPEG','png', 'PNG', 'gif', 'GIF', 'pptx', 'PPTX', 'csv', 'CSV', 'xlsx', 'XLSX', 'zip', 'ZIP'];

                el.bind('change', function() {
                    validFile(false);
                    scope.$apply(function() {
                        scope.fileStore.maxSizeError = false;
                        if (el[0].files.length > 1) {
                            modelSetter(scope, el[0].files);
                        } else {
                            modelSetter(scope, el[0].files[0]);
                        }

                        if(el[0].files.length > 0) {
                            var fileSize = el[0].files[0].size;
                            if (fileSize === 0) {
                               scope.fileStore.maxSizeError = true;
                            }
                        }
                        ngModel.$render();
                        angular.element(el).val(null)
                    });
                });

                //validFile

                ngModel.$render = function () { //called on scope.$apply
                    ngModel.$setViewValue(el[0].files[0]); //This method should be called when a control wants to change the view value; typically, this is done from within a DOM event handler. For example, the input directive calls it when the value of the input changes and select calls it when an option is selected. When $setViewValue is called, the new value will be staged for committing through the $parsers and $validators pipelines
                };
                function validFile(bool) { //sets the input field as either valid or invalid with a boolean value 
                    ngModel.$setValidity('validfile', bool); //Changes the validity state, and notify the form.
                }
                ngModel.$parsers.push(function(value) { //Array of functions to execute, as a pipeline, whenever the control updates the ngModelController with a new $viewValue from the DOM, usually via user input.
                    var ext = value.name.substr(value.name.lastIndexOf('.')+1);
                    if(ext=='') return;
                    if(validFormats.indexOf(ext) == -1){
                        return value;
                    }
                    validFile(true); //validates state of input and form
                    return value;
                });


            }

        }

}

function selectNgValidationFiles() { //if files to be uploaded vary in future, add condition to check type or create new directive
    return {
        require: "ngModel",
        link: function postLink(scope,elem,attrs,ngModel) { //ngModel will return properties of input //scope will return the parent controller where the directive is placed

            var validFormats = ['pdf', 'PDF', 'doc', 'DOC', 'docx', 'DOCX', 'jpg', 'JPG', 'jpeg', 'JPEG','png', 'PNG', 'gif', 'GIF', 'pptx', 'PPTX', 'csv', 'CSV', 'xlsx', 'XLSX', 'zip', 'ZIP'];
            elem.bind('change', function () {
                validFile(false);
                scope.$apply(function () { //$scope.apply() is a way to inform angular that a data model has changed in the current context. Calling $scope.apply() implicitly calls $rootScope.$digest(), so every watcher that is registered to $rootScope on down to the currently existing child scopes will be dirty-checked to detect models changes.
                    ngModel.$render(); //Called when the view needs to be updated. This will update the input field, and call the $render method below
                });
            });
            ngModel.$render = function () { //called on scope.$apply
                ngModel.$setViewValue(elem[0].files[0]); //This method should be called when a control wants to change the view value; typically, this is done from within a DOM event handler. For example, the input directive calls it when the value of the input changes and select calls it when an option is selected. When $setViewValue is called, the new value will be staged for committing through the $parsers and $validators pipelines
            };
            function validFile(bool) { //sets the input field as either valid or invalid with a boolean value 
                ngModel.$setValidity('validformat', bool); //Changes the validity state, and notify the form.
            }
            ngModel.$parsers.push(function(value) { //Array of functions to execute, as a pipeline, whenever the control updates the ngModelController with a new $viewValue from the DOM, usually via user input.
                var ext = value.name.substr(value.name.lastIndexOf('.')+1);
                if(ext=='') return;
                if(validFormats.indexOf(ext) == -1){
                    return value;
                }
                validFile(true); //validates state of input and form
                return value;
            });
        }
    }
};



function validateNumbers(){

    var regExp = /^[0-9]*$/;

    return {

        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {

            function myValidation(value) {
                if (regExp.test(value)) {
                    ctrl.$setValidity('validNumber', true);
                } else {
                    ctrl.$setValidity('validNumber', false);
                }
                return value;
            }
            ctrl.$parsers.push(myValidation);
        }

    };

}

function validateTextField() {

    var regExp = /[[\]<>"%;&+*/\\]/g;

    return {

        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {

            function myValidation(value) {

                if(regExp.test(value)) {
                     ctrl.$setValidity('validTextField', false);                  
                } else {

                     ctrl.$setValidity('validTextField', true);
                }
                return value;
            }
            ctrl.$parsers.push(myValidation);
        }

    };

}

function validateCompanyName() {

    var regExp = /^[a-zA-z0-9\'\+\.\(\), -]*$/;

    return {

        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {

            function myValidation(value) {
                if (regExp.test(value)) {
                    ctrl.$setValidity('validCompanyName', true);
                } else {
                    ctrl.$setValidity('validCompanyName', false);
                }
                return value;
            }
            ctrl.$parsers.push(myValidation);
        }

    };

}

function validateName(){

    var regExp = /^[a-zA-z0-9\s\w'-]*$/;

    return {

        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {

            function myValidation(value) {
                if (regExp.test(value)) {
                    ctrl.$setValidity('validName', true);
                } else {
                    ctrl.$setValidity('validName', false);
                }
                return value;
            }
            ctrl.$parsers.push(myValidation);
        }

    };

}

function validatePhone() {

    var regExp = /^[0-9\s\+\-\(\) ]*$/;

    return {
        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {

            function myValidation(value) {
                if (regExp.test(value)) {
                    ctrl.$setValidity('validPhone', true);
                } else {
                    ctrl.$setValidity('validPhone', false);
                }
                return value;
            }
            ctrl.$parsers.push(myValidation);
        }        
    };

}

function validateEmail(){

    var regExp = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,})$/;

    return {
        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {

            function myValidation(value) {
                if (regExp.test(value)) {
                    ctrl.$setValidity('validEmail', true);
                } else {
                    ctrl.$setValidity('validEmail', false);
                }
                return value;
            }
            ctrl.$parsers.push(myValidation);
        }        
    };

}

function validateAddress(){

    var regExp = /^[a-zA-z0-9\s\-\(\).,]*$/;

    return {
        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {
            
            var modelController = elem.controller('ngModel');

            function myValidation(value) {
                if (regExp.test(value)) {

                    modelController.$setValidity('validAddress', true);
                } else {
                    modelController.$setValidity('validAddress', false);
                }
                return value;
            }
            ctrl.$parsers.push(myValidation);
        }
    };

}

function validateZip(){

    var regExp = /^[0-9\-]*$/;

    return {
        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {
            
            var modelController = elem.controller('ngModel');

            function myValidation(value) {
                if (regExp.test(value)) {

                    modelController.$setValidity('validZip', true);
                } else {
                    modelController.$setValidity('validZip', false);
                }
                return value;
            }
            ctrl.$parsers.push(myValidation);
        }        
    };
}


function uiSelectRequired() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {

            if (angular.isUndefined(attrs.multiple)) {
                 return;
            }
            ngModelCtrl.$isEmpty = function (modelValue) {
                return !modelValue.length;
            };
        }
    };
};

function refValidate() {

    var regExp = /[&<>]/;

    return {
        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {

            function myValidation(value) {
                if (!regExp.test(value)) {
                    ctrl.$setValidity('validRef', true);
                } else {
                    ctrl.$setValidity('validRef', false);
                }
                return value;
            }
            ctrl.$parsers.push(myValidation);
        }        
    };

}


function selectNgFiles() { //if files to be uploaded vary in future, add condition to check type or create new directive
    return {
        require: "ngModel",
        link: function postLink(scope,elem,attrs,ngModel) {
            var validFormats = ['pdf', 'PDF'];
            elem.bind('change', function () {
                validFile(false);
                scope.$apply(function () {
                    ngModel.$render();
                });
            });
            ngModel.$render = function () {
                ngModel.$setViewValue(elem[0].files[0]);
            };
            function validFile(bool) {
                ngModel.$setValidity('pdfIncorrect', bool);
            }
            ngModel.$parsers.push(function(value) {
                var ext = value.name.substr(value.name.lastIndexOf('.')+1);
                if(ext=='') return;
                if(validFormats.indexOf(ext) == -1){
                    return value;
                }
                validFile(true);
                return value;
            });
        }
    }
}




fileModel.$inject = ['$parse'];

function fileModel($parse) {
    return {
       restrict: 'A',
       link: function(scope, element, attrs) {
              var model = $parse(attrs.fileModel);
              var modelSetter = model.assign;

              element.bind('change', function(){
                 scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                 });
              });
       }
    };
}

function stopPropagation() {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            console.log('hit')
            console.log('attr : ', attr)
            console.log('attr.stopEvent : ', attr.stopPropagation)
            if(attr && attr.stopPropagation)
                element.bind(attr.stopPropagation, function (e) {
                    console.log(e)
                    e.stopPropagation();
                });
        }
    };
}

/* harmony default export */ __webpack_exports__["a"] = (angular.module('directives.validation-rules', [])
    .directive('fileModel', fileModel)
    .directive('validateName', validateName)
    .directive('validateNumbers', validateNumbers)
    .directive('validatePhone', validatePhone)
    .directive('validateEmail', validateEmail)
    .directive('validateAddress', validateAddress)
    .directive('validateZip', validateZip)
    .directive('refValidate', refValidate)
    .directive('selectNgFiles', selectNgFiles)
    .directive('selectNgValidationFiles', selectNgValidationFiles)
    .directive('validateCompanyName', validateCompanyName)
    .directive('uiSelectRequired', uiSelectRequired)
    .directive('validateTextField', validateTextField)
    .directive('stopPropagation', stopPropagation)
    .directive('supportFileUpload', supportFileUpload)
    .name);


/***/ }),

/***/ "./app/global/directives/zx-password-meter.directive.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
zxPasswordMeter.$inject = ['$compile'];

function zxPasswordMeter($compile) {
    return {
        scope: {
          value: "@",
          max: "@?"
        },
        template: __webpack_require__("./node_modules/html-loader/index.js!./app/global/directives/html/password-meter.tpl.htm"),
        link: function(scope) {

          scope.type = 'danger';
          scope.max = (!scope.max) ? 100 : scope.max;

          scope.$watch('value', function(newValue) {

            var strenghPercent = newValue / scope.max;
            
            if (strenghPercent === 0) {
              scope.text = 'No Score';
            } else if (strenghPercent <= 0.25) {
              scope.type = 'danger';
              scope.text = 'Weak';
            } else if (strenghPercent <= 0.50) {
              scope.type = 'warning';
              scope.text = 'Moderate';
            } else if (strenghPercent <= 0.75) {
              scope.type = 'warning';
              scope.text = 'Strong';
            } else {
              scope.type = 'success';
              scope.text = 'Perfect';
            }

          });
        }
      }
}
 
/* harmony default export */ __webpack_exports__["a"] = (angular.module('directives.zxPasswordMeter', [])
    .directive('zxPasswordMeter', zxPasswordMeter)
    .name);


/***/ }),

/***/ "./app/global/services/app.core.serv.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (angular.module('services.core-service', []).factory('CoreService', CoreService).name);

CoreService.$inject = ['$q', '$timeout', '$http'];

function CoreService($q, $timeout, $http) {


    var factory = {     
        ppContact: ppContact,
        openAppGuide: openAppGuide,
        appGuideOpen: false,
        checkCases: checkCases
    };

    function ppContact() {
        var deferred = $q.defer();
        $http.get(ppdomain+'partner-details/')
        .then(
            function(response){
                deferred.resolve(response.data)
            },
            function(errResponse){
                deferred.resolve(errResponse)
            }
        );
        return deferred.promise;
    }

    function openAppGuide() {
        return factory.appGuideOpen = !factory.appGuideOpen;
    }

    function checkCases() {

        var deferred = $q.defer();
        $http.get(ppdomain+'haveGotAnyPatents/')
        .then(
            function(response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error : ', errResponse);
                deferred.resolve(errResponse);
            }
        )
        return deferred.promise;
    }

    return factory;

}


/***/ }),

/***/ "./app/global/services/app.ppnumber.serv.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (angular.module('services.ppnumber-service', []).service('PpnumberService', PpnumberService).name);

PpnumberService.$inject = ['$q', '$http'];

function PpnumberService($q, $http) {

    var factory = {
        fetchNumber: fetchNumber
    }

    function fetchNumber(index) {

    	var deffered = $q.defer()

        $http.get(ppdomain+'partner-details/')
        .then(
        	function(response){
        		deffered.resolve(response.data)
        	},
        	function(errResponse){
        		console.error('Error fetch partner numners. Error :', errResponse)
        		deffered.reject(errResponse)
        	}
        )

        return deffered.promise
    }

    return factory;

}

/***/ }),

/***/ "./app/global/services/app.timezone.serv.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (angular.module('services.timezone-service', []).factory('TimezoneService', TimezoneService).name);

TimezoneService.$inject = ['$http', '$q'];

function TimezoneService($http, $q){

	var factory = {
		fetchUsaTimeZones: fetchUsaTimeZones
	};

 	function fetchUsaTimeZones() {
		var deferred = $q.defer();
		$http.get('/p3sweb/public/ustimezones.json')
		.then(
			function(response){
				deferred.resolve(response.data.ustimezones)
			},
			function(errResponse){
				deferred.resolve(errResponse)
			}
		);
		return deferred.promise;
	}
	return factory;
}

/***/ }),

/***/ "./app/global/vendors/ngCart/ngCart.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./app/global/vendors/ngCart/ngCart.fulfilment.js
/* harmony default export */ var ngCart_fulfilment = (angular.module('ngCart.fulfilment', [])

.service('fulfilmentProvider', ['$injector', '$state', '$timeout', function($injector, $state, $timeout){

    this._obj = {
        service : undefined,
        settings : undefined
    };
  
    this.setService = function(service){
        this._obj.service = service;
    };
  
    this.setSettings = function(settings){
        this._obj.settings = settings;
    };
  
    this.checkout = function(orderObj){
        var provider = $injector.get('ngCart.fulfilment.' + this._obj.service);
        return provider.checkout(this._obj.settings,orderObj);
    };
      
}])

.service('ngCart.fulfilment.http', ['$http','$state', '$q', function($http, $state, $q){

        
        this.checkout = function(service, patent){

            var deferred = $q.defer();
            $http.post('http://localhost:8080/p3sweb/rest-prepare-banktransfer/', patent)
            .then(
                function(response){
                    deferred.resolve(response.data);
                },
                function(errResponse){
                    console.error('Error submitting POST request to rest-prepare-banktransfer/. Error: ', errResponse)
                    deferred.reject(errResponse);
                }
            );

            return deferred.promise;
        };

 }]).name);




// CONCATENATED MODULE: ./app/global/vendors/ngCart/ngCart.directives.js




/* harmony default export */ var ngCart_directives = (angular.module('ngCart.directives', [ngCart_fulfilment])

.controller('CartController',['$scope', 'ngCart', '$state', function($scope, ngCart, $state) {
    $scope.ngCart = ngCart;
}])

.directive('ngcartAddtocart', ['ngCart', function(ngCart){
    return {
        restrict : 'E',
        controller : 'CartController',
        scope: {
            id:'@',
            name:'@',
            quantity:'@',
            quantityMax:'@',
            price:'@',
            data:'='
        },
        transclude: true,
        template: function(element, attrs) {
            if ( typeof attrs.templateUrl == 'undefined' ) {
                return __webpack_require__("./node_modules/html-loader/index.js!./app/global/vendors/ngCart/html/addtocart.htm");
            } else {
                return attrs.templateUrl;
            }
        },
        link:function(scope, element, attrs){

            scope.attrs = attrs;
            scope.inCart = function(){
                return  ngCart.getItemById(attrs.id);
            };

            if (scope.inCart()){
                scope.q = ngCart.getItemById(attrs.id).getQuantity();
            } else {
                scope.q = parseInt(scope.quantity);
            }

            scope.qtyOpt =  [];
            for (var i = 1; i <= scope.quantityMax; i++) {
                scope.qtyOpt.push(i);
            }

        }

    };
}])

.directive('ngcartCart', [function(){
    return {
        restrict : 'E',
        scope: {
            ngModel: '='
        },
        controller : 'CartController',
        template: function(element, attrs) {
            if ( typeof attrs.templateUrl == 'undefined' ) {
                return __webpack_require__("./node_modules/html-loader/index.js!./app/global/vendors/ngCart/html/cart.htm");
            } else {
                return attrs.templateUrl;
            }
        },
        link:function(scope, element, attrs){

        }
    };
}])

.directive('ngcartSummary', [function(){
    return {
        restrict : 'E',
        controller : 'CartController',
        scope: {},
        transclude: true,
        template: function(element, attrs) {
            if ( typeof attrs.templateUrl == 'undefined' ) {
                return __webpack_require__("./node_modules/html-loader/index.js!./app/global/vendors/ngCart/html/summary.htm");
            } else {
                return attrs.templateUrl;
            }
        }
    };
}])

.directive('ngcartCheckout', ['ngCart', 'ngCartItem', 'BasketService', 'CasesRestService', '$rootScope', '$timeout',  '$state', function(ngCart, ngCartItem, BasketService, CasesRestService, $rootScope, $timeout,  $state){
    return {
        restrict : 'E',
        scope: {
            service:'@',
            settings:'=',
            ngModel: '='
        },
        controller : ('CartController', ['$scope', 'ngCart', 'fulfilmentProvider', 'BasketService','$state', function($scope, ngCart, fulfilmentProvider, BasketService, $state) {

            $scope.ngCart = ngCart;
            $scope.productData = ngCart.$cart.items;



            $scope.basketItems = function() {
                return [] = Object.keys($scope.productData).map(function(data, index){
                    var obj = {};
                    obj.ep_ApplicationNo = $scope.productData[data]._data.ep_ApplicationNumber;
                    obj.patentID = $scope.productData[data]._data.patentID;
                    obj.serviceType = $scope.productData[data]._name;
                    return obj;
                })
            };

            $scope.checkout = function () {

                var orderObj = {
                    basketItems: $scope.basketItems(),
                    totalCostUSD: ngCart.totalCost(),
                    dateNowLocalTime: null
                };

                fulfilmentProvider.setService($scope.service);
                fulfilmentProvider.setSettings($scope.settings);

                fulfilmentProvider.checkout(orderObj)
                    .then(function (data, status, headers, config) {
                            data.billingDetails = $scope.summary.billingDetails;
                            $state.go('bank-transfer-preparation', {orderObj:orderObj, details: data}, {reload: false});                            
                        },
                        function (data, status, headers, config) {
                            $rootScope.$broadcast('ngCart:checkout_failed', {
                                statusCode: status,
                                error: data
                            });
                        }
                    );
            };
        }]),
        link: function(scope, element, attrs) {
            
            $rootScope.$on('ngCart:itemRemoved', function() {
               fetchBasketPatents();
            });

            fetchBasketPatents();

            function fetchBasketPatents(orderObj) {
                var orderObj = {};
                orderObj.basketItems = scope.basketItems();
                BasketService.fetchBasketPatents(orderObj)
                .then(
                    function(response){

                        scope.summary = {
                            firstName: response.firstName,
                            lastName: response.lastName,
                            billingDetails: {
                                billingStreet: response.billingStreet,
                                billingCity: response.billingCity,
                                billingState: response.billingState,
                                billingZip: response.billingZip,
                            },
                            date: response.dateNowLocalTimeUI,
                            fees: {
                                totalProcessingFeesUSD: response.totalProcessingFeesUSD,
                                totalExpressFeesUSD: response.totalExpressFeesUSD,
                                totalUrgentFeesUSD: response.totalUrgentFeesUSD,
                                totalOfficialFeesUSD: response.totalOfficialFeesUSD,
                                totalPatentPlaceFeesUSD: (function(){
                                    return response.totalCostUSD - response.totalOfficialFeesUSD;
                                }()),
                                totalCostUSD: response.totalCostUSD
                            },
                            totalPatents: response.orderedPatentUIs.length
                        };

                    },
                    function(errResponse){
                        console.error('Error: Unable to fetch basket details: ', errResponse);
                    }
                );
            }
        },
        transclude: true,
        template: function(element, attrs) {
            if ( typeof attrs.templateUrl == 'undefined' ) {
                return __webpack_require__("./node_modules/html-loader/index.js!./app/global/vendors/ngCart/html/checkout.htm");
            } else {
                return attrs.templateUrl;
            }
        }
    };
}]).name);



// CONCATENATED MODULE: ./app/global/vendors/ngCart/ngCart.js




/* harmony default export */ var ngCart = __webpack_exports__["a"] = (angular.module('ngCart', [ngCart_directives])

    .config([function () {

    }])

    .provider('$ngCart', function () {
        this.$get = function () {
        };
    })

    .run(['$rootScope', 'ngCart','ngCartItem', 'store', function ($rootScope, ngCart, ngCartItem, store) {

        $rootScope.$on('ngCart:change', function(){
            ngCart.$save();
        });

        if (angular.isObject(store.get('cart'))) {
            ngCart.$restore(store.get('cart'));

        } else {
            ngCart.init();
        }

    }])

    .service('ngCart', ['$rootScope', '$window', 'ngCartItem', 'store', '$uibModal', '$state', function ($rootScope, $window, ngCartItem, store, $uibModal, $state) {

        var vm = this;

        this.init = function(){
            this.$cart = {
                shipping : null,
                taxRate : null,
                tax : null,
                items : []
            };
        };

        function differentTypes(type) {
            if(type == 'validation') { //if newly added item is a validation
                return vm.getCart().items.some(function(cartItems){ //check that there are no nonvalidations orders
                    return cartItems._name !== 'validation';
                })
            }
            if(type !== 'validation') { //if newly added item is a validation
                return vm.getCart().items.some(function(cartItems){ //check that there are no nonvalidations orders
                    return cartItems._name == 'validation';
                })
            }            
        }

        this.addItem = function (id, name, price, quantity, data) {

            var inCart = this.getItemById(id);

            if(differentTypes(name)) { 

                var modalInstance = $uibModal.open({
                    template: __webpack_require__("./node_modules/html-loader/index.js!./app/global/vendors/ngCart/html/modal.validation-in-basket.tpl.htm"),
                    appendTo: undefined,
                    controllerAs: '$ctrl',
                    controller: ['$uibModalInstance', function($uibModalInstance) {
                        this.dismissModal = function () {
                            $uibModalInstance.close();
                        };

                    }]
                })


                return; 
            }

            var modalInstance = $uibModal.open({
                template: __webpack_require__("./node_modules/html-loader/index.js!./app/global/vendors/ngCart/html/modal.confirm-add-action.tpl.htm"),
                appendTo: undefined,
                controllerAs: '$ctrl',
                controller: ['$uibModalInstance', function($uibModalInstance) {

                    this.order = {}
                    this.order.price = price;

                    if(data.p3sServices) {
                        this.order.euroAction = data.p3sServices.map(function(item){
                            return  item;
                        }).find(function(item){        
                            return item.serviceType === name;
                        })
                    }

                    if(data.p3sServicesWithFees) {
                        this.order.euroAction = data.p3sServicesWithFees.map(function(item){
                            if(item.serviceType == 'Euro-PCT') { item.serviceType = 'epct'}
                            return  item;
                        }).find(function(item){
                            return item.serviceType === name;
                        })                    
                    }

                    this.order.ep_ApplicationNumber = data.ep_ApplicationNumber;
                    this.order.totalOrderLength = vm.getItems().length;
                    this.order.totalCost = vm.totalCost();

                    this.continueBasket =  function() {
                        $state.go('basket', {})
                        $uibModalInstance.close();
                    }

                    this.dismissModal = function () {
                        $uibModalInstance.close();
                    };

                }]
            })

            if (typeof inCart === 'object'){
                //Update quantity of an item if it's already in the cart
                inCart.setQuantity(quantity, false);
                $rootScope.$broadcast('ngCart:itemUpdated', inCart);
            } else {
                var newItem = new ngCartItem(id, name, price, quantity, data);
                this.$cart.items.push(newItem);
                $rootScope.$broadcast('ngCart:itemAdded', newItem);
            }

            $rootScope.$broadcast('ngCart:change', {});
        };

        this.getItemById = function (itemId) {
            var items = this.getCart().items;
            var build = false;

            angular.forEach(items, function (item) {
                if  (item.getId() === itemId) {
                    build = item;
                }
            });
            return build;
        };

        this.setShipping = function(shipping){
            this.$cart.shipping = shipping;
            return this.getShipping();
        };

        this.getShipping = function(){
            if (this.getCart().items.length == 0) return 0;
            return  this.getCart().shipping;
        };

        this.setTaxRate = function(taxRate){
            this.$cart.taxRate = +parseFloat(taxRate).toFixed(2);
            return this.getTaxRate();
        };

        this.getTaxRate = function(){
            return this.$cart.taxRate
        };

        this.getTax = function(){
            return +parseFloat(((this.getSubTotal()/100) * this.getCart().taxRate )).toFixed(2);
        };

        this.setCart = function (cart) {
            this.$cart = cart;
            return this.getCart();
        };

        this.getCart = function(){
            return this.$cart;
        };

        this.getItems = function(){
            return this.getCart().items;
        };

        this.getTotalItems = function () {
            var count = 0;
            var items = this.getItems();
            angular.forEach(items, function (item) {
                count += item.getQuantity();
            });
            return count;
        };

        this.getTotalUniqueItems = function () {
            return this.getCart().items.length;
        };

        this.getSubTotal = function(){
            var total = 0;
            angular.forEach(this.getCart().items, function (item) {
                total += item.getTotal();
            });
            return +parseFloat(total).toFixed(2);
        };

        this.totalCost = function () {
            return +parseFloat(this.getSubTotal() + this.getTax()).toFixed(2);
        };

        this.removeItem = function (index) {
            var item = this.$cart.items.splice(index, 1)[0] || {};
            $rootScope.$broadcast('ngCart:itemRemoved', item);
            $rootScope.$broadcast('ngCart:change', {});


        };

        this.removeItemById = function (id, patentcase) {

            var item;
            var cart = this.getCart();
            angular.forEach(cart.items, function (item, index) {
                if(parseInt(item.getId()) === parseInt(id)) {
                    item = cart.items.splice(index, 1)[0] || {};
                }
            });
            this.setCart(cart);
            $rootScope.$broadcast('ngCart:itemRemoved', item);
            $rootScope.$broadcast('ngCart:change', {});
            if(patentcase !== true) {            
                var modalInstance = $uibModal.open({
                    template: __webpack_require__("./node_modules/html-loader/index.js!./app/global/vendors/ngCart/html/modal.confirm-remove-action.tpl.htm"),
                    appendTo: undefined,
                    controllerAs: '$ctrl',
                    controller: ['$uibModalInstance', function($uibModalInstance) {
                        this.dismissModal = function () {
                            $uibModalInstance.close();
                        };

                    }]
                })
            }

        };

        this.empty = function () {
            
            $rootScope.$broadcast('ngCart:change', {});
            this.$cart.items = [];
            $window.localStorage.removeItem('cart');
        };
        
        this.isEmpty = function () {
            
            return (this.$cart.items.length > 0 ? false : true);
            
        };

        this.toObject = function() {

            if (this.getItems().length === 0) return false;

            var items = [];
            angular.forEach(this.getItems(), function(item){
                items.push (item.toObject());
            });

            return {
                shipping: this.getShipping(),
                tax: this.getTax(),
                taxRate: this.getTaxRate(),
                subTotal: this.getSubTotal(),
                totalCost: this.totalCost(),
                items:items
            }
        };


        this.$restore = function(storedCart){
            var _self = this;
            _self.init();
            _self.$cart.shipping = storedCart.shipping;
            _self.$cart.tax = storedCart.tax;

            angular.forEach(storedCart.items, function (item) {
                _self.$cart.items.push(new ngCartItem(item._id,  item._name, item._price, item._quantity, item._data));
            });
            this.$save();
        };

        this.$save = function () {

            var reduceCart = this.getCart().items.map(function(item){
                if(!item._data.p3sServices) { //logic to prevent error of object loop
                    item._data.p3sServicesWithFees.map(function(prop){                    
                        if(prop.form1200FeeUI) {
                            prop.form1200FeeUI.data = null;
                        }

                        if(prop.renewalFeeUI) {
                            prop.renewalFeeUI.data = null;
                        }

                        if(prop.grantFeeUI) {
                            prop.grantFeeUI.data = null;
                        }

                        if(prop.validationFeeUI) {
                            prop.validationFeeUI.data = null;
                        }                        
                    })

                } 
                return item;
            })
            return store.set('cart', JSON.stringify(reduceCart));
        }

    }])

    .factory('ngCartItem', ['$rootScope', '$log', function ($rootScope, $log) {

        var item = function (id, name, price, quantity, data) {
            this.setId(id);
            this.setName(name);
            this.setPrice(price);
            this.setQuantity(quantity);
            this.setData(data);
        };


        item.prototype.setId = function(id){
            if (id)  this._id = id;
            else {
                $log.error('An ID must be provided');
            }
        };

        item.prototype.getId = function(){
            return this._id;
        };


        item.prototype.setName = function(name){
            if (name)  this._name = name;
            else {
                $log.error('A name must be provided');
            }
        };
        item.prototype.getName = function(){
            return this._name;
        };

        item.prototype.setPrice = function(price){
            var priceFloat = parseFloat(price);
            if (priceFloat) {
                if (priceFloat <= 0) {
                    $log.error('A price must be over 0');
                } else {
                    this._price = (priceFloat);
                }
            } else {
                $log.error('A price must be provided');
            }
        };
        item.prototype.getPrice = function(){
            return this._price;
        };


        item.prototype.setQuantity = function(quantity, relative){


            var quantityInt = parseInt(quantity);
            if (quantityInt % 1 === 0){
                if (relative === true){
                    this._quantity  += quantityInt;
                } else {
                    this._quantity = quantityInt;
                }
                if (this._quantity < 1) this._quantity = 1;

            } else {
                this._quantity = 1;
                $log.info('Quantity must be an integer and was defaulted to 1');
            }


        };

        item.prototype.getQuantity = function(){
            return this._quantity;
        };

        item.prototype.setData = function(data){
            if (data) this._data = data;
        };

        item.prototype.getData = function(){
            if (this._data) return this._data;
            else $log.info('This item has no data');
        };


        item.prototype.getTotal = function(){
            return +parseFloat(this.getQuantity() * this.getPrice()).toFixed(2);
        };

        item.prototype.toObject = function() {
            return {
                id: this.getId(),
                name: this.getName(),
                price: this.getPrice(),
                quantity: this.getQuantity(),
                data: this.getData(),
                total: this.getTotal()
            }
        };

        return item;

    }])

    .service('store', ['$window', function ($window) {

        return {

            get: function (key) {
                if ( $window.localStorage.getItem(key) )  {
                    var cart = angular.fromJson( $window.localStorage.getItem(key) ) ;
                    return JSON.parse(cart);
                }
                return false;

            },


            set: function (key, val) {

                if (val === undefined) {
                    $window.localStorage.removeItem(key);
                } else {
                    $window.localStorage.setItem( key, angular.toJson(val) );
                }
                return $window.localStorage.getItem(key);
            }
        }
    }])

    .controller('CartController',['$scope', 'ngCart', function($scope, ngCart) {

        $scope.ngCart = ngCart;

    }])

    .value('version', '1.0.0').name);


/***/ }),

/***/ "./assets/imgs/icons/pp_icon.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "043ff6a5b9bd165679317dfe537b296d.png";

/***/ }),

/***/ "./assets/imgs/logos/pp-logo-text-black.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "0b4815fa77e5a987aa2be5a52ab74674.png";

/***/ }),

/***/ "./assets/imgs/logos/pp_icon.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "6262a6319e9c9bc242704aae9478366b.png";

/***/ }),

/***/ "./node_modules/empty-module sync js$":
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./index.js": "./node_modules/empty-module/index.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) { // check for number or string
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return id;
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./node_modules/empty-module sync js$";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/case.overview.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div data-ng-show=\"$ctrl.portfolioLoaded\" class=\"animate-show modal-box\">\r\n\t<div class=\"modal-overview d-flex flex-column bg-white\">\r\n\t\t<div class=\"modal-overview__options-panel cursor-pointer d-flex align-items-center\">\r\n\t\t\t<div class=\"options-panel__item\">\r\n\t\t\t\t<button class=\"btn btn-no-bg\" data-ng-click=\"$ctrl.confirmDeletePatent($ctrl.patent)\"  data-ng-disabled=\"!$ctrl.patent.patentDeletable\"><i class=\"fas fa-trash-alt fa-lg action-icon\"></i>\r\n\t\t\t\t</button>\r\n\t\t\t\t<md-tooltip md-delay=\"500\" md-direction=\"bottom\" md-z-index=\"99999\" data-ng-show=\"!$ctrl.patent.patentDeletable\" class=\"font-h4\">\r\n\t\t\t\t\t<div class=\"tooltip-inner text-left\">\r\n\t\t\t\t\t\t<p class=\"font-h4 m-b-xs\">Unable to delete case</p>\r\n\t\t\t\t\t\t<p class=\"font-body\" data-ng-bind=\"$ctrl.patent.patentNotDeletableReason\">\r\n\t\t\t\t\t\t</p>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</md-tooltip>\r\n\t\t\t</div>\r\n\t\t\t<div  class=\"options-panel__item\">\r\n\t\t\t\t<button class=\"btn btn-no-bg\" data-ng-click=\"$ctrl.closeCaseoverview()\"><i class=\"fas fa-times fa-2x action-icon\"></i></button>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div class=\"d-flex flex-grow-1 brbl-10 brtl-10 h100\">\r\n\t\t\t<div class=\"row flex-grow-1\">\r\n\t\t\t\t<div class=\"col-md-12 col-lg-12 col-xl-12 d-flex flex-grow-1 h100\">\r\n\t\t\t\t\t<div class=\"d-flex flex-grow-1\">\r\n\t\t\t\t\t\t<div class=\"width197 brbl-10 brtl-10 bg-light-grey\">\r\n\t\t\t\t\t\t\t<ul class=\"tabs-left nav tabs-left--width197 m-t-lg\">\r\n\t\t\t\t\t\t\t\t<li class=\"nav-item\">\r\n\t\t\t\t\t\t\t\t\t<a class=\"nav-link d-flex flex-column\" data-ng-class=\"{'active': activeLeft === 0 }\" data-ng-click=\"$ctrl.setTab('details'); activeLeft = 0;\">\r\n\t\t\t\t\t\t\t\t\t\t<span><i class=\"fal fa-info-circle font-h3\"></i></span>\r\n\t\t\t\t\t\t\t\t\t\t<span>Details</span>\r\n\t\t\t\t\t\t\t\t\t</a>\r\n\t\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t\t<li class=\"nav-item\">\r\n\t\t\t\t\t\t\t\t\t<a class=\"nav-link d-flex flex-column\" \r\n\t\t\t\t\t\t\t\t\tdata-ng-disabled=\"noReminders\"\r\n\t\t\t\t\t\t\t\t\tdata-ng-class=\"{'disabled': noReminders, 'active': activeLeft === 1 }\" \r\n\t\t\t\t\t\t\t\t\tdata-ng-click=\"$ctrl.processView('reminders', 1); activeLeft = 1;\">\r\n\t\t\t\t\t\t\t\t\t\t<span><i class=\"fal fa-exclamation-circle font-h3\"></i></span>\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t\t\t<span>Reminders</span>\r\n\t\t\t\t\t\t\t\t\t</a>\r\n\t\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t\t<li class=\"nav-item\" data-ng-show=\"$ctrl.displayForm1200Tab\">\r\n\t\t\t\t\t\t\t\t\t<a class=\"nav-link d-flex flex-column\" data-ng-class=\"{'active': activeLeft === 2 }\" data-ng-click=\"$ctrl.setTab('form1200'); activeLeft = 2;\">\r\n\t\t\t\t\t\t\t\t\t\t<span> <i class=\"fal fa-file-alt font-h3\"></i></span>\r\n\t\t\t\t\t\t\t\t\t\t<span>Form 1200</span>\r\n\t\t\t\t\t\t\t\t\t</a>\r\n\t\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t\t<li class=\"nav-item\" data-ng-show=\"$ctrl.displayRenewalHistoryTab\">\r\n\t\t\t\t\t\t\t\t\t<a class=\"nav-link d-flex flex-column\" data-ng-class=\"{'active': activeLeft === 3 }\" data-ng-click=\"$ctrl.setTab('renewalhistory'); activeLeft = 3;\">\r\n\t\t\t\t\t\t\t\t\t\t<span><i class=\"fal fa-usd-circle font-h3\"></i></span>\r\n\t\t\t\t\t\t\t\t\t\t<span>Renewal History</span>\r\n\t\t\t\t\t\t\t\t\t</a>\r\n\t\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t\t<li class=\"nav-item\" data-ng-show=\"$ctrl.displayGrantTab\">\r\n\t\t\t\t\t\t\t\t\t<a class=\"nav-link d-flex flex-column\" data-ng-class=\"{'active': activeLeft === 4 }\" data-ng-click=\"$ctrl.setTab('grantandpublishing');  activeLeft = 4;\">\r\n\t\t\t\t\t\t\t\t\t\t<span> <i class=\"fal fa-file-alt font-h3\"></i></span>\r\n\t\t\t\t\t\t\t\t\t\t<span>Grant & Publishing</span>\r\n\t\t\t\t\t\t\t\t\t</a>\r\n\t\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t\t<li class=\"nav-item\" data-ng-show=\"$ctrl.displayValidationTab\">\r\n\t\t\t\t\t\t\t\t\t<a class=\"nav-link d-flex flex-column\" data-ng-class=\"{'active': activeLeft === 8 }\" data-ng-click=\"$ctrl.setTab('validation');  activeLeft = 8;\">\r\n\t\t\t\t\t\t\t\t\t\t<span> <i class=\"fal fa-file-alt font-h3\"></i></span>\r\n\t\t\t\t\t\t\t\t\t\t<span>Validation</span>\r\n\t\t\t\t\t\t\t\t\t</a>\r\n\t\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t\t<li class=\"nav-item\">\r\n\t\t\t\t\t\t\t\t\t<a \r\n\t\t\t\t\t\t\t\t\tclass=\"nav-link d-flex flex-column\" \r\n\t\t\t\t\t\t\t\t\tdata-ng-disabled=\"notInProgress\" \r\n\t\t\t\t\t\t\t\t\tdata-ng-class=\"{'disabled': notInProgress, 'active': activeLeft ===  5};\" \r\n\t\t\t\t\t\t\t\t\tdata-ng-click=\"$ctrl.processView('feebreakdown', 5); activeLeft = 5;\" >\r\n\t\t\t\t\t\t\t\t\t\t<span><i class=\"fal fa-usd-circle font-h3\"></i></span>\r\n\t\t\t\t\t\t\t\t\t\t<span>Fee Breakdown</span>\r\n\t\t\t\t\t\t\t\t\t</a>\r\n\t\t\t\t\t\t            <md-tooltip md-delay=\"500\" md-direction=\"right\" md-z-index=\"99999\" data-ng-show=\"notInProgress\" class=\"font-h4\">\r\n\t\t\t\t\t\t              \tThis tab provides no information due the current status(es) of the European action(s).<br> Please check again once there is any progress with the application.\r\n\t\t\t\t\t\t            </md-tooltip>\r\n\t\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t\t<li class=\"nav-item\">\r\n\t\t\t\t\t\t\t\t\t<a \r\n\t\t\t\t\t\t\t\t\tclass=\"nav-link d-flex flex-column\" \r\n\t\t\t\t\t\t\t\t\tdata-ng-disabled=\"notInProgress\" \r\n\t\t\t\t\t\t\t\t\tdata-ng-class=\"{'disabled': notInProgress, 'active': activeLeft ===  6};\" \r\n\t\t\t\t\t\t\t\t\tdata-ng-click=\"$ctrl.processView('fxchart', 6, 'chart'); activeLeft = 6;\">\r\n\t\t\t\t\t\t\t\t\t\t<span><i class=\"fal fa-chart-line font-h3\"></i></span>\r\n\t\t\t\t\t\t\t\t\t\t<span>FX Chart</span>\r\n\t\t\t\t\t\t\t\t\t</a>\r\n\t\t\t\t\t\t            <md-tooltip md-delay=\"500\" md-direction=\"right\" md-z-index=\"99999\" data-ng-show=\"notInProgress\" class=\"font-h4\">\r\n\t\t\t\t\t\t              \tThis tab provides no information due the current status(es) of the European action(s).<br> Please check again once there is any progress with the application.\r\n\t\t\t\t\t\t            </md-tooltip>\r\n\t\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t\t<li class=\"nav-item\">\r\n\t\t\t\t\t\t\t\t\t<a \r\n\t\t\t\t\t\t\t\t\tclass=\"nav-link d-flex flex-column\" \r\n\t\t\t\t\t\t\t\t\tdata-ng-disabled=\"notInProgress\" \r\n\t\t\t\t\t\t\t\t\tdata-ng-class=\"{'disabled': notInProgress,'active': activeLeft ===  7}\" \r\n\t\t\t\t\t\t\t\t\tdata-ng-click=\"$ctrl.processView('costchart', 7, 'chart'); activeLeft = 7;\">\r\n\t\t\t\t\t\t\t\t\t\t<span> <i class=\"fal fa-chart-bar font-h3\"></i> </span>\r\n\t\t\t\t\t\t\t\t\t\t<span>Cost Chart</span>\r\n\t\t\t\t\t\t\t\t\t</a>\r\n\t\t\t\t\t\t            <md-tooltip md-delay=\"500\" md-direction=\"right\" md-z-index=\"99999\" data-ng-show=\"notInProgress\" class=\"font-h4\">\r\n\t\t\t\t\t\t              \tThis tab provides no information due the current status(es) of the European action(s).<br> Please check again once there is any progress with the application.\r\n\t\t\t\t\t\t            </md-tooltip>\t\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t</li>\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t</ul>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t<div class=\"d-flex flex-column flex-grow-1 modal-overview__view\">\r\n\t\t\t\t\t\t\t<div class=\" p-t-4 p-r-3 p-l-3 \">\r\n\t\t\t\t\t\t\t\t<div class=\"row\">\r\n\t\t\t\t\t\t\t\t\t<div class=\"col-md-6 col-xl-6 d-flex flex-column \" data-ng-class=\"$ctrl.actionsAvailable == true ? 'justify-content-between' : 'justify-content-center'\">\r\n\t\t\t\t\t\t\t\t\t\t<p class=\"font-h3 font-weight-bold\">Application Number: <span class=\"font-weight-normal\">{{$ctrl.patent.ep_ApplicationNumber}}</span></p>\r\n\t\t\t\t\t\t\t\t\t\t<div data-ng-show=\"$ctrl.actionsAvailable\" class=\"d-flex m-t-sm\">\r\n\t\t\t\t\t\t\t\t\t\t\t<p class=\"font-weight-bold m-r-xs\">Formality Actions Available</p>\r\n\t\t\t                                <button class=\"btn btn-no-bg\" data-ng-click=\"formalityAction = !formalityAction\" data-ng-hide=\"!formalityAction\">\r\n\t\t\t                                \t<i class=\"fas fa-minus-circle txt-phase-green cursor-pointer fa-lg\" ></i>\r\n\t\t\t                                </button>\r\n\t\t\t                                <button class=\"btn btn-no-bg\" data-ng-click=\"formalityAction = !formalityAction\" data-ng-show=\"!formalityAction\">\r\n\t\t\t                                \t<i class=\"fas fa-plus-circle txt-phase-green cursor-pointer fa-lg\" ></i>\r\n\t\t\t                                </button>\r\n\t\t\t                            </div>\t\t\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t<div class=\"col-md-6 col-xl-6 text-right\">\r\n\t\t\t\t\t\t\t\t    \t<md-menu>\r\n\t\t\t\t\t\t\t\t      \t\t<button class=\"btn btn--lg btn--bordered grey pill-radius txt-white\" data-ng-click=\"$ctrl.openSupportMenu($mdMenu, $event);\">\r\n\t\t\t\t\t\t\t\t        \t\t<span class=\"icon-text\">Request support</span> \r\n\t\t\t\t\t\t\t\t      \t\t</button>\r\n\t\t\t\t\t\t\t\t      \t\t<md-menu-content width=\"4\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"md-menu-close-container\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t<button class=\"btn btn-no-bg\" data-ng-click=\"$mdMenu.close()\"><i class=\"fas fa-times fa-lg\"></i></button>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"spacer\"></div>\r\n\t\t\t\t\t\t\t\t\t        \t<md-list data-ng-show=\"$ctrl.multipleFormalities\">\r\n\t\t\t\t\t\t\t\t\t        \t\t<md-list-item class=\"border-grey-xs--btm\">\r\n\t\t\t\t\t\t\t\t\t        \t\t\t<p>Which formality is your enquiry related to?</p>\r\n\t\t\t\t\t\t\t\t\t        \t\t</md-list-item>\r\n\t\t\t\t\t\t\t\t\t\t\t        <md-list-item>\r\n\t\t\t\t\t\t\t\t\t\t\t        \t<button class=\"btn btn-md-list\" data-ng-click=\"$ctrl.selectMultiFormality('renewal');\" md-prevent-menu-close=\"md-prevent-menu-close\">Renewal</button>\r\n\t\t\t\t\t\t\t\t\t\t\t        </md-list-item>\r\n\t\t\t\t\t\t\t\t\t\t\t        <md-list-item>\r\n\t\t\t\t\t\t\t\t\t\t\t        \t<button class=\"btn btn-md-list\" data-ng-click=\"$ctrl.selectMultiFormality('grant');\" md-prevent-menu-close=\"md-prevent-menu-close\">Grant</button>\r\n\t\t\t\t\t\t\t\t\t\t\t        </md-list-item>\t\t\t\t\t\t\t\t        \t\t\r\n\t\t\t\t\t\t\t\t\t        \t</md-list>\t\t\t\t\t\t\t      \t\t\t\r\n\t\t\t\t\t\t\t\t\t        \t<md-list data-ng-show=\"$ctrl.displaySupportTypes\">\r\n\t\t\t\t\t\t\t\t\t        \t\t<md-list-item class=\"border-grey-xs--btm text-center\">\r\n\t\t\t\t\t\t\t\t\t        \t\t\t<p>Select a category for your enquiry</p>\r\n\t\t\t\t\t\t\t\t\t        \t\t</md-list-item>\t\t\t\t\t\t\t\t\t        \t\t\r\n\t\t\t\t\t\t\t\t\t        \t\t<md-list-item data-ng-repeat=\"type in $ctrl.supportType\" class=\"font-body\">\r\n\t\t\t\t\t\t\t\t\t        \t\t\t<button class=\"btn btn-md-list\" data-ng-click=\"$ctrl.selectSupportType(type)\">{{type}}</button>\r\n\t\t\t\t\t\t\t\t\t        \t\t\t\r\n\t\t\t\t\t\t\t\t\t        \t\t</md-list-item>\r\n\t\t\t\t\t\t\t\t\t        \t</md-list>\r\n\t\t\t\t\t\t\t\t\t      \t</md-menu-content>\t\r\n\t\t\t\t\t\t\t\t    \t</md-menu>\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t        <div class=\"col-md-12\">\r\n\t\t\t\t\t\t\t        \t<div class=\"border-grey-xs--btm m-t-sm m-b-sm\"></div>\r\n\t\t\t\t\t\t\t        </div>\r\n\t\t\t\t\t\t        </div>\r\n\t\t\t\t\t\t\t\t<div class=\"row\" data-ng-show=\"$ctrl.actionsAvailable\">\r\n\t\t\t\t\t\t\t\t\t<div class=\"col-md-12 col-xl-12\">\r\n\t\t\t                            <div class=\"expandcollapse-item\" data-ng-init=\"formalityAction = true\">\r\n\t\t\t                                <div class=\"slideDown m-b-sm\" data-ng-hide=\"formalityAction === false\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t<div data-ng-init=\"$ctrl.checkAvailableAction($ctrl.patent.p3sServicesWithFees)\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t                \t\t<div data-ng-repeat=\"item in $ctrl.patent.p3sServicesWithFees track by $index\" class=\"formality-tile m-r-sm\" data-ng-class=\"{'d-none' : item.saleType == 'Not In Progress'}\" >\r\n\t\t\t\t\t\t\t                \t\t\t\r\n\t\t\t\t\t\t\t\t\t\t\t               \t<p class=\"font-body text-capitalize\" data-ng-if=\"item.saleType == 'Online' || item.saleType == 'Offline' || item.saleType == 'In Progress'\"><span class=\"font-weight-bold m-r-xs\">Formality:</span> {{item.serviceType}}</p>\r\n\r\n\t\t\t\t\t\t\t\t\t\t\t               \t<p><span class=\"font-weight-bold m-r-xs\">Support:</span> <span data-ng-if=\"item.supportRequestedBy !== null\" class=\"txt-phase-green\">Requested</span><span data-ng-if=\"item.supportRequestedBy == null\">N/A</span></p>\r\n\r\n\t\t\t\t\t\t\t\t\t\t\t                \r\n\t\t\t\t\t\t\t\t\t\t\t                \t<span class=\"font-body font-weight-bold m-r-xs\">Action:</span>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t            <transaction-link trans-id=\"{{$ctrl.patent.patentID}}\" trans-servicetype=\"{{item.serviceType}}\" data-ng-if=\"item.saleType == 'In Progress' && item.serviceStatus !== 'Preparing quote'\" class=\"directive-btn underlined\"></transaction-link>\r\n\t\t\t\t\t                                            <a data-ng-if=\"item.saleType == 'Online' && item.serviceStatus === 'Grant available'\" class=\"btn btn--bordered btn-underlined txt-phase-green\" data-ng-click=\"$ctrl.setTab('grantandpublishing');  activeLeft = 4;\">Prepare Grant\r\n\t\t\t\t\t                                            </a>\r\n\t\t\t\t\t                                            <a data-ng-if=\"item.saleType == 'Online' && item.serviceStatus === 'Validation available'\" class=\"btn btn--bordered btn-underlined txt-phase-green\" data-ng-click=\"$ctrl.setTab('validation');  activeLeft = 4;\">Select validation states\r\n\t\t\t\t\t                                            </a>                                            \r\n\t\t\t\t\t                                            <a data-ng-if=\"item.saleType == 'Online' && (item.serviceStatus === 'Epct available' || item.serviceStatus === 'Epct rejected')\" class=\"btn btn--bordered btn-underlined txt-phase-green\" data-ng-click=\"$ctrl.setTab('form1200'); activeLeft = 2;\">Initiate Form 1200</a>\r\n\t\t\t\t\t                                            <p data-ng-if=\"item.serviceStatus == 'Epct being generated'\" class=\"btn btn--bordered btn-underlined txt-phase-green\">{{item.serviceStatusUI}}</p>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t            <ngcart-addtocart id=\"{{item.actionID}}\" class=\"directive-btn underlined cartbtn\" name=\"epct\" price=\"{{item.currentStageCostUSD}}\" quantity=\"1\" quantity-max=\"10\" data=\"$ctrl.patent\" data-ng-if=\"item.saleType == 'Online' && item.serviceStatus == 'Epct saved'\"></ngcart-addtocart>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t            <ngcart-addtocart id=\"{{item.actionID}}\" class=\"directive-btn underlined cartbtn\" name=\"renewal\" price=\"{{item.currentStageCostUSD}}\" quantity=\"1\" quantity-max=\"10\" data=\"$ctrl.patent\" data-ng-if=\"item.saleType == 'Online' && item.serviceStatus == 'Show price'\"></ngcart-addtocart>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t            <ngcart-addtocart id=\"{{item.actionID}}\" class=\"directive-btn underlined cartbtn\" name=\"grant\" price=\"{{item.currentStageCostUSD}}\" quantity=\"1\" quantity-max=\"10\" data=\"$ctrl.patent\" data-ng-if=\"item.saleType == 'Online' && item.serviceStatus == 'Grant saved'\"></ngcart-addtocart>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t            <ngcart-addtocart id=\"{{item.actionID}}\" class=\"directive-btn underlined cartbtn\" name=\"validation\" price=\"{{item.currentStageCostUSD}}\" quantity=\"1\" quantity-max=\"10\" data=\"$ctrl.patent\" data-ng-if=\"item.saleType == 'Online' && item.serviceStatus == 'Quote provided'\"></ngcart-addtocart>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t            <div data-ng-if=\"item.saleType == 'Offline'\" class=\"d-inline\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t            \t<p class=\"font-weight-medium font-body m-r-xs d-inline\" data-ng-class=\"item.isUrgentAttention ? 'txt-phase-red' : 'txt-phase-green'\" >Call {{phoneNumber}}</p>\r\n\t\t\t\t\t\t\t                                        <div class=\"d-inline\">                            \r\n\t\t\t\t\t\t\t                                            <i class=\"fas fa-question-circle txt-phase-green cursor-pointer fa-lg\">\r\n\t\t\t\t\t\t\t                                            </i>\t\t\t                                            \r\n\t\t\t\t\t\t\t                                            <md-tooltip md-delay=\"200\" class=\"mdtooltip-md\" md-direction=\"bottom\" md-z-index=\"99999\" data-ng-if=\"item.isUrgentAttention\">\r\n\t\t\t\t\t\t\t                                                <p class=\"font-body\">\r\n\t\t\t\t\t                    \t\t\t\t\t\t\t\t\t\tThis formality's deadline is too close for it to be processed online. Call our patent administrator on {{phoneNumber}} who will attempt to process it manually before the deadline hits\r\n\t\t\t\t\t\t\t                                                </p>\r\n\t\t\t\t\t\t\t                                            </md-tooltip>  \r\n\t\t\t\t\t\t\t                                            <md-tooltip md-delay=\"200\" class=\"mdtooltip-md\" md-direction=\"bottom\" md-z-index=\"99999\" data-ng-if=\"!item.isUrgentAttention && item.saleType == 'Offline'\">\r\n\t\t\t\t\t\t\t                                                <p class=\"font-body\">\r\n\t\t\t\t\t\t\t                                                    This formality can only be processed manually offline. To find out more details as to why, please select the appropriate formality tab on the left\r\n\t\t\t\t\t\t\t                                                </p>\r\n\t\t\t\t\t\t\t                                            </md-tooltip>  \t\t\t                                            \r\n\t\t\t\t\t\t\t                                        </div>\t\t\t\t\t\t\t\t\t            \t\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t            </div>\r\n\t\t\t\t\t\t\t\t\t\t\t              \r\n\t\t\t\t\t\t\t                \t\t\t</div>\r\n\t\t\t\t\t\t\t                \t\t\t\r\n\t\t\t\t\t\t                \t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"border-grey-xs--btm m-t-sm m-b-sm\"></div>\r\n\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t</div>\r\n\t                                </div>                                \r\n\t\t\t\t\t\t\t\t</div>\r\n\r\n\t\t\t\t\t\t\t</div>\r\n\r\n\t\t\t\t\t\t\t<div class=\"p-r-3 p-b-3 p-l-3 modal-overview__view__body brbr-10\">\r\n\r\n\t\t\t\t\t\t\t\t\t\t<div ui-view=\"details\" class=\"d-flex flex-column flex-grow-1\" data-ng-show=\"caseoverview_tab == 'details'\"></div>\r\n\t\t\t\t\t\t\t\t\t\t<div ui-view=\"reminders\" class=\"d-flex flex-column flex-grow-1\" data-ng-show=\"caseoverview_tab == 'reminders'\"></div>\r\n\t\t\t\t\t\t\t\t\t\t<div ui-view=\"form1200\" class=\"d-flex flex-column flex-grow-1\" data-ng-show=\"caseoverview_tab == 'form1200'\"></div>\r\n\t\t\t\t\t\t\t\t\t\t<div ui-view=\"renewalhistory\" class=\"d-flex flex-column flex-grow-1\" data-ng-show=\"caseoverview_tab == 'renewalhistory'\"></div>\r\n\t\t\t\t\t\t\t\t\t\t<div ui-view=\"grantandpublishing\" class=\"d-flex flex-column flex-grow-1\" data-ng-show=\"caseoverview_tab == 'grantandpublishing'\"></div>\r\n\t\t\t\t\t\t\t\t\t\t<div ui-view=\"validation\" class=\"d-flex flex-column flex-grow-1\" data-ng-show=\"caseoverview_tab == 'validation'\"></div>\r\n\t\t\t\t\t\t\t\t\t\t<div ui-view=\"fee-breakdown\" class=\"d-flex flex-column flex-grow-1\" data-ng-show=\"caseoverview_tab == 'feebreakdown'\"></div>\r\n\t\t\t\t\t\t\t\t\t\t<div ui-view=\"fxchart\" class=\"d-flex flex-column flex-grow-1\" data-ng-show=\"caseoverview_tab == 'fxchart'\"></div>\r\n\t\t\t\t\t\t\t\t\t\t<div ui-view=\"costchart\" class=\"d-flex flex-column flex-grow-1\" data-ng-show=\"caseoverview_tab == 'costchart'\"></div>\r\n\t\r\n\t\t\t\t\t\t\t</div>\t\t\t\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\t\t\t\r\n\t\t\t\t</div>\t\t\t\t\t\r\n\t\t\t</div>\r\n\t\t</div>\r\n<!-- \t\t<div class=\"row m-t-md\">\r\n\t\t\t<div class=\"col-xl-12 text-left\">\r\n\t\t\t\t<input type=\"button\" id=\"delete\" class=\"btn btn--lg btn--red pill-radius\" value=\"Remove patent\" data-ng-click=\"$ctrl.confirmDeletePatent($ctrl.patent.patentID)\">\r\n\t\t\t</div>\r\n\t\t</div> -->\r\n\t</div>\r\n</div>\r\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/costchart/costchart.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"row m-b-sm\"> <!-- add if condition to check data-ng-if application has been saved-->\n    <div class=\"col-xl-12\">\n        <p>Select an action from the drop-down menu below</p>\n    </div>\n</div>\n<div class=\"row\">\n    <div class=\"col-xl-12 text-xs-left\">                           \n        <div data-ng-if=\"$ctrl.barData !== null\">\n            <div class=\"row\">\n                <div class=\"col-xl-12\">\n                    <div class=\"form-inline\">\n                        <div class=\"form-group\">                      \n                            <label class=\"font-h4 font-weight-bold text-uppercase m-r-sm\">Display chart data for: </label>\n                            <select name=\"actions\" id=\"actions\" class=\"form-control text-capitalize\" data-ng-model=\"$ctrl.data.selectedAction\" data-ng-options=\"option.action for option in $ctrl.data.availableAction track by option.id\" data-ng-change=\"$ctrl.setData($ctrl.data.selectedAction.action)\"></select>\n                        </div>        \n                    </div>   \n                </div>\n            </div>                       \n            <nvd3 options=\"$ctrl.barOptions\" data=\"$ctrl.barData\" class=\"with-transitions\"></nvd3>\n        </div>\n    </div>\n</div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/details/case-details.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"col-md-12\">\n\t<div class=\"row\">\n\t\t<form class=\"form d-flex flex-grow-1\" name=\"patentInfoForm\" novalidate>\n\t\t\t<div class=\"d-flex flex-grow-1 flex-column\">\n\t\t\t\t<div class=\"row flex-grow-1\">\n\t\t\t\t\t<div class=\"col-xl-12 col-cxl-12\">\n\t\t\t\t\t\t<div class=\"m-b-lg\">\n\t\t\t\t\t\t\t<div class=\"form-group row\">\n\t\t\t\t\t\t\t\t<label class=\"font-weight-medium col-xl-4 d-flex align-items-center m-b-md-xs lg-m-b-xs\">Client Reference: </label>\n\t\t\t\t\t\t\t\t<div class=\"col-xl-8\">\n\t\t\t\t\t\t\t\t\t<div class=\"icon-field\">\n\t\t\t\t\t\t\t\t\t\t<input type=\"text\" class=\"form-control m-r-sm\" name=\"clientRef\" id=\"clientRef\" data-ng-model=\"$ctrl.patent.clientRef\" data-ng-maxlength=\"15\">\n\t\t\t\t\t\t\t\t\t\t<i class=\"far fa-pencil fa-2x icon\"></i>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t        \t\t<p class=\"txt-phase-red m-t-xs\" data-ng-show=\"patentInfoForm.clientRef.$error.maxlength && patentInfoForm.clientRef.$dirty\">A maximum of 15 characters is allowed for a Client Reference</p>\n\n\t\t\t\t        \t\t</div>\t\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"form-group row\">\n\t\t\t\t\t\t\t\t<label class=\"font-weight-medium col-xl-4 d-flex align-items-center m-b-md-xs lg-m-b-xs\">Client Desc: </label>\n\t\t\t\t\t\t\t\t<div class=\"col-xl-8\">\n\t\t\t\t\t\t\t\t\t<div class=\"icon-field\">\n\t\t\t\t\t\t\t\t    \t<input type=\"text\" class=\"form-control m-r-sm\" name=\"shortTitle\" id=\"shortTitle\" data-ng-model=\"$ctrl.patent.shortTitle\" data-ng-maxlength=\"25\">\n\t\t\t\t\t\t\t\t    \t<i class=\"far fa-pencil fa-2x icon\"></i>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t        \t\t<p class=\"txt-phase-red m-t-xs\" data-ng-show=\"patentInfoForm.shortTitle.$error.maxlength && patentInfoForm.shortTitle.$dirty\">A maximum of 25 characters is allowed for a Client Description</p>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"form-group row\">\n\t\t\t\t\t\t\t\t<label class=\"font-weight-medium col-xl-4 d-flex align-items-center m-b-md-xs lg-m-b-xs\">Applicant Name: </label>\n\t\t\t\t\t\t\t\t<div class=\"col-xl-8\">\n\t\t\t\t\t        \t\t<input type=\"text\" class=\"form-control\" data-ng-model=\"$ctrl.patent.primaryApplicantName\" readonly>\n\t\t\t\t\t        \t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"form-group row\">\n\t\t\t\t\t\t\t\t<label class=\"font-weight-medium col-xl-4 d-flex align-items-center m-b-md-xs lg-m-b-xs\">Publication No: </label>\n\t\t\t\t\t\t\t\t<div class=\"col-xl-8\">\n\t\t\t\t\t\t        \t<input type=\"text\" class=\"form-control\" data-ng-model=\"$ctrl.patent.ep_PublicationNumber\" readonly>\n\t\t\t\t\t\t        </div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"form-group row\">\n\t\t\t\t\t\t\t\t<label class=\"font-weight-medium col-xl-4 d-flex align-items-center m-b-md-xs lg-m-b-xs\">Title: </label>\n\t\t\t\t\t\t\t\t<div class=\"col-xl-8\">\n\t\t\t\t\t\t        \t<input type=\"text\" class=\"form-control\" data-ng-model=\"$ctrl.patent.title\" readonly>\n\t\t\t\t\t\t        </div>\n\t\t\t\t\t\t\t</div>\t\n\t\t\t\t\t\t\t<div class=\"form-group row\">\n\t\t\t\t\t\t\t\t<label class=\"font-weight-medium col-xl-4 d-flex align-items-center m-b-md-xs lg-m-b-xs\">International Filing date: </label>\n\t\t\t\t\t\t\t\t<div class=\"col-xl-8\">\n\t\t\t\t\t\t        \t<input type=\"text\" class=\"form-control\" data-ng-model=\"$ctrl.patent.internationalFilingDateUI\" readonly>\n\t\t\t\t\t\t        </div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"form-group row\">\n\t\t\t\t\t\t\t\t<label class=\"font-weight-medium col-xl-4 d-flex align-items-center m-b-md-xs lg-m-b-xs\">Priority date: </label>\n\t\t\t\t\t\t\t\t<div class=\"col-xl-8\">\n\t\t\t\t\t\t        \t<input type=\"text\" class=\"form-control\" data-ng-model=\"$ctrl.patent.priorityDateUI\" readonly>\n\t\t\t\t\t\t        </div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"form-group row\">\n\t\t\t\t\t\t\t\t<label class=\"font-weight-medium col-xl-4 d-flex align-items-center m-b-md-xs lg-m-b-xs\">EPO Status: </label>\n\t\t\t\t\t\t\t\t<div class=\"col-xl-8\">\n\t\t\t\t\t\t        \t<input type=\"text\" class=\"form-control\" data-ng-model=\"$ctrl.patent.epoPatentStatus\" readonly>\n\t\t\t\t\t\t        </div>\n\t\t\t\t\t\t\t</div>\t\t\t\t\t\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-xl-12 text-right\">\n\t\t\t\t\t\t<input type=\"submit\" id=\"submit\" class=\"btn btn--lg btn--green pill-radius\" value=\"Save\" data-ng-click=\"$ctrl.updatePatent($ctrl.patent)\">\n\t\t\t\t\t</div>\n\t\t\t\t</div>\t\t\n\t\t\t</div>\n\t\t</form>\n\t</div>\n</div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/europct/europct.form1200.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"row m-b-sm\" data-ng-if=\"$ctrl.pendingAssisted && $ctrl.assistedAvailable\">\n    <div class=\"col-xl-12\">\n        <div class=\"m-b-xs offline-processing-panel\">\n            <div class=\"row\">\n                <div class=\"col-md-2 d-flex justify-content-center align-items-center\">\n                    <i class=\"fas fa-exclamation-circle fa-4x txt-phase-amber\"></i>\n                </div>\n                <div class=\"col-md-10\">\n                    <p class=\"m-b-xs font-h4 font-weight-bold\">Assisted formality filing requested</p>\n                    <p>Unless our IP professional has instructed you to do so, please do not carry out any actions on this formality. You have requested assisted formality filing, so editing or deleting any information may cause issues with your filing.</p>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n<div data-ng-if=\"$ctrl.epctStage == 1\" data-ng-class=\"fade-in\" class=\"d-flex flex-grow-1\">\n    <div class=\"row flex-grow-1\">\n        <div class=\"d-flex col-md-12 col-xl-12\">\n            <div class=\"m-b-sm d-flex flex-column flex-grow-1\" dynamic=\"$ctrl.form1200Template\">\n            </div>\n        </div>\n    </div>\n</div>\n\n<div data-ng-if=\"$ctrl.epctStage == 2\" data-ng-class=\"fade-in\" class=\"d-flex flex-grow-1\" data-ng-controller=\"Form1200GeneratedController\">\n    <div class=\"row flex-grow-1\">\n        <div class=\"d-flex col-md-12 col-xl-12\">\n            <div class=\"m-b-sm d-flex flex-grow-1\" dynamic=\"$ctrl.form1200Template\">\n            </div>\n        </div>\n    </div>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/feebreakdown/fee-breakdown.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"row m-b-sm\">\n    <div class=\"col-xl-12\">\n        <p>Select an action from the drop-down menu below</p>\n    </div>\n</div>\n<div class=\"row m-b-sm\">\n    <div class=\"col-xl-12\">\n        <div class=\"form-inline\">\n            <div class=\"form-group\">                      \n                <label class=\"font-h4 font-weight-bold text-uppercase m-r-sm\">Display fees for: </label>\n                <select name=\"actions\" id=\"actions\" class=\"form-control text-capitalize\" data-ng-model=\"$ctrl.data.selectedAction\" data-ng-options=\"option.action for option in $ctrl.data.availableAction track by option.id\" data-ng-change=\"$ctrl.setFees($ctrl.data.selectedAction.action)\">\n                </select>\n            </div>\n        </div>\n    </div>\n</div>\n<div>\n    <div class=\"row\">\n        <div class=\"col-xl-12 text-right\">\n            <p class=\"font-h4\">1 USD = {{$ctrl.availableFees.official[0].feeUI.fxRate || $ctrl.availableFees.official.feeUI.fxRate}} EUR</p>\n        </div>  \n    </div>\n    <div class=\"m-t-md\">\n        <div class=\"row\">\n            <div class=\"offset-xl-5 col-xl-4\">\n                <p class=\"font-h4 font-weight-bold m-b-xs text-left\">USD</p>\n            </div>\n            <div class=\"col-md-3 col-xl-3\">\n                <p class=\"font-h4 font-weight-bold m-b-xs text-left\">EUR</p>\n            </div>\n        </div>\n        <div class=\"m-b-sm border-grey-xs--btm\"></div>                  \n        <div class=\"row m-b-sm\">\n            <div class=\"col-md-5 col-xl-5\">\n                <p class=\"font-weight-medium font-h4\">Official Fee:\n                    <button class=\"btn btn-no-bg accordion-caret\" data-ng-class=\"{'active': !panelActive}\" data-ng-click=\"panelActive = !panelActive\">\n                        <i class=\"fas fa-lg fa-caret-right\"></i>\n                    </button>\n                </p>\n            </div>\n            <div class=\"col-md-4 col-xl-4\">\n                <p class=\"text-left font-h4\">$ {{($ctrl.availableFees.official[0].feeUI.currentOfficialFeeUSD || $ctrl.availableFees.official.currentOfficialFeeUSD | number: 2) || '0.00'}}</p>\n            </div>\n            <div class=\"col-md-3 col-xl-3\">\n                <p class=\"text-left font-h4\">&euro; {{($ctrl.availableFees.official[0].feeUI.currentOfficialFeeEUR || $ctrl.availableFees.official.currentOfficialFeeEUR | number: 2) || '0.00'}}</p>\n            </div>\n            <div class=\"col-md-12 col-xl-12\">\n                <div class=\"expandcollapse-item\">\n                    <div class=\"slideDown m-t-sm\" data-ng-init=\"panelActive = true\" data-ng-hide=\"panelActive\">\n                        <div data-ng-if=\"$ctrl.displayForm1200\">\n                            <div class=\"row m-b-sm\">\n                                <div class=\"col-md-5 col-xl-5\">\n                                    <p class=\"font-weight-medium m-l-sm\">Designation fee:</p>\n                                </div>\n                                <div class=\"col-md-4 col-xl-4\">\n                                    <p class=\"text-left font-body\">$ {{($ctrl.availableFees.official[0].feeUI.designationFeeUSD | number: 2) || '0.00'}}</p>\n                                </div>\n                                <div class=\"col-md-3 col-xl-3\">\n                                    <p class=\"text-left font-body\">&euro; {{($ctrl.availableFees.official[0].feeUI.designationFeeEUR | number: 2) || '0.00'}}</p>\n                                </div>                                                                                        \n                            </div>\n                            <div class=\"row m-b-sm\">\n                                <div class=\"col-md-5 col-xl-5\">\n                                    <p class=\"font-weight-medium m-l-sm\">Examination fee:</p>\n                                </div>\n                                <div class=\"col-md-4 col-xl-4\">\n                                    <p class=\"text-left font-body\">$ {{($ctrl.availableFees.official[0].feeUI.examinationFeeUSD | number: 2) || '0.00'}}</p>\n                                </div>\n                                <div class=\"col-md-3 col-xl-3\">\n                                    <p class=\"text-left font-body\">&euro; {{($ctrl.availableFees.official[0].feeUI.examinationFeeEUR | number: 2) || '0.00'}}</p>\n                                </div>                                                                                        \n                            </div>\n                            <div class=\"row m-b-sm\">\n                                <div class=\"col-md-5 col-xl-5\">\n                                    <p class=\"font-weight-medium m-l-sm\">Excess Page fee:</p>\n                                </div>\n                                <div class=\"col-md-4 col-xl-4\">\n                                    <p class=\"text-left font-body\">$ {{($ctrl.availableFees.official[0].feeUI.excessPageFeeUSD | number: 2) || '0.00'}}</p>\n                                </div>\n                                <div class=\"col-md-3 col-xl-3\">\n                                    <p class=\"text-left font-body\">&euro; {{($ctrl.availableFees.official[0].feeUI.excessPageFeeEUR | number: 2) || '0.00'}}</p>\n                                </div>                                                                                        \n                            </div>\n                            <div class=\"row m-b-sm\">\n                                <div class=\"col-md-5 col-xl-5\">\n                                    <p class=\"font-weight-medium m-l-sm\">Filing fee:</p>\n                                </div>\n                                <div class=\"col-md-4 col-xl-4\">\n                                    <p class=\"text-left font-body\">$ {{($ctrl.availableFees.official[0].feeUI.filingFeeUSD | number: 2) || '0.00'}}</p>\n                                </div>\n                                <div class=\"col-md-3 col-xl-3\">\n                                    <p class=\"text-left font-body\">&euro; {{($ctrl.availableFees.official[0].feeUI.filingFeeEUR | number: 2) || '0.00'}}</p>\n                                </div>                                                                                        \n                            </div>\n                            <div class=\"row m-b-sm\">\n                                <div class=\"col-md-5 col-xl-5\">\n                                    <p class=\"font-weight-medium m-l-sm\">Supplmentary Search fee:</p>\n                                </div>\n                                <div class=\"col-md-4 col-xl-4\">\n                                    <p class=\"text-left font-body\">$ {{($ctrl.availableFees.official[0].feeUI.supplementarySearchFeeUSD | number: 2) || '0.00'}}</p>\n                                </div>\n                                <div class=\"col-md-3 col-xl-3\">\n                                    <p class=\"text-left font-body\">&euro; {{($ctrl.availableFees.official[0].feeUI.supplementarySearchFeeEUR | number: 2) || '0.00'}}</p>\n                                </div>                                                                                        \n                            </div>\n                            <div class=\"row m-b-sm\">\n                                <div class=\"col-md-5 col-xl-5\">\n                                    <p class=\"font-weight-medium m-l-sm\">Validation State fee:</p>\n                                </div>\n                                <div class=\"col-md-4 col-xl-4\">\n                                    <p class=\"text-left font-body\">$ {{($ctrl.availableFees.official[0].feeUI.validationFeeUSD | number: 2) || '0.00'}}</p>\n                                </div>\n                                <div class=\"col-md-3 col-xl-3\">\n                                    <p class=\"text-left font-body\">&euro; {{($ctrl.availableFees.official[0].feeUI.validationFeeEUR | number: 2) || '0.00'}}</p>\n                                </div>                                                                                        \n                            </div>\n                            <div class=\"row m-b-sm\">\n                                <div class=\"col-md-5 col-xl-5\">\n                                    <p class=\"font-weight-medium m-l-sm\">Extension State fee:</p>\n                                </div>\n                                <div class=\"col-md-4 col-xl-4\">\n                                    <p class=\"text-left font-body\">$ {{($ctrl.availableFees.official[0].feeUI.extensionFeeUSD | number: 2) || '0.00'}}</p>\n                                </div>\n                                <div class=\"col-md-3 col-xl-3\">\n                                    <p class=\"text-left font-body\">&euro; {{($ctrl.availableFees.official[0].feeUI.extensionFeeEUR | number: 2) || '0.00'}}</p>\n                                </div>                                                                                        \n                            </div>                                        \n                            <div class=\"row m-b-sm\">\n                                <div class=\"col-md-5 col-xl-5\">\n                                    <p class=\"font-weight-medium m-l-sm\">Claims fee 1:</p>\n                                </div>\n                                <div class=\"col-md-4 col-xl-4\">\n                                    <p class=\"text-left font-body\">$ {{($ctrl.availableFees.official[0].feeUI.claimsFee1USD | number: 2) || '0.00'}}</p>\n                                </div>\n                                <div class=\"col-md-3 col-xl-3\">\n                                    <p class=\"text-left font-body\">&euro; {{($ctrl.availableFees.official[0].feeUI.claimsFee1EUR | number: 2) || '0.00'}}</p>\n                                </div>                                                                                        \n                            </div>   \n                            <div class=\"row m-b-sm\">\n                                <div class=\"col-md-5 col-xl-5\">\n                                    <p class=\"font-weight-medium m-l-sm\">Claims fee 2:</p>\n                                </div>\n                                <div class=\"col-md-4 col-xl-4\">\n                                    <p class=\"text-left font-body\">$ {{($ctrl.availableFees.official[0].feeUI.claimsFee2USD | number: 2) || '0.00'}}</p>\n                                </div>\n                                <div class=\"col-md-3 col-xl-3\">\n                                    <p class=\"text-left font-body\">&euro; {{($ctrl.availableFees.official[0].feeUI.claimsFee2EUR | number: 2) || '0.00'}}</p>\n                                </div>\n                            </div>\n                            <div class=\"row m-b-sm\">\n                                <div class=\"col-md-5 col-xl-5\">\n                                    <p class=\"font-weight-medium m-l-sm\">Additional Documents:</p>\n                                </div>\n                                <div class=\"col-md-4 col-xl-4\">\n                                    <p class=\"text-left font-body\">$ {{($ctrl.availableFees.official[0].feeUI.additionalCopiesFeeUSD | number: 2) || '0.00'}}</p>\n                                </div>\n                                <div class=\"col-md-3 col-xl-3\">\n                                    <p class=\"text-left font-body\">&euro; {{($ctrl.availableFees.official[0].feeUI.additionalCopiesFeeEUR | number: 2) || '0.00'}}</p>\n                                </div>                                                                                        \n                            </div>\n                            <div class=\"row m-b-sm\">\n                                <div class=\"col-md-5 col-xl-5\">\n                                    <p class=\"font-weight-medium m-l-sm\">Renewal Fee:</p>\n                                </div>\n                                <div class=\"col-md-4 col-xl-4\">\n                                    <p class=\"text-left font-body\">$ {{($ctrl.availableFees.official[0].feeUI.renewalFeeUSD | number: 2) || '0.00'}}</p>\n                                </div>\n                                <div class=\"col-md-3 col-xl-3\">\n                                    <p class=\"text-left font-body\">&euro; {{($ctrl.availableFees.official[0].feeUI.renewalFeeEUR | number: 2) || '0.00'}}</p>\n                                </div>\n                            </div>\n                        </div>\n                        <div data-ng-if=\"$ctrl.displayRenewal\">\n                            <div class=\"row m-b-sm\">\n                                <div class=\"col-md-5 col-xl-5\">\n                                    <p class=\"font-weight-medium m-l-sm\">Renewal Fee:</p>\n                                </div>\n                                <div class=\"col-md-4 col-xl-4\">\n                                    <p class=\"text-left font-body\">$ {{($ctrl.availableFees.official[0].feeUI.renewalFeeUSD | number: 2) || '0.00'}}</p>\n                                </div>\n                                <div class=\"col-md-3 col-xl-3\">\n                                    <p class=\"text-left font-body\">&euro; {{($ctrl.availableFees.official[0].feeUI.renewalFeeEUR | number: 2) || '0.00'}}</p>\n                                </div>                                                                                        \n                            </div>\n                            <div class=\"row m-b-sm\">\n                                <div class=\"col-md-5 col-xl-5\">\n                                    <p class=\"font-weight-medium m-l-sm\">Extension Fee:</p>\n                                </div>\n                                <div class=\"col-md-4 col-xl-4\">\n                                    <p class=\"text-left font-body\">$ {{($ctrl.availableFees.official[0].feeUI.extensionFeeUSD | number: 2) || '0.00'}}</p>\n                                </div>\n                                <div class=\"col-md-3 col-xl-3\">\n                                    <p class=\"text-left font-body\">&euro; {{($ctrl.availableFees.official[0].feeUI.extensionFeeEUR | number: 2) || '0.00'}}</p>\n                                </div>                                                                                        \n                            </div>                            \n                        </div>\n                        <div data-ng-if=\"$ctrl.displayGrant\">\n                            <div class=\"row m-b-sm\">\n                                <div class=\"col-md-5 col-xl-5\">\n                                    <p class=\"font-weight-medium m-l-sm\">Grant Fee:</p>\n                                </div>\n                                <div class=\"col-md-4 col-xl-4\">\n                                    <p class=\"text-left font-body\">$ {{($ctrl.availableFees.official[0].feeUI.grantFeeUSD | number: 2) || '0.00'}}</p>\n                                </div>\n                                <div class=\"col-md-3 col-xl-3\">\n                                    <p class=\"text-left font-body\">&euro; {{($ctrl.availableFees.official[0].feeUI.grantFeeEUR | number: 2) || '0.00'}}</p>\n                                </div>                                                                                        \n                            </div>                             \n                            <div class=\"row m-b-sm\">\n                                <div class=\"col-md-5 col-xl-5\">\n                                    <p class=\"font-weight-medium m-l-sm\">Claims for the 16th and each subsequent claim to the limit of 50:</p>\n                                </div>\n                                <div class=\"col-md-4 col-xl-4\">\n                                    <p class=\"text-left font-body\">$ {{($ctrl.availableFees.official[0].feeUI.claimsFee1USD | number: 2) || '0.00'}}</p>\n                                </div>\n                                <div class=\"col-md-3 col-xl-3\">\n                                    <p class=\"text-left font-body\">&euro; {{($ctrl.availableFees.official[0].feeUI.claimsFee1EUR | number: 2) || '0.00'}}</p>\n                                </div>                                                                                        \n                            </div>\n                            <div class=\"row m-b-sm\">\n                                <div class=\"col-md-5 col-xl-5\">\n                                    <p class=\"font-weight-medium m-l-sm\">Claims for the 51st and each subsequent claim:</p>\n                                </div>\n                                <div class=\"col-md-4 col-xl-4\">\n                                    <p class=\"text-left font-body\">$ {{($ctrl.availableFees.official[0].feeUI.claimsFee2USD | number: 2) || '0.00'}}</p>\n                                </div>\n                                <div class=\"col-md-3 col-xl-3\">\n                                    <p class=\"text-left font-body\">&euro; {{($ctrl.availableFees.official[0].feeUI.claimsFee2EUR | number: 2) || '0.00'}}</p>\n                                </div>                                                                                        \n                            </div>      \n                            <div class=\"row m-b-sm\">\n                                <div class=\"col-md-5 col-xl-5\">\n                                    <p class=\"font-weight-medium m-l-sm\">Excess pages:</p>\n                                </div>\n                                <div class=\"col-md-4 col-xl-4\">\n                                    <p class=\"text-left font-body\">$ {{($ctrl.availableFees.official[0].feeUI.excessPageFeeUSD | number: 2) || '0.00'}}</p>\n                                </div>\n                                <div class=\"col-md-3 col-xl-3\">\n                                    <p class=\"text-left font-body\">&euro; {{($ctrl.availableFees.official[0].feeUI.excessPageFeeEUR | number: 2) || '0.00'}}</p>\n                                </div>                                                                                        \n                            </div>                           \n                        </div>                   \n                        <div data-ng-if=\"$ctrl.displayValidation\">\n                            <div class=\"row m-b-sm\" data-ng-if=\"$ctrl.availableFees.official.feeUI.designatedStates.length\">\n                                <div class=\"col-md-5 col-xl-5 m-b-sm\">\n                                    <p class=\"font-weight-medium m-l-sm\">Designation State Fees:</p>\n                                </div>\n                                <div class=\"col-md-12 col-xl-12\" data-ng-repeat=\"state in $ctrl.availableFees.official.feeUI.designatedStates\">     \n                                    <div class=\"row m-b-sm\">\n                                        <div class=\"col-md-5 col-xl-5\">\n                                            <p class=\"m-l-lg\">{{state.stateCode}}</p>\n                                        </div>\n                                        <div class=\"col-md-4 col-xl-4\">\n                                            <p class=\"text-left font-body\">$ {{(state.validationCost_USD | number: 2) || '0.00'}}</p>\n                                        </div>\n                                        <div class=\"col-md-3 col-xl-3\">\n                                            <p class=\"text-left font-body\">&euro; {{(state.validationCost_EUR | number: 2) || '0.00'}}</p>\n                                        </div>                                                                                        \n                                    </div>\n                                </div>\n                            </div>                             \n                            <div class=\"row m-b-sm\" data-ng-if=\"$ctrl.availableFees.official.feeUI.extensionStates.length\">\n                                <div class=\"col-md-5 col-xl-5 m-b-sm\">\n                                    <p class=\"font-weight-medium m-l-sm\">Extension State Fees:</p>\n                                </div>\n                                <div class=\"col-md-12 col-xl-12\" data-ng-repeat=\"state in $ctrl.availableFees.official.feeUI.extensionStates\">\n                                    <div class=\"row m-b-sm\">\n                                        <div class=\"col-md-5 col-xl-5\">\n                                            <p class=\"m-l-lg\">{{state.stateCode}}</p>\n                                        </div>\n                                        <div class=\"col-md-4 col-xl-4\">\n                                            <p class=\"text-left font-body\">$ {{(state.validationCost_USD | number: 2) || '0.00'}}</p>\n                                        </div>\n                                        <div class=\"col-md-3 col-xl-3\">\n                                            <p class=\"text-left font-body\">&euro; {{(state.validationCost_EUR | number: 2) || '0.00'}}</p>\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>\n                            <div class=\"row m-b-sm\" data-ng-if=\"$ctrl.availableFees.official.feeUI.validationStates.length\">\n                                <div class=\"col-md-5 col-xl-5  m-b-sm\">\n                                    <p class=\"font-weight-medium m-l-sm\">Validation State Fees:</p>\n                                </div>\n                                <div class=\"col-md-12 col-xl-12\" data-ng-repeat=\"state in $ctrl.availableFees.official.feeUI.validationStates\">\n                                    <div class=\"row m-b-sm\">\n                                        <div class=\"col-md-5 col-xl-5\">\n                                            <p class=\"m-l-lg\">{{state.stateCode}}</p>\n                                        </div>\n                                        <div class=\"col-md-4 col-xl-4\"> \n                                            <p class=\"text-left font-body\">$ {{(state.validationCost_USD | number: 2) || '0.00'}}</p>\n                                        </div>\n                                        <div class=\"col-md-3 col-xl-3\">\n                                            <p class=\"text-left font-body\">&euro; {{(state.validationCost_EUR | number: 2) || '0.00'}}</p>\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>      \n                        </div>                        \n                        <div class=\"border-grey-xs--btm\"></div> \n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class=\"row m-b-sm\">\n            <div class=\"col-md-5 col-xl-5\">\n                <p class=\"font-weight-medium  font-h4\">Patent Place Fees:\n                    <button class=\"btn btn-no-bg accordion-caret\" data-ng-class=\"{'active': !ppPanelActive}\" data-ng-click=\"ppPanelActive = !ppPanelActive\">\n                        <i class=\"fas fa-lg fa-caret-right\"></i>\n                    </button>\n                </p>\n            </div>\n            <div class=\"col-md-4 col-xl-4\">\n                <p class=\"text-left font-h4\">$ {{($ctrl.availableFees.ppFeesUSD | number: 2) || '0.00'}}</p>\n            </div>\n            <div class=\"col-md-3 col-xl-3\">\n                <p class=\"text-left font-h4\">&euro; {{($ctrl.availableFees.ppFeesEUR | number: 2) || '0.00'}}</p>\n            </div>    \n            <div class=\"col-xl-12\">\n                <div class=\"expandcollapse-item\">\n                    <div class=\"slideDown m-t-sm\" data-ng-init=\"ppPanelActive = true\" data-ng-hide=\"ppPanelActive\">\n                        <div class=\"row m-b-sm\">\n                            <div class=\"col-xl-5\">\n                                <p class=\"font-weight-medium m-l-sm\">Processing fee:</p>\n                            </div>\n                            <div class=\"col-md-4 col-xl-4\">\n                                <p class=\"text-left\">$ {{($ctrl.availableFees.official[0].feeUI.processingFeeUSD || $ctrl.availableFees.official.feeUI.processingFeeUSD| number: 2) || '0.00'}}</p>\n                            </div>\n                            <div class=\"col-md-3 col-xl-3\">\n                                <p class=\"text-left\">&euro; {{($ctrl.availableFees.official[0].feeUI.processingFeeEUR || $ctrl.availableFees.official.feeUI.processingFeeEUR| number: 2) || '0.00'}}</p>\n                            </div>\n                        </div>\n                        <div class=\"row m-b-sm\">\n                            <div class=\"col-xl-5\">\n                                <p class=\"font-weight-medium m-l-sm\">Express fee:</p>\n                            </div>\n                            <div class=\"col-md-4 col-xl-4\">\n                                <p class=\"text-left\">$ {{($ctrl.availableFees.official[0].feeUI.expressFeeUSD | number: 2) || '0.00'}}</p>\n                            </div>\n                            <div class=\"col-md-3 col-xl-3\">\n                                <p class=\"text-left\">&euro; {{($ctrl.availableFees.official[0].feeUI.expressFeeEUR | number: 2) || '0.00'}}</p>\n                            </div>\n                        </div>\n                        <div class=\"row m-b-sm\">\n                            <div class=\"col-xl-5\">\n                                <p class=\"font-weight-medium m-l-sm\">Urgent fee:</p>\n                            </div>\n                            <div class=\"col-md-4 col-xl-4\">\n                                <p class=\"text-left\">$ {{($ctrl.availableFees.official[0].feeUI.urgentFeeUSD | number: 2) || '0.00'}}</p>\n                            </div>\n                            <div class=\"col-md-3 col-xl-3\">\n                                <p class=\"text-left\">&euro; {{($ctrl.availableFees.official[0].feeUI.urgentFeeEUR | number: 2) || '0.00'}}</p>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class=\"m-b-md border-grey-xs--btm\"></div>\n        <div class=\"row m-b-md\">\n            <div class=\"col-md-5 col-xl-5\">\n                <p class=\"font-weight-heavy font-h4\">Total:</p>\n            </div>\n            <div class=\"col-md-4 col-xl-4\">\n                <p class=\"text-left font-h4\">$ {{($ctrl.availableFees.official[0].feeUI.subTotalUSD || $ctrl.availableFees.official.feeUI.subTotalUSD | number: 2) || '0.00'}}</p>\n            </div>\n            <div class=\"col-md-3 col-xl-3\">\n                <p class=\"text-left font-h4\">&euro; {{($ctrl.availableFees.official[0].feeUI.subTotalEUR || $ctrl.availableFees.official.feeUI.subTotalEUR | number: 2) || '0.00'}}</p>\n            </div>\n        </div>\n    </div>\n</div>\n<div data-ng-if=\"$ctrl.availableFees.official[0].isUrgentAttention\" class=\"d-flex justify-content-center align-items-center m-b-xxxl m-t-xxxl\">\n    <p class=\"font-h4 font-weight-medium\">This European Action requires urgent attention. If you want to process the action before the deadline is reached, call our legal team on: {{phoneNumber}}</p>\n</div>\n<div class=\"m-b-md border-grey-xs--btm\"></div>\n<div class=\"row\">\n    <div class=\"col-md-6 col-lg-12 col-xl-6 d-flex justify-content-start align-items-center\">\n        <div class=\"d-flex flex-column align-items-start text-left m-r-xxxl\">\n            <span class=\"txt-grey text-uppercase font-body font-weight-heavy m-b-xs\" data-ng-if=\"$ctrl.availableFees.official[0].saleType !== 'In Progress'\">Current cost</span>\n            <span class=\"txt-grey text-uppercase font-body font-weight-heavy m-b-xs\" data-ng-if=\"$ctrl.availableFees.official[0].saleType == 'In Progress'\">Committed cost</span>\n            <p class=\"font-h3 font-weight-bold nowrap\" data-ng-class=\"$ctrl.availableFees.official[0].cssCurrent || $ctrl.availableFees.official.cssCurrent\" data-ng-if=\"$ctrl.availableFees.official[0].saleType !== 'In Progress'\">$ {{$ctrl.availableFees.official[0].feeUI.subTotalUSD || $ctrl.availableFees.official.feeUI.subTotalUSD | number: 2}}</p>\n            <p class=\"font-h3 font-weight-bold nowrap\" data-ng-if=\"$ctrl.availableFees.official[0].saleType == 'In Progress'\">$ {{$ctrl.availableFees.official[0].feeUI.subTotalUSD | number: 2}}</p>\n        </div>   \n        <div class=\"d-flex flex-column align-items-start text-left\" data-ng-if=\"$ctrl.availableFees.official[0].saleType !== 'In Progress' && $ctrl.availableFees.official.serviceType !== 'validation'\">\n            <span class=\"txt-grey text-uppercase font-body font-weight-heavy m-b-xs\">Future cost</span>\n            <p class=\"font-h3 font-weight-bold nowrap\" data-ng-class=\"$ctrl.availableFees.official[0].cssNext\" data-ng-if=\"(!$ctrl.availableFees.official[0].isUrgentAttention \n            && $ctrl.availableFees.official[0].currentStageColour !== 'Black' \n            && ($ctrl.availableFees.official[0].saleType === 'Online' || $ctrl.availableFees.official[0].saleType === 'Offline')) \n            || \n            ($ctrl.availableFees.official[0].currentStageColour == 'Red' \n            && $ctrl.availableFees.official[0].serviceType == 'renewal')\n            ||\n            (!$ctrl.availableFees.official[0].isUrgentAttention \n            && $ctrl.availableFees.official[0].currentStageColour == 'Black' \n            && ($ctrl.availableFees.official[0].saleType === 'Online' || $ctrl.availableFees.official[0].saleType === 'Offline'))\">$ {{$ctrl.availableFees.official[0].nextStageCostUSD | number: 2}}</p>\n            <p class=\"font-h3 font-weight-bold\" data-ng-if=\"\n            ($ctrl.availableFees.official[0].isUrgentAttention && $ctrl.availableFees.official[0].currentStageColour === 'Red' && $ctrl.availableFees.official[0].serviceType !== 'renewal') \n            || ($ctrl.availableFees.official[0].isUrgentAttention && $ctrl.availableFees.official[0].currentStageColour === 'Black' && $ctrl.availableFees.official[0].serviceType == 'renewal')\">LAPSE</p>   \n        </div>\n    </div>\n    <div class=\"col-md-6 col-lg-12 col-xl-6 lg-m-t-sm d-flex justify-content-center align-items-end flex-column\" >\n        <p class=\"font-h3 font-weight-heavy font-h3--content\" data-ng-if=\"\n        ((!$ctrl.availableFees.official[0].isUrgentAttention && $ctrl.availableFees.official[0].saleType !== 'In Progress') && $ctrl.availableFees.official.serviceType !== 'validation') \n        || ($ctrl.availableFees.official[0].isUrgentAttention && $ctrl.availableFees.official[0].currentStageColour === 'Red' && $ctrl.availableFees.official[0].serviceType == 'renewal')\">Save: <span class=\"txt-phase-green\">$ {{($ctrl.availableFees.savings | number: 2) || '0.00'}}</span></p>\n        <p class=\"font-body\" data-ng-if=\"$ctrl.availableFees.official[0].saleType === 'Online' || $ctrl.availableFees.official[0].saleType === 'Offline'\">Instruct before: <span class=\"font-weight-bold\">{{$ctrl.availableFees.official[0].costBandEndDateUI}}</span></p>\n    </div>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/fxchart/fxchart.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"row m-b-sm\"> <!-- add if condition to check data-ng-if application has been saved-->\n    <div class=\"col-xl-12\">\n        <p>Select an action from the drop-down menu below</p>\n    </div>\n</div>\n<div class=\"row\">\n    <div class=\"col-xl-12 text-xs-left\">                            \n        <div data-ng-if=\"$ctrl.lineData !== null\">\n            <div class=\"row\">\n                <div class=\"col-xl-12\">\n                    <div class=\"form-inline\">\n                        <div class=\"form-group\">                      \n                            <label class=\"font-h4 font-weight-bold text-uppercase m-r-sm\">Display FX data for</label>\n                            <select name=\"actions\" id=\"actions\" class=\"form-control text-capitalize\" data-ng-model=\"$ctrl.data.selectedAction\" data-ng-options=\"option.action for option in $ctrl.data.availableAction track by option.id\" data-ng-change=\"$ctrl.setData($ctrl.data.selectedAction.action)\"></select>\n                        </div>\n                    </div>\n                </div>\n            </div>\n            <nvd3 options=\"$ctrl.lineOptions\" data=\"$ctrl.lineData\" class=\"with-transitions\"></nvd3>\n        </div>\n    </div>\n</div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/grant/grant.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"row m-b-sm\" data-ng-if=\"$ctrl.pendingAssisted && $ctrl.assistedAvailable\">\n    <div class=\"col-xl-12\">\n        <div class=\"m-b-xs offline-processing-panel\">\n            <div class=\"row\">\n                <div class=\"col-md-2 d-flex justify-content-center align-items-center\">\n                    <i class=\"fas fa-exclamation-circle fa-4x txt-phase-amber\"></i>\n                </div>\n                <div class=\"col-md-10\">\n                    <p class=\"m-b-xs font-h4 font-weight-bold\">Assisted formality filing requested</p>\n                    <p>Unless our IP professional has instructed you to do so, please do not carry out any actions on this formality. You have requested assisted formality filing, so editing or deleting any information may cause issues with your filing.</p>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n<div data-ng-if=\"$ctrl.grantStage == 1\" data-ng-class=\"fade-in\" class=\"d-flex flex-grow-1\">\n    <div class=\"row flex-grow-1\">\n        <div class=\"d-flex col-md-12 col-xl-12\">\n            <div class=\"m-b-sm d-flex flex-column flex-grow-1\" dynamic=\"$ctrl.grantTemplate\">\n            </div>\n\n        </div>\n    </div>\n</div>\n<div data-ng-if=\"$ctrl.grantStage == 2\" data-ng-class=\"fade-in\" class=\"d-flex flex-grow-1\" >\n    <div class=\"row flex-grow-1\">\n        <div class=\"d-flex col-md-12 col-xl-12\">\n            <div class=\"m-b-sm d-flex flex-column flex-grow-1\" dynamic=\"$ctrl.grantTemplate\">\n            </div>\n        </div>\n    </div>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/notifications/notifications.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"row m-b-sm\" data-ng-if=\"$ctrl.data.availableAction.length == 0\">\n\t<div class=\"col-md-12 col-xl-12\">\n\t\t<p class=\"font-h4 font-weight-medium\">There are currently no European Actions available via The Patent Place. If a European Action becomes available, you can configure your notification settings here for the available action(s).</p>\n\t</div>\n</div>\n\n<div data-ng-if=\"$ctrl.data.availableAction.length !== 0\" class=\"d-flex flex-column flex-grow-1\">\n\t<div class=\"row m-b-sm\"> <!-- add if condition to check data-ng-if application has been saved-->\n\t    <div class=\"col-md-12 col-xl-12\">\n\t        <p class=\"font-body\">Reminders are emails sent to your inbox to help keep you up to date on the progress of your patent’s available formalities. Below you can configure each phase reminder settings to best suit your needs for when you receive a reminder email.</p>\n\t        <p data-ng-if=\"$ctrl.validationReminders\" class=\"font-body m-t-xs\">Due to additional elements required for processing validations through Patent Place, reminders work on an Online then Offline reminder basis.</p>\t        \n\t    </div>\n\t</div>\t\n\t<div class=\"row m-b-sm\"> <!-- add if condition to check data-ng-if application has been saved -->\n\t    <div class=\"col-md-12 col-xl-12\">\n\t    \t<div class=\"form-inline\">\n\t    \t\t<div class=\"form-group\">                      \n\t            \t<label class=\"font-h4 font-weight-bold text-uppercase m-r-sm\">Display notifications for: </label>\n\t\t        \t<select name=\"actions\" id=\"actions\" class=\"form-control text-capitalize\" data-ng-model=\"$ctrl.data.selectedAction\" data-ng-options=\"option.action for option in $ctrl.data.availableAction track by option.id\" data-ng-init=\"$ctrl.displayNotifications($ctrl.data.selectedAction.action)\" data-ng-change=\"$ctrl.displayNotifications($ctrl.data.selectedAction.action)\">\n\t\t\t        </select>\n\t    \t\t</div>\n\t    \t</div>\n\t    </div>\n\t</div>\t\n\n\t<div class=\"d-flex flex-column\">\n\t\t<div class=\"d-flex align-items-center\">\n\t\t\t<div class=\"notification-heading\">\n\t\t\t\t<span data-ng-if=\"!$ctrl.validationReminders\" class=\"font-h4 font-weight-bold txt-phase-green\">Green</span>\n\t\t\t\t<span data-ng-if=\"$ctrl.validationReminders\" class=\"font-h4 font-weight-bold txt-phase-green\">Online\n\t\t\t\t\t<i class=\"fas fa-question-circle txt-phase-green cursor-pointer fa-1x\"></i>\n\t\t            <md-tooltip md-delay=\"500\" md-direction=\"right\" md-z-index=\"99999\" class=\"font-body mdtooltip-md\">\n\t\t              \tThe Online (Green) period lasts from the Administrative Grant Date, up until 6 weeks prior to the validation deadline. Within this timeframe, the instruction can be processed Online via the platform.\n\t\t            </md-tooltip>\n\t\t\t\t</span>\n\t\t\t</div>\n\t\t\t<div class=\"py-2 pl-5 notification-body border-grey-xs--left\" data-ng-repeat=\"checkbox in $ctrl.notifications.green track by $index\" index=\"$index\">\n\t    \t\t<div class=\"d-flex flex-wrap\">\n\t                <div class=\"d-flex align-items-center m-r-md\" data-ng-repeat=\"item in checkbox\">\n\t                    <label class=\"notification-radio\">\n\t                      \t<input type=\"checkbox\" data-ng-model=\"item.isOn\">\n\t                      \t<span class=\"checkmark green\"></span>\n\t                    </label>\n\t                    <span class=\"font-body checkbox-text\">{{item.title}}</span>\n\t                </div>\n\t            </div>\n\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"d-flex align-items-center\" data-ng-if=\"!$ctrl.validationReminders\">\n\t\t\t<div class=\"notification-heading\">\n\t\t\t\t<span class=\"font-h4 font-weight-bold txt-phase-amber\">Amber</span>\n\t\t\t</div>\t\t\t\n\t\t\n\t\t\t<div class=\"py-2 pl-5 notification-body  border-grey-xs--left\" data-ng-repeat=\"checkbox in $ctrl.notifications.amber track by $index\" index=\"$index\">\n\t    \t\t<div class=\"d-flex flex-wrap\">\n\t                <div class=\"d-flex align-items-center m-r-md\" data-ng-repeat=\"item in checkbox\">\n\t                    <label class=\"notification-radio\">\n\t                      \t<input type=\"checkbox\" data-ng-model=\"item.isOn\">\n\t                      \t<span class=\"checkmark amber\"></span>\n\t                    </label>\n\t                    <span class=\"font-body checkbox-text\">{{item.title}}</span>\n\t                </div>\n\t            </div>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"d-flex align-items-center\">\n\t\t\t<div class=\"notification-heading\">\n\t\t\t\t<p data-ng-if=\"!$ctrl.validationReminders\" class=\"font-h4 font-weight-bold txt-phase-red\">Red</p>\n\t\t\t\t<div data-ng-if=\"$ctrl.validationReminders\">\t\t\t\t\n\t\t\t\t\t<p class=\"font-h4 font-weight-bold txt-phase-red\">\n\t\t\t\t\t\tOffline\n\t\t\t\t\t\t<i class=\"fas fa-question-circle txt-phase-green cursor-pointer fa-1x\"></i>\n\t\t\t            <md-tooltip md-delay=\"500\" md-direction=\"right\" md-z-index=\"99999\" class=\"font-body mdtooltip-md\">\n\t\t\t              \tThe Offline (Red) period lasts from 6 weeks prior to the validation deadline. Within this timeframe, if you phone or email one of our patent administrators they may be able to assist.\n\t\t\t            </md-tooltip>\n\n\t\t\t\t\t</p>\n\t\t\t\t</div>\n\t\t\t</div>\t\n\t\t\t<div class=\"border-grey-xs--left\">\n\t\t\t\t<div class=\"py-2 pl-5 notification-body\" data-ng-repeat=\"checkbox in $ctrl.notifications.red track by $index\" index=\"$index\">\n\t\t    \t\t<div class=\"d-flex flex-wrap\">\n\t\t                <div class=\"d-flex align-items-center m-r-md\" data-ng-repeat=\"item in checkbox\">\n\t                        <label class=\"notification-radio\">\n\t                          \t<input type=\"checkbox\" data-ng-model=\"item.isOn\">\n\t                          \t<span class=\"checkmark red\"></span>\n\t                        </label>\n\t\t                    <span class=\"font-body checkbox-text\">{{item.title}}</span>\n\t\t                </div>\n\t\t            </div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t\t<div data-ng-if=\"$ctrl.toBlueOrNotToBlue\">\n\t\t\t<div class=\"d-flex align-items-center\">\n\t\t\t\t<div class=\"notification-heading\">\n\t\t\t\t\t<span class=\"font-h4 font-weight-bold txt-phase-blue\">Blue</span>\n\t\t\t\t</div>\t\n\t\t\t\t<div class=\"border-grey-xs--left\">\t\n\t\t\t\t\t<div class=\"py-2 pl-5 notification-body\" data-ng-repeat=\"checkbox in $ctrl.notifications.blue track by $index\" index=\"$index\">\n\t\t\t    \t\t<div class=\"d-flex flex-wrap\">\n\t\t\t                <div class=\"d-flex align-items-center m-r-md\" data-ng-repeat=\"item in checkbox\">\n\t\t                        <label class=\"notification-radio\">\n\t\t                          \t<input type=\"checkbox\" data-ng-model=\"item.isOn\">\n\t\t                          \t<span class=\"checkmark blue\"></span>\n\t\t                        </label>\n\t\t\t                    <span class=\"font-body checkbox-text\">{{item.title}}</span>\n\t\t\t                </div>\n\t\t\t            </div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\t\n\t\t\t</div>\n\t\t\t<div class=\"d-flex align-items-center\">\n\t\t\t\t<div class=\"notification-heading\">\n\t\t\t\t\t<span class=\"font-h4 font-weight-bold txt-phase-black\">Black</span>\n\t\t\t\t</div>\t\t\n\t\t\t\t<div class=\"border-grey-xs--left\">\t\n\t\t\t\t\t<div class=\"py-2 pl-5 notification-body\" data-ng-repeat=\"checkbox in $ctrl.notifications.black track by $index\" index=\"$index\">\n\t\t\t    \t\t<div class=\"d-flex flex-wrap\">\n\t\t\t                <div class=\"d-flex align-items-center m-r-md\" data-ng-repeat=\"item in checkbox\">\n\t\t\t                        <label class=\"notification-radio\">\n\t\t\t                          \t<input type=\"checkbox\" data-ng-model=\"item.isOn\">\n\t\t\t                          \t<span class=\"checkmark black\"></span>\n\t\t\t                        </label>\n\t\t\t                    <span class=\"font-body checkbox-text\">{{item.title}}</span>\n\t\t\t                </div>\n\t\t\t            </div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\t\t\n\t\t\t</div>\n\t\t</div><!--blue and black end-->\n\t\n\t<div class=\"row m-t-md flex-grow-1\">\n\t\t<div class=\"col-xl-12 text-right d-flex align-items-end justify-content-end\">\n\t        <input type=\"submit\" id=\"submit\" class=\"btn btn--green btn--lg pill-radius\" value=\"Save\" data-ng-click=\"$ctrl.updateNotifications($ctrl.patent.patentID, $ctrl.notificationUi, $ctrl.notificationUrl)\" data-ng-disabled=\"$ctrl.updatingNotifications\">\n\t\t</div>\n\t</div>\n</div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/renewal/renewal.history.tpl.htm":
/***/ (function(module, exports) {

module.exports = "\n<div class=\"content-panel bg-white border-t-none\">\n\t<div class=\"bg-white\">\n\t\t<div class=\"row\">\n\t\t\t<div class=\"col-xl-12\">\n\t\t\t\t<div class=\"scrollable-area renewalhistory-table scrollable-area--no-shadow sticky-table\">\n\t\t\t\t\t<table class=\"t-data m-t-lg\" data-ng-repeat=\"renewal in $ctrl.renewal | orderBy:$ctrl.sortType:$ctrl.sortReverse\">\n\t\t\t\t\t\t<tbody class=\"sticky-tbody\">\n\t\t\t\t\t\t\t<tr class=\"t-data__row border-grey-xs--btm\">\n\t\t\t\t\t\t\t\t<td class=\"t-data__td text-left align-top t-data__w15 font-h4 font-weight-bold sticky-td\">Renewal Year</td>\n\t\t\t\t\t\t\t\t<td class=\"t-data__td text-left align-top t-data__w15 font-h4\">Year <span data-ng-bind=\"renewal.renewalYear\"></span></td>\n\t\t\t\t\t\t\t</tr>\n\t<!-- \t\t\t\t\t\t<tr class=\"t-data__row border-grey-xs--btm\">\n\t\t\t\t\t\t\t\t<td class=\"t-data__td text-left align-top t-data__w15 font-h4 font-weight-bold\">Date Renewed</td>\n\t\t\t\t\t\t\t\t<td class=\"t-data__td text-left align-top t-data__w15 font-h4 font-weight-bold\">{{renewal.renewalDueDate | date: 'MM/dd/yy'}}</td>\n\t\t\t\t\t\t\t</tr> --> <!--ask backend to provide data ASAP at appropriate time -->\n\t\t\t\t\t\t\t<tr class=\"t-data__row border-grey-xs--btm\">\n\t\t\t\t\t\t\t\t<td class=\"t-data__td text-left align-top t-data__w15 font-h4 font-weight-bold sticky-td\">Cost Breakdown</td>\n\t\t\t\t\t\t\t\t<td class=\"text-left align-top t-data__w15\">\n\t\t\t\t\t\t\t\t\t<table class=\"t-data table-borderless\">\n\t\t\t\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t\t\t\t<td class=\"t-data__td text-left font-h4\">Official fee:</td>\n\t\t\t\t\t\t\t\t\t\t\t<td class=\"t-data__td text-left\">$ {{(renewal.renewalFeeUI.currentOfficialFeeUSD | number: 2) || '0.00'}}</td>\n\t\t\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t\t\t\t<td class=\"t-data__td text-left font-h4\">Patent Place fees:</td>\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t<td class=\"t-data__td text-left\">$ {{(renewal.renewalFeeUI.subTotalUSD - renewal.renewalFeeUI.currentOfficialFeeUSD | number: 2) || '0.00'}}</td>\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t</tr>\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t</table>\n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<td class=\"t-data__td text-left align-top t-data__w15 font-h4 font-weight-bold sticky-td\">Downloads</td>\n\t\t\t\t\t\t\t\t<td class=\"t-data__td text-left align-top t-data__w15 font-h4\">\n\t\t\t\t\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t\t\t\t\t<div class=\"col-xl-12 text-left\">\n\t\t\t\t\t\t\t\t\t\t\t<a class=\"btn btn--lg btn--green pill-radius m-r-sm\" data-ng-href=\"{{renewal.certificateUrl}}\" target=\"_blank\" data-ng-if=\"renewal.certificateUrl\">Certificate\n\t\t\t\t\t\t\t \t\t\t\t</a>\n\t\t\t\t\t\t\t\t\t\t\t<a class=\"btn btn--lg btn--green pill-radius\" data-ng-href=\"{{renewal.invoiceUrl}}\" download>Invoice\n\t\t\t\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t\t\t\t</div>\t\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t</tbody>\n\t\t\t\t\t</table>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/case/html/validation/validation.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"row m-b-sm\" data-ng-if=\"$ctrl.pendingAssisted && $ctrl.assistedAvailable\">\n    <div class=\"col-xl-12\">\n        <div class=\"m-b-xs offline-processing-panel\">\n            <div class=\"row\">\n                <div class=\"col-md-2 d-flex justify-content-center align-items-center\">\n                    <i class=\"fas fa-exclamation-circle fa-4x txt-phase-amber\"></i>\n                </div>\n                <div class=\"col-md-10\">\n                    <p class=\"m-b-xs font-h4 font-weight-bold\">Assisted formality filing requested</p>\n                    <p>Unless our IP professional has instructed you to do so, please do not carry out any actions on this formality. You have requested assisted formality filing, so editing or deleting any information may cause issues with your filing.</p>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n<div class=\"d-flex flex-grow-1\" data-ng-class=\"fade-in\">\n    <div class=\"row\">\n        <div class=\"col-md-12 col-xl-12 d-flex\">\n            <div class=\"d-flex flex-column\" dynamic=\"$ctrl.validationTemplate\">\n            </div>\n        </div>\n    </div>\n</div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/checkout/html/checkout.bank-transfer-preparation.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"row\">\r\n    <div class=\"col-md-12\">\r\n        <h1 class=\"font-h1 lh-default\" data-ng-bind=\"$ctrl.pageTitle\"></h1>\r\n    </div>\r\n</div>\r\n<div data-ng-controller=\"CartController\" class=\"m-b-xl\">\r\n    <div class=\"d-none d-md-block d-lg-none\">\r\n        <div class=\"row m-b-md\">\r\n            <div class=\"col-md-12\">\r\n                <div class=\"content-panel\">\r\n                    <div class=\"content-panel__body bg-white\">\r\n                        <h3 class=\"font-h2 font-weight-bold\">Important notice</h3>\r\n                        <div class=\"border-grey-xs--btm m-t-sm m-b-sm\"></div>\r\n                        <div>\r\n                            <p class=\"font-body m-b-md\">Please check the transaction details below. When you press the \"Place this order\" button below you're entering in to a legal contract under our terms and conditions.</p>\r\n                            <p class=\"font-body m-b-md\">You will need to make payment in to the MoneyCorp account at the Bank of New York.</p>\r\n                            <p class=\"font-h4 font-weight-medium m-b-md\">Funds must be received in to our account at MoneyCorp by:</p>                \r\n                            <p class=\"font-weight-bold font-h3 m-b-md\">{{$ctrl.details.transTargetEndDateUI}}</p>       \r\n                            <p class=\"font-body\">The transaction will be progressed at the time shown provided funds have been received. After this point the transaction will be cancelled and penalty charges will apply. If subsequently re-submitted, the costs may have changed, or the European Action(s) may no longer be available.</p>\r\n                        </div>\r\n                    </div>\r\n                </div> \r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"d-none d-md-block d-lg-none\">\r\n        <div class=\"row\">\r\n           <div class=\"col-md-12\">\r\n                <div class=\"content-panel\">\r\n                    <div class=\"content-panel__body bg-white border-grey-xs--btm\">\r\n                        <p class=\"font-h3 font-weight-medium\">Order Summary</p>\r\n                        <div class=\"border-grey-xs--btm m-t-sm m-b-sm\"></div>\r\n                        <div class=\"row\">\r\n                            <div class=\"col-md-5\">\r\n                                <div class=\"border-grey-xs--btm  m-b-xs\">\r\n                                    <div class=\"row font-body m-b-xs\">\r\n                                        <div class=\"col-md-5\">\r\n                                            <p class=\"font-weight-medium font-body\">Total Actions: </p>                        \r\n                                        </div>\r\n                                        <div class=\"col-md-7\">\r\n                                            <p class=\"font-body\">{{$ctrl.details.orderedPatentUIs.length}}</p>\r\n                                        </div>                                \r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"border-grey-xs--btm m-b-xs\">\r\n                                    <div class=\"row font-body m-b-xs\">                                \r\n                                        <div class=\"col-md-5\">\r\n                                            <p class=\"font-weight-medium font-body\">Actions: </p>                        \r\n                                        </div>                    \r\n                                        <div class=\"col-md-7\">\r\n                                            <span class=\"font-body\" data-ng-repeat=\"p in $ctrl.details.patentNos\">{{p.ep_ApplicationNo}} <span class=\"text-capitalize\">(p.serviceType)</span><br></span>\r\n                                        </div>  \r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"border-grey-xs--btm m-b-xs\">\r\n                                    <div class=\"row font-body m-b-xs\">                                \r\n                                        <div class=\"col-md-5\">\r\n                                            <p class=\"font-weight-medium font-body\">Date: </p>                        \r\n                                        </div>                  \r\n                                        <div class=\"col-md-7\">\r\n                                            <p class=\"font-body\">{{$ctrl.details.dateNowLocalTimeUI}}</p>\r\n                                        </div>\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"m-b-xs\"> \r\n                                    <div class=\"row font-body m-b-xs\">                         \r\n                                        <div class=\"col-md-5\">\r\n                                            <p class=\"font-weight-medium font-body\">Total Cost: </p>                        \r\n                                        </div>\r\n                                        <div class=\"col-md-7\">\r\n                                            <p class=\"font-body\">$ {{$ctrl.details.totalCostUSD | number: 2 }}</p>\r\n                                        </div> \r\n                                    </div>\r\n                                </div>\r\n                            </div>                       \r\n                            <div class=\"col-md-7 d-flex justify-content-end align-items-end\">\r\n                                <button class=\"btn btn--lg btn--red pill-radius m-r-sm\" data-ng-click=\"$ctrl.openCancelTransModal()\">Cancel transaction</button>                            \r\n                                <button class=\"btn btn--lg btn--green pill-radius\" data-ng-click=\"$ctrl.commitTransfer(); ngCart.empty()\" data-ng-disabled=\"$ctrl.commitTransferBtn\">Place this order</button>  \r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"d-none d-lg-block\">\r\n        <div class=\"row\">\r\n            <div class=\"col-lg-6 col-xl-6\">\r\n                <div class=\"content-panel\">\r\n                    <div class=\"content-panel__body bg-white\">\r\n                        <p class=\"font-h2 font-weight-medium\">Important notice</p>\r\n                        <div class=\" border-grey-xs--btm m-b-sm m-t-sm\"></div>\r\n                        <p class=\"font-body m-b-md\">Please check the transaction details below. When you press the \"Place this order\" button below you're entering in to a legal contract under our <a href=\"http://thepatent.place/terms\" target=\"__blank\" class=\"inline-link\">Terms and Conditions</a>.</p>\r\n                        <p class=\"font-h4 font-weight-medium m-b-md\">Funds must be received in to our U.S MoneyCorp account by:</p>                \r\n                        <p class=\"font-weight-bold font-h3 m-b-md\">{{$ctrl.details.transTargetEndDateUI}}</p>       \r\n                        <p class=\"font-body\">The transaction will be progressed at the time shown provided funds have been received. Otherwise the transaction will be cancelled and penalty charges will apply.  The cost of the European Action(s) may also change.</p>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\t        <div class=\"col-lg-6 col-xl-6\">\r\n                <div class=\"content-panel\">\r\n                    <div class=\"content-panel__body bg-white\">\r\n                        <p class=\"font-h3 font-weight-medium\">Order Summary</p>\r\n                        <div class=\" border-grey-xs--btm m-b-sm m-t-sm\"></div>\r\n                        <div class=\"row\">\r\n                            <div class=\"col-xl-12\">\r\n                                <div class=\"border-grey-xs--btm  m-b-xs\">\r\n                                    <div class=\"row m-b-xs\">\r\n                                        <div class=\"col-xl-8\">\r\n                                            <p class=\"font-weight-medium font-h4\">Total Patents: </p>                        \r\n                                        </div>\r\n                                        <div class=\"col-xl-4\">\r\n                                            <p class=\"font-h4\" >{{$ctrl.details.orderedPatentUIs.length}}</p>\r\n                                        </div>                                \r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"border-grey-xs--btm m-b-xs\">\r\n                                    <div class=\"row m-b-xs\">                                \r\n                                        <div class=\"col-xl-8\">\r\n                                            <p class=\"font-weight-medium font-h4\">Actions\r\n                                            </p>\r\n                                        </div>\r\n                                            <div class=\"col-xl-4\">\r\n                                                <span class=\"font-body\" data-ng-repeat=\"p in $ctrl.details.patentNos\">{{p.ep_ApplicationNo}} <span class=\"text-capitalize\">({{p.serviceType}})</span><br></span>\r\n                                            </div>  \r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"border-grey-xs--btm m-b-xs\">\r\n                                    <div class=\"row m-b-xs\">                                \r\n                                        <div class=\"col-xl-8\">\r\n                                            <p class=\"font-weight-medium font-h4\">Date: </p>                        \r\n                                        </div>                  \r\n                                        <div class=\"col-xl-4\">\r\n                                            <p class=\"font-h4\">{{$ctrl.details.dateNowLocalTimeUI}}</p>\r\n                                        </div>\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"row\">                         \r\n                                    <div class=\"col-xl-8\">\r\n                                        <p class=\"font-weight-medium font-h4\">Total Cost: </p>                        \r\n                                    </div>\r\n                                    <div class=\"col-xl-4\">\r\n                                        <p class=\"font-h4\">$ {{$ctrl.details.totalCostUSD | number: 2 }}</p>\r\n                                    </div> \r\n                                </div>\r\n                            </div>                       \r\n                        </div>\r\n            \t\t\t<div class=\"row m-t-md\">\r\n        \t\t\t\t\t<div class=\"col-xl-12 d-flex justify-content-end\">\r\n                                <button class=\"btn btn--lg btn--red pill-radius m-r-sm\" data-ng-click=\"$ctrl.openCancelTransModal()\">Cancel transaction</button>\r\n                                 <button class=\"btn btn--lg btn--green pill-radius\" data-ng-click=\"$ctrl.commitTransfer(); ngCart.empty()\" data-ng-disabled=\"$ctrl.preparingTransactionn\">Place this order</button>\r\n        \t\t\t\t\t</div>\t\t\t\t\t\t\r\n            \t\t\t</div>\r\n                    </div>\r\n    \t\t\t</div>\t\t\r\n            </div>\r\n    \t</div>\r\n    </div>\r\n\r\n<div class=\"caseoverview-load\" data-ng-show=\"$ctrl.preparingTransaction\">\r\n    <div class=\"caseoverview-load-backdrop\">\r\n        \r\n    </div>\r\n    <div class=\"caseoverview-loader d-flex justify-content-center align-items-center\">   \r\n        <div>\r\n            <i class=\"fas fa-cog fa-spin fa-2x m-b-xs txt-white\"></i>\r\n            <p class=\"txt-white font-h4 font-weight-bold\">We are just processing your transaction</p>\r\n        </div>\r\n    </div>\r\n</div>    \r\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/checkout/html/checkout.bank-transfer-success.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"row\">\n    <div class=\"col-md-12\">\n        <h1 class=\"font-h1 lh-default\" data-ng-bind=\"$ctrl.pageTitle\"></h1>\n    </div>\n</div>\n<div data-ng-controller=\"CartController\" class=\"m-b-xl\">\n    <div class=\"row m-b-md\">\n    \t<div class=\"col-md-12\">\n            <div class=\"content-panel\">\n                <div class=\"content-panel__body bg-white\">\n                    <p class=\"font-h3 font-weight-medium\">Important notice</p>\n                    <div class=\"border-grey-xs--btm m-t-md m-b-md\"></div>\n                    <div class=\"m-b-md\">\n                        <p class=\"font-body\">Thank you for your instruction. This data can be accessed via \"Transactions\" should you need it again. Please double check the reference you use when you make the transfer, as we rely on it to process your transaction. We may not be able to process your instruction if it's wrong. Once you've made the transfer you can follow the progess through the transaction monitor</p>               \n                    </div>\n                    <div class=\"row m-b-sm\">\n                        <div class=\"col-md-4\">\n                            <p class=\"font-weight-medium font-h4\">Transaction ID: </p>     \n                        </div>\n                       <div class=\"col-md-8\">                   \n                            <p class=\"font-weight-bold font-h4\">{{orderObj.p3sTransRef}}</p>\n                        </div>\n                    </div>\n                    <div class=\"row m-b-sm\">\n                        <div class=\"col-md-4\">\n                            <p class=\"font-weight-medium font-h4\">Date: </p>\n                        </div>\n                        <div class=\"col-md-8\">\n                            <p class=\"font-weight-bold font-h4\">{{orderObj.dateNowLocalTimeUI}}</p> <!--dummy date-->\n                        </div>              \n                    </div>\n                    <div class=\"row m-b-sm\">\n                        <div class=\"col-md-4\">\n                            <p class=\"font-weight-medium font-h4\">Funds received by: </p>\n                        </div>\n                        <div class=\"col-md-8\">\n                            <p class=\"font-weight-bold font-h4\">{{orderObj.transTargetEndDateUI}}</p> <!--dummy date-->\n                        </div>              \n                    </div>   \n                </div>\n            </div>\n        </div>\n    </div>\n    <div class=\"row\">\n        <div class=\"col-md-6\">\n            <div class=\"content-panel\">\n                <div class=\"content-panel__body bg-white\">\n                    <p class=\"font-h3 font-weight-medium\"><span class=\"font-weight-bold\" ng-bind=\"orderObj.bankTransferPaymentDetails.account1PaymentType\"></span> Account Details</p>\n                    <div class=\" border-grey-xs--btm m-t-md m-b-md\"></div>\n                    <div class=\"row\">\n                        <div class=\"col-md-12\">\n                            <div class=\"border-grey-xs--btm m-b-xs\">\n                                <div class=\"row font-body m-b-xs\">\n                                    <div class=\"col-md-12 col-lg-6 col-xl-6\">\n                                        <p class=\"font-weight-medium font-body\">Bank Name: </p>                        \n                                    </div>\n                                    <div class=\"col-md-12 col-lg-6 col-xl-6\">\n                                        <p class=\"font-body\">{{orderObj.bankTransferPaymentDetails.account1BankName}}</p>\n                                    </div>\n                                </div>\n                            </div>\n                            <div class=\"border-grey-xs--btm m-b-xs\">\n                                <div class=\"row font-body m-b-xs\">\n                                    <div class=\"col-md-12 col-lg-6 col-xl-6\">\n                                        <p class=\"font-weight-medium font-body\">ABA Routing Number: </p>                        \n                                    </div>\n                                    <div class=\"col-md-12 col-lg-6 col-xl-6\">\n                                        <p class=\"font-body\">{{orderObj.bankTransferPaymentDetails.account1BranchCode}}</p>\n                                    </div>\n                                </div>\n                            </div>\n                            <div class=\"border-grey-xs--btm m-b-xs\">\n                                <div class=\"row font-body m-b-xs\">\n                                    <div class=\"col-md-12 col-lg-6 col-xl-6\">\n                                        <p class=\"font-weight-medium font-body\">Account Number: </p>\n                                    </div>\n                                    <div class=\"col-md-12 col-lg-6 col-xl-6\">\n                                        <p class=\"font-body\">{{orderObj.bankTransferPaymentDetails.account1AcctNumber}}</p>\n                                    </div>\n                                </div>\n                            </div>\n                            <div class=\"border-grey-xs--btm m-b-xs\">\n                                <div class=\"row font-body m-b-xs\">\n                                    <div class=\"col-md-12 col-lg-6 col-xl-6\">\n                                        <p class=\"font-weight-medium font-body\">Account Type: </p>\n                                    </div>\n                                    <div class=\"col-md-12 col-lg-6 col-xl-6\">\n                                        <p class=\"font-body\">{{orderObj.bankTransferPaymentDetails.account1AcctType}}</p>\n                                    </div>\n                                </div>\n                            </div>\n                            <div class=\"border-grey-xs--btm m-b-xs\">\n                                <div class=\"row font-body m-b-xs\">\n                                    <div class=\"col-md-12 col-lg-6 col-xl-6\">\n                                        <p class=\"font-weight-medium font-body\">Account Name: </p>                        \n                                    </div>\n                                    <div class=\"col-md-12 col-lg-6 col-xl-6\">\n                                        <p class=\"font-body\">{{orderObj.bankTransferPaymentDetails.account1AcctName}}</p>\n                                    </div>\n                                </div>\n                            </div>\n                            <div class=\"border-grey-xs--btm m-b-xs\">\n                                <div class=\"row font-body m-b-xs\">\n                                    <div class=\"col-md-12 col-lg-6 col-xl-6\">\n                                        <p class=\"font-weight-medium font-body\">Reference: </p>                        \n                                    </div>\n                                    <div class=\"col-md-12 col-lg-6 col-xl-6\">\n                                        <p class=\"font-body\">{{orderObj.p3sTransRef}}</p>\n                                    </div>\n                                </div>\n                            </div>\n                            <div class=\"border-grey-xs--btm m-b-xs\">\n                                <div class=\"row font-body m-b-xs\">\n                                    <div class=\"col-md-12 col-lg-6 col-xl-6\">\n                                        <p class=\"font-weight-medium font-body\">Amount: </p>                        \n                                    </div>\n                                    <div class=\"col-md-12 col-lg-6 col-xl-6\">\n                                        <p class=\"font-body\">$ {{orderObj.totalCostUSD | number: 2 }}</p>\n                                    </div>\n                                </div>\n                            </div>                                                                                                                                                     \n                        </div>\n                    </div>\n    \t\t\t</div>\n            </div>\n        </div>\n        <div class=\"col-md-6\">\n            <div class=\"content-panel\">\n                <div class=\"content-panel__body bg-white\">\n                    <p class=\"font-h3 font-weight-medium\"><span class=\"font-weight-bold\" ng-bind=\"orderObj.bankTransferPaymentDetails.account2PaymentType\"></span> Account Details</p>\n                    <div class=\" border-grey-xs--btm m-t-md m-b-md\"></div>\n                    <div class=\"row\">\n                        <div class=\"col-md-12\">\n                            <div class=\"border-grey-xs--btm m-b-xs\">\n                                <div class=\"row font-body m-b-xs\">\n                                    <div class=\"col-md-12 col-lg-6 col-xl-6\">\n                                        <p class=\"font-weight-medium font-body\">Bank Name: </p>                        \n                                    </div>\n                                    <div class=\"col-md-12 col-lg-6 col-xl-6\">\n                                        <p class=\"font-body\">{{orderObj.bankTransferPaymentDetails.account2BankName}}</p>\n                                    </div>\n                                </div>\n                            </div>\n                            <div class=\"border-grey-xs--btm m-b-xs\">\n                                <div class=\"row font-body m-b-xs\">\n                                    <div class=\"col-md-12 col-lg-6 col-xl-6\">\n                                        <p class=\"font-weight-medium font-body\">ABA Routing Number: </p>                        \n                                    </div>\n                                    <div class=\"col-md-12 col-lg-6 col-xl-6\">\n                                        <p class=\"font-body\">{{orderObj.bankTransferPaymentDetails.account2BranchCode}}</p>\n                                    </div>\n                                </div>\n                            </div>\n                            <div class=\"border-grey-xs--btm m-b-xs\">\n                                <div class=\"row font-body m-b-xs\">\n                                    <div class=\"col-md-12 col-lg-6 col-xl-6\">\n                                        <p class=\"font-weight-medium font-body\">Account Number: </p>\n                                    </div>\n                                    <div class=\"col-md-12 col-lg-6 col-xl-6\">\n                                        <p class=\"font-body\">{{orderObj.bankTransferPaymentDetails.account2AcctNumber}}</p>\n                                    </div>\n                                </div>\n                            </div>\n                            <div class=\"border-grey-xs--btm m-b-xs\">\n                                <div class=\"row font-body m-b-xs\">\n                                    <div class=\"col-md-12 col-lg-6 col-xl-6\">\n                                        <p class=\"font-weight-medium font-body\">Account Type: </p>\n                                    </div>\n                                    <div class=\"col-md-12 col-lg-6 col-xl-6\">\n                                        <p class=\"font-body\">{{orderObj.bankTransferPaymentDetails.account2AcctType}}</p>\n                                    </div>\n                                </div>\n                            </div>\n                            <div class=\"border-grey-xs--btm m-b-xs\">\n                                <div class=\"row font-body m-b-xs\">\n                                    <div class=\"col-md-12 col-lg-6 col-xl-6\">\n                                        <p class=\"font-weight-medium font-body\">Account Name: </p>                        \n                                    </div>\n                                    <div class=\"col-md-12 col-lg-6 col-xl-6\">\n                                        <p class=\"font-body\">{{orderObj.bankTransferPaymentDetails.account2AcctName}}</p>\n                                    </div>\n                                </div>\n                            </div>\n                            <div class=\"border-grey-xs--btm m-b-xs\">\n                                <div class=\"row font-body m-b-xs\">\n                                    <div class=\"col-md-12 col-lg-6 col-xl-6\">\n                                        <p class=\"font-weight-medium font-body\">Reference: </p>                        \n                                    </div>\n                                    <div class=\"col-md-12 col-lg-6 col-xl-6\">\n                                        <p class=\"font-body\">{{orderObj.p3sTransRef}}</p>\n                                    </div>\n                                </div>\n                            </div>\n                            <div class=\"border-grey-xs--btm m-b-xs\">\n                                <div class=\"row font-body m-b-xs\">\n                                    <div class=\"col-md-12 col-lg-6 col-xl-6\">\n                                        <p class=\"font-weight-medium font-body\">Amount: </p>                        \n                                    </div>\n                                    <div class=\"col-md-12 col-lg-6 col-xl-6\">\n                                        <p class=\"font-body\">$ {{orderObj.totalCostUSD | number: 2 }}</p>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>      \n    </div><!-- row end-->\n    <div class=\"row m-t-md\">\n        <div class=\"col-md-12 d-flex justify-content-end btn-default\">\n            <a class=\"btn btn--lg btn--green pill-radius m-r-sm\" data-ng-href=\"{{orderObj.proformaInvoiceUrl}}\" download>Download Invoice</a>\n            <a class=\"btn btn--lg btn--green pill-radius\" data-ui-sref=\"dashboard\">Return to dashboard</a>\n        </div>\n    </div>        \n</div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/checkout/html/checkout.basket.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"row\">\n    <div class=\"col-md-12\">\n        <h1 class=\"font-h1 lh-default\" data-ng-bind=\"$ctrl.pageTitle\"></h1>\n    </div>\n</div>\n<div class=\"m-b-xl\">\n    <ngcart-cart></ngcart-cart>\n    <ngcart-checkout service=\"http\"></ngcart-checkout>\n</div>\n\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/dashboard/html/dashboard.actions-available.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"container__scrollable-area\">\n    <div class=\"row\">\n        <div class=\"col-md-12\">\n            <div class=\"d-flex align-items-center justify-content-between py-3 px-4\">\n                <div uib-popover-template=\"'availableactionstpl.html'\" popover-trigger=\"'none'\" popover-is-open=\"displayHelp\"  popover-placement=\"right\">\n                    <h4 class=\"font-h4 font-weight-bold\">Available European Actions</h4>\n                    <script type=\"text/ng-template\" id=\"availableactionstpl.html\" class=\"left\">\n                        <button class=\"btn btn-no-bg mdtooltip-close\" data-ng-click=\"displayFirstHelp(false)\">\n                            <i class=\"fal fa-times fa-lg txt-black\"></i>\n                        </button>\n                        <div>\n                            <p>This table will display all actions available for all cases added to the system</p>\n                        </div>\n                    </script>   \n                </div>\n                <div class=\"d-flex align-items-center\">                \n                    <md-chips data-ng-model=\"$ctrl.chipOptions\" readonly=\"true\" md-removable=\"true\" class=\"text-capitalize font-weight-medium cursor-pointer\" md-on-remove=\"selectedChip($chip.prop, $chip.value, $chip.cat); getItems($chip.cat, availableActions)\">\n                        <md-chip-template>\n                            <strong class=\"font-body\"><span data-ng-show=\"{{$chip.prop}} == 'epct'\">Euro-PCT</span><span data-ng-hide=\"{{$chip.prop}} == 'epct'\">{{$chip.prop}}</span></strong>\n                            <em class=\"font-body\" data-ng-if=\"$chip.cat ==='serviceType'\">(action)</em><em class=\"font-body\" data-ng-if=\"$chip.cat ==='currentStageColour'\">(phase)</em>                     \n                        </md-chip-template>\n                        <!-- <md-icon><i class=\"d-flex input-group-text pill-radius fa fa-search\"></i></md-icon> -->\n                    </md-chips>\n                    <div class=\"m-r-lg\">\n                        <div class=\"input-group m-r-sm\">\n                            <input type=\"text\" class=\"form-control pill-radius\" name=\"availableActionsSearch\" data-ng-model=\"searchAvailableActions\" placeholder=\"Search available actions...\" autocomplete=\"off\">  \n                            <div class=\"input-group-append\">\n                                <div class=\"input-group-text\">\n                                    <i class=\"pill-radius fa fa-search fa-lg\"></i>\n                                </div>\n                            </div>\n                        </div>\n                    </div>     \n                    <div>\n                        <md-menu md-position-mode=\"target-right target\">\n                            <md-button class=\"icon-stretch icon-stretch--icon black pill-radius\" data-ng-click=\"$ctrl.showFilter($mdMenu, $event)\">\n                                <span class=\"icon-text\">Filter</span>              \n                                <i class=\"fal fa-filter fa-2x cursor-pointer icon\"></i> \n                            </md-button>\n                            <md-menu-content class=\"container-filter-list\">\n                                <md-list class=\"box\" data-ng-repeat=\"cat in categories\" ng-init=\"filter[cat]={}\">\n                                    <md-subheader class=\"md-no-sticky\">\n                                        <h2 class=\"font-h3\" data-ng-if=\"cat == 'saleType'\">Processing</h2>\n                                        <h2 class=\"font-h3\" data-ng-if=\"cat == 'currentStageColour'\">Current Stage Colour</h2>\n                                        <h2 class=\"font-h3\" data-ng-if=\"cat == 'nextStageColour'\">Next Stage Colour</h2>\n                                        <h2 class=\"font-h3\" data-ng-if=\"cat == 'serviceType'\">European Action</h2>\n                                    </md-subheader>\n                                    <md-list-item data-ng-repeat=\"value in getItems(cat, availableActions)\">\n                                        <md-checkbox class=\"md-secondary\" data-ng-model=\"filter[cat][value]\" data-ng-change=\"updateFiltered(value, filter[cat][value], cat);\"> \n                                        </md-checkbox>\n                                        <p>({{(filtered | filter:value:true).length}})&nbsp;\n                                            <span class=\"text-capitalize\" data-ng-if=\"value == 'GREY'\">Grey</span>\n                                            <span class=\"text-capitalize\" data-ng-if=\"value == 'Offline'\">Offline (Manual/Urgent)</span>\n                                            <span class=\"text-capitalize\" data-ng-if=\"value == 'epct'\">Euro-PCT</span>\n                                            <span class=\"text-capitalize\" data-ng-if=\"value !== 'epct' && value !== 'GREY' && value !== 'Offline'\">{{value}}</span>\n                                        </p>\n                                    </md-list-item>\n                                    <md-divider></md-divider>\n                                </md-list>\n                                <div layout=\"row\" class=\"demo-dialog-button\">\n                                    <md-button md-autofocus flex class=\"md-primary\" data-ng-click=\"closeDialog();\">\n                                        Close\n                                    </md-button>\n                                </div>\n                            </md-menu-content>\n                        </md-menu>\n                    </div>\n                </div> \n            </div>\n        </div>\n    </div>\n    <div class=\"scrollable-area scrollable-area--set-height-md\">\n        <table class=\"t-data sticky-table\">\n            <thead class=\"sticky-thead\">\n                <tr class=\"t-data__row t-data__row--select\">\n                    <th class=\"t-data__th t-data__th--xs sticky-th\" data-ng-click=\"$ctrl.sortBy('ep_ApplicationNumber');\">\n                        <span>App No.</span>\n                        <span data-ng-show=\"$ctrl.propertyName == 'ep_ApplicationNumber' && !$ctrl.reverse\">\n                            <i class=\"fas fa-angle-down fa-lg\"></i>\n                        </span>\n                        <span data-ng-show=\"$ctrl.propertyName == 'ep_ApplicationNumber' && $ctrl.reverse\">\n                            <i class=\"fas fa-angle-up fa-lg\"></i>\n                        </span>\n                    </th>             \n                    <th class=\"t-data__th t-data__th--sm\">\n                        <span>European Action</span>\n                    </th>\n                    <th class=\"t-data__th t-data__th--sm\">\n                        <span>Current Phase</span>\n                    </th>\n                    <th class=\"t-data__th t-data__th--sm\">\n                        <span>Next Phase</span>    \n                    </th>                    \n                    <th class=\"t-data__th t-data__th--xs\">\n                        <span></span>\n                    </th>\n                </tr>\n            </thead>\n            \n            <tbody class=\"sticky-tbody\">\n                <tr data-ng-repeat=\"patent in filtered=(availableActions | filter:filterByPropertiesMatchingAND | filter:searchAvailableActions) | orderBy:$ctrl.propertyName:$ctrl.reverse as Result\" data-ng-click=\"$ctrl.rowSelect($event, patent); $ctrl.select(patent.patentID)\"  class=\"t-data__row t-data__row--select\" data-ng-class=\"{active: patent.patentID == $ctrl.selected}\">\n                    <td class=\"t-data__td t-data__td--xs sticky-td\">\n                        <a class=\"t-data__a\" data-ng-bind=\"patent.ep_ApplicationNumber\" data-ng-attr-id=\"{{patent.patentID}}\"></a>\n                    </td>\n                    <td class=\"t-data__td t-data__td--sm\">\n                         <table>\n                      \n                            <div class=\"d-flex justify-content-left btn-underlined-selector\">\n                                <span data-ng-bind=\"patent.p3sServices[0].serviceType\" data-ng-if=\"patent.p3sServices[0].serviceType !== 'postgrant' && patent.p3sServices[0].serviceType !== 'epct'\" class=\"text-capitalize\"></span>\n                                <span data-ng-if=\"patent.p3sServices[0].serviceType == 'epct'\" class=\"text-capitalize\">Euro-PCT</span>\n                                <span data-ng-if=\"patent.p3sServices[0].serviceType == 'postgrant'\" class=\"text-capitalize\">----</span>\n                            </div>\n                        \n                        </table>\n                    </td><!--when multiple services begin-->                    \n                    <td class=\"t-data__td t-data__td--sm\">\n                        <table>\n                  \n                            <div data-ng-if=\"(patent.p3sServices[0].saleType === 'Online' || patent.p3sServices[0].saleType === 'Offline') && patent.p3sServices[0].serviceType !== 'validation'\">\n                                <div class=\"d-flex flex-column\">\n                                    <div class=\"d-flex justify-content-start align-patent.p3sServices[0]s-center\"><!--display costs-->\n                                        <p class=\"font-weight-bold m-r-sm\"><i class=\"fas fa-circle m-r-xs\" data-ng-class=\"patent.p3sServices[0].cssCurrent\"></i>$ {{patent.p3sServices[0].currentStageCostUSD | number: 2}}</p>\n                                    </div>\n                                </div>\n                            </div>\n                            <div data-ng-if=\"patent.p3sServices[0].serviceType == 'validation' && (patent.p3sServices[0].serviceStatus == 'Validation available' || patent.p3sServices[0].serviceStatus == 'Preparing quote')\">\n                                <div class=\"d-flex flex-column\">\n                                    <div class=\"d-flex justify-content-start\"><!--display costs-->\n                                        <p class=\"font-weight-bold txt-phase-green\" data-ng-if=\"patent.p3sServices[0].serviceStatus == 'Validation available'\">Request Quote</p>\n                                        <p class=\"font-weight-bold txt-phase-green\" data-ng-if=\"patent.p3sServices[0].serviceStatus == 'Preparing quote'\">Preparing Quote</p>\n                                    </div>\n                                </div>\n                            </div>                            \n                            <div data-ng-if=\"patent.p3sServices[0].serviceType == 'validation' && patent.p3sServices[0].serviceStatus == 'Quote provided'\">\n                                <div class=\"d-flex flex-column\">\n                                    <div class=\"d-flex justify-content-start\"><!--display costs-->\n                                        <p class=\"font-weight-bold m-r-sm\"><i class=\"fas fa-circle m-r-xs\" data-ng-class=\"patent.p3sServices[0].cssCurrent\"></i>$ {{patent.p3sServices[0].currentStageCostUSD | number: 2}}</p>\n                                    </div>\n                                </div>\n                            </div>                                \n                            <div data-ng-if=\"(patent.p3sServices[0].saleType !== 'Online' && patent.p3sServices[0].saleType !== 'Offline' && patent.p3sServices[0].serviceStatus !== 'Epct being generated') || (patent.p3sServices[0].saleType == 'Offline' && patent.p3sServices[0].serviceType == 'validation')\">\n                                <p class=\"txt-grey\">N/A</p>\n                            </div>                           \n                           \n                        </table>                         \n                    </td><!--when multiple services begin-->     \n                    <td class=\"t-data__td t-data__td--sm\">\n                        <table>\n                            \n                                <div data-ng-if=\"(patent.p3sServices[0].saleType === 'Online' || patent.p3sServices[0].saleType === 'Offline') && patent.p3sServices[0].serviceType !== 'validation'\">\n                                    <div class=\"d-flex flex-column\">\n                                        <div class=\"d-flex justify-content-start align-patent.p3sServices[0]s-center\"><!--display costs-->\n\n                                            <p data-ng-if=\"(!patent.p3sServices[0].isUrgentAttention && patent.p3sServices[0].currentStageColour !== 'Black' && (patent.p3sServices[0].saleType === 'Online' || patent.p3sServices[0].saleType === 'Offline')) || (!patent.p3sServices[0].isUrgentAttention && patent.p3sServices[0].currentStageColour == 'Black' && (patent.p3sServices[0].saleType === 'Online' || patent.p3sServices[0].saleType === 'Offline')) || \n                                            (patent.p3sServices[0].isUrgentAttention && patent.p3sServices[0].currentStageColour == 'Red' && (patent.p3sServices[0].saleType === 'Online' || patent.p3sServices[0].saleType === 'Offline'))\" class=\"font-weight-bold\"><i class=\"fas fa-circle m-r-xs\" data-ng-class=\"patent.p3sServices[0].cssNext\"></i> $ {{patent.p3sServices[0].nextStageCostUSD | number: 2}}</p> \n                                            <p data-ng-if=\"patent.p3sServices[0].isUrgentAttention && patent.p3sServices[0].currentStageColour == 'Black' && patent.p3sServices[0].serviceType === 'renewal'\" class=\"font-weight-bold\">LAPSE</p> <!--if current colour is black and urgent attention required. Means that it is the second stage of black and is renewal-->\n                                            <p data-ng-if=\"patent.p3sServices[0].isUrgentAttention && patent.p3sServices[0].currentStageColour == 'Red' && patent.p3sServices[0].serviceType !== 'renewal'\" class=\"font-weight-bold\">LAPSE</p> <!--if current colour is black and urgent attention required. Means that it is the second stage of black-->\n                                        </div>    \n                                    </div>\n                                </div>                            \n                                <div data-ng-if=\"(patent.p3sServices[0].saleType !== 'Online' && patent.p3sServices[0].saleType !== 'Offline' && patent.p3sServices[0].serviceStatus !== 'Epct being generated') || patent.p3sServices[0].serviceType == 'validation'\">\n                                    <p class=\"txt-grey\">N/A</p>\n                                </div>\n                           \n                        </table>                              \n                    </td><!--when multiple services begin-->     \n                    <td class=\"t-data__td t-data__td--xs\">\n                        <button class=\"btn btn-no-bg btn-underlined pill-radius font-body txt-phase-green font-weight-normal nowrap\" data-ui-sref=\"portfolio.modal.case({caseId: patent.patentID})\">View Patent</button>\n                    </td>\n                </tr>\n                <tr data-ng-show=\"Result.length==0\">\n                    <td class=\"t-data__td text-left\" colspan=\"8\">\n                        No Results Found\n                    </td>\n                </tr>                                   \n            </tbody>\n        </table>\n    </div><!-- response table end-->\n\n</div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/dashboard/html/dashboard.europcts-graph.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"widget-panel widget-panel-sq\">\n\t<div class=\"widget-panel__body bg-white d-flex flex-column\">\n\t\t<div>\t\t\n\t\t\t<p class=\"font-h4 font-weight-bold\">Euro-PCT formalities</p>\n\t\t</div>\n\t\t<div class=\"row d-flex flex-grow-1 just-content-center align-items-center\">\n\t\t\t<div class=\"col-md-12 col-lg-12 col-xl-12\">\n\t\t\t\t\n\t\t\t\t<div data-ng-if=\"$ctrl.donutData.total !== 0\">\n\t\t\t\t\t<nvd3 options=\"$ctrl.donutOptions\" data=\"$ctrl.donutData.phases\" class=\"with-transitions\"></nvd3>\n\t\t\t\t\t<div class=\"donut-inner\">\n\t\t\t\t\t\t<h4 class=\"font-h4 font-weight-bold\">Total</h4>\n\t\t\t\t\t\t<span class=\"font-h2 font-weight-bold\">{{$ctrl.donutData.total}}</span>\t\t\t\t\t\t\t\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div data-ng-if=\"$ctrl.donutData.total === 0\">\n\t\t\t\t\t<p class=\"font-body text-center\">There are currently no Euro-PCT formalities</p>\n\t\t\t\t</div>\t\t\n\t\t\t\t<!--check whether it works when its back online-->\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/dashboard/html/dashboard.fxchart-widget.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"widget-panel\">\n\t<div class=\"widget-panel__body bg-white\">\n\t\t<div class=\"row m-b-md\">\n\t\t\t<div class=\"col-md-12\">\n\t\t\t\t<h3 class=\"font-h3\"><span class=\"font-weight-bold\">FX Chart</span> - USD:EUR</h3>\n\t\t\t</div>\n\t\t</div>\n\n\t\t<div data-ng-hide=\"$ctrl.fxChartLoaded\" class=\" d-flex flex-column justify-content-center align-items-center h-100\">\n\t        <i class=\"fas fa-cog fa-spin fa-2x m-b-xs\"></i>\n\t        <p>We are just fetching latest FX data</p>\n        </div>\n\t\t\n\t\t<div data-ng-show=\"$ctrl.fxChartLoaded\">\n\t\t\t<nvd3 options=\"$ctrl.lineOptions\" data=\"$ctrl.lineData\" class=\"with-transitions\"></nvd3> <!--xAxisTickFormat=\"xAxisTickFormatFunction()\"-->\n\t\t</div>\n\t</div>\n</div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/dashboard/html/dashboard.grants-graph.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"widget-panel widget-panel-sq\">\n\t<div class=\"widget-panel__body bg-white d-flex flex-column\">\n\t\t<div>\t\t\n\t\t\t<p class=\"font-h4 font-weight-bold\">Grant formalities</p>\n\t\t</div>\n\t\t<div class=\"row d-flex flex-grow-1 just-content-center align-items-center\">\n\t\t\t<div class=\"col-md-12 col-lg-12 col-xl-12\">\n\t\t\t\t\n\t\t\t\t<div data-ng-if=\"$ctrl.donutData.total !== 0\">\n\t\t\t\t\t<nvd3 options=\"$ctrl.donutOptions\" data=\"$ctrl.donutData.phases\" class=\"with-transitions\"></nvd3>\n\t\t\t\t\t<div class=\"donut-inner\">\n\t\t\t\t\t\t<h4 class=\"font-h4 font-weight-bold\">Total</h4>\n\t\t\t\t\t\t<span class=\"font-h2 font-weight-bold\">{{$ctrl.donutData.total}}</span>\t\t\t\t\t\t\t\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div data-ng-if=\"$ctrl.donutData.total === 0\">\n\t\t\t\t\t<p class=\"font-body text-center\">There are currently no Grant formalities on the system</p>\n\t\t\t\t</div>\t\t\n\t\t\t\t<!--check whether it works when its back online-->\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/dashboard/html/dashboard.renewals-graph.tpl.htm":
/***/ (function(module, exports) {

module.exports = "\n<div class=\"widget-panel widget-panel-sq\" uib-popover-template=\"'addcasestemplate.html'\" popover-trigger=\"'none'\" popover-is-open=\"displayHelp\"  popover-placement=\"top\">\n\t<div class=\"widget-panel__body bg-white d-flex flex-column\">\n\t\t<div>\t\t\n\t\t\t<p class=\"font-h4 font-weight-bold\">Renewal formalities</p>\n\t\t</div>\n\t\t<div class=\"row d-flex flex-grow-1 just-content-center align-items-center\">\n\t\t\t<div class=\"col-md-12 col-lg-12 col-xl-12\">\n\t\t\t\t\n\t\t\t\t<div data-ng-if=\"$ctrl.donutData.total !== 0\">\n\t\t\t\t\t<nvd3 options=\"$ctrl.donutOptions\" data=\"$ctrl.donutData.phases\" class=\"with-transitions\"></nvd3>\n\t\t\t\t\t<div class=\"donut-inner\">\n\t\t\t\t\t\t<h4 class=\"font-h4 font-weight-bold\">Total</h4>\n\t\t\t\t\t\t<span class=\"font-h2 font-weight-bold\">{{$ctrl.donutData.total}}</span>\t\t\t\t\t\t\t\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div data-ng-if=\"$ctrl.donutData.total === 0\">\n\t\t\t\t\t<p class=\"font-body text-center\">There are currently no Renewal formalities on the system</p>\n\t\t\t\t</div>\t\t\n\t\t\t\t<!--check whether it works when its back online-->\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\n</div>\n<script type=\"text/ng-template\" id=\"addcasestemplate.html\" class=\"left\">\n    <button class=\"btn btn-no-bg mdtooltip-close\" data-ng-click=\"displayFirstHelp(false)\">\n        <i class=\"fal fa-times fa-lg txt-black\"></i>\n    </button>\n    <div>\n        <p>The donut charts represent the total number European actions within each color phase</p>\n    </div>\n</script>  ";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/dashboard/html/dashboard.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"m-b-xl d-flex flex-column flex-grow-1 animate-show\">\n\t<div data-ng-hide=\"dashboardLoaded\" class=\"animate-show h-100\">\n\t\t<div class=\" d-flex flex-column justify-content-center align-items-center h-100\">\n\t        <i class=\"fas fa-cog fa-spin fa-2x m-b-xs\"></i>\n\t        <p>We are just preparing your dashboard</p>\n        </div>\n\t</div>\n\t<div data-ng-show=\"dashboardLoaded\" class=\"animate-show\">\n\t\t<div class=\"row\">\n\t\t\t<div class=\"col-sm-12\">\n\t\t\t\t<h1 class=\"font-h1 lh-default\">Dashboard</h1>\n\t\t\t</div>\n\t\t</div>\t\t\n\t\t<div class=\"row m-b-xl lg-m-b-md dashboard-row-top\">\t\n\t\t\t<div class=\"col-md-4 col-lg-3 col-xl-3\">\n\t\t\t\t<div ui-view=\"europctsgraph\" class=\"h-100\"></div>\n\t\t\t</div>\n\t\t\t<div class=\"col-md-4 col-lg-3 col-xl-3\">\n\t\t\t\t<div ui-view=\"renewalsgraph\" class=\"h-100\"></div>\n\t\t\t</div>\n\t\t\t<div class=\"col-md-4 col-lg-3 col-xl-3\">\n\t\t\t\t<div ui-view=\"grantsgraph\" class=\"h-100\"></div>\n\t\t\t</div>\n\t\t\t<div class=\"col-md-4 col-lg-3 col-xl-3\">\n\t\t\t\t<div ui-view=\"validationsgraph\" class=\"h-100\"></div>\n\t\t\t</div>\t\t\t\t\t\t\t\t\t\n\t\t</div>\n\t\t<div class=\"row m-b-xl lg-m-b-md\">\n\t\t\t<div class=\"col-md-12 col-lg-12 col-xl-6 md-m-b-md lg-m-b-md\">\n\t\t\t\t<div ui-view=\"actionsavailable\" class=\"h-100\"></div>\n\t\t\t</div>\n\t\t\t<div class=\"col-md-12 col-lg-12 col-xl-6 lg-m-b-md d-md-none d-lg-block\" >\n\t\t\t\t<div ui-view=\"fxchartwidget\" class=\"h-100\"></div>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/dashboard/html/dashboard.validations-graph.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"widget-panel widget-panel-sq\">\n\t<div class=\"widget-panel__body bg-white d-flex flex-column\">\n\t\t<div>\t\t\n\t\t\t<p class=\"font-h4 font-weight-bold\">Validation formalities</p>\n\t\t</div>\n\t\t<div class=\"row d-flex flex-grow-1 just-content-center align-items-center\">\n\t\t\t<div class=\"col-md-12 col-lg-12 col-xl-12\">\n\t\t\t\t\n\t\t\t\t<div data-ng-if=\"$ctrl.donutData.total !== 0\">\n\t\t\t\t\t<nvd3 options=\"$ctrl.donutOptions\" data=\"$ctrl.donutData.phases\" class=\"with-transitions\"></nvd3>\n\t\t\t\t\t<div class=\"donut-inner\">\n\t\t\t\t\t\t<h4 class=\"font-h4 font-weight-bold\">Total</h4>\n\t\t\t\t\t\t<span class=\"font-h2 font-weight-bold\">{{$ctrl.donutData.total}}</span>\t\t\t\t\t\t\t\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div data-ng-if=\"$ctrl.donutData.total === 0\">\n\t\t\t\t\t<p class=\"font-body text-center\">There are currently no Validation formalities on the system</p>\n\t\t\t\t</div>\t\t\n\t\t\t\t<!--check whether it works when its back online-->\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/forgot-password/html/forgot-password.tpl.htm":
/***/ (function(module, exports, __webpack_require__) {

module.exports = "<div class=\"d-flex justify-content-center align-items-center content-panel\">\n   <div class=\"container-pre-app__center-box-40\">\n      <div class=\"content-panel__body bg-white p-t-xxxl p-b-xxxl p-r-6 p-l-6\">\n         <div class=\"row\">\n            <div class=\"col-xl-12 text-center\">\n               <img src=\"" + __webpack_require__("./assets/imgs/logos/pp-logo-text-black.png") + "\" alt=\"patent place logo with text\" width=\"200\" class=\"m-b-lg\">\n            </div>  \n         </div>\n         \n         <div class=\"row m-b-lg\">\n            <div class=\"col-md-12 text-center\">\n               <h1 class=\"font-h1 font-weight-light\">Forgotten your password</h1>\n            </div>\n         </div>\n         <div id=\"initialForgotPass\">\n            <p class=\"m-b-sm\">Please provide the email address registered to your account</p>\n            <form name=\"forgottenForm\" data-ng-submit=\"$ctrl.submitEmail($ctrl.formData.emailAddress)\">\n               <div class=\"form-group\" data-ng-class=\"{ 'has-error': forgottenForm.emailAddress.$dirty && forgottenForm.emailAddress.$error.required }\">\n                  <input type=\"text\" name=\"emailAddress\"  class=\"form-control\" data-ng-model=\"$ctrl.formData.emailAddress\" placeholder=\"Email address\" data-validate-email required>\n                  <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"forgottenForm.emailAddress.$error.required && forgottenForm.emailAddress.$dirty\">Please fill out this field</p>                  \n                  <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"forgottenForm.emailAddress.$error.email && forgottenForm.emailAddress.$dirty\">Please enter a valid email address</p>\n               </div>\n               <div class=\"form-actions text-right\">\n                  <button type=\"submit\" data-ng-disabled=\"forgottenForm.$invalid || $ctrl.dataLoading\" class=\"btn btn--lg btn-block btn--green pill-radius\">Send Verification Email</button>\n               </div>\n            </form>\n         </div>\n      </div>\n   </div>\n</div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/forgot-password/html/modals/modal.reset-password-verification-error.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n\t<span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"fas fa-exclamation-circle fa-4x txt-phase-red\"></i>   \n    </div>\n\t<p class=\"font-h3 font-weight-medium\">Error verifying your reset password request</p>\n\t<p class=\"font-body w-100 text-center m-b-sm m-t-xs\">We are sorry but there was an error when verifying your reset password request. Please attempt the process again. If it's still a problem then please let us know: support@ip.place</p>\n    <div class=\"d-flex\">\n    \t<button class=\"btn btn--lg btn--green pill-radius m-r-md\" data-ng-click=\"$ctrl.dismissModal()\">Dismiss</button>\n    </div>\n</div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/forgot-password/html/reset-password.tpl.htm":
/***/ (function(module, exports, __webpack_require__) {

module.exports = "<div class=\"d-flex justify-content-center align-items-center content-panel\">\n   <div class=\"container-pre-app__center-box-40\">\n      <div class=\"content-panel__body bg-white p-t-xxxl p-b-xxxl p-r-6 p-l-6\">\n         <div class=\"row\">\n            <div class=\"col-xl-12 text-center\">\n               <img src=\"" + __webpack_require__("./assets/imgs/logos/pp-logo-text-black.png") + "\" alt=\"patent place logo with text\" width=\"200\" class=\"m-b-lg\">\n            </div>  \n         </div>\n         \n         <div class=\"row m-b-lg\">\n            <div class=\"col-md-12 text-center\">\n               <h1 class=\"font-h1 font-weight-light\">Enter in new password</h1>\n            </div>\n         </div>\n         <div id=\"initialForgotPass\">\n            <p class=\"m-b-sm\">Please enter and confirm your new password</p>\n            <form name=\"resetPasswordForm\" data-ng-submit=\"$ctrl.submitEmail($ctrl.formData.password)\">\n                <div class=\"form-group row m-b-none\">\n                    <div class=\"col-md-12 col-lg-12 col-xl-12\">\n                        <div class=\"icon-field\">\n                            <input type=\"password\" name=\"password\" id=\"password\" class=\"form-control font-body pill-radius m-b-xs\" data-ng-blur=\"visitedPassword=true\" autocomplete=\"off\" placeholder=\"Password\" data-ng-model=\"$ctrl.formData.password\" zxcvbn=\"$ctrl.passwordStrength\" data-ng-change=\"$ctrl.passwordUpdate($ctrl.formData.password);\"  required>\n                            <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"resetPasswordForm.password.$error.required && resetPasswordForm.password.$dirty\">Please fill out this field</p>\n                            <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"resetPasswordForm.password.$error.minlength && resetPasswordForm.password.$dirty\">Password needs to be a minimum of 8 characters</p>\n                            <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"resetPasswordForm.password.$error.maxlength && resetPasswordForm.password.$dirty\">Password needs to be a maximum of 20 characters</p>\n                        </div>\n                        <div class=\"m-t-xs m-b-xs\">\n                            <zx-password-meter value=\"{{ $ctrl.passwordStrength.score }}\" max=\"4\"></zx-password-meter>\n                        </div>\n                  </div>\n               </div>\n               <div class=\"form-group row\">\n                  <div class=\"col-md-12 col-lg-12 col-xl-12\">\n                     <input type=\"password\" name=\"confirmPassword\" class=\"form-control font-body pill-radius\" data-ng-model=\"$ctrl.formData.confirmPassword\" data-confrim-pw-to=\"$ctrl.formData.password\" placeholder=\"Confirm Password\" required>\n                     <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"resetPasswordForm.confirmPassword.$invalid && resetPasswordForm.password.$dirty\">Passwords don't match.</p>\n                  </div>\n               </div>\n                <div class=\"row m-b-sm \">\n                    <div class=\"col-md-12 col-lg-12 col-xl-12 d-flex justify-content-end\">\n                        <div\n                            vc-recaptcha\n                            theme=\"'light'\"\n                            key=\"$ctrl.recap.publicKey\"\n                        ></div>\n                    </div>\n                </div>\n<!--                 <div  class=\"d-inline m-l-sm\">\n                    \n                </div>    -->                    \n               <div class=\"form-actions text-right\">\n                    <button type=\"submit\" data-ng-disabled=\"resetPasswordForm.$invalid || $ctrl.dataLoading\" class=\"btn btn--lg btn-block btn--green pill-radius\"><i data-ng-show=\"$ctrl.dataLoading\" class=\"fa fa-spinner fa-spin fa-lg fa-fw txt-white m-r-xs\"></i> Reset password</button>\n              </div>\n            </form>\n         </div>\n      </div>\n   </div>\n</div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/login/html/login.tpl.htm":
/***/ (function(module, exports, __webpack_require__) {

module.exports = "<div class=\"d-flex justify-content-center align-items-center content-panel\">\n \t<div class=\"container-pre-app__center-box-40\">\n        <div class=\"content-panel__body bg-white p-t-xxxl p-b-xxxl p-r-6 p-l-6\">\n           \t<div class=\"row\">\n              \t<div class=\"col-xl-12 text-center\">\n                 \t<img src=\"" + __webpack_require__("./assets/imgs/logos/pp-logo-text-black.png") + "\" alt=\"patent place logo with text\" width=\"200\" class=\"m-b-lg\">\n              \t</div>  \n           \t</div>\n           \n           \t<div class=\"row m-b-lg\">\n              \t<div class=\"col-md-12 text-center\">\n                 \t<h1 class=\"font-h1 font-weight-light\">Login into your account</h1>\n              \t</div>\n           \t</div>\n           \t<div class=\"row\">\n              \t<div class=\"col-md-12\">   \t\t\n\t\t\t\t           \t\n\n\t\t\t\t    <form name=\"loginForm\" data-ng-submit=\"$ctrl.login(loginForm)\" novalidate>\n\t\t\t\t        <div class=\"form-group\" data-ng-class=\"{ 'has-error': loginForm.j_username.$dirty && loginForm.j_username.$error.required &&  loginForm.j_username.$error.email}\">\n\t\t\t\t            <input type=\"text\" name=\"j_username\" class=\"form-control\" data-ng-model=\"$ctrl.credentials.username\" placeholder=\"Username\" data-validate-email required>\n\t\t\t\t            <p data-ng-show=\"loginForm.j_username.$dirty && loginForm.j_username.$error.required\" class=\"txt-phase-red m-t-xs\">Please provide a username</p>\n\n                            <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"loginForm.j_username.$error.validEmail && loginForm.j_username.$dirty\">Please enter a valid email address</p>\n\n\n\t\t\t\t        </div>\n\t\t\t\t        <div class=\"form-group\" data-ng-class=\"{ 'has-error': loginForm.password.$dirty && loginForm.password.$error.required }\">\n\t\t\t\t            <input type=\"password\" name=\"j_password\" class=\"form-control\" data-ng-model=\"$ctrl.credentials.password\" placeholder=\"Password\" required />\n\t\t\t\t            <span data-ng-show=\"loginForm.password.$dirty && loginForm.password.$error.required\" class=\"txt-phase-red\">Password is required</span>\n\t\t\t\t        </div>\n\t\t\t\t        <p class=\"font-body m-t-xs m-b-xs txt-phase-red\" data-ng-show=\"$ctrl.incorrectCredentials\">You have entered incorrect username and/or password details. Please try again</p>\n\t\t\t\t        <div class=\"form-actions text-right\">\n\t\t\t\t            <button type=\"submit\" data-ng-disabled=\"$ctrl.dataLoading\" class=\"btn btn--lg btn-block btn--green d-flex justify-content-center align-items-center pill-radius\" ><i class=\"fa fa-spinner fa-spin fa-2x fa-fw  m-r-xs\" data-ng-show=\"$ctrl.dataLoading\"></i>Login</button>\n\t\t\t\t        </div>\n\t\t\t\t    </form>\n             \t\t<div class=\"row\">\n\t                    <div class=\"col-md-12 text-center d-flex justify-content-between m-t-sm\">\n\t                       <div class=\"d-flex\">                     \n\t                          <p class=\"font-body m-r-xs\">Don't have an account?</p>\n\t                          <a data-ui-sref=\"register\" class=\"inline-link font-weight-bold font-weight-medium txt-phase-green\">Register Now</a>\n\t                       </div>                           \n\t                       <a data-ui-sref=\"forgot-password\" class=\"btn-no-bg font-weight-medium btn-underlined\">Forgot Password?</a>\n\t                    </div>\n             \t\t</div>\n          \t\t</div>\n       \t\t</div>\n    \t</div>\n\t</div>\n</div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/portfolio/html/portfolio.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div data-ng-show=\"data.length === 0\" class=\"col-md-12\">\n    <div class=\"bg-white p-a-sm\">\n        <p class=\"font-weight-medium\">We are sorry but no results were returned from you search criteria. Please try again.</p>\n    </div>\n</div>\n<div data-ng-hide=\"$ctrl.portfolioLoaded\" class=\"animate-hide d-flex flex-column justify-content-center align-items-center flex-grow-1\">\n    <i class=\"fas fa-cog fa-spin fa-2x m-b-xs\"></i>\n    <p class=\"font-h4 font-weight-bold\">We are just fetching all your cases</p>\n</div>\n\n\n<div data-ng-show=\"$ctrl.portfolioLoaded\" class=\"animate-show container__scrollable-area\">\n    <div class=\"p-l-3 p-r-3 p-tb-sm br-tx-1\">                            \n        <div class=\"d-flex justify-content-between align-items-center\">\n            <div class=\"d-flex\">\n                \n                <div uib-popover-template=\"'portfoliotpl.html'\" popover-trigger=\"'none'\" popover-is-open=\"displayPortfolioHelp\"  popover-placement=\"right\">\n                    <h1 class=\"font-h1 lh-default m-r-lg\">Portfolio</h1>\n                    <script type=\"text/ng-template\" id=\"portfoliotpl.html\" class=\"left\">\n                        <button class=\"btn btn-no-bg mdtooltip-close\" data-ng-click=\"displayFirstHelp('portfolio', false)\">\n                            <i class=\"fal fa-times fa-lg txt-black\"></i>\n                        </button>\n                        <div>\n                            <p class=\"m-b-xs\">The portfolio table displays all cases added to the system. </p>\n                            <p>Select one of the cases added to the portfolio to provide further information via the case-overview</p>\n                        </div>\n                    </script>   \n                </div>\n            </div>\n            <div class=\"d-flex align-items-center\">\n                <md-chips data-ng-model=\"$ctrl.chipOptions\" readonly=\"true\" md-removable=\"true\" class=\"text-capitalize font-weight-medium cursor-pointer\" md-on-remove=\"selectedChip($chip.prop, $chip.value, $chip.cat); getItems($chip.cat, portfolioData)\">\n                    <md-chip-template>\n                        <strong class=\"font-body\">\n                            <span data-ng-show=\"$chip.prop == 'Epct' || $chip.prop == 'Euro-PCT'\">Euro-PCT</span>\n                            <span data-ng-show=\"$chip.prop !== 'Epct' && $chip.prop !== 'Euro-PCT'\">{{$chip.prop}}</span>\n                        </strong>\n                        <em class=\"font-body\" data-ng-if=\"$chip.cat ==='serviceType'\">(action)</em><em class=\"font-body\" data-ng-if=\"$chip.cat ==='currentStageColour'\">(phase)</em>                     \n                    </md-chip-template>\n                    <!-- <md-icon><i class=\"d-flex input-group-text pill-radius fa fa-search\"></i></md-icon> -->\n                </md-chips>\n                <div class=\"m-r-lg\">\n                    <div class=\"input-group m-r-sm\">\n                        <input type=\"text\" class=\"form-control pill-radius\" name=\"portfolioSearch\" data-ng-model=\"searchPortfolio\" placeholder=\"Search Portfolio...\" autocomplete=\"off\">  \n                        <div class=\"input-group-append\">\n                            <div class=\"input-group-text\">\n                                <i class=\"pill-radius fa fa-search fa-lg\"></i>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n                <div>\n                    <md-menu md-position-mode=\"target-right target\">\n                        <md-button class=\"icon-stretch icon-stretch--icon black pill-radius\" data-ng-click=\"$ctrl.showFilter($mdMenu, $event)\">\n                            <span class=\"icon-text\">Filter</span>              \n                            <i class=\"fal fa-filter fa-2x cursor-pointer icon\"></i> \n                        </md-button>\n                        <md-menu-content class=\"container-filter-list\">\n                            <md-list class=\"box\" data-ng-repeat=\"cat in categories\" ng-init=\"filter[cat]={}\">\n                                <md-subheader class=\"md-no-sticky\">\n                                    <h2 class=\"font-h3\">{{cat == 'currentStageColour' ? 'Current Stage Colour' : 'European Action'}}</h2>\n                                </md-subheader>\n                                <md-list-item data-ng-repeat=\"value in getItems(cat, portfolioData)\">\n                                    <md-checkbox class=\"md-secondary\" data-ng-model=\"filter[cat][value]\" data-ng-change=\"updateFiltered(value, filter[cat][value], cat);\"> <!--used to update filtered patents totals, not filter portfolio-->\n                                    </md-checkbox>\n                                    <p>({{(filtered | filter:value:true).length}})&nbsp;\n                                        <span class=\"text-capitalize\" data-ng-if=\"value == 'GREY'\">Grey</span>\n                                        <span class=\"text-capitalize\" data-ng-if=\"(value == 'epct' || value == 'Euro-PCT')\">Euro-PCT</span>\n                                        <span class=\"text-capitalize\" data-ng-if=\"(value !== 'epct' && value !== 'Euro-PCT') && value !== 'GREY'\">{{value}}</span>\n                                    </p>\n                                </md-list-item>\n                                <md-divider></md-divider>\n                            </md-list>\n                            <div layout=\"row\" class=\"demo-dialog-button\">\n                                <md-button md-autofocus flex class=\"md-primary\" data-ng-click=\"closeDialog();\">\n                                    Close\n                                </md-button>\n                            </div>\n                        </md-menu-content>\n                    </md-menu>\n                </div>\n                <div>\n \n                    <md-button class=\"icon-stretch icon-stretch--icon green pill-radius left\" data-ng-click=\"$ctrl.showAddPatent($event)\" uib-popover-template=\"'addcasestemplate.html'\" popover-trigger=\"'none'\" popover-is-open=\"displayCaseHelp\"  popover-placement=\"left\" type=\"button\">\n                        <span class=\"icon-text\">Add Case</span>\n                        <i class=\"fal fa-plus fa-2x txt-white cursor-pointer icon\"></i>\n                    </md-button>\n                    <script type=\"text/ng-template\" id=\"addcasestemplate.html\">\n                        <button class=\"btn btn-no-bg mdtooltip-close\" data-ng-click=\"displayFirstHelp('addcase', false)\">\n                            <i class=\"fal fa-times fa-lg txt-black\"></i>\n                        </button>\n                        <div>\n                            <p>Start adding cases to your portfolio here</p>\n                        </div>\n                    </script>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <div class=\"scrollable-area scrollable-area--full-height\">\n        <table class=\"t-data sticky-table\">\n            <thead class=\"sticky-thead\">\n                <tr class=\"t-data__row t-data__row--select\">\n                    <th class=\"t-data__th t-data__th--sm sticky-th\" data-ng-click=\"$ctrl.sortBy('ep_ApplicationNumber');\">\n                        <span>App No.</span>\n                        <span data-ng-show=\"$ctrl.propertyName == 'ep_ApplicationNumber' && !$ctrl.reverse\">\n                            <i class=\"fas fa-angle-down fa-lg\"></i>\n                        </span>\n                        <span data-ng-show=\"$ctrl.propertyName == 'ep_ApplicationNumber' && $ctrl.reverse\">\n                            <i class=\"fas fa-angle-up fa-lg\"></i>\n                        </span>\n                    </th>\n                    <th class=\"t-data__th t-data__th--md\" data-ng-click=\"$ctrl.sortBy('clientRef');\">\n                        <span>Client Ref</span>\n                        <span data-ng-show=\"$ctrl.propertyName == 'clientRef' && !$ctrl.reverse\">\n                            <i class=\"fas fa-angle-down fa-lg\"></i>\n                        </span>\n                        <span data-ng-show=\"$ctrl.propertyName == 'clientRef' && $ctrl.reverse\">\n                            <i class=\"fas fa-angle-up fa-lg\"></i>\n                        </span>                          \n                    </th>\n                    <th class=\"t-data__th t-data__th--md\" data-ng-click=\"$ctrl.sortBy('shortTitle');\">\n                        <span>Client Description</span>\n                        <span data-ng-show=\"$ctrl.propertyName == 'shortTitle' && !$ctrl.reverse\">\n                            <i class=\"fas fa-angle-down fa-lg\"></i>\n                        </span>\n                        <span data-ng-show=\"$ctrl.propertyName == 'shortTitle' && $ctrl.reverse\">\n                            <i class=\"fas fa-angle-up fa-lg\"></i>\n                        </span>                          \n                    </th>                    \n                    <th class=\"t-data__th t-data__th--sm\">\n                        <span>European Action</span>\n                    </th>\n                    <th class=\"t-data__th t-data__th--md\">\n                        <span>Patent Place Status</span>                        \n                    </th>\n                    <th class=\"t-data__th t-data__th--sm\">\n                        <span>Current Phase</span>\n                    </th>\n                    <th class=\"t-data__th t-data__th--sm\">\n                        <span>Next Phase</span>    \n                    </th>                    \n                    <th class=\"t-data__th t-data__th--md\">\n                        <span></span>\n                    </th>\n                </tr>\n            </thead>\n            \n            <tbody class=\"sticky-tbody\">\n                <tr data-ng-repeat=\"patent in filtered=(portfolioData | filter:filterByPropertiesMatchingAND | filter:searchPortfolio) | orderBy:$ctrl.propertyName:$ctrl.reverse as Result\" data-ng-click=\"$ctrl.rowSelect($event, patent); $ctrl.select(patent.patentID)\"  class=\"t-data__row t-data__row--select\" data-ng-class=\"{active: patent.patentID == $ctrl.selected}\">\n                    <td class=\"t-data__td t-data__td--sm sticky-td\">\n                        <a class=\"t-data__a\" data-ng-bind=\"patent.ep_ApplicationNumber\" data-ng-attr-id=\"{{patent.patentID}}\"></a>\n                    </td>\n                    <td class=\"t-data__td t-data__td--md\">\n                        <span class=\"txt-grey\" data-ng-if=\"patent.clientRef == ''\">[No client reference provided]</span>\n                        <span data-ng-if=\"patent.clientRef !== ''\">{{patent.clientRef}}</span>\n                    </td>\n                    <td class=\"t-data__td t-data__td--md\">\n                        <span class=\"txt-grey\" data-ng-if=\"patent.shortTitle == ''\">[No client description provided]</span>\n                        <span data-ng-if=\"patent.shortTitle !== ''\">{{patent.shortTitle}}</span>\n                    </td>\n                    <td class=\"t-data__th--sm\">\n                        <table data-ng-if=\"patent.p3sServices.length == 1\">\n                            <tr>\n                                <td data-ng-repeat=\"item in patent.p3sServices track by $index\"  class=\"t-data__td\">\n                                    <div class=\"d-flex justify-content-left btn-underlined-selector\">\n                                        <span data-ng-bind=\"item.serviceType\" data-ng-if=\"item.serviceType !== 'postgrant' && (item.serviceType !== 'epct' && item.serviceType !== 'Euro-PCT')\" class=\"text-capitalize\"></span>\n                                        <span data-ng-if=\"item.serviceType == 'epct' || item.serviceType == 'Euro-PCT'\" class=\"text-capitalize\">Euro-PCT</span>\n                                        <span data-ng-if=\"item.serviceType == 'postgrant'\" class=\"text-capitalize\">----</span>\n                                    </div>\n                                </td>\n                            </tr>\n                        </table>\n                        <table data-ng-if=\"patent.p3sServices.length > 1\">\n                            <tr data-ng-repeat=\"item in patent.p3sServices track by $index\">\n                                <td class=\"t-data__td\">\n                                    <div class=\"d-flex justify-content-left btn-underlined-selector\">\n                                        <span data-ng-bind=\"item.serviceType\" class=\"text-capitalize\"></span>\n                                    </div>\n                                </td>\n                            </tr>\n                        </table>                                \n                    </td><!--when multiple services begin-->                    \n                    <td class=\"t-data__td--md p-t-none p-b-none\" >\n                        <table data-ng-if=\"patent.p3sServices.length == 1\">\n                            <tr>\n                                <td data-ng-repeat=\"item in patent.p3sServices track by $index\" class=\"t-data__td\" data-ng-if=\"item.supportRequestedBy !== null\">\n                                    <span class=\"font-weight-medium\">Support Requested</span>\n                                </td>                                \n                                <td data-ng-repeat=\"item in patent.p3sServices track by $index\" class=\"t-data__td\" data-ng-if=\"item.supportRequestedBy == null\">\n                                    <div data-ng-if=\"!item.isUrgentAttention\"> <!-- cover manual processing-->\n                                        <span data-ng-bind=\"item.serviceStatusUI\" class=\"font-weight-medium\"></span>\n                                        <div data-ng-if=\"item.serviceStatusUI == 'Manual Processing Only'\" class=\"d-inline font-weight-medium\">                            \n                                            <i class=\"fas fa-question-circle txt-phase-green cursor-pointer fa-1x\">\n                                            </i>\n                                            <md-tooltip md-delay=\"200\" class=\"mdtooltip-md\" md-direction=\"bottom\" md-z-index=\"99999\">\n                                                <p class=\"font-body\">\n                                                    Check the case overview tab for this case to find out further information as to why the status has been set to 'Manual Processing Only'\n                                                </p>\n                                            </md-tooltip>                                            \n                                        </div>\n                                    </div>\n                                    <div data-ng-if=\"item.isUrgentAttention && item.serviceType !== 'validation'\"> <!-- cover manual processing-->\n                                        <p class=\"txt-phase-red font-weight-medium\">URGENT ACTION REQUIRED</p>\n                                    </div>     \n                                    <div data-ng-if=\"item.isUrgentAttention && item.serviceType == 'validation'\"> <!-- cover manual processing for validations-->\n                                        <p class=\"d-inline font-weight-medium\">Manual Processing Only</p>\n                                        <div class=\"d-inline\">                                        \n                                            <i class=\"fas fa-question-circle txt-phase-green cursor-pointer fa-1x\"></i>\n                                            <md-tooltip md-delay=\"200\" class=\"mdtooltip-md\" md-direction=\"bottom\" md-z-index=\"99999\">\n                                                <p class=\"font-body\">\n                                                    Check the case overview tab for this case to find out further information as to why the status has been set to 'Manual Processing Only'\n                                                </p>\n                                            </md-tooltip>            \n                                        </div>\n                                    </div>\n                                </td>\n                            </tr>\n                        </table>                       \n                        <table data-ng-if=\"patent.p3sServices.length > 1\">\n                            <td data-ng-repeat=\"item in patent.p3sServices track by $index\" class=\"t-data__td\" data-ng-if=\"item.supportRequestedBy !== null\">\n                                <span class=\"font-weight-medium\">Support Requested</span>\n                            </td>                               \n                            <tr data-ng-repeat=\"item in patent.p3sServices track by $index\" data-ng-if=\"item.supportRequestedBy == null\">\n                                <td class=\"t-data__td\">\n                                    <div data-ng-if=\"!item.isUrgentAttention\"> <!-- cover manual processing-->\n                                        <span data-ng-bind=\"item.serviceStatusUI\" class=\"font-weight-medium\"></span>\n                                    </div>\n                                    <div data-ng-if=\"item.isUrgentAttention\"> <!-- cover manual processing-->\n                                        <p class=\"txt-phase-red\">URGENT ACTION REQUIRED</p>\n                                    </div>                                            \n                                </td>\n                            </tr>\n                        </table>                         \n                    </td><!--patent place status-->\n                    <td class=\" t-data__td--sm\">\n                        <table data-ng-if=\"patent.p3sServices.length == 1\">\n                            <td data-ng-repeat=\"item in patent.p3sServices track by $index\" class=\"t-data__td\">\n                                <div data-ng-if=\"(item.saleType === 'Online' || item.saleType === 'Offline') && item.serviceType !== 'validation'\">\n                                    <div class=\"d-flex flex-column\">\n                                        <div class=\"d-flex justify-content-start align-items-center\"><!--display costs-->\n                                            <p class=\"font-weight-bold m-r-sm\"><i class=\"fas fa-circle m-r-xs\" data-ng-class=\"item.cssCurrent\"></i>$ {{item.currentStageCostUSD | number: 2}}</p>\n                                        </div>\n                                    </div>\n                                </div>\n                                <div data-ng-if=\"item.serviceType == 'validation'\">\n                                    <div class=\"d-flex flex-column\">\n                                        <div class=\"d-flex justify-content-start\"><!--display costs-->\n                                            <p class=\"font-weight-bold m-r-sm\" data-ng-if=\"item.serviceStatus == 'Quote provided'\"><i class=\"fas fa-circle m-r-xs\" data-ng-class=\"item.cssCurrent\"></i>$ {{item.currentStageCostUSD | number: 2}}</p>\n                                            <p class=\"font-weight-bold txt-phase-green\" data-ng-if=\"item.serviceStatus == 'Validation available'\">Request Quote</p>\n                                            <p class=\"font-weight-bold txt-phase-green\" data-ng-if=\"item.serviceStatus == 'Preparing quote'\">Preparing Quote</p>\n                                            <p class=\"txt-grey\" data-ng-if=\"item.serviceStatus !== 'Quote provided' && item.serviceStatus !== 'Validation available' && item.serviceStatus !== 'Preparing quote'\">N/A</p>\n                                        </div>\n                                    </div>\n                                </div>\n                                <div data-ng-if=\"item.saleType !== 'Online' && item.saleType !== 'Offline' && item.serviceStatus !== 'Epct being generated' && item.serviceStatus !== 'Preparing quote' && item.serviceStatus !== 'Scanned PoAs received'  && item.serviceStatus !== 'Blank PoAs downloaded' && item.serviceStatus !== 'Paper documents received' &&  item.saleType !== 'In Progress' && item.serviceType !== 'validation'\">\n                                    <p class=\"txt-grey\">N/A</p>\n                                </div>\n                                <div data-ng-if=\"item.saleType == 'In Progress' &&   item.serviceType !== 'validation'\">\n                                    <p class=\"txt-grey\">N/A</p>\n                                </div>            \n                            </td>\n                        </table>\n                        <table data-ng-if=\"patent.p3sServices.length > 1\">\n                            <tr data-ng-repeat=\"item in patent.p3sServices track by $index\">\n                                <td class=\"t-data__td\">\n                                    <div data-ng-if=\"item.saleType === 'Online' || item.saleType === 'Offline'\">\n                                        <div class=\"d-flex flex-column\">\n                                            <div class=\"d-flex justify-content-start align-items-center\"><!--display costs-->\n                                                <p class=\"font-weight-bold m-r-sm\"><i class=\"fas fa-circle m-r-xs\" data-ng-class=\"item.cssCurrent\"></i>$ {{item.currentStageCostUSD | number: 2}}</p>\n                                            </div>\n                                        </div>\n                                    </div>\n                                    <div data-ng-if=\"item.saleType !== 'Online' && item.saleType !== 'Offline' && item.serviceStatus !== 'Epct being generated' && item.serviceStatus !== 'Preparing quote'\">\n                                        <p class=\"txt-grey\">N/A</p>\n                                    </div>                                \n                                </td>\n                            </tr>\n                        </table>                                \n                    </td><!--when multiple services begin-->     \n                    <td class=\"t-data__th--sm\">\n                        <table data-ng-if=\"patent.p3sServices.length == 1\">\n                            <td data-ng-repeat=\"item in patent.p3sServices track by $index\" class=\"t-data__td\">\n                                <div data-ng-if=\"(item.saleType === 'Online' || item.saleType === 'Offline') && item.serviceType !== 'validation'\">\n                                    <div class=\"d-flex flex-column\">\n                                        <div class=\"d-flex justify-content-start align-items-center\"><!--display costs-->\n\n                                            <p data-ng-if=\"\n                                            (!item.isUrgentAttention && item.currentStageColour !== 'Black' && (item.saleType === 'Online' || item.saleType === 'Offline')) \n                                            || \n                                            (!item.isUrgentAttention && item.currentStageColour == 'Black' && (item.saleType === 'Online' || item.saleType === 'Offline'))\n                                            || \n                                            (item.currentStageColour == 'Red' && item.serviceType === 'renewal')\n                                            \" \n                                            class=\"font-weight-bold\"><i class=\"fas fa-circle m-r-xs\" data-ng-class=\"item.cssNext\"></i> $ {{item.nextStageCostUSD | number: 2}}</p> \n                                            <p data-ng-if=\"item.isUrgentAttention && item.currentStageColour == 'Black' && item.serviceType === 'renewal'\" class=\"font-weight-bold\">LAPSE</p> <!--if current colour is black and urgent attention required. Means that it is the second stage of black and is renewal-->\n                                            <p data-ng-if=\"item.isUrgentAttention && item.currentStageColour == 'Red' && item.serviceType !== 'renewal'\" class=\"font-weight-bold\">LAPSE</p> <!--if current colour is black and urgent attention required. Means that it is the second stage of black-->\n                                        </div>    \n                                    </div>\n                                </div>                            \n                                <div data-ng-if=\"(item.saleType !== 'Online' && item.saleType !== 'Offline' && item.serviceStatus !== 'Epct being generated') || item.serviceType == 'validation'\">\n                                    <p class=\"txt-grey\">N/A</p>\n                                </div>\n                            </td>\n                        </table>\n                        <table data-ng-if=\"patent.p3sServices.length > 1\">\n                            <tr data-ng-repeat=\"item in patent.p3sServices track by $index\">\n                                <td class=\"t-data__td\">\n                                    <div data-ng-if=\"(item.saleType === 'Online' || item.saleType === 'Offline') && item.serviceType !== 'validation'\">\n                                        <div class=\"d-flex flex-column\">\n                                            <div class=\"d-flex justify-content-start align-items-center\"><!--display costs-->\n                                                <p data-ng-if=\"\n                                                (!item.isUrgentAttention && item.currentStageColour !== 'Black' && (item.saleType === 'Online' || item.saleType === 'Offline')) \n                                                || \n                                                (!item.isUrgentAttention && item.currentStageColour == 'Black' && (item.saleType === 'Online' || item.saleType === 'Offline'))\" class=\"font-weight-bold\n                                                ||\n                                                (item.currentStageColour == 'Red' && item.serviceType === 'renewal')\n                                                \"><i class=\"fas fa-circle m-r-xs\" data-ng-class=\"item.cssNext\"></i> $ {{item.nextStageCostUSD | number: 2}}</p> \n                                                <p data-ng-if=\"item.isUrgentAttention && item.currentStageColour == 'Black' && item.serviceType === 'renewal'\" class=\"font-weight-bold\">LAPSE</p> <!--if current colour is black and urgent attention required. Means that it is the second stage of black and is renewal-->\n                                                <p data-ng-if=\"item.isUrgentAttention && item.currentStageColour == 'Red' && item.serviceType !== 'renewal'\" class=\"font-weight-bold\">LAPSE</p> <!--if current colour is black and urgent attention required. Means that it is the second stage of black-->\n                                            </div>    \n                                        </div>\n                                    </div>                            \n                                    <div data-ng-if=\"(item.saleType !== 'Online' && item.saleType !== 'Offline' && item.serviceStatus !== 'Epct being generated') || item.serviceType == 'validation'\">\n                                        <p class=\"txt-grey\">N/A</p>\n                                    </div>             \n                                </td>\n                            </tr>\n                        </table>                                \n                    </td><!--when multiple services begin-->     \n                    <td class=\"t-data__td t-data__td--md\">\n                        <table data-ng-if=\"patent.p3sServices.length == 1\">\n                            <tr>\n                                <td>\n                                    <div class=\"d-flex justify-content-center btn-underlined-selector\" data-ng-repeat=\"item in patent.p3sServices track by $index\">\n                                        <div data-ng-if=\"item.serviceType == 'Euro-PCT' || item.serviceType == 'epct'\">\n                                            <a data-ng-if=\"item.saleType == 'Online' && (item.serviceStatus === 'Epct available' || item.serviceStatus === 'Epct rejected')\" class=\"btn btn--bordered btn-underlined txt-phase-green font-weight-bold generateForm1200\">Generate Form 1200</a>\n                                            <ngcart-addtocart id=\"{{item.actionID}}\" class=\"tablebtn font-weight-bold\" name=\"epct\" price=\"{{item.currentStageCostUSD}}\" quantity=\"1\" quantity-max=\"10\" data=\"patent\" data-ng-if=\"item.saleType == 'Online' && item.serviceStatus == 'Epct saved'\"> <!--secret to different button labels checkngcartdirective.js-->\n                                            </ngcart-addtocart>\n                                        </div>\n                                        <div data-ng-if=\"item.serviceType == 'renewal'\">\n                                            <ngcart-addtocart id=\"{{item.actionID}}\" class=\"tablebtn font-weight-bold\" name=\"renewal\" price=\"{{item.currentStageCostUSD}}\" quantity=\"1\" quantity-max=\"10\" data=\"patent\" data-ng-if=\"item.saleType == 'Online' && item.serviceStatus == 'Show price'\"> <!--secret to different button labels checkngcartdirective.js-->\n                                            </ngcart-addtocart>\n                                            \n                                        </div>\n                                        <div data-ng-if=\"item.serviceType == 'grant'\">\n                                            <a data-ng-if=\"item.saleType == 'Online' && item.serviceStatus === 'Grant available'\" class=\"btn btn--bordered btn-underlined txt-phase-green font-weight-bold prepareGrant\" data-ng-click=\"$ctrl.prepareGrant(patent.patentID)\">Prepare Grant\n                                            </a>\n                                            <ngcart-addtocart id=\"{{item.actionID}}\" class=\"tablebtn font-weight-bold\" name=\"grant\" price=\"{{item.currentStageCostUSD}}\" quantity=\"1\" quantity-max=\"10\" data=\"patent\" data-ng-if=\"item.saleType == 'Online' && item.serviceStatus == 'Grant saved'\"> <!--secret to different button labels checkngcartdirective.js-->\n                                            </ngcart-addtocart>\n                                        </div>          \n                                        <div data-ng-if=\"item.serviceType == 'validation'\">\n                                            <ngcart-addtocart id=\"{{item.actionID}}\" class=\"tablebtn font-weight-bold\" name=\"validation\" price=\"{{item.currentStageCostUSD}}\" quantity=\"1\" quantity-max=\"10\" data=\"patent\" data-ng-if=\"item.saleType == 'Online' && item.serviceStatus == 'Quote provided'\"> <!--secret to different button labels checkngcartdirective.js-->\n                                            </ngcart-addtocart>\n                                        </div>                                                  \n                                        <p class=\"font-weight-bold\" data-ng-class=\"item.isUrgentAttention && item.serviceType !== 'validation' ? 'txt-phase-red' : 'txt-phase-green'\" data-ng-if=\"item.saleType == 'Offline'\">Call {{phoneNumber}}</p>\n                                    </div>\n                                </td>\n                            </tr>\n                        </table>\n                        <table data-ng-if=\"patent.p3sServices.length > 1\">\n                            <tr data-ng-repeat=\"item in patent.p3sServices track by $index\">\n                                <td class=\"t-data__td\">\n                                    <div class=\"d-flex justify-content-center btn-underlined-selector\">\n\n                                        <div data-ng-if=\"item.serviceType == 'renewal'\">\n                                            <ngcart-addtocart id=\"{{item.actionID}}\" class=\"tablebtn font-weight-bold\" name=\"renewal\" price=\"{{item.currentStageCostUSD}}\" quantity=\"1\" quantity-max=\"10\" data=\"patent\" data-ng-if=\"item.saleType == 'Online' && item.serviceStatus == 'Show price'\"> <!--secret to different button labels checkngcartdirective.js-->\n                                            </ngcart-addtocart>\n                                        </div>\n                                        <div data-ng-if=\"item.serviceType == 'grant'\">\n                                            <a data-ng-if=\"item.saleType == 'Online' && item.serviceStatus === 'Grant available'\" class=\"btn btn--bordered btn-underlined font-weight-bold txt-phase-green prepareGrant\" data-ng-click=\"$ctrl.prepareGrant(patent.patentID)\">Prepare Grant\n                                            </a>\n                                            <ngcart-addtocart id=\"{{item.actionID}}\" class=\"tablebtn font-weight-bold\" name=\"grant\" price=\"{{item.currentStageCostUSD}}\" quantity=\"1\" quantity-max=\"10\" data=\"patent\" data-ng-if=\"item.saleType == 'Online' && item.serviceStatus == 'Grant saved'\"> <!--secret to different button labels checkngcartdirective.js-->\n                                            </ngcart-addtocart>\n                                        </div>                                                \n                                        <p class=\"font-weight-bold\" data-ng-class=\"item.isUrgentAttention ? 'txt-phase-red' : 'txt-phase-green'\" data-ng-if=\"item.saleType == 'Offline'\">Call {{phoneNumber}}</p>\n                                        <p class=\"invisible\" data-ng-if=\"item.saleType !== 'Online' && item.serviceStatus !== 'Show price' && item.serviceStatus !== 'Grant available'\">Fill space</p>\n                                    </div>\n                                </td>\n                            </tr>\n                        </table>\n                    </td>\n                </tr>\n                <tr data-ng-show=\"Result.length==0\">\n                    <td class=\"t-data__td text-left\" colspan=\"8\">\n                        No Results Found\n                    </td>\n                </tr>                                   \n            </tbody>\n        </table>\n    </div><!-- response table end-->\n</div>\n\n<div class=\"caseoverview-load\" data-ng-show=\"$ctrl.caseoverviewLoading\">\n    <div class=\"caseoverview-load-backdrop\"  data-ng-show=\"$ctrl.caseoverviewLoading\">\n        \n    </div>\n    <div class=\"caseoverview-loader d-flex justify-content-center align-items-center\">   \n        <div>\n            <i class=\"fas fa-cog fa-spin fa-2x m-b-xs txt-white\"></i>\n            <p class=\"txt-white font-h4 font-weight-bold\">We are just fetching your case</p>\n        </div>\n    </div>\n</div>\n\n<div class=\"caseoverview-load\" data-ng-show=\"$ctrl.addingPatent\">\n    <div class=\"caseoverview-load-backdrop\">\n        \n    </div>\n    <div class=\"caseoverview-loader d-flex justify-content-center align-items-center\">   \n        <div>\n            <i class=\"fas fa-cog fa-spin fa-2x m-b-xs txt-white\"></i>\n            <p class=\"txt-white font-h4 font-weight-bold\">We are just adding your patent</p>\n        </div>\n    </div>\n</div>\n\n<div data-ui-view=\"modal\" autoscroll=\"false\"></div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/profile/html/profile.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"m-b-xl\">\n\t<form name=\"userProfileForm\" novalidate>\n\t\t<div class=\"content-panel m-b-md\">\n\t\t\t<div class=\"row m-b-md\">\n\t\t\t\t<div class=\"col-md-12 col-lg-12 col-xl-12 d-flex\">\n\t\t\t\t\t<avatar-img class=\"m-r-xl\" data-ng-click=\"$ctrl.openAvatarModal()\"></avatar-img>\n\t\t\t\t\t<div class=\"d-flex justify-content-center align-items-start flex-column\">\n\t\t      \t \t\t<p class=\"font-weight-medium font-h1 lh-head m-b-xs\">{{$ctrl.user.firstName}} {{$ctrl.user.lastName}}</p>\n      \t \t\t\t\t<p class=\"font-h1 font-weight-light\">{{$ctrl.user.business.businessName}}</p>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-xl-6 d-flex\">\n\t\t\t\t\t<div class=\"content-panel__body bg-white flex-grow-1\">\n\t\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t\t<div class=\"col-xl-12\">\n\t\t\t\t\t\t\t\t<fieldset class=\"form-group md-m-b-md p-0\">\n\t\t\t\t\t\t\t\t\t<legend class=\"font-weight-bold font-h4\">Email notifications</legend>\n\t\t\t\t\t\t\t\t\t<p class=\"font-body font-weight-medium\">Do you want to receive email notifications?</p>\n\t\t\t\t\t\t\t\t\t<div class=\"row m-t-xs\">\n\t\t\t\t\t\t\t\t\t\t<div class=\"col-md-4\">\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"onoffswitch\">\n\t\t\t\t\t\t\t\t\t\t\t\t<label class=\"switch font-body\">\n\t\t\t\t\t\t\t\t\t\t\t  \t\t<input type=\"checkbox\" data-ng-model=\"$ctrl.user.isEmailNotification\">\n\t\t\t\t\t\t\t\t\t\t\t  \t\t<span class=\"slider round\"></span>\n\t\t\t\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</fieldset>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t\t<div class=\"col-md-12 col-xl-12\">\n\t\t\t\t\t\t\t\t<p class=\"font-h4 font-weight-bold\">Company Users: {{$ctrl.companyUsers.length}}</p>\n\t\t\t\t\t\t\t\t<div class=\"row m-t-sm\">\n\t\t\t\t\t\t\t\t\t<div class=\"col-xl-6\" data-ng-repeat=\"prop in $ctrl.chunkedData.chunk\">\n\t\t\t\t\t\t\t\t\t\t<div data-ng-repeat=\"user in prop track by $index\">\n\t\t\t\t\t\t\t\t\t\t\t<input class=\"form-control m-b-md\" placeholder=\"{{user.index}}. {{user.firstName}} {{user.lastName}} \" readonly>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\t\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\t\n\t\t\t\t<div class=\"col-xl-6 d-flex m-t-md-sm lg-m-t-sm\">\n\t\t\t\t\t<div class=\"content-panel__body bg-white flex-grow-1\">\n\t\t\t\t\t\t<div class=\"row m-b-md\">\n\t\t\t\t\t\t\t<div class=\"col-md-12 col-lg-6 col-xl-12\">\n\t\t\t\t\t\t\t\t<fieldset class=\"m-b-md p-0\">\n\t\t\t\t\t\t\t\t\t<legend class=\"font-weight-bold font-h2 m-b-md\">User Details</legend>\n\t\t\t\t\t\t\t\t\t<div class=\"form-group row\">\n\t\t\t\t\t\t\t\t\t\t<label class=\"col-md-4 d-flex flex-column justify-content-center font-body font-weight-medium\" for=\"emailAddress\">Email:</label>\n\t\t\t\t\t\t\t\t\t\t<div class=\"col-md-6 col-lg-8\">\n\t\t\t\t\t\t\t\t\t\t\t<input type=\"email\" name=\"emailAddress\" id=\"emailAddress\" data-ng-model=\"$ctrl.user.emailAddress\" class=\"form-control font-body pill-radius\" readonly>\n\t\t\t\t\t\t\t\t\t\t\t<p class=\"font-body txt-phase-red\" data-ng-show=\"userProfileForm.emailAddress.$error.required && userProfileForm.emailAddress.$dirty\">Please fill out this field</p>\n\t\t\t\t\t\t\t\t\t\t\t<p class=\"font-body txt-phase-red\" data-ng-show=\"userProfileForm.emailAddress.$error.email && userProfileForm.emailAddress.$dirty\">Please enter a valid email address</p>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class=\"form-group row\">\n\t\t\t\t\t\t\t\t\t\t<label class=\"col-md-4 d-flex flex-column justify-content-center font-body font-weight-medium\" for=\"firstName\">First name:</label>\n\t\t\t\t\t\t\t\t\t\t<div class=\"col-md-6 col-lg-8\">\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"icon-field\">\n\t\t\t\t\t\t\t\t\t\t\t\t<input type=\"text\" name=\"firstName\" class=\"form-control font-body pill-radius\" data-ng-model=\"$ctrl.user.firstName\" id=\"firstName\" data-ng-bind=\"firstName\" required data-validate-name>\n\t\t\t\t\t\t\t\t\t\t\t\t<i class=\"far fa-pencil fa-2x icon\"></i>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t<p class=\"font-body txt-phase-red\" data-ng-show=\"userProfileForm.firstName.$error.required && userProfileForm.firstName.$dirty\">Please fill out this field</p>\n\t\t\t\t\t\t\t\t\t\t\t<p class=\"font-body txt-phase-red\" data-ng-show=\"userProfileForm.firstName.$error.validName && userProfileForm.firstName.$dirty\">Only letters, numbers, ' - and spaces are valid charcters in this field.</p>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class=\"form-group row\">\n\t\t\t\t\t\t\t\t\t\t<label class=\"col-md-4 d-flex flex-column justify-content-center font-body font-weight-medium\" for=\"lastName\">Last name:</label>\n\t\t\t\t\t\t\t\t\t\t<div class=\"col-md-6 col-lg-8\">\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"icon-field\">\n\t\t\t\t\t\t\t\t\t\t\t\t<input type=\"text\" class=\"form-control font-body pill-radius\" name=\"lastName\" data-ng-model=\"$ctrl.user.lastName\"  id=\"lastName\" required data-validate-name>\n\t\t\t\t\t\t\t\t\t\t\t\t<i class=\"far fa-pencil fa-2x icon\"></i>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t<p class=\"font-body txt-phase-red\" data-ng-show=\"userProfileForm.lastName.$invalid && !userProfileForm.lastName.$pristine\">Please fill out this field</p>\n\t\t\t\t\t\t\t\t\t\t\t<p class=\"font-body txt-phase-red\" data-ng-show=\"userProfileForm.lastName.$error.validName && userProfileForm.lastName.$dirty\">Only letters, numbers, ' - and spaces are valid charcters in this field.</p>\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t                    <div class=\"form-group row m-b-none\">\n\t\t\t\t\t\t\t\t\t\t<label class=\"col-md-4 d-flex flex-column font-body font-weight-medium m-t-xs\" for=\"password\">Password:</label>\n\t\t\t\t                        <div class=\"col-md-6 col-lg-8\">\n\t\t\t\t                            <div class=\"icon-field\">\n\t\t\t\t                                <input type=\"password\" name=\"password\"  id=\"password\" class=\"form-control font-body pill-radius m-b-xs\"  data-ng-blur=\"visitedPassword=true\" autocomplete=\"off\" placeholder=\"Password\" data-ng-model=\"$ctrl.formData.password\" zxcvbn=\"$ctrl.passwordStrength\" data-ng-change=\"$ctrl.passwordUpdate($ctrl.formData.password);\">\n\t\t\t\t                                <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"userProfileForm.password.$error.required && userProfileForm.password.$dirty\">Please fill out this field</p>\n\t\t\t\t                                <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"userProfileForm.password.$error.minlength && userProfileForm.password.$dirty\">Password needs to be a minimum of 8 characters</p>\n\t\t\t\t                                <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"userProfileForm.password.$error.maxlength && userProfileForm.password.$dirty\">Password needs to be a maximum of 20 characters</p>\n\t\t\t\t                            </div>\n\t\t\t\t                        </div>\n\t\t\t\t                        <div class=\"col-md-6 offset-md-4 col-lg-8 offset-lg-4\">\n\t\t\t\t                   \t\t\t<div class=\"m-t-xs m-b-sm\">\n\t\t\t\t                                <zx-password-meter value=\"{{ $ctrl.passwordStrength.score }}\" max=\"4\"></zx-password-meter>\n\t\t\t\t                            </div>\n\t\t\t\t                        </div>\n\t\t\t\t                    </div>\n\t\t\t\t\t\t\t\t\t<div class=\"form-group row\">\n\t\t\t\t\t\t\t\t\t\t<label class=\"col-md-4 d-flex flex-column font-body font-weight-medium m-t-xs\" for=\"password\">Password:</label>\n\t\t\t\t\t\t\t\t\t\t<div class=\"col-md-6 col-lg-8\">\n\t\t\t                            \t<input type=\"password\" name=\"confirmPassword\" class=\"form-control font-body pill-radius\" data-ng-model=\"$ctrl.formData.confirmPassword\" data-confrim-pw-to=\"$ctrl.formData.password\" placeholder=\"Confirm Password\" data-ng-required=\"$ctrl.formData.password\">\n\t\t\t                            \t<p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"userProfileForm.confirmPassword.$invalid && userProfileForm.password.$dirty && userProfileForm.confirmPassword.$dirty\">Passwords don't match.</p>\t\t\t\t                            \t\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</fieldset>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"row m-t-lg m-t-md-sm lg-m-t-sm\">\n\t\t\t\t<div class=\"col-xl-6 d-flex\">\n\t\t\t\t\t<div class=\"content-panel__body bg-white flex-grow-1\">\t\t\n\t\t\t\t\t\t<fieldset>\n\t\t\t\t\t\t\t<legend class=\"font-weight-bold font-h2 m-b-sm\">Business Address</legend>\n\t\t\t\t\t\t\t<div class=\"form-group row\">\n\t\t\t\t\t\t\t\t<label class=\"col-md-4 d-flex flex-column justify-content-center font-body font-weight-medium\" for=\"businessName\">Business name:</label>\n\t\t\t\t\t\t\t\t<div class=\"col-md-6 col-lg-8\">\n\t\t\t\t\t\t\t\t\t<input type=\"text\" name=\"businessName\" class=\"form-control font-body pill-radius\" data-ng-model=\"$ctrl.user.business.businessName\" id=\"businessName\" readonly>\n\t\t\t\t\t\t\t\t\t<p class=\"font-body txt-phase-red\" data-ng-show=\"userProfileForm.businessName.$error.required && userProfileForm.businessName.$dirty\">Please fill out this field.</p>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"form-group row\">\n\t\t\t\t\t\t\t\t<label class=\"col-md-4 d-flex flex-column justify-content-center font-body font-weight-medium\" for=\"phoneNumber\">Tel:</label>\n\t\t\t\t\t\t\t\t<div class=\"col-md-3 col-lg-8\">\n\t\t\t\t\t\t\t\t\t<div class=\"icon-field\">\n\t\t\t\t\t\t\t\t\t\t<input type=\"text\" name=\"phoneNumber\" class=\"form-control font-body pill-radius\" data-ng-maxlength=\"40\" data-ng-model=\"$ctrl.user.business.phoneNumber\" id=\"phoneNumber\" data-max-length=\"40\" required data-validate-phone>\n\t\t\t\t\t\t\t\t\t\t<i class=\"far fa-pencil fa-2x icon\"></i>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<p class=\"font-body txt-phase-red\" data-ng-show=\"userProfileForm.phoneNumber.$error.required && userProfileForm.phoneNumber.$dirty\">Please fill out this field.</p>\n\t\t\t\t\t\t\t\t\t<p class=\"font-body txt-phase-red\" data-ng-show=\"(userProfileForm.phoneNumber.$error.validPhone && userProfileForm.phoneNumber.$dirty) || userProfileForm.phoneNumber.$error.maxlength\">Please enter a valid phone number.</p>\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"form-group row\">\n\t\t\t\t\t\t\t\t<label class=\"col-md-4 d-flex flex-column justify-content-center font-body font-weight-medium\" for=\"street\">Street:</label>\n\t\t\t\t\t\t\t\t<div class=\"col-md-6 col-lg-8\">\n\t\t\t\t\t\t\t\t\t<div class=\"icon-field\">\n\t\t\t\t\t\t\t\t\t\t<input type=\"text\" name=\"street\" class=\"form-control font-body pill-radius\" data-ng-model=\"$ctrl.user.business.street\" id=\"street\" required data-validate-address>\n\t\t\t\t\t\t\t\t\t\t<i class=\"far fa-pencil fa-2x icon\"></i>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<p class=\"font-body txt-phase-red\" data-ng-show=\"userProfileForm.street.$error.required && userProfileForm.street.$dirty\">Please fill out this field.</p>\n\t\t\t\t\t\t\t\t\t<p class=\"font-body txt-phase-red\" data-ng-show=\"userProfileForm.street.$error.validAddress && userProfileForm.street.$dirty\">Only letters, numbers, -, (), . and spaces are valid charcters in this field.</p>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"form-group row\">\n\t\t\t\t\t\t\t\t<label class=\"col-md-4 d-flex flex-column justify-content-center font-body font-weight-medium\" for=\"city\">City:</label>\n\t\t\t\t\t\t\t\t<div class=\"col-md-5 col-lg-8\">\n\t\t\t\t\t\t\t\t\t<div class=\"icon-field\">\n\t\t\t\t\t\t\t\t\t\t<input type=\"text\" name=\"city\" class=\"form-control font-body pill-radius\" data-ng-model=\"$ctrl.user.business.city\" id=\"city\" required data-validate-address>\n\t\t\t\t\t\t\t\t\t\t<i class=\"far fa-pencil fa-2x icon\"></i>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<p class=\"font-body txt-phase-red\" data-ng-show=\"userProfileForm.city.$error.required && userProfileForm.city.$dirty\">Please fill out this field.</p>\n\t\t\t\t\t\t\t\t\t<p class=\"font-body txt-phase-red\" data-ng-show=\"userProfileForm.city.$error.validAddress && userProfileForm.city.$dirty\">Only letters, numbers, -, (), . and spaces are valid charcters in this field.</p>\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"form-group row\">\n\t\t\t\t\t\t\t\t<label class=\"col-md-4 d-flex flex-column justify-content-center font-body font-weight-medium\" for=\"USstate\">State:</label>\n\t\t\t\t\t\t\t\t<div class=\"col-md-3 col-lg-8\">\n\t\t\t\t\t\t\t\t\t<div class=\"icon-field\">\n\t\t\t\t\t\t\t\t\t\t<input type=\"text\" name=\"USstate\" class=\"form-control font-body pill-radius\" data-ng-model=\"$ctrl.user.business.usstate\" id=\"USstate\" required data-validate-address>\n\t\t\t\t\t\t\t\t\t\t<i class=\"far fa-pencil fa-2x icon\"></i>\n\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t<p class=\"font-body txt-phase-red\" data-ng-show=\"userProfileForm.USstate.$error.required && userProfileForm.USstate.$dirty\">Please fill out this field.</p>\n\t\t\t\t\t\t\t\t\t<p class=\"font-body txt-phase-red\" data-ng-show=\"userProfileForm.USstate.$error.validAddress && userProfileForm.USstate.$dirty\">Only letters, numbers, -, (), . and spaces are valid charcters in this field.</p>\t\t\t\t\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"form-group row\">\n\t\t\t\t\t\t\t\t<label class=\"col-md-4 d-flex flex-column justify-content-center font-body font-weight-medium\" for=\"zip\">Zip:</label>\n\t\t\t\t\t\t\t\t<div class=\"col-md-3 col-lg-8\">\n\t\t\t\t\t\t\t\t\t<div class=\"icon-field\">\n\t\t\t\t\t\t\t\t\t\t<input type=\"text\" name=\"zip\" class=\"form-control font-body pill-radius\" data-ng-model=\"$ctrl.user.business.zip\" id=\"zip\" required data-validate-zip>\n\t\t\t\t\t\t\t\t\t\t<i class=\"far fa-pencil fa-2x icon\"></i>\n\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t<p class=\"font-body txt-phase-red\" data-ng-show=\"userProfileForm.zip.$error.required && userProfileForm.zip.$dirty\">Please fill out this field.</p>\t\t\n\t\t\t\t\t\t\t\t\t<p class=\"font-body txt-phase-red\" data-ng-show=\"userProfileForm.zip.$error.validZip && userProfileForm.zip.$dirty\">Only numbers and - are valid characters in this field.</p>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"form-group row\">\n\t\t\t\t\t\t\t\t<label class=\"col-md-4 d-flex flex-column justify-content-center font-body font-weight-medium\" for=\"timezone\">Time Zone</label>\n\t\t\t\t\t\t\t\t<div class=\"col-md-2 col-lg-3 col-xl-3\">\n\t\t\t\t\t\t\t\t\t<select name=\"timezone\" id=\"timezone\" class=\"form-control font-body pill-radius\"\n\t\t\t\t\t\t\t\t\t    data-ng-model=\"$ctrl.user.business.timezone\"\n\t\t\t\t\t\t\t\t\t    data-ng-change=\"$ctrl.updateTimezone($ctrl.user.business.timezone)\" \n\t\t\t\t\t\t\t\t\t    data-ng-options=\"zone.abbr as zone.abbr for zone in $ctrl.ustimezones\">\n\t\t\t\t\t\t\t\t\t</select>\n\t\t\t\t\t\t\t\t\t<!--removed track by zone.text in data-ng-options-->\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</fieldset>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-xl-6 d-flex m-t-md-sm lg-m-t-sm\">\n\t\t\t\t\t<div class=\"content-panel__body bg-white flex-grow-1\">\n\t\t\t\t\t\t<fieldset>\n\t\t\t\t\t\t\t<legend class=\"font-weight-bold font-h2 m-b-sm\">Billing address</legend>\n\t\t\t\t\t\t\t<div class=\"form-group row\">\n\t\t\t\t\t\t\t\t<label class=\"col-md-4 d-flex flex-column justify-content-center font-body font-weight-medium\" for=\"billing_street\">Street</label>\n\t\t\t\t\t\t\t\t<div class=\"col-md-6 col-lg-8\">\n\t\t\t\t\t\t\t\t\t<div class=\"icon-field\">\n\t\t\t\t\t\t\t\t\t\t<input type=\"text\" name=\"billing_street\" class=\"form-control font-body pill-radius\" data-ng-model=\"$ctrl.user.business.billingStreet\" id=\"billing_street\" required data-validate-address>\n\t\t\t\t\t\t\t\t\t\t<i class=\"far fa-pencil fa-2x icon\"></i>\n\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t<p class=\"font-body txt-phase-red\" data-ng-show=\"userProfileForm.billing_street.$error.required && userProfileForm.billing_street.$dirty\">Please fill out this field</p>\n\t\t\t\t\t\t\t\t\t<p class=\"font-body txt-phase-red\" data-ng-show=\"userProfileForm.billing_street.$error.validAddress && userProfileForm.billing_street.$dirty\">Only letters, numbers, -, (), . and spaces are valid charcters in this field.</p>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"form-group row\">\n\t\t\t\t\t\t\t\t<label class=\"col-md-4 d-flex flex-column justify-content-center font-body font-weight-medium\" for=\"billing_city\">City</label>\n\t\t\t\t\t\t\t\t<div class=\"col-md-5 col-lg-8\">\n\t\t\t\t\t\t\t\t\t<div class=\"icon-field\">\n\t\t\t\t\t\t\t\t\t\t<input type=\"text\" name=\"billing_city\" class=\"form-control font-body pill-radius\" data-ng-model=\"$ctrl.user.business.billingCity\" id=\"billing_city\" required data-validate-address>\n\t\t\t\t\t\t\t\t\t\t<i class=\"far fa-pencil fa-2x icon\"></i>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<p class=\"font-body txt-phase-red\" data-ng-show=\"userProfileForm.billing_city.$error.required && userProfileForm.billing_city.$dirty\">Please fill out this field</p>\n\t\t\t\t\t\t\t\t\t<p class=\"font-body txt-phase-red\" data-ng-show=\"userProfileForm.billing_city.$error.validAddress && userProfileForm.billing_city.$dirty\">Only letters, numbers, -, (), . and spaces are valid charcters in this field.</p>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"form-group row\">\n\t\t\t\t\t\t\t\t<label class=\"col-md-4 d-flex flex-column justify-content-center font-body font-weight-medium\" for=\"billing_state\">State</label>\n\t\t\t\t\t\t\t\t<div class=\"col-md-3 col-lg-8\">\n\t\t\t\t\t\t\t\t\t<div class=\"icon-field\">\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t<input type=\"text\" name=\"billing_state\" class=\"form-control font-body pill-radius\" data-ng-model=\"$ctrl.user.business.billingState\" id=\"billing_state\" required data-validate-address>\n\t\t\t\t\t\t\t\t\t\t<i class=\"far fa-pencil fa-2x icon\"></i>\n\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t<p class=\"font-body txt-phase-red\" data-ng-show=\"userProfileForm.billing_state.$error.required && userProfileForm.billing_state.$dirty\">Please fill out this field</p>\n\t\t\t\t\t\t\t\t\t<p class=\"font-body txt-phase-red\" data-ng-show=\"userProfileForm.billing_state.$error.validAddress && userProfileForm.billing_state.$dirty\">Only letters, numbers, -, (), . and spaces are valid charcters in this field.</p>\t\t\t\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"form-group row\">\n\t\t\t\t\t\t\t\t<label class=\"col-md-4 d-flex flex-column justify-content-center font-body font-weight-medium\" for=\"billing_zip\">Zip</label>\n\t\t\t\t\t\t\t\t<div class=\"col-md-3 col-lg-8\">\n\t\t\t\t\t\t\t\t\t<div class=\"icon-field\">\t\n\t\t\t\t\t\t\t\t\t\t<input type=\"text\" name=\"billing_zip\" class=\"form-control font-body pill-radius\" data-ng-model=\"$ctrl.user.business.billingZip\" id=\"billing_zip\" required data-validate-zip>\n\t\t\t\t\t\t\t\t\t\t<i class=\"far fa-pencil fa-2x icon\"></i>\n\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t<p class=\"font-body txt-phase-red\" data-ng-show=\"userProfileForm.billing_zip.$error.required && userProfileForm.billing_zip.$dirty\">Please fill out this field</p>\n\t\t\t\t\t\t\t\t\t<p class=\"font-body txt-phase-red\" data-ng-show=\"userProfileForm.billing_zip.$error.validZip && userProfileForm.billing_zip.$dirty\">Only numbers and - are valid characters in this field.</p>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</fieldset>\n\t\t\t\t\t</div>\n\t\t\t\t</div> <!---row end-->\n\t\t\t</div> <!-- content panel body end-->\n\t\t</div><!-- content panel end -->\n\t\t<div class=\"row m-t-md\">\n\t\t\t<div class=\"col-md-12 text-right\">\n\t\t\t\t<button type=\"submit\" id=\"submit\" class=\"btn btn--lg btn--green pill-radius\" data-ng-click=\"$ctrl.updateUser(user, $ctrl.formData.password)\" data-ng-disabled=\"userProfileForm.$invalid\">Save Changes</button>\n\t\t\t</div>\n\t\t</div>\n\t</form>\n</div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/register/html/modals/modal.register-error.tpl.htm":
/***/ (function(module, exports) {

module.exports = "        \n<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n\t<span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"fas fa-exclamation-circle fa-4x txt-phase-red\"></i>   \n    </div>\n\t<p class=\"font-h3 font-weight-medium\">We were unable to register your account</p>\n\t<p class=\"font-body w-100 text-center m-b-sm m-t-xs\">We are sorry but there was an error when attempting to register your details. Please check and try again. If it's still a problem then please let us know: support@ip.place</p>\n    <div class=\"d-flex\">\n    \t<button class=\"btn btn--lg btn--green pill-radius m-r-md\" data-ng-click=\"$ctrl.dismissModal()\">Dismiss</button>\n    </div>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/register/html/modals/modal.register-success.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n\t<span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"fas fa-check-circle fa-4x txt-phase-green\"></i>\n    </div>\n\t<p class=\"font-h3 font-weight-medium\">Successfully registered an account</p>\n\t<p class=\"font-body w-100 text-center m-b-sm m-t-xs\">All that is left now is for you to verify your account. An email has been sent to you with a verification link. Please check your junk inbox. Once you have clicked that, you will be able to login to your Patent Place account.</p>\n    <div class=\"d-flex\">\n    \t<button class=\"btn btn--lg btn--green pill-radius m-r-md\" data-ng-click=\"$ctrl.dismissModal()\">Dismiss</button>\n    </div>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/register/html/modals/modal.verify-error.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n\t<span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"fas fa-exclamation-circle fa-4x txt-phase-red\"></i>   \n    </div>\n\t<p class=\"font-h3 font-weight-medium\">We were unable to verify your account</p>\n\t<p class=\"font-body w-100 text-center m-b-sm m-t-xs\">We are sorry but there was an error when verifying your account. Please check and click the verification link in the email again. If it's still a problem then please let us know: support@ip.place</p>\n    <div class=\"d-flex\">\n    \t<button class=\"btn btn--lg btn--green pill-radius m-r-md\" data-ng-click=\"$ctrl.dismissModal()\">Dismiss</button>\n    </div>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/register/html/modals/modal.verify-success.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n\t<span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"fas fa-check-circle fa-4x txt-phase-green\"></i>\n    </div>\n\t<p class=\"font-h3 font-weight-medium\">Successfully verified your account</p>\n\t<p class=\"font-body w-100 text-center m-b-sm m-t-xs\">You have successfully verified your account! You can now login and start adding cases to your portfolio. If you need any help, don't hesitate to contact us at support@ip.place, or use our help guide within the application</p>\n    <div class=\"d-flex\">\n    \t<button class=\"btn btn--lg btn--green pill-radius m-r-md\" data-ng-click=\"$ctrl.dismissModal()\">Dismiss</button>\n    </div>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/register/html/register.tpl.htm":
/***/ (function(module, exports, __webpack_require__) {

module.exports = "<div class=\"d-flex justify-content-center align-items-center content-panel\">\n    <div class=\"content-panel__body  flex-grow-0 bg-white p-t-xxxl p-b-xxxl p-r-6 p-l-6\">\n        <form name=\"registrationForm\" class=\"form-validation\" role=\"form\" data-ng-submit=\"$ctrl.register()\" novalidate>\n            <div class=\"animate-switch-container\" data-ng-switch on=\"$ctrl.stage\" data-ng-class=\"{forward: $ctrl.direction, backward:!$ctrl.direction}\">\n                <div class=\"row\">\n                    <div class=\"col-xl-12 text-center\">\n                        <img src=\"" + __webpack_require__("./assets/imgs/logos/pp-logo-text-black.png") + "\" alt=\"patent place logo with text\" width=\"200\" class=\"m-b-lg\">\n                    </div>  \n                </div>\n                <div class=\"row\">\n                    <div class=\"col-md-12\">\n                        <div class=\"text-center\">\n                            <h2 class=\"font-h2 font-weight-light\">Register account</h2>\n                       \n                            <!-- the links to our nested states using relative paths -->\n                            <!-- add the active class if the state matches our ui-sref -->\n                            <div id=\"status-buttons\" class=\"text-center m-t-md\">\n                                <a data-ng-class=\"{'active': $ctrl.stage == ''}\" data-ng-click=\"$ctrl.back('')\"><span>1</span>User</a>\n                                <a data-ng-class=\"{'active': $ctrl.stage == 'stage1'}\" data-ng-click=\"$ctrl.next('stage1')\"><span>2</span>Business</a>\n                                <a data-ng-class=\"{'active': $ctrl.stage == 'stage2'}\" data-ng-click=\"$ctrl.next('stage2')\"><span>3</span>Billing</a>\n                            </div>\n                        </div>                    \n                    </div>\n                </div>\n                <div class=\"animate-switch\" data-ng-switch-default>\n                    <h2 class=\"m-b-sm\">User Details</h2>\n                    <div class=\"form-group row\">\n                        <div class=\"col-md-12 col-lg-12 col-xl-12\">\n                            <input type=\"email\" name=\"emailAddress\" class=\"form-control pill-radius font-body\" data-ng-model=\"$ctrl.formData.emailAddress\" placeholder=\"Email\" data-ng-class=\"{'input-error': $ctrl.formValidation && registrationForm.emailAddress.$error.required}\" data-validate-email required>\n                            <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"registrationForm.emailAddress.$error.required && registrationForm.emailAddress.$dirty\">Please fill out this field</p>\n                            <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"registrationForm.emailAddress.$error.validEmail && registrationForm.emailAddress.$dirty\">Please enter a valid email address</p>\n                        </div>\n                    </div>\n                    <div class=\"form-group row\">\n                        <div class=\"col-md-12 col-lg-12 col-xl-12\">\n                            <input type=\"text\" name=\"firstName\" class=\"form-control pill-radius font-body\"data-ng-model=\"$ctrl.formData.firstName\" placeholder=\"First Name\" data-ng-class=\"{'input-error': $ctrl.formValidation && registrationForm.firstName.$error.required}\" data-validate-name required>\n                            <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"registrationForm.firstName.$error.required && registrationForm.firstName.$dirty\">Please fill out this field</p>\n                            <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"registrationForm.firstName.$error.validName && registrationForm.firstName.$dirty\">Only letters, numbers, ' - and spaces are valid charcters in this field.</p>        \n                        </div>\n                    </div>\n                    <div class=\"form-group row\">\n                        <div class=\"col-md-12 col-lg-12 col-xl-12\">\n                            <input type=\"text\" class=\"form-control pill-radius font-body\" name=\"lastName\" data-ng-model=\"$ctrl.formData.lastName\" placeholder=\"Last Name\" data-ng-class=\"{'input-error': $ctrl.formValidation && registrationForm.lastName.$error.required}\" data-validate-name required>\n                            <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"registrationForm.lastName.$error.required && registrationForm.lastName.$dirty\">Please fill out this field</p>\n                            <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"registrationForm.lastName.$error.validName && registrationForm.lastName.$dirty\">Only letters, numbers, ' - and spaces are valid charcters in this field.</p>              \n                        </div>\n                    </div>\n                    <div class=\"form-group row m-b-none\">\n                        <div class=\"col-md-12 col-lg-12 col-xl-12\">\n                            <div class=\"icon-field\">\n                                <input type=\"password\" name=\"password\"  id=\"password\" class=\"form-control font-body pill-radius m-b-xs\" data-ng-class=\"{'input-error': $ctrl.formValidation && registrationForm.password.$error.required}\"  data-ng-blur=\"visitedPassword=true\" autocomplete=\"off\" placeholder=\"Password\" data-ng-model=\"$ctrl.formData.password\" zxcvbn=\"$ctrl.passwordStrength\" data-ng-change=\"$ctrl.passwordUpdate($ctrl.formData.password);\" required>\n                                <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"registrationForm.password.$error.required && registrationForm.password.$dirty\">Please fill out this field</p>\n                                <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"registrationForm.password.$error.minlength && registrationForm.password.$dirty\">Password needs to be a minimum of 8 characters</p>\n                                <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"registrationForm.password.$error.maxlength && registrationForm.password.$dirty\">Password needs to be a maximum of 20 characters</p>\n                            </div>\n                            <div class=\"m-t-xs m-b-xs\">\n                                <zx-password-meter value=\"{{ $ctrl.passwordStrength.score }}\" max=\"4\"></zx-password-meter>\n                            </div>\n                        </div>\n                    </div>\n                    <div class=\"form-group row\">\n                        <div class=\"col-md-12 col-lg-12 col-xl-12\">\n                            <input type=\"password\" name=\"confirmPassword\" class=\"form-control font-body pill-radius\" data-ng-model=\"$ctrl.formData.confirmPassword\" data-confrim-pw-to=\"$ctrl.formData.password\" data-ng-class=\"{'input-error': $ctrl.formValidation && registrationForm.confirmPassword.$error.required}\" placeholder=\"Confirm Password\" required>\n                            <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"registrationForm.confirmPassword.$invalid && registrationForm.password.$dirty\">Passwords don't match.</p>\n                        </div>\n                    </div>\n                    <div class=\"form-group row m-b-none\">\n                        <div class=\"col-md-12 col-lg-12 col-xl-12 text-right\">\n                            <a class=\"btn btn--lg btn--green pill-radius txt-white\" data-ng-click=\"$ctrl.next('stage1')\">\n                                Business Details <i class=\"far fa-angle-right\"></i>\n                            </a>            \n                        </div>\n                    </div>\n                </div>\n                <div class=\"animate-switch\" data-ng-switch-when=\"stage1\">\n\n                    <!--find company -->\n\n                    <h2 class=\"m-b-sm\">Business Details</h2>\n                    <div data-ng-show=\"$ctrl.notSelectedCompanyReg && !$ctrl.displayBusinessDetails\" class=\"animate-show m-b-sm\">\n                        <div class=\"form-group row\">\n                            <div class=\"col-md-12 col-lg-12 col-xl-12\">\n                                <h4 class=\"font-body font-weight-medium m-b-sm\">Has your firm already registered?</h4>\n                                <div class=\"form-check form-check-inline\">\n                                    <input class=\"m-l-xs\" type=\"radio\" class=\"form-check-input checkbox-square\" name=\"businessRegyes\" data-ng-init=\"$ctrl.business.registered.yes = false\" data-ng-model=\"$ctrl.business.registered.yes\" data-ng-click=\"$ctrl.business.notregistered.yes = false;\" data-ng-change=\"$ctrl.checkFetchBusiness('registered', $ctrl.business)\">\n                                    <label  class=\"form-check-label\">Yes</label>\n                                </div>\n                                <div class=\"form-check form-check-inline\">\n                                    <input class=\"m-l-xs\" type=\"radio\" class=\"form-check-input checkbox-square\" name=\"businessRegno\" data-ng-init=\"$ctrl.business.notregistered.yes = false\"  data-ng-model=\"$ctrl.business.notregistered.yes\" data-ng-click=\"$ctrl.business.registered.yes = false\" data-ng-change=\"$ctrl.checkFetchBusiness('notregistered', $ctrl.business)\">\n                                    <label  class=\"form-check-label\">No</label>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n\n                    <div data-ng-show=\"$ctrl.displayCompanyPIN && !$ctrl.displayBusinessDetails\" class=\"animate-show\">\n\n                        <div data-ng-show=\"!$ctrl.searchCompanyresponse\">\n                            <div class=\"form-group row\">\n                                <div class=\"col-md-12 col-lg-12 col-xl-12\">\n                                    <input class=\"form-control pill-radius font-body\" name=\"companyNumber\" placeholder=\"Company Number\" data-ng-model=\"companyNumber\" data-ng-maxlength=\"6\">\n                                    <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"registrationForm.companyNumber.$error.maxlength && registrationForm.companyNumber.$dirty\">Maximum of 6 alphanumeric characters are permitted in this field.</p>            \n                                </div>\n                            </div>\n                            <div class=\"form-group row\">\n                                <div class=\"col-md-12 col-lg-12 col-xl-12\">\n                                    <input class=\"form-control pill-radius font-body\" name=\"companyPin\" placeholder=\"Company PIN\" data-ng-model=\"companyPin\" data-validate-numbers>\n                                    <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"registrationForm.companyPin.$error.minlength && registrationForm.companyPin.$dirty\">Minimum of 3 numbers are permitted in this field.</p>\n                                    <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"registrationForm.companyPin.$error.maxlength && registrationForm.companyPin.$dirty\">Maximum of 4 numbers are permitted in this field.</p>\n                                    <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"registrationForm.validNumbers.$error.maxlength && registrationForm.companyPin.$dirty\">Only numeric characters are permitted in this field</p>            \n                                </div>\n                            </div>\n                        </div>\n\n                        <div data-ng-show=\"$ctrl.searchCompanyresponse\" class=\"animate-show\">\n                            <p class=\"font-body font-weight-medium m-b-sm\">Is this your company?</p>\n                            <div class=\"form-check form-check-inline\">\n                                <input class=\"m-l-xs\" type=\"radio\" class=\"form-check-input checkbox-square\" name=\"correctCompany\" data-ng-init=\"$ctrl.business.company.yes = false\" data-ng-model=\"$ctrl.business.company.yes\" data-ng-click=\"$ctrl.business.notcompany.yes = false;\" data-ng-change=\"$ctrl.acceptDetails()\">\n                                <label  class=\"form-check-label\">Yes</label>\n                            </div>\n                            <div class=\"form-check form-check-inline\">\n                                <input class=\"m-l-xs\" type=\"radio\" class=\"form-check-input checkbox-square\" name=\"incorrectCompany\" data-ng-init=\"$ctrl.business.notcompany.yes = false\"  data-ng-model=\"$ctrl.business.notcompany.yes\" data-ng-click=\"$ctrl.business.company.yes = false\" data-ng-change=\"$ctrl.declineDetails()\">\n                                <label  class=\"form-check-label\">No</label>\n                            </div>                                \n                            <div class=\"m-t-md m-b-md company-table\">\n                                <table class=\"t-data\">\n\n                                    <tbody>\n                                        <tr class=\"t-data__row\" data-ng-repeat=\"(key, value) in $ctrl.searchCompanyresponse\">\n                                            <td class=\"t-data__td t-data__td--sm font-body font-weight-medium text-capitalize\">{{key}}</td>\n                                            <td class=\"t-data__td t-data__td--sm font-body text-capatalize\">{{value}}</td>\n                                        </tr>\n                                    </tbody>\n                                </table>\n                            </div>\n                        </div>\n\n                        <div data-ng-show=\"$ctrl.noCompany\" class=\"animate-show\">\n                            <div class=\"row m-b-sm\">\n                                <div class=\"col-md-12 col-lg-12 col-xl-12\">\n                                    <p class=\"font-weight-medium txt-phase-red\">We were unable find the company with the provided information. Please check and try again.</p>\n                                </div>\n                            </div>\n                        </div>\n                        <div class=\"form-group row\" data-ng-hide=\"$ctrl.hideSearchBtn\" class=\"animate-show\">\n                            <div class=\"col-md-12 col-lg-12 col-xl-12 d-flex align-items-center\">\n                                <button type=\"button\" name=\"companyDetailsSubmit\"  class=\"btn btn--lg btn--green pill-radius\" value=\"Search\" data-ng-click=\"$ctrl.searchCompany(companyPin, companyNumber)\">Search Company</button>\n                                <div data-ng-if=\"$ctrl.companyPinLoading\" class=\"d-inline m-l-sm\">\n                                    <i class=\"fa fa-spinner fa-spin fa-2x fa-fw\"></i>\n                                </div>\n                            </div>\n                        </div>    \n                    </div>\n\n                    <!--end of find company -->\n\n                    <div data-ng-show=\"$ctrl.displayBusinessDetails\" class=\"animate-show\">\n                        <div class=\"form-group row\">\n                            <div class=\"col-md-12 col-lg-12 col-xl-12\">\n                                <input type=\"text\" name=\"businessName\" class=\"form-control pill-radius font-body\" placeholder=\"Business Name\" data-ng-model=\"$ctrl.formData.businessName\" data-ng-class=\"{'input-error': $ctrl.formValidation && registrationForm.businessName.$error.required}\"  data-validate-company-name required>\n                                <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"registrationForm.businessName.$error.required && registrationForm.businessName.$dirty\">Please fill out this field</p>\n                                <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"registrationForm.businessName.$error.validCompanyName && registrationForm.businessName.$dirty\">Only letters, numbers, -, (), ., + and spaces are valid charcters in this field.</p>\n                            </div>\n                        </div>\n                        <div class=\"form-group row\">\n                            <div class=\"col-md-12 col-lg-12 col-xl-12\">\n                                <input type=\"text\" name=\"phoneNumber\" class=\"form-control pill-radius font-body\" placeholder=\"Business phone number\"  data-ng-model=\"$ctrl.formData.phoneNumber\" data-ng-class=\"{'input-error': $ctrl.formValidation && registrationForm.phoneNumber.$error.required}\" data-ng-minlength=\"10\" data-ng-maxlength=\"40\" data-validate-phone required>\n                                <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"registrationForm.phoneNumber.$error.required && registrationForm.phoneNumber.$dirty\">Please fill out this field</p>\n                                <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"registrationForm.phoneNumber.$error.minlength && registrationForm.phoneNumber.$dirty\">Minimum of 10 numbers are permitted in this field.</p>\n                                <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"registrationForm.phoneNumber.$error.maxlength && registrationForm.phoneNumber.$dirty\">Maximum of 40 numbers are permitted in this field.</p>\n                                <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"registrationForm.phoneNumber.$error.validPhone && registrationForm.phoneNumber.$dirty\">Please enter a valid phone number.</p>               \n                            </div>\n                        </div>\n                        <div class=\"form-group row\">\n                            <div class=\"col-md-12 col-lg-12 col-xl-12\">\n                                <input type=\"text\" name=\"street\" class=\"form-control pill-radius font-body\" placeholder=\"Business Street\" data-ng-model=\"$ctrl.formData.street\" data-ng-class=\"{'input-error': $ctrl.formValidation && registrationForm.street.$error.required}\" data-validate-address required>\n                                <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"registrationForm.street.$error.required && registrationForm.street.$dirty\">Please fill out this field.</p>\n                                <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"registrationForm.street.$error.validAddress && registrationForm.street.$dirty\">Only letters, numbers, -, (), . and spaces are valid charcters in this field.</p>\n                            </div>\n                        </div>\n                        <div class=\"form-group row\">\n                            <div class=\"col-md-12 col-lg-12 col-xl-12\">\n                                <input type=\"text\" name=\"city\" class=\"form-control pill-radius font-body\" placeholder=\"Business City\" data-ng-model=\"$ctrl.formData.city\" data-ng-class=\"{'input-error': $ctrl.formValidation && registrationForm.city.$error.required}\"  data-validate-address required>\n                                <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"registrationForm.city.$error.required && registrationForm.city.$dirty\">Please fill out this field.</p>\n                                <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"registrationForm.city.$error.validAddress && registrationForm.city.$dirty\">Only letters, numbers, -, (), . and spaces are valid charcters in this field.</p>\n                            </div>\n                        </div>\n                        <div class=\"form-group row\">\n                            <div class=\"col-md-12 col-lg-12 col-xl-12\">\n                                <input type=\"text\" name=\"usstate\" class=\"form-control pill-radius font-body\" placeholder=\"Business State\" data-ng-model=\"$ctrl.formData.USstate\" data-ng-class=\"{'input-error': $ctrl.formValidation && registrationForm.usstate.$error.required}\"  data-validate-address required>\n                                <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"registrationForm.usstate.$error.required && registrationForm.usstate.$dirty\">Please fill out this field.</p>\n                                <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"registrationForm.usstate.$error.validAddress && registrationForm.usstate.$dirty\">Only letters, numbers, -, (), . and spaces are valid charcters in this field.</p>            \n                            </div>\n                        </div>\n                      <div class=\"form-group row\">\n                          <div class=\"col-md-6 col-lg-6 col-xl-6\">\n                              <input type=\"text\" name=\"zip\" class=\"form-control pill-radius font-body\" placeholder=\"Business Zip\" data-ng-model=\"$ctrl.formData.zip\"  data-ng-maxlength=\"10\" data-ng-class=\"{'input-error': $ctrl.formValidation && registrationForm.zip.$error.required}\"  data-validate-zip required>\n                              <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"registrationForm.zip.$error.required && registrationForm.zip.$dirty\">Please fill out this field.</p>\n                              <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"registrationForm.zip.$error.validZip && registrationForm.zip.$dirty\">Please provide a valid ZIP.</p> \n                              <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"registrationForm.zip.$error.maxlength && registrationForm.zip.$dirty\">Maximum of 10 numbers are permitted in this field</p> \n                          </div>\n                          <div class=\"col-md-6 col-lg-6 col-xl-6\">\n                              <select name=\"timezone\" class=\"form-control font-body pill-radius\"\n                                  data-ng-model=\"$ctrl.formData.timezone\"\n                                  data-ng-class=\"{'input-error': $ctrl.formValidation && registrationForm.timezone.$error.required}\"\n                                  required>\n                                  <option value=\"\" disabled selected>Select timezone</option>\n                                  <option data-ng-repeat=\"zone in $ctrl.ustimezones\" value=\"{{zone.abbr}}\" data-ng-selected=\"zone.abbr == selectedItemvalue\">{{zone.abbr}}</option>\n                              </select>\n                              <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"registrationFormzip.$error.required && registrationFormzip.$dirty\">Please select a timezone.</p>\n                          </div>\n                      </div>\n                        <div class=\"form-group row m-b-none\">\n                            <div class=\"col-md-12 col-lg-12 col-xl-12 text-right d-flex justify-content-between\">\n                                <a class=\"btn btn--lg btn--bordered grey pill-radius txt-white\" data-ng-click=\"$ctrl.back('')\" >\n                                    <i class=\"far fa-angle-left\"></i> User Details \n                                </a>                                  \n                                <a class=\"btn btn--lg btn--green pill-radius txt-white\" data-ng-click=\"$ctrl.next('stage2')\" >\n                                    Billing Details <i class=\"far fa-angle-right\"></i>\n                                </a>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n                <div class=\"animate-switch\" data-ng-switch-when=\"stage2\">\n                    <h2 class=\"m-b-sm\">Billing Details</h2>\n                    <div>\n                        <div class=\"row m-b-md\">\n                            <div class=\"col-md-12 col-lg-12 col-xl-12\">\n                                <div class=\"d-flex align-items-center\">\n                                    <label class=\"font-body font-weight-medium\">\n                                        Use business address for billing address?\n                                        <input type=\"checkbox\" name=\"same_as_business\" class=\" m-l-sm\" data-ng-model=\"copyAddress\" data-ng-change=\"$ctrl.copyBusinessAddress(copyAddress)\">\n                                    </label>\n                                </div>\n                            </div>\n                        </div>\n                        <div class=\"form-group row\">\n                            <div class=\"col-md-12 col-lg-12 col-xl-12\">\n                                <input type=\"text\" name=\"billingStreet\" class=\"form-control pill-radius font-body\" placeholder=\"Billing Street\" data-ng-model=\"$ctrl.formData.billingStreet\" data-ng-class=\"{'input-error': $ctrl.formValidation && registrationForm.billingStreet.$error.required}\" data-validate-address required>\n                                <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"registrationForm.billingStreet.$error.required && registrationForm.billingStreet.$dirty\">Please fill out this field.</p>\n                                <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"registrationForm.billingStreet.$error.validAddress && registrationForm.billingStreet.$dirty\">Only letters, numbers, -, (), . and spaces are valid charcters in this field.</p>                \n                            </div>\n                        </div>\n                        <div class=\"form-group row\">\n                            <div class=\"col-md-12 col-lg-12 col-xl-12\">\n                                <input type=\"text\" name=\"billingCity\" class=\"form-control pill-radius font-body\" placeholder=\"Billing City\" data-ng-model=\"$ctrl.formData.billingCity\" data-ng-class=\"{'input-error': $ctrl.formValidation && registrationForm.billingCity.$error.required}\" data-validate-address required>\n                                <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"registrationForm.billingCity.$error.required && registrationForm.billingCity.$dirty\">Please fill out this field.</p>\n                                <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"registrationForm.billingCity.$error.validAddress && registrationForm.billingCity.$dirty\">Only letters, numbers, -, (), . and spaces are valid charcters in this field.</p>                  \n                            </div>\n                        </div>\n                        <div class=\"form-group row\">\n                            <div class=\"col-md-12 col-lg-12 col-xl-12\">\n                                <input type=\"text\" name=\"billingState\" class=\"form-control pill-radius font-body\" placeholder=\"Billing State\" data-ng-model=\"$ctrl.formData.billingState\" data-ng-class=\"{'input-error': $ctrl.formValidation && registrationForm.billingState.$error.required}\" data-validate-address required>\n                                <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"registrationForm.billingState.$error.required && registrationForm.billingState.$dirty\">Please fill out this field.</p>\n                                <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"registrationForm.billingState.$error.validAddress && registrationForm.billingState.$dirty\">Only letters, numbers, -, (), . and spaces are valid charcters in this field.</p>                \n                            </div>\n                        </div>\n                        <div class=\"form-group row\">\n                            <div class=\"col-md-12 col-lg-12 col-xl-12\">\n                                <input type=\"text\" name=\"billingZip\" class=\"form-control pill-radius font-body\" placeholder=\"Billing Zip\"  data-ng-model=\"$ctrl.formData.billingZip\" data-ng-class=\"{'input-error': $ctrl.formValidation && registrationForm.billingZip.$error.required}\" data-validate-zip required>\n                                <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"registrationForm.billingZip.$error.required && registrationForm.billingZip.$dirty\">Please fill out this field.</p>\n                                <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"registrationForm.billingZip.$error.validZip && registrationForm.billingZip.$dirty\">Please provide a valid ZIP.</p> \n                                <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"registrationForm.billingZip.$error.maxlength && registrationForm.billingZip.$dirty\">Maximum of 10 numbers are permitted in this field</p>                 \n                            </div>\n                        </div>\n                        <div class=\"row m-b-sm \">\n                            <div class=\"col-md-12 col-lg-12 col-xl-12 d-flex justify-content-end\">\n                                <div\n                                    vc-recaptcha\n                                    theme=\"'light'\"\n                                    key=\"$ctrl.recap.publicKey\"\n                                ></div>\n                            </div>\n                        </div>\n                        <div class=\"row m-b-sm\">\n                            <div class=\"col-md-12 col-xl-12 text-right\">\n                                <label class=\"form-check-label m-r-xs\">\n                                    I accept the <a href=\"http://thepatent.place/terms/\" target=\"__blank\" class=\"font-weight-medium inline-link\">Terms and Conditions</a>\n                                    <input type=\"checkbox\" name=\"terms-register\" data-ng-model=\"$ctrl.formData.tandc\" required>      \n                                </label> \n                            </div>\n                        </div>\n                        <div class=\"row\">\n                            <div class=\"col-md-12 col-xl-12 d-flex justify-content-between\">\n                                <a class=\"btn btn--lg btn--bordered grey pill-radius txt-white\" data-ng-click=\"$ctrl.back('stage1')\">\n                                    <i class=\"far fa-angle-left\"></i> Business Details \n                                </a>                             \n                                <button type=\"submit\" name=\"formSubmit\" class=\"btn btn--lg btn--green pill-radius\" value=\"\" data-ng-disabled=\"registrationForm.$invalid\"><i class=\"fa fa-spinner fa-spin fa-2x fa-fw  m-r-xs\" data-ng-if=\"$ctrl.dataLoading\"></i>Create account</button>\n                            </div>\n\n                        </div>\n                    </div>\n                  \n                </div>\n\n        </form>\n    </div>\n\n<!-- \n\n                    <div class=\"animate-switch\" data-ng-switch-when=\"success\">\n                        <div class=\"success-wrap\">\n                        <h2 class=\"confirmation-text\">Thank you</h2>\n                        <p>Your message has been sent.<br>You should receive a confirmation email.</p>\n                        <div><button type=\"button\" class=\"btn btn-success\" data-ng-click=\"reset()\" >Send Another</button></div>\n                      </div>\n                    </div>\n                    <div class=\"animate-switch\" data-ng-switch-when=\"error\" >\n                      <div class=\"error-wrap\">\n                        <h2 class=\"confirmation-text\">Error</h2>\n                        <p>There was an error when attempting to submit your request.<br>Please try again later.</p>\n                        <p><strong>*This will always error until a web service URL is set.*</strong></p>\n                        <div><button type=\"button\" class=\"btn btn-danger\" data-ng-click=\"reset()\" >Try again</button></div>\n                      </div>\n                    </div>\n                  </div> -->";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/register/html/verification.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div data-ng-hide=\"$ctrl.portfolioLoaded\" class=\"animate-hide d-flex flex-column justify-content-center align-items-center flex-grow-1\">\n    <i class=\"fas fa-cog fa-spin fa-2x m-b-xs\"></i>\n    <p>Verifying your account...</p>\n</div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/sidenav/html/sidenav-li-item.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<md-button class=\"d-flex align-items-center\" data-ui-sref-active=\"active\" data-ui-sref=\"{{section.state}}\" ng-click=\"focusSection()\">\n\t<i class=\"{{section.icon}}\"></i><span class=\"m-l-xs font-h4\">{{section.name}}</span>\n\t<span class=\"md-visually-hidden\" data-ng-if=\"isSelected()\">current page</span>\n</md-button>\n\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/sidenav/html/sidenav-nav-li.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<md-button class=\"md-button-toggle font-weight-medium justify-content-center align-items-center\" data-ng-click=\"toggle()\" aria-controls=\"side-menu-{{section.name}}\" flex layout=\"row\" aria-expanded=\"{{isOpen()}}\">\n    <i class=\"{{section.icon}}\"></i><span class=\"txt-green m-l-xs font-h4\">{{section.name}}</span>\n\t<md-icon md-font-set=\"fas fa-chevron-down\" class=\"md-toggle-icon txt-green font-h4 d-flex align-items-center\" data-ng-class=\"{'toggled' : isOpen()}\"></md-icon>\n</md-button>\n<ul data-ng-show=\"isOpen()\" id=\"side-menu-{{section.name}}\" class=\"nav menu-toggle-list w-100\">\n    <li data-ng-repeat=\"page in section.pages\" class=\"font-weight-medium\">\n        <menu-link section=\"page\"></menu-link>\n    </li>\n</ul>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/sidenav/html/sidenav.tpl.htm":
/***/ (function(module, exports, __webpack_require__) {

module.exports = "<div> <!--top nav-->\n    <div layout=\"row\" class=\"closed-sidenav border-grey-xs--btm\">\n    \t<div class=\"closed-sidenav--inner d-flex justify-content-between\">\n\t\t\t<span class=\"d-flex cursor-pointer m-r-lg align-items-center\" data-ng-click=\"$ctrl.toggleLeft()\">\n\t\t    \t<i class=\"fas fa-bars fa-2x txt-black\"></i>\n\t\t\t    <p class=\"txt-black m-l-sm font-h4\">Menu</p>\n\t\t\t</span>\n\t    \t<div class=\"d-flex\">\n\t\t\t\t<div class=\"d-flex justify-content-between align-items-center m-r-lg\">\n\t\t\t\t\t<span class=\"m-r-xs font-h4 txt-black\"><span class=\"font-weight-bold\">EST:</span> {{$ctrl.est}}</span> \n\t\t\t\t\t<span class=\"font-h4 txt-black\"><span class=\"font-weight-bold\">UTC:</span> {{$ctrl.utc}}</span>\n\t\t\t\t</div>\t\t\n\t\t\t\t<div class=\"d-flex justify-content-between align-items-center\">\n\t\t\t\t\t<span class=\"m-r-md font-h4 txt-black\"><span class=\"font-weight-bold m-r-xs\">USD - EUR</span>{{$ctrl.fxRate}}</span> \n\t\t\t\t</div>\n\t    \t</div>\n\t\t\t<div class=\"d-flex justify-content-end align-items-center\">\n\t\t\t\t<div class=\"d-flex justify-content-between align-items-center m-r-md\">\t\t\t\n<!-- \t\t\t\t\t<i class=\"far fa-info-circle fa-2x cursor-pointer\" data-ng-click=\"$ctrl.openGuide()\"></i> -->\n\t\t\t\t\t<md-tooltip md-delay=\"500\" md-direction=\"bottom\">App Guide</md-tooltip>\t\t\t\n\t\t\t\t</div>\n\t\t\t\t<a data-ui-sref=\"basket\" class=\"m-r-md\">\n\t\t\t\t\t<ngcart-summary class=\"font-body txt-black\"></ngcart-summary>\n\t\t\t\t</a>\n\t\t\t\t<div class=\"d-flex\">\n\t\t\t\t\t<p class=\"txt-black\">\n\t\t\t\t\t\t<a data-ui-sref=\"profile\" class=\"font-weight-medium font-h4\">{{$ctrl.user.firstName}}</a> | \n\n\t\t\t\t\t</p>\n\t\t\t\t\t<button class=\"font-h4 txt-black inline-link btn btn-no-bg m-l-xs\" data-ng-click=\"$ctrl.empty(); $ctrl.logout()\">Logout</button>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n  \t</div>\n</div>\n\n\n<div><!--side-nav-->\n \t<section flex>\n\t    <md-sidenav class=\"md-sidenav-left bg-phase-grey\" md-component-id=\"left\" md-disable-backdrop md-whiteframe=\"3\">\n      \t\t<div class=\"row\">\n\t\t      \t<div class=\"col-md-12\">\n\t\t      \t\t<div class=\"bg-phase-grey p-v-sm-h-lg flex-grow-1 d-flex justify-content-center align-items-center\">\n\t\t\t      \t\t<img src=\"" + __webpack_require__("./app/features/sidenav/ppIcon-lg.png") + "\" alt=\"patent place icon small\" width=\"200\">\n\t\t\t      \t</div>\n\t\t\t      \t<span class=\"cursor-pointer close-icon\" data-ng-click=\"$ctrl.toggleLeft()\"><i class=\"fas fa-times fa-2x txt-white\"></i></span>\n\t      \t\t</div>\n\t      \t</div>\t    \t\t\t\n      \t \t<md-content class=\"bg-phase-grey\">\n\t      \t \t<div layout=\"column\" class=\"p-pill-tabs m-b-sm p-a-sm\">\n\t      \t \t\t\n\t\t      \t \t<div class=\"d-flex justify-content-center align-items-center m-b-sm\">\t\t      \t \t\n\t\t      \t \t\t<a class=\"nav-link\" data-ui-sref=\"profile\">\t\t\t\n\t\t      \t \t\t\t<img data-ng-src=\"{{$ctrl.avatarimage}}\" data-ng-if=\"$ctrl.avatarimage\" alt=\"users profile pic\" class=\"profile-pic-radius\" width=\"104\">\n\t\t      \t \t\t\t<img src=\"" + __webpack_require__("./app/features/sidenav/avatarDefault.png") + "\" data-ng-if=\"!$ctrl.avatarimage\" alt=\"users profile pic\" class=\"profile-pic-radius\" width=\"104\">\n\t      \t \t\t\t</a>\n\t\t      \t \t</div>\n\t      \t \t\t<div class=\"d-flex justify-content-center align-items-center\">\n\t      \t \t\t\t<a class=\"nav-link nav-link--white d-flex justify-content-center align-items-center font-h4 font-weight-bold\" data-ui-sref=\"profile\">\n\t\t\t      \t \t\t{{$ctrl.user.firstName}} {{$ctrl.user.lastName}}\n\t\t      \t \t\t</a>\n\t      \t \t\t</div>\n\t      \t \t\t<div class=\"d-flex justify-content-center align-items-center\">\n\t\t      \t \t\t<span class=\"font-body text-center\">{{$ctrl.user.business.businessName}}</span>\n\t\t      \t \t</div>\n\t      \t \t</div>\n\t      \t \t<div layout=\"column\" class=\" d-flex justify-content-center\">\n\t      \t \t\t<nav class=\"nav\">\n\t\t\t\t\t\t<ul class=\"side-menu w-100\">\n\t\t\t\t\t\t\t<li data-ng-repeat=\"section in $ctrl.menu.sections\" class=\"font-body font-weight-medium\" data-ui-sref-active=\"active\" data-ng-class=\"{'parentActive' : $ctrl.isSectionSelected(section)}\">\n\t                        \t<menu-link section=\"section\" data-ng-if=\"section.type === 'link'\"></menu-link>\n\t        \t\t\t\t\t<menu-toggle section=\"section\" data-ng-if=\"section.type === 'toggle'\" context=\"$ctrl\"></menu-toggle>\n\t\t\t\t\t        </li>\n\t\t\t\t\t\t</ul>\n\t\t\t\t\t</nav>\n\t\t\t\t</div>\n\t\t\t</md-content>\n\t    </md-sidenav>\n  \t</section>\n  \n    <div layout=\"column\" class=\"closed-sidenav-side bg-phase-grey\">\n\t  \t<div class=\"text-center w-100 p-tb-20\">\n\t  \t\t<a data-ui-sref=\"dashboard.content\">\n\t  \t\t\t<img width=\"35\" src=\"" + __webpack_require__("./app/features/sidenav/ppIcon.png") + "\">\n\t  \t\t</a>\n\t    </div>\n\t\t<ul class=\"nav flex-column\">\n\t\t\t<li class=\"nav-item\" data-ui-sref-active=\"active\">\n\t\t\t\t<a class=\"nav-link p-tb-md d-flex justify-content-center align-items-center active\" data-ui-sref=\"dashboard.content\">\n\t\t\t\t\t<i class=\"fal fa-tachometer-alt fa-2x d-none d-xl-block\"></i>\n\t\t\t\t\t<i class=\"fal fa-tachometer-alt fa-2x d-xl-none\"></i>\n\t\t\t\t</a>\n\t\t\t\t<md-tooltip md-delay=\"500\" md-direction=\"right\">Dashboard</md-tooltip>\n\t\t\t</li>\n\t\t\t<li class=\"nav-item\" data-ui-sref-active=\"active\">\n\t\t\t\t<a class=\"nav-link p-tb-md d-flex justify-content-center align-items-center\" data-ui-sref=\"portfolio\">\n\t\t\t\t\t<i class=\"fal fa-folder-open fa-2x\"></i>\n\t\t\t\t</a>\n\t\t\t\t<md-tooltip md-delay=\"500\" md-direction=\"right\">Portfolio</md-tooltip>\n\t\t\t</li>\t\t\t\n\t\t\t<li class=\"nav-item\" data-ui-sref-active=\"active\">\n\t\t\t\t<a class=\"nav-link p-tb-md d-flex justify-content-center align-items-center\" data-ui-sref=\"transactions\">\n\t\t\t\t\t<i class=\"fal fa-usd-square fa-2x\"></i>\n\t\t\t\t</a>\n\t\t\t\t<md-tooltip md-delay=\"500\" md-direction=\"right\">Transactions</md-tooltip>\n\t\t\t</li>\n\t\t\t<li class=\"nav-item\" data-ui-sref-active=\"active\">\n\t\t\t\t<a class=\"nav-link p-tb-md d-flex justify-content-center align-items-center\" data-ui-sref=\"general-support\">\n\t\t\t\t\t<i class=\"fas fa-user-headset fa-2x\"></i>\n\t\t\t\t</a>\n\t\t\t\t<md-tooltip md-delay=\"500\" md-direction=\"right\">Support</md-tooltip>\n\t\t\t</li>\t\t\t\n\t\t</ul>\n\t\t<div class=\"text-center position-bottom w-100 m-b-sm\">\n<!-- \t\t\t<button data-ng-click=\"$ctrl.openGuide()\" class=\"m-b-sm btn btn-no-bg\">\n\t\t\t\t<i class=\"far fa-info-circle fa-2x txt-white\"></i>\n\t\t\t\t<md-tooltip md-delay=\"500\" md-direction=\"right\">App Guide</md-tooltip>\n\t\t\t</button> -->\n\t\t</div>\n  \t</div>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/support/general/html/general-support.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"content-panel m-b-md\">\r\n    <div class=\"row\">\r\n        <div class=\"col-md-12 col-xl-12 d-flex\">\r\n            <div class=\"content-panel__body bg-white flex-grow-1\">\r\n                <div class=\"row m-b-md\">\r\n                    <div class=\"col-md-6 col-xl-6\">                \r\n                        <p class=\"font-h1 m-b-md\">Support form</p>\r\n                        <p>Our professional team are always here to help with your enquiries, whether they are IP-related or technical. Use the form below to provide as much information as you can to ensure that we direct your enquiry to the appropriate team.</p>\r\n                    </div>\r\n                </div>\r\n                <div class=\"form-group row m-b-md\">\r\n                    <div class=\"col-md-8 col-xl-7\">\r\n                        <p class=\"font-body m-b-xs\">Is your enquiry in relation to specific case(s)?</p>\r\n                        <div class=\"form-check form-check-inline\">\r\n                            <label for=\"specificCase\">Yes</label>\r\n                            <input type=\"checkbox\" class=\"m-l-xs m-r-sm\" name=\"specificCase\" \r\n\r\n                            ng-model=\"specificCase\" \r\n                            ng-true-value=\"'yes'\" \r\n                            data-ng-checked=\"specificCase == 'yes'\" \r\n\r\n                            data-ng-change=\"$ctrl.specificCaseCheck('yes', $ctrl.caseSpecific, specificCase.yes)\" \r\n                            data-ng-disabled=\"$ctrl.fetchingPatents\"> <!--ng-required if caseCheck == 'yes'-->\r\n                        </div>\r\n\r\n                        <div class=\"form-check form-check-inline\">\r\n                            <label for=\"notSpecificCase\">No</label>\r\n                            <input type=\"checkbox\" class=\"m-l-xs m-r-sm\" name=\"specificCase\" \r\n\r\n                            ng-model=\"specificCase\"\r\n                            ng-true-value=\"'no'\" \r\n                            data-ng-checked=\"specificCase == 'no'\" \r\n\r\n                            data-ng-change=\"$ctrl.specificCaseCheck('no', $ctrl.caseSpecific, specificCase.no)\" \r\n                            data-ng-disabled=\"$ctrl.fetchingPatents\">\r\n                        </div>\r\n                        <div class=\"form-check form-check-inline\">\r\n                            <label for=\"unsureSpecificCase\">Unsure</label>\r\n                            <input type=\"checkbox\" class=\"m-l-xs\" name=\"specificCase\"\r\n\r\n                            ng-model=\"specificCase\"\r\n                            ng-true-value=\"'unsure'\" \r\n                            data-ng-checked=\"specificCase == 'unsure'\" \r\n\r\n                            data-ng-change=\"$ctrl.specificCaseCheck('unsure', $ctrl.caseSpecific, specificCase.unsure)\" data-ng-disabled=\"$ctrl.fetchingPatents\">\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n\r\n                <div data-ng-show=\"specificCase == 'yes' && $ctrl.optionSelected\">\r\n                    <form name=\"specificSupportForm\" novalidate>\r\n                        <div class=\"form-group row  m-b-md\">\r\n                            <div class=\"col-md-6 col-xl-5\">\r\n                                <label for=\"category\" class=\"font-h4 font-weight-bold m-b-xs\">Category</label>\r\n                                <select name=\"category\" class=\"form-control font-body pill-radius\"\r\n                                    data-ng-model=\"caseFormData.category\"\r\n                                    data-ng-change=\"$ctrl.checkSpecificType(caseFormData.category, $ctrl.caseSpecificCategory)\"\r\n                                    data-ng-disabled=\"$ctrl.fetchingPatents\"\r\n                                    required>\r\n                                    <option value=\"\" disabled selected>--Please select--</option>\r\n                                    <option data-ng-repeat=\"item in $ctrl.specificCategories\" value=\"{{item}}\" data-ng-selected=\"item == selectedItemvalue\">{{item}}</option>\r\n                                </select>\r\n                            </div>\r\n                        </div>\r\n                        <div data-ng-if=\"$ctrl.categorySelected\">\r\n                            <div class=\"row\" data-ng-show=\"$ctrl.fetchingPatents\" >\r\n                                <div class=\"col-md-6 col-xl-5\">\r\n                                    <div class=\"animate-hide d-flex flex-column justify-content-center align-items-center flex-grow-1\">\r\n                                        <i class=\"fas fa-cog fa-spin fa-2x m-b-xs\"></i>\r\n                                        <p class=\"font-body font-weight-bold\">We are just fetching available cases</p>\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"row\" data-ng-hide=\"$ctrl.fetchingPatents\">\r\n                                    <div data-ng-if=\"!$ctrl.patents\" class=\"col-md-6 col-xl-5\">\r\n                                        <p class=\"font-h4 font-weight-bold text-center\">\r\n                                             - No cases available for this category -\r\n                                        </p>\r\n                                    </div>\r\n                                    <div data-ng-show=\"$ctrl.patents.length > 0\" class=\"col-md-6 col-xl-6\">\r\n                                        <p class=\"font-h4 font-weight-bold m-b-xs\">Cases available for <span data-ng-if=\"!$ctrl.assistedFiling\">enquiry</span><span data-ng-if=\"$ctrl.assistedFiling\">assisted formality filing</span></p>\r\n                                        <p data-ng-if=\"$ctrl.assistedFiling\" class=\"m-b-xs\">Select below any cases you wish to request assisted formality filing for. Upon selection you will have the option to provide a message and, if required, any supporting documents.</p>\r\n                                        <p data-ng-if=\"!$ctrl.assistedFiling\" class=\"m-b-xs\">Select below any cases you wish to include in your enquiry. Upon selection you will be prompted to provide a message and, if required, any supporting documents.</p>  \r\n                                        <div class=\"container__scrollable-area\">\r\n                                            <div class=\"row p-a-sm\">\r\n                                                <div class=\"offset-md-6 col-md-6 offset-xl-6 col-xl-6\">\r\n                                                    <input type=\"text\" class=\"form-control pill-radius\" data-ng-model=\"$ctrl.tableSearch\" placeholder=\"Search table...\">\r\n                                                </div>\r\n                                            </div>\r\n                                            <div class=\"scrollable-area scrollable-area--250\">\r\n                                                <table class=\"t-data support-table\">\r\n                                                    <thead>\r\n                                                        <tr class=\"t-data__row t-data__row--select\">\r\n                                                            <th class=\"t-data__th t-data__th--sm sticky-th\" data-ng-click=\"$ctrl.sortBy('epApplicationNumber');\">\r\n                                                                <span>App No.</span>\r\n                                                                <span data-ng-show=\"$ctrl.propertyName == 'ep_ApplicationNumber' && !$ctrl.reverse\">\r\n                                                                    <i class=\"fas fa-angle-down fa-lg\"></i>\r\n                                                                </span>\r\n                                                                <span data-ng-show=\"$ctrl.propertyName == 'ep_ApplicationNumber' && $ctrl.reverse\">\r\n                                                                    <i class=\"fas fa-angle-up fa-lg\"></i>\r\n                                                                </span>\r\n                                                            </th>\r\n                                                            <th class=\"t-data__th t-data__th--sm sticky-th\">\r\n                                                                Formality Type\r\n                                                            </th>                                            \r\n                                                            <th class=\"t-data__th t-data__th--sm sticky-th\">\r\n                                                            </th>\r\n                                                        </tr>\r\n                                                    </thead>\r\n                                                    <tbody class=\"sticky-tbody\">\r\n                                                        <tr data-ng-repeat=\"patent in $ctrl.patents | filter : $ctrl.tableSearch | orderBy:$ctrl.propertyName:$ctrl.reverse as Result\" class=\"t-data__row t-data__row--select\" data-ng-class=\"{'disabled-row': patent.selectedForEnquiry}\" >\r\n                                                            <td class=\"t-data__td t-data__td--sm sticky-td\">\r\n                                                                <a class=\"t-data__a\" data-ng-bind=\"patent.epApplicationNumber\" data-ng-attr-id=\"{{patent.patentID}}\"></a>\r\n                                                            </td>\r\n                                                            <td class=\"t-data__td t-data__td--sm sticky-td\">\r\n                                                                <p class=\"text-capitalize d-inline\" data-ng-if=\"patent.formalityAvailable == 'epct'\">Euro-PCT</p>\r\n                                                                <p class=\"text-capitalize d-inline\" data-ng-if=\"patent.formalityAvailable == 'postvalidation' || patent.formalityAvailable == 'postgrant'\">----</p>\r\n                                                                <p class=\"text-capitalize d-inline\" data-ng-if=\"patent.formalityAvailable !== 'postvalidation' && patent.formalityAvailable !== 'postgrant' && patent.formalityAvailable !== 'epct'\">{{patent.formalityAvailable}}</p>\r\n                                                                <div class=\"d-inline\" data-ng-if=\"patent.isManualProcessing || patent.isUrgent\">                                        \r\n                                                                    <i class=\"far fa-exclamation-triangle fa-lg txt-phase-amber cursor-pointer\"></i>\r\n                                                                    <md-tooltip md-delay=\"200\" class=\"mdtooltip-md\" md-direction=\"bottom\" md-z-index=\"99999\">\r\n                                                                        <p class=\"font-body\" data-ng-if=\"patent.isManualProcessing\">\r\n                                                                            <span class=\"font-weight-bold\">Manual processing: </span>This formality can only be processed offline via one of our IP profesionals. Please contact our customer support team on {{phoneNumber}}.\r\n                                                                        </p>\r\n                                                                       <p class=\"font-body\" data-ng-if=\"patent.isUrgent\">\r\n                                                                            <span class=\"font-weight-bold\">Urgent processing: </span>It is too close to the deadline for processing this formality online. If you wish to discuss that, we recommend you call our customer support number of {{phoneNumber}}.\r\n                                                                        </p>                                                                        \r\n                                                                    </md-tooltip>            \r\n                                                                </div>\r\n                                                            </td>\r\n                                                            <td class=\"t-data__td t-data__td--sm sticky-td\">\r\n                                                                <button class=\"btn btn--bordered btn-underlined txt-phase-green font-weight-bold\" data-ng-click=\"$ctrl.formalitySelect(patent)\" id=\"{{patent.formalityAvailable + patent.patentID}}\" data-ng-disabled=\"patent.selectedForEnquiry\">Add</button>\r\n                                                            </td>                                            \r\n                                                        </tr>\r\n                                                    </tbody>  \r\n                                                </table>\r\n                                            </div>\r\n                                        </div>                                                                         \r\n                \r\n                                </div>\r\n                            </div>\r\n                            <div class=\"row\">\r\n                                <div class=\"col-xl-12 m-t-md\" data-ng-if=\"allEnquiryCases.length > 0\">\r\n                                    <p class=\"font-h4 font-weight-bold m-b-xs\">Cases selected:</p>\r\n                                    <div class=\"container__scrollable-area\">\r\n                                        <div class=\"scrollable-area scrollable-area--250\">\r\n                                            <table class=\"t-data support-table\">\r\n                                                <thead>\r\n                                                    <tr class=\"t-data__row t-data__row--select\">\r\n                                                        <th class=\"t-data__th t-data__th--sm sticky-th\">\r\n                                                            App No.\r\n                                                        </th>\r\n                                                        <th class=\"t-data__th t-data__th--sm sticky-th th-w-25\">\r\n                                                            Message\r\n                                                        </th>\r\n                                                        <th class=\"t-data__th t-data__th--sm sticky-th th-w-25\">\r\n                                                            Files\r\n                                                        </th>\r\n                                                        <th class=\"t-data__th t-data__th--sm sticky-th\">\r\n                                                            Indicative cost\r\n                                                        </th>\r\n                                                        <th class=\"t-data__th t-data__th--sm sticky-th\">\r\n                                                        </th>\r\n                                                        <th class=\"t-data__th t-data__th--sm sticky-th\">\r\n\r\n                                                        </th>\r\n                                                    </tr>\r\n                                                </thead>\r\n                                                <tbody class=\"sticky-tbody\">\r\n                                                    <tr data-ng-repeat=\"case in allEnquiryCases\">\r\n                                                        <td class=\"t-data__td t-data__td--sm sticky-td\" data-ng-bind=\"case.epApplicationNumber\">\r\n                                                        </td>\r\n                                                        <td class=\"t-data__td t-data__td--sm sticky-td t-data-ellipsis\" data-ng-bind=\"case.message\">\r\n                                                        </td>\r\n                                                        <td class=\"t-data__td t-data__td--sm sticky-td\">\r\n                                                            <span class=\"d-block\" data-ng-if=\"case.uploadedDocs.length > 0\" data-ng-repeat=\"file in case.uploadedDocs\">\r\n                                                                {{file.name}}\r\n                                                            </span>\r\n                                                            <span class=\"d-block txt-grey\" data-ng-if=\"case.uploadedDocs.length == 0\">[No files uploaded]</span>                                                            \r\n                                                        </td>\r\n                                                        <td class=\"t-data__td t-data__td--sm sticky-td\">\r\n                                                            <span data-ng-if=\"case.indicativeCost\">$ {{case.indicativeCost}}</span>\r\n                                                            <span class=\"txt-grey\" data-ng-if=\"!case.indicativeCost\">N/A</span>\r\n                                                        </td>\r\n                                                        <td class=\"t-data__td t-data__td--sm sticky-td\">\r\n                                                            <button class=\"btn btn--bordered btn-underlined txt-phase-green font-weight-bold\" data-ng-click=\"$ctrl.formalitySelect(case, 'edit')\" data-ng-disabled=\"patent.selectedForEnquiry\">Edit</button>\r\n                                                        </td>\r\n                                                        <td class=\"t-data__td t-data__td--sm sticky-td\">\r\n                                                            <button class=\"btn btn--bordered btn-underlined txt-phase-green font-weight-bold\" data-ng-click=\"$ctrl.formalitySelect(case, 'delete')\" data-ng-disabled=\"patent.selectedForEnquiry\">Delete</button>\r\n                                                        </td>                                                \r\n                                                    </tr>\r\n                                                </tbody>\r\n                                            </table>\r\n                                        </div>\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"row m-t-md\" data-ng-if=\"allEnquiryCases.length > 0 && $ctrl.assistedFiling\">\r\n                                <div class=\"col-md-12 col-xl-12 text-right m-b-xs\">\r\n                                    <label class=\"form-check-label m-r-xs\">\r\n                                        I understand additional fees are added when requesting assisted formality filing \r\n                                        <input type=\"checkbox\" name=\"tandcFees\" class=\"m-l-xs\" data-ng-model=\"caseFormData.tandcFees\" data-ng-required=\"$ctrl.assistedFiling\">      \r\n                                    </label> \r\n                                </div>\r\n                               <div class=\"col-md-12 col-xl-12 text-right\">\r\n                                    <label class=\"form-check-label m-r-xs\">\r\n                                        I understand a professional from Patent Place is granted temporary access to my account when preparing a formality\r\n                                        <input type=\"checkbox\" name=\"tandcAccess\" class=\"m-l-xs\" data-ng-model=\"caseFormData.tandcAccess\" data-ng-required=\"$ctrl.assistedFiling\">      \r\n                                    </label> \r\n                                </div>                                \r\n                            </div>\r\n                            <div class=\"row m-t-sm\" data-ng-if=\"allEnquiryCases.length > 0\">\r\n                                \r\n                                <div class=\"col-md-12 col-xl-12 text-right\">\r\n                                    <button type=\"submit\" class=\"btn btn--green btn--lg pill-radius\" data-ng-click=\"$ctrl.submitForm(caseFormData, true)\" data-ng-disabled=\"specificSupportForm.$invalid || $ctrl.submittingRequest\">\r\n                                        <span data-ng-show=\"$ctrl.submittingRequest\">                                \r\n                                            <i class=\"fa fa-spinner fa-spin fa-lg m-r-xs\" ></i>\r\n                                        </span>\r\n                                        Request support\r\n                                    </button>\r\n                                </div>\r\n                            </div>\r\n                        </div> \r\n                    </form>\r\n                </div>\r\n\r\n                <!--non case specific form-->\r\n                <div data-ng-show=\"(specificCase == 'no' || specificCase == 'unsure') && $ctrl.optionSelected\">\r\n                \t<form name=\"supportForm\" id=\"supportForm\" data-ng-init=\"\" data-ng-model=\"$ctrl.supportForm\" novalidate>\r\n                        <div class=\"form-group row\">\r\n                    \t\t<div class=\"col-md-7 col-xl-6\">\r\n                    \t\t\t<label for=\"subject\" class=\"font-h4 font-weight-bold m-b-xs\">Subject</label>\r\n                    \t\t\t<input type=\"text\" name=\"subject\" id=\"subject\" class=\"form-control\" data-ng-model=\"$ctrl.formData.subject\" data-ng-maxlength=\"150\" validate-text-field required>\r\n                                <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"supportForm.subject.$error.required && supportForm.subject.$dirty\">Please fill out this field</p>\r\n                                <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"supportForm.subject.$error.validTextField\">Special characters: []\\<\\>\"%;&+\\/* are not permitted.</p>\r\n                                <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"supportForm.subject.$error.maxlength && supportForm.subject.$dirty\">Subject field has a maximum limit of 150 characters</p>                            \r\n                    \t\t</div>\r\n                        </div>\r\n                        <div class=\"form-group row\">\r\n                            <div class=\"col-md-7 col-xl-6\">\r\n                                <label for=\"category\" class=\"font-h4 font-weight-bold m-b-xs\">Category</label>\r\n                                <select name=\"category\" class=\"form-control font-body pill-radius\"\r\n                                    data-ng-model=\"$ctrl.formData.category\"\r\n                                    data-ng-class=\"{'input-error': $ctrl.formValidation && supportForm.timezone.$error.required}\" data-ng-change=\"$ctrl.checkSubcategories($ctrl.formData.category)\"\r\n                                    required>\r\n                                    <option value=\"\" disabled selected>--Please select--</option>\r\n                                    <option data-ng-repeat=\"item in $ctrl.categories\" value=\"{{item}}\" data-ng-selected=\"item == selectedItemvalue\">{{item}}</option>\r\n                                </select>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"form-group row\" data-ng-show=\"$ctrl.subCategoryRequired\">\r\n                            <div class=\"col-md-7 col-xl-6\">\r\n                                <label for=\"subcategory\" class=\"font-h4 font-weight-bold m-b-xs\">Sub-category</label>\r\n                                <select name=\"subcategory\" class=\"form-control font-body pill-radius\"\r\n                                    data-ng-model=\"$ctrl.formData.subcategory\"\r\n                                    data-ng-class=\"{'input-error': $ctrl.formValidation && upportForm.timezone.$error.required}\"\r\n                                    data-ng-required=\"$ctrl.subCategoryRequired\">\r\n                                    <option value=\"\" disabled selected>--Please select--</option>\r\n                                    <option data-ng-repeat=\"item in $ctrl.subcategory\" value=\"{{item}}\" data-ng-selected=\"item == selectedItemvalue\">{{item}}</option>\r\n                                 </select>\r\n                            </div>   \r\n                        </div>\r\n                        <div class=\"form-group row\">\r\n                            <div class=\"col-md-8 col-xl-6\">                        \r\n                                <label for=\"message\" class=\"font-h4 font-weight-bold m-b-xs\">Message</label>\r\n                                <textarea name=\"message\" id=\"message\" class=\"form-control br-1\" rows=\"10\" data-ng-model=\"$ctrl.formData.message\" maxlength=\"5000\" validate-text-field required></textarea>\r\n                                <p class=\"form-help font-body m-t-xs\">{{!$ctrl.formData.message.length ? 0 : $ctrl.formData.message.length}} / 5000 Characters</p>                        \r\n                                <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"supportForm.message.$error.required && supportForm.message.$dirty\">Please fill out this field</p>\r\n                                <p class=\"font-body txt-phase-red m-t-xs\" data-ng-show=\"supportForm.message.$error.validTextField && supportForm.message.$dirty\">Special characters: &lsqb;&rsqb;&lt;&gt;&quot;&percnt;&semi;&amp;&plus;&bsol;&sol;&ast; are not permitted.</p>                            \r\n                            </div>\r\n                        </div>\r\n                        <div class=\"form-group row\">\r\n                            <div class=\"col-md-8\">\r\n                                <p class=\"font-h4 font-weight-bold m-b-xs\">Supporting documents</p>\r\n                                <p class=\"font-body\">If you have any documents that will help our team with your enquiry, please upload them here.</p>\r\n                                <div data-ng-if=\"$ctrl.files.length > 0\" class=\"m-t-xs\">                            \r\n                                    <p class=\"font-body m-b-xs\">Files uploaded:</p>\r\n                                    <div data-ng-repeat=\"file in $ctrl.files\" class=\"btn btn--lg btn--plain br-1 btn-file-upload m-r-sm\">\r\n                                        <span class=\"m-r-sm\" title=\"{{file.name}}\">{{file.name}}</span>\r\n                                        <span data-ng-click=\"$ctrl.files.splice($index,1)\"><i class=\"fas fa-times fa-lg action-icon btn-close\"></i></span>\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                        </div> \r\n                        <div class=\"form-group row\"  data-ng-if=\"fileStore.maxSizeError || supportForm.uploadedDocs.$error.validfile\">\r\n                            <div class=\"col-md-12 col-xl-7m-b-sm\">\r\n                                <p class=\"txt-phase-red font-body\" data-ng-show=\"fileStore.maxSizeError\">You cannot upload a document with a file size of 0KB.</p>\r\n                                <div ng-messages=\"supportForm.uploadedDocs.$error\" data-ng-if=\"supportForm.uploadedDocs.$error.validfile\">\r\n                                    <p class=\"txt-phase-red m-t-xs\" ng-message=\"validfile\">Invalid file format uploaded. Only the following file formats are permitted (not case sensitive): .pdf, .docx, .png, .gif, .jpg, .jpeg, .pptx, .csv, .xlsx, .zip</p> \r\n                                </div>   \r\n                            </div>              \r\n                        </div>\r\n                        <div class=\"form-group row m-t-md\">\r\n                           \r\n                            <div class=\"col-md-6 col-xl-4 text-left\">\r\n                                <input type=\"file\" name=\"uploadedDocs\" id=\"uploadedDocs\" class=\"d-none\" data-ng-model=\"fileStore.file\" support-file-upload onchange=\"angular.element(this).scope().getFileDetails(this)\" accept=\".pdf, .PDF, .docx, .DOCX, .png, .PNG, .gif, .GIF, ,.jpg, .JPG, .jpeg, .JPEG, .pptx, .PPTX, .csv, .CSV, .xlsx, .XLSX, .zip, .ZIP\" multiple>\r\n                                <label for=\"uploadedDocs\" class=\"btn btn--lg pill-radius btn--plain\">Attach file(s)</label>\r\n                             \r\n                            </div>\r\n                            <div class=\"col-md-6 col-xl-3 text-right\">\r\n                                <button type=\"submit\" class=\"btn btn--green btn--lg pill-radius\" data-ng-click=\"$ctrl.submitForm($ctrl.formData, false)\" data-ng-disabled=\"supportForm.$invalid\">\r\n                                    <span data-ng-show=\"$ctrl.submittingRequest\">                                \r\n                                        <i class=\"fa fa-spinner fa-spin fa-lg m-r-xs\" ></i>\r\n                                    </span>\r\n                                    Request support\r\n                                </button>\r\n                            </div>\r\n\r\n                        </div>                    \r\n                \t</form>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/transactions/html/transaction-item.details.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<uib-tabset type=\"pills\" active=\"activeSelectedTab\">\n\t<uib-tab heading=\"Transaction Details\" index=\"0\" data-ng-hide=\"true\">\n\t\t<div data-ng-repeat=\"transaction in $ctrl.transactionItem.serviceUIs | filter: transactionsFilter\">\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-md-12 col-lg-12 col-xl-12 md-m-b-md\">\n\t\t\t\t\t<p class=\"font-body font-weight-medium m-b-sm\">Transaction item {{$index + 1}} of {{$ctrl.transactionItem.serviceUIs.length}}</p>\n\t\t\t\t\t<p class=\"font-body text-uppercase font-weight-bold m-b-xs\">Details</p>\n\t\t\t\t\t<p class=\"font-weight-bold font-body m-b-xs lh-default\">Client Ref: \n\t\t\t\t\t\t<span class=\"font-weight-normal lh-default\" data-ng-bind=\"transaction.clientRef\"></span>\n\t\t\t\t\t</p>\n\t\t\t\t\t<p class=\"font-weight-bold font-body m-b-xs lh-default\">European Action: <span class=\"font-weight-normal lh-default text-capitalize\" data-ng-bind=\"transaction.serviceType\"></span></p>\n\t\t\t\t\t<p class=\"font-weight-bold font-body m-b-xs lh-default\">App No: <span class=\"font-weight-normal lh-default\" data-ng-bind=\"transaction.patentApplicationNumber || transaction.patentApplicationNumber\"></span></p>\n\t\t\t\t\t<p class=\"font-weight-bold font-body lh-default m-r-md\">Transaction item status:\n\t\t\t\t\t\t<span class=\"font-weight-normal font-body lh-default\" data-ng-bind=\"transaction.transItemStatus\"></span>\n\t\t\t\t\t\t<button class=\"btn btn-no-bg\">\t\t\t\t\t\t\n\t\t\t\t\t\t\t<i class=\"fas fa-question-circle txt-phase-green cursor-pointer fa-lg\" data-ng-if=\"$ctrl.transactionItem.hasFailed\"></i>\n\t\t\t\t            <md-tooltip md-delay=\"200\" class=\"mdtooltip-md\" md-direction=\"bottom\" md-z-index=\"99999\">\n\t\t\t\t\t\t\t\tUnfortunately this transaction item has failed due to the reason of <span class=\"font-weight-medium\">'{{$ctrl.transactionItem.failureReason}}'</span>. If you require further information or assitance, please email us at: support@ip.place. \t\t\t              \t\n\t\t\t\t            </md-tooltip>\t\t\t\t\t\t\t\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<button class=\"btn btn-no-bg\">\n\t\t\t            \t<i class=\"fas fa-question-circle txt-phase-green cursor-pointer fa-lg\" data-ng-if=\"!$ctrl.transactionItem.hasFailed\">\n\t\t\t            \t</i>\n\t\t\t\t            <md-tooltip md-delay=\"200\" class=\"mdtooltip-md\" md-direction=\"bottom\" md-z-index=\"99999\" data-ng-if=\"transaction.transItemStatus == 'Payment in progress'\">\n\t\t\t\t\t\t\t\tThis is the process between asking us to complete a transaction and us sending the money to the patent office. We send an instruction to our payment partner who book the currency exchange transaction. Once we receive the money it's exchanged and sent on to the patent office.\t              \t\t\t              \t\n\t\t\t\t            </md-tooltip>\n\t\t\t\t            <md-tooltip md-delay=\"200\" class=\"mdtooltip-md\" md-direction=\"right\" md-z-index=\"99999\" data-ng-if=\"transaction.transItemStatus == 'EPO Instructed'\">\n\t\t\t\t              \tThis means that we've asked the EPO to complete the transaction. We're now just waiting for them to action this.          \t\t\t              \t\n\t\t\t\t            </md-tooltip>\n\t\t\t\t            <md-tooltip md-delay=\"200\" class=\"mdtooltip-md\" md-direction=\"right\" md-z-index=\"99999\" data-ng-if=\"transaction.transItemStatus == 'Processing'\">\n\t\t\t\t              \tThe European patent validation work is now in progress. When the work is completed, you will be emailed a notification and the status of the transaciton will be updated to 'Completed'.              \t\n\t\t\t\t            </md-tooltip>\n\t\t\t\t            <md-tooltip md-delay=\"200\" class=\"mdtooltip-md\" md-direction=\"right\" md-z-index=\"99999\" data-ng-if=\"transaction.transItemStatus == 'Completed'\">\n\t\t\t\t              \tWe've had confirmation that the instruction has gone through. You can download a copy of the invoice or any relevant certificates.       \t\t\t              \t\n\t\t\t\t            </md-tooltip>\n\t\t\t\t\t\t</button>\n\n\t\t            </p>\n\t\t\t\t\t \n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"m-b-md m-t-md\"></div>\n\t\t\t<div class=\"row\" data-ng-if=\"transaction.epoReceiptUrl || transaction.certificateUrl\">\n\t\t\t\t<div class=\"col-md-12\">\n\t\t\t\t\t<p class=\"font-body text-uppercase font-weight-bold m-b-xs\">Documents</p>\n\n\t\t\t\t\t<a class=\"btn-underlined pill-radius font-body txt-phase-green font-weight-normal text-capitalize\" download data-ng-href=\"{{transaction.epoReceiptUrl}}\" data-ng-if=\"transaction.epoReceiptUrl\">{{transaction.serviceType}} receipt</a><br data-ng-if=\"transaction.epoReceiptUrl\">\n\t\t\t\t\t<a data-ng-href=\"{{transaction.certificateUrl}}\" class=\"btn-underlined pill-radius font-body txt-phase-green font-weight-normal\" download data-ng-if=\"transaction.certificateUrl\">Certificate</a>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"m-b-md m-t-md\"></div> \n\t    \t<div class=\"row m-b-sm\">\n\t\t    \t<div class=\"col-xl-12\">\n\t\t    \t\t<p class=\"font-body text-uppercase font-weight-bold m-b-xs\">Fees</p>\n\t\t    \t</div>\n\t\t        <div class=\"col-md-5 col-xl-5\">\n\t\t            <p class=\"font-weight-bold font-body\">Official Fees:\n\t\t            \t<button class=\"btn btn-no-bg accordion-caret\" data-ng-click=\"panelActive = !panelActive\" data-ng-class=\"{'active': !panelActive}\">\n\t\t            \t\t<i class=\"fas fa-lg fa-caret-right\"></i>\n\t\t            \t</button>\n\t\t                \n\t\t            </p>\n\t\t        </div>\t\t\t\t\t\t\t\t\n\t\t        <div class=\"col-md-4 col-xl-4\">\n\t\t            <p class=\"text-left font-body\">$ {{(transaction.serviceFeeUI.currentOfficialFeeUSD | number: 2) || '0.00'}}</p>\n\t\t        </div>\n\t\t        <div class=\"col-md-12 col-xl-12\">\t\t\t\t\t\t\t\t\n\t\t\t\t\t<div class=\"expandcollapse-item\">\n\t\t\t\t\t\t<div class=\"slideDown m-t-sm\" data-ng-init=\"panelActive = true\" data-ng-hide=\"panelActive\">\n\t\t\t\t\t\t\t<div data-ng-if=\"transaction.serviceType == 'Euro-PCT'\">\n\t\t\t                \n\t\t\t                    <div class=\"row m-b-sm\">\n\t\t\t                        <div class=\"col-md-5 col-xl-5\">\n\t\t\t                            <p class=\"font-weight-medium m-l-sm\">Designation fee:</p>\n\t\t\t                        </div>\n\t\t\t                        <div class=\"col-md-4 col-xl-4\">\n\t\t\t                            <p class=\"text-left font-body\">$ {{(transaction.serviceFeeUI.designationFeeUSD | number: 2) || '0.00'}}</p>\n\t\t\t                        </div>                                                                                     \n\t\t\t                    </div>\n\t\t\t                    <div class=\"row m-b-sm\">\n\t\t\t                        <div class=\"col-md-5 col-xl-5\">\n\t\t\t                            <p class=\"font-weight-medium m-l-sm\">Examination fee:</p>\n\t\t\t                        </div>\n\t\t\t                        <div class=\"col-md-4 col-xl-4\">\n\t\t\t                            <p class=\"text-left font-body\">$ {{(transaction.serviceFeeUI.examinationFeeUSD | number: 2) || '0.00'}}</p>\n\t\t\t                        </div>                                                                                      \n\t\t\t                    </div>\n\t\t\t                    <div class=\"row m-b-sm\">\n\t\t\t                        <div class=\"col-md-5 col-xl-5\">\n\t\t\t                            <p class=\"font-weight-medium m-l-sm\">Excess Page fee:</p>\n\t\t\t                        </div>\n\t\t\t                        <div class=\"col-md-4 col-xl-4\">\n\t\t\t                            <p class=\"text-left font-body\">$ {{(transaction.serviceFeeUI.excessPageFeeUSD | number: 2) || '0.00'}}</p>\n\t\t\t                        </div>                                                                                       \n\t\t\t                    </div>\n\t\t\t                    <div class=\"row m-b-sm\">\n\t\t\t                        <div class=\"col-md-5 col-xl-5\">\n\t\t\t                            <p class=\"font-weight-medium m-l-sm\">Filing fee:</p>\n\t\t\t                        </div>\n\t\t\t                        <div class=\"col-md-4 col-xl-4\">\n\t\t\t                            <p class=\"text-left font-body\">$ {{(transaction.serviceFeeUI.filingFeeUSD | number: 2) || '0.00'}}</p>\n\t\t\t                        </div>                                                                                    \n\t\t\t                    </div>\n\t\t\t                    <div class=\"row m-b-sm\">\n\t\t\t                        <div class=\"col-md-5 col-xl-5\">\n\t\t\t                            <p class=\"font-weight-medium m-l-sm\">Supplmentary Search fee:</p>\n\t\t\t                        </div>\n\t\t\t                        <div class=\"col-md-4 col-xl-4\">\n\t\t\t                            <p class=\"text-left font-body\">$ {{(transaction.serviceFeeUI.supplementarySearchFeeUSD | number: 2) || '0.00'}}</p>\n\t\t\t                        </div>                                                                                       \n\t\t\t                    </div>\n\t\t\t                    <div class=\"row m-b-sm\">\n\t\t\t                        <div class=\"col-md-5 col-xl-5\">\n\t\t\t                            <p class=\"font-weight-medium m-l-sm\">Validation State fee:</p>\n\t\t\t                        </div>\n\t\t\t                        <div class=\"col-md-4 col-xl-4\">\n\t\t\t                            <p class=\"text-left font-body\">$ {{(transaction.serviceFeeUI.validationFeeUSD | number: 2) || '0.00'}}</p>\n\t\t\t                        </div>                                                                                    \n\t\t\t                    </div>\n\t\t\t                    <div class=\"row m-b-sm\">\n\t\t\t                        <div class=\"col-md-5 col-xl-5\">\n\t\t\t                            <p class=\"font-weight-medium m-l-sm\">Extension State fee:</p>\n\t\t\t                        </div>\n\t\t\t                        <div class=\"col-md-4 col-xl-4\">\n\t\t\t                            <p class=\"text-left font-body\">$ {{(transaction.serviceFeeUI.extensionFeeUSD | number: 2) || '0.00'}}</p>\n\t\t\t                        </div>                                                                                      \n\t\t\t                    </div>                                        \n\t\t\t                    <div class=\"row m-b-sm\">\n\t\t\t                        <div class=\"col-md-5 col-xl-5\">\n\t\t\t                            <p class=\"font-weight-medium m-l-sm\">Claims fee 1:</p>\n\t\t\t                        </div>\n\t\t\t                        <div class=\"col-md-4 col-xl-4\">\n\t\t\t                            <p class=\"text-left font-body\">$ {{(transaction.serviceFeeUI.claimsFee1USD | number: 2) || '0.00'}}</p>\n\t\t\t                        </div>                                                                                      \n\t\t\t                    </div>   \n\t\t\t                    <div class=\"row m-b-sm\">\n\t\t\t                        <div class=\"col-md-5 col-xl-5\">\n\t\t\t                            <p class=\"font-weight-medium m-l-sm\">Claims fee 2:</p>\n\t\t\t                        </div>\n\t\t\t                        <div class=\"col-md-4 col-xl-4\">\n\t\t\t                            <p class=\"text-left font-body\">$ {{(transaction.serviceFeeUI.claimsFee2USD | number: 2) || '0.00'}}</p>\n\t\t\t                        </div>                                                                                    \n\t\t\t                    </div>\n\t                            <div class=\"row m-b-sm\">\n\t                                <div class=\"col-md-5 col-xl-5\">\n\t                                    <p class=\"font-weight-medium m-l-sm\">Additional Documents:</p>\n\t                                </div>\n\t                                <div class=\"col-md-4 col-xl-4\">\n\t                                    <p class=\"text-left font-body\">$ {{(transaction.serviceFeeUI.additionalCopiesFeeUSD | number: 2) || '0.00'}}</p>\n\t                                </div>                                                                                    \n\t                            </div>\n\t                            <div class=\"row m-b-sm\">\n\t                                <div class=\"col-md-5 col-xl-5\">\n\t                                    <p class=\"font-weight-medium m-l-sm\">Renewal Fee:</p>\n\t                                </div>\n\t                                <div class=\"col-md-4 col-xl-4\">\n\t                                    <p class=\"text-left font-body\">$ {{(transaction.serviceFeeUI.renewalFeeUSD | number: 2) || '0.00'}}</p>\n\t                                </div>\n\t                            </div>\n\t\t\t                    <div class=\"border-grey-xs--btm\"></div> \n\t\t\t                </div>\n\t\t\t\t            <div data-ng-if=\"transaction.serviceType == 'renewal'\">\n\t\t                        <div class=\"row m-b-sm\">\n\t                                <div class=\"col-md-5 col-xl-5\">\n\t                                    <p class=\"font-weight-medium m-l-sm\">Renewal Fee:</p>\n\t                                </div>\n\t                                <div class=\"col-md-4 col-xl-4\">\n\t                                    <p class=\"text-left font-body\">$ {{(transaction.serviceFeeUI.renewalFeeUSD | number: 2) || '0.00'}}</p>\n\t                                </div>                                                                                \n\t                            </div>\n\t                            <div class=\"row m-b-sm\">\n\t                                <div class=\"col-md-5 col-xl-5\">\n\t                                    <p class=\"font-weight-medium m-l-sm\">Extension Fee:</p>\n\t                                </div>\n\t                                <div class=\"col-md-4 col-xl-4\">\n\t                                    <p class=\"text-left font-body\">$ {{(transaction.serviceFeeUI.extensionFeeUSD | number: 2) || '0.00'}}</p>\n\t                                </div>                                                                                       \n\t                            </div>   \n\t\t\t\t            </div>\n\t\t\t\t            <div data-ng-if=\"transaction.serviceType == 'grant'\">\n\t                            <div class=\"row m-b-sm\">\n\t                                <div class=\"col-md-5 col-xl-5\">\n\t                                    <p class=\"font-weight-medium m-l-sm\">Grant Fee:</p>\n\t                                </div>\n\t                                <div class=\"col-md-4 col-xl-4\">\n\t                                    <p class=\"text-left font-body\">$ {{(transaction.serviceFeeUI.grantFeeUSD | number: 2) || '0.00'}}</p>\n\t                                </div>                                                                                       \n\t                            </div>                             \n\t                            <div class=\"row m-b-sm\">\n\t                                <div class=\"col-md-5 col-xl-5\">\n\t                                    <p class=\"font-weight-medium m-l-sm\">Claims for the 16th and each subsequent claim to the limit of 50:</p>\n\t                                </div>\n\t                                <div class=\"col-md-4 col-xl-4\">\n\t                                    <p class=\"text-left font-body\">$ {{(transaction.serviceFeeUI.claimsFee1USD | number: 2) || '0.00'}}</p>\n\t                                </div>                                                                                     \n\t                            </div>\n\t                            <div class=\"row m-b-sm\">\n\t                                <div class=\"col-md-5 col-xl-5\">\n\t                                    <p class=\"font-weight-medium m-l-sm\">Claims for the 51st and each subsequent claim:</p>\n\t                                </div>\n\t                                <div class=\"col-md-4 col-xl-4\">\n\t                                    <p class=\"text-left font-body\">$ {{(transaction.serviceFeeUI.claimsFee2USD | number: 2) || '0.00'}}</p>\n\t                                </div>                                                                                     \n\t                            </div>      \n\t                            <div class=\"row m-b-sm\">\n\t                                <div class=\"col-md-5 col-xl-5\">\n\t                                    <p class=\"font-weight-medium m-l-sm\">Excess pages:</p>\n\t                                </div>\n\t                                <div class=\"col-md-4 col-xl-4\">\n\t                                    <p class=\"text-left font-body\">$ {{(transaction.serviceFeeUI.excessPageFeeUSD | number: 2) || '0.00'}}</p>\n\t                                </div>                                                                                  \n\t                            </div>\n\t\t\t\t            </div>\n\t\t\t\t            <div data-ng-if=\"transaction.serviceType == 'validation'\">\n\t                            <div class=\"row m-b-sm\" data-ng-repeat=\"state in transaction.allStates\">\n\t                                <div class=\"col-md-5 col-xl-5\">\n\t                                    <p class=\"font-weight-medium m-l-sm\">{{state.stateCode}}:\n\t\t\t\t\t\t\t\t            <md-tooltip md-delay=\"200\" md-direction=\"right\" md-z-index=\"99999\">\n\t\t\t\t\t\t\t\t              \t{{states.stateName}}\n\t\t\t\t\t\t\t\t            </md-tooltip>\n\t\t\t\t\t\t\t            </p>\t  \t\t\t                                    \n\t                                </div>\n\t                                <div class=\"col-md-4 col-xl-4\">\n\t                                    <p class=\"text-left font-body\">$ {{(state.validationCost_USD | number: 2) || '0.00'}}</p>\n\t                                </div>                                                                                     \n\t                            </div>\n\t\t\t\t            </div>\t\t\t\t            \t\t\t\t\t\t            \n\t\t\t\t        </div>\n\t\t\t\t\t</div>\n\t\t        </div>\n\t\t    </div><!--row end-->\n\t\t    <div class=\"row m-b-sm\">\n\t\t        <div class=\"col-md-5 col-xl-5\">\n\t\t            <p class=\"font-weight-bold font-body\">Patent Place Fees:\n\t\t            \t<button class=\"btn btn-no-bg accordion-caret\" data-ng-click=\"ppPanelActive = !ppPanelActive\" data-ng-class=\"{'active': !ppPanelActive}\" >\n\t\t                \t<i class=\"fas fa-lg fa-caret-right \"></i>\n\t\t                </button>\n\t\t            </p>\n\t\t        </div>\n\t\t        <div class=\"col-md-4 col-xl-4\">\n\t\t            <p class=\"text-left font-body\">$ {{(transaction.serviceFeeUI.subTotalUSD - transaction.serviceFeeUI.currentOfficialFeeUSD | number: 2) || '0.00'}}</p>\n\t\t        </div> \n\t\t        <div class=\"col-xl-12\">\n\t\t        \t<div class=\"slideDown m-t-sm\" data-ng-init=\"ppPanelActive = true\" data-ng-hide=\"ppPanelActive\">\n\t\t            \t<div class=\"expandcollapse-item\">\n\t                         <div class=\"row m-b-sm\">\n\t                            <div class=\"col-md-5 col-xl-5\">\n\t                                <p class=\"font-weight-medium m-l-sm\">Processing fee:</p>\n\t                            </div>\n\t\t                            <div class=\"col-md-4 col-xl-4\">\n\t\t                                <p class=\"text-left font-body\">$ {{(transaction.serviceFeeUI.processingFeeUSD | number: 2) || '0.00'}}</p>\n\t\t\t                        </div>\n\t\t\t                    </div>\n\t\t\t                    <div class=\"row m-b-sm\">\n\t\t\t                        <div class=\"col-md-5 col-xl-5\">\n\t\t\t                            <p class=\"font-weight-medium m-l-sm\">Express fee:</p>\n\t\t\t                        </div>\n\t\t\t                        <div class=\"col-md-4 col-xl-4\">\n\t\t\t                            <p class=\"text-left\">$ {{(transaction.serviceFeeUI.expressFeeUSD | number: 2) || '0.00'}}</p>\n\t\t\t                        </div>\n\t\t\t                    </div>\n\t\t\t                    <div class=\"row m-b-sm\">\n\t\t\t                        <div class=\"col-md-5 col-xl-5\">\n\t\t\t                            <p class=\"font-weight-medium m-l-sm\">Urgent fee:</p>\n\t\t\t                        </div>\n\t\t\t                        <div class=\"col-md-4 col-xl-4\">\n\t\t\t                            <p class=\"text-left\">$ {{(transaction.serviceFeeUI.urgentFeeUSD | number: 2) || '0.00'}}</p>\n\t\t\t                        </div>\n\t\t\t                    </div>\n\t\t\t                </div>\n\t\t\t            </div>\n\t\t        </div>\n\t\t    </div> <!--row end-->\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-md-5 col-xl-5\">\n\t\t\t\t\t<p class=\"font-weight-bold font-body\">Total: </p>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-md-4 col-xl-4\">\n\t\t\t\t\t<p class=\"font-body\">$ {{(transaction.serviceFeeUI.subTotalUSD || '0.00') | number: 2}}</p>\n\t\t\t\t</div>\t\n\t\t\t</div>\n\t\t\t<div class=\"border-grey-xs--btm m-t-lg m-b-lg\"></div> \n\t\t</div><!-- end of repeat-->\n\t\t<div class=\"row\">\n\t\t\t<div class=\"col-md-12 text-right\">\n\t\t\t\t<p class=\"font-h4 font-weight-weight\">Invoice : <a data-ng-href=\"{{$ctrl.transactionItem.invoiceUrl}}\" class=\"btn-underlined pill-radius font-h4 txt-phase-green font-weight-normal\" download>Download</a></p>\n\t\t\t</div>\n\t\t</div>\n\t</uib-tab>\n</uib-tabset>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/transactions/html/transaction-item.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div data-ng-if=\"$ctrl.transactionLoaded\" class=\"animate-show modal-box\">\r\n\t<div class=\"modal-overview d-flex flex-column bg-white\">\r\n\t\t<div class=\"modal-overview__options-panel cursor-pointer d-flex align-items-center\">\r\n\t\t\t<div class=\"options-panel__item\">\r\n\t\t\t\t<button class=\"btn btn-no-bg\" data-ng-click=\"$ctrl.closeOverview()\"><i class=\"fas fa-times fa-2x action-icon\"></i></button>\r\n\t\t\t</div>\t\t\t\r\n\t\t</div>\r\n\t\t<div class=\"d-flex flex-grow-1 brbl-10 brtl-10 h100\">\r\n\t\t\t<div class=\"row flex-grow-1\">\r\n\t\t\t\t<div class=\"col-md-12 col-lg-12 col-xl-12 d-flex flex-grow-1 h100\">\r\n\t\t\t\t\t<div class=\"d-flex flex-grow-1\">\r\n\t\t\t\t\t\t<div class=\"width197 brbl-10 brtl-10 bg-light-grey\">\r\n\t\t\t\t\t\t\t<ul class=\"tabs-left nav tabs-left--width197 m-t-lg\">\r\n\t\t\t\t\t\t\t\t<li class=\"nav-item\">\r\n\t\t\t\t\t\t\t\t\t<a class=\"nav-link d-flex flex-column active\">\r\n\t\t\t\t\t\t\t\t\t\t<span><i class=\"fal fa-info-circle font-h3\"></i></span>\r\n\t\t\t\t\t\t\t\t\t\t<span>Details</span>\r\n\t\t\t\t\t\t\t\t\t</a>\r\n\t\t\t\t\t\t\t\t</li>\t\t\t\t\t\r\n\t\t\t\t\t\t\t</ul>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t<div class=\"d-flex flex-column flex-grow-1 modal-overview__view\">\r\n\t\t\t\t\t\t\t<div class=\" p-t-4 p-r-3 p-l-3 \">\r\n\t\t\t\t\t\t\t\t<div class=\"row\">\r\n\t\t\t\t\t\t\t\t\t<div class=\"col-md-12 col-xl-12 d-flex justify-content-between align-items-center m-b-sm\">\r\n\t\t\t\t\t\t\t\t\t\t<p class=\"font-h3 font-weight-bold\">Transaction ID: <span class=\"font-weight-normal\" data-ng-bind=\"$ctrl.transactionItem.p3s_TransRef\"></span></p>\t\r\n\t\t\t\t\t\t\t\t\t\t<p class=\"font-h3 font-weight-bold font-weight-bold\">Transaction initiated on: <span class=\"font-weight-normal\">{{$ctrl.transactionItem.transStartDate | date: 'MM/dd/yy'}}</span></p>\r\n\t\t\t\t\t\t\t\t\t</div>\r\n\r\n\t\t\t\t\t\t\t\t\t<div class=\"col-md-12 col-lg-12 col-xl-12\">\r\n\t\t\t\t\t\t\t\t\t\t<p class=\"font-weight-bold font-h3 d-none d-xl-block\">Transaction progress: \r\n\t\t\t\t\t\t\t\t\t\t\t<span data-ng-if=\"!$ctrl.transactionItem.hasFailed\" class=\"font-weight-normal\">{{$ctrl.transactionItem.latestTransStatus}}</span> \r\n\t\t\t\t\t\t\t\t\t\t\t<span data-ng-if=\"$ctrl.transactionItem.hasFailed\" class=\"font-weight-normal\">Failed - {{$ctrl.transactionItem.failureReason}}</span>\r\n\t\t\t\t\t\t\t\t\t\t</p>\r\n\t\t\t\t\t\t\t\t\t\t<div data-ng-class=\"($ctrl.transactionItem.hasFailed !== true ? 'success' : 'failed')\">\r\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"steps\">\r\n\t\t\t\t\t\t\t\t\t\t\t    <ul id=\"progressTracker\" class=\"steps-container d-flex justify-content-between\">\r\n\t\t\t\t\t\t\t\t\t\t\t        <li data-ng-repeat=\"li in $ctrl.transStatus track by $index\" data-ng-init=\"$ctrl.checkProgress()\" data-ng-class=\"(li.complete == true ? 'complete': '') + '' + (li.active == true ? 'active': '')\"> \r\n\t\t\t\t\t\t\t\t\t\t\t            <div class=\"step font-body cursor-help\" tooltip-placement=\"{{li.position}}\" uib-tooltip=\"{{li.tip}}\" tooltip-class=\"trackerStep\">\r\n\t\t\t\t\t\t\t\t\t\t\t                <div class=\"step-image\">\r\n\t\t\t\t\t\t\t\t\t\t\t                \t<span>\r\n\t\t\t\t\t\t\t\t\t\t\t                \t\t<i data-ng-show=\"li.complete == true\" class=\"far fa-check txt-white fa-lg\"></i>\r\n\r\n\t\t\t\t\t\t\t\t\t\t\t                \t\t<i data-ng-show=\"!$ctrl.transactionItem.hasFailed && li.active\" class=\"far fa-circle txt-white fa-lg\"></i>\r\n\t\t\t\t\t\t\t\t\t\t\t                \t\t<i data-ng-show=\"$ctrl.transactionItem.hasFailed && li.active\" class=\"far fa-times txt-white fa-lg\"></i>\r\n\t\t\t\t\t\t\t\t\t\t\t                \t</span>\r\n\t\t\t\t\t\t\t\t\t\t\t                \t\r\n\t\t\t\t\t\t\t\t\t\t\t                </div>\r\n\t\t\t\t\t\t\t\t\t\t\t                <div class=\"step-current\"><span>{{li.status}}</span></div>\r\n\t\t\t\t\t\t\t\t\t\t\t            </div>\r\n\t\t\t\t\t\t\t\t\t\t\t        </li>\r\n\t\t\t\t\t\t\t\t\t\t\t    </ul>\r\n\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t        <div class=\"col-md-12\">\r\n\t\t\t\t\t\t\t        \t<div class=\"border-grey-xs--btm m-t-sm m-b-sm\"></div>  \t\r\n\t\t\t\t\t\t\t        </div>\r\n\t\t\t\t\t\t        </div>\r\n\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t<div class=\"p-r-3 p-b-3 p-l-3 modal-overview__view__body brbr-10 m-t-sm\">\r\n\t\t\t\t\t\t\t\t<div class=\"row\">\r\n\t\t\t\t\t\t\t\t\t<div class=\"col-md-12\">\r\n\t\t\t\t\t\t\t\t\t\t<div ui-view=\"details\" class=\"d-flex flex-column flex-grow-1\"></div>\r\n\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t</div>\t\t\t\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\t\t\t\r\n\t\t\t\t</div>\t\t\t\t\t\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n\r\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/features/transactions/html/transactions.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div data-ng-show=\"transactions.length === 0\" class=\"col-md-12\">\n    <div class=\"bg-white p-a-sm\">\n        <p class=\"font-weight-medium font-h4 font-weight-medium\">There are currently no transactions.</p>\n    </div>\n</div>\n<div data-ng-hide=\"transactionsLoaded\" class=\"animate-hide d-flex flex-column justify-content-center align-items-center flex-grow-1\">\n    <i class=\"fas fa-cog fa-spin fa-2x m-b-xs\"></i>\n    <p>We are just fetching your transactions</p>\n</div>\n<div data-ng-show=\"transactionsLoaded\" class=\"animate-show container__scrollable-area\">\n    <div  class=\"animate-show container__scrollable-area\">\n        <div class=\"p-l-3 p-r-3 p-tb-sm br-tx-1\">                            \n            <div class=\"d-flex justify-content-between align-items-center\">\n\n                <div uib-popover-template=\"'transactiontpl.html'\" popover-trigger=\"'none'\" popover-is-open=\"displayTransactionHelp\"   popover-placement=\"right\">\n                    <div class=\"d-flex\">\n                        <h1 class=\"font-h1 lh-default m-r-lg\">Transactions</h1>\n                    </div>\n                    <script type=\"text/ng-template\" id=\"transactiontpl.html\" class=\"left\">\n                        <button class=\"btn btn-no-bg mdtooltip-close\" data-ng-click=\"displayFirstHelp('transaction', false)\">\n                            <i class=\"fal fa-times fa-lg txt-black\"></i>\n                        </button>\n                        <div>\n                            <p class=\"m-b-xs\">The transaction table displays both current and historic transactions. </p>\n                            <p>Select one of the transactions and further information will be provided</p>\n                        </div>\n                    </script>   \n                </div>                \n                <div class=\"d-flex align-items-center\">\n                    <md-chips data-ng-model=\"$ctrl.chipOptions\" readonly=\"true\" md-removable=\"true\" class=\"text-capitalize font-weight-medium cursor-pointer\" md-on-remove=\"selectedChip($chip.prop, $chip.value, $chip.cat); getItems($chip.cat, transactions)\">\n                        <md-chip-template>      \n                            {{$chip.prop}}   \n                        </md-chip-template>\n                        <!-- <md-icon><i class=\"d-flex input-group-text pill-radius fa fa-search\"></i></md-icon> -->\n                    </md-chips>\n                    <div class=\"m-r-lg\">\n                        <div class=\"input-group m-r-sm\">\n                            <input type=\"text\" class=\"form-control pill-radius\" name=\"transactionSearch\" data-ng-model=\"searchTransactions\" placeholder=\"Search transactions...\" autocomplete=\"off\">  \n                            <div class=\"input-group-append\">\n                                <div class=\"input-group-text\">\n                                    <i class=\"pill-radius fa fa-search fa-lg\"></i>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                    <div>\n                        <md-menu md-position-mode=\"target-right target\">\n                            <md-button class=\"icon-stretch icon-stretch--icon black pill-radius\" data-ng-click=\"$ctrl.showFilter($mdMenu, $event)\">\n                                <span class=\"icon-text\">Filter</span>              \n                                <i class=\"fal fa-filter fa-2x cursor-pointer icon\"></i> \n                            </md-button>\n                            <md-menu-content class=\"container-filter-list\">\n                                <md-list class=\"box\" data-ng-repeat=\"cat in categories\" ng-init=\"filter[cat]={}\">\n                                    <md-subheader class=\"md-no-sticky\">\n                                        <h2 class=\"font-h3\">{{cat == 'latestTransStatus' ? 'Transaction Status' : 'Transaction Type'}}</h2>\n                                    </md-subheader>\n                                    <md-list-item data-ng-repeat=\"value in getItems(cat, transactions)\">\n                                        <md-checkbox class=\"md-secondary\" data-ng-model=\"filter[cat][value]\" data-ng-change=\"$ctrl.updateFiltered(value, filter[cat][value], cat);\"> <!--used to update filtered patents totals, not filter portfolio-->\n                                        </md-checkbox>\n                                        <p>({{(filtered | filter:value:true).length}})&nbsp;\n                                            <span class=\"text-capitalize\">{{value}}</span>\n                                        </p>\n                                    </md-list-item>\n                                    <md-divider></md-divider>\n                                </md-list>\n                                <div layout=\"row\" class=\"demo-dialog-button\">\n                                    <md-button md-autofocus flex class=\"md-primary\" data-ng-click=\"closeDialog();\">\n                                        Close\n                                    </md-button>\n                                </div>\n                            </md-menu-content>\n                        </md-menu>\n                    </div>\n                </div>\n            </div>\n        </div>\n\n        <div class=\"scrollable-area scrollable-area--full-height\">\n            <table class=\"t-data sticky-table\">\n                <thead class=\"sticky-thead\">\n    \t\t\t\t<tr class=\"t-data__row t-data__row--select t-data__head\">\n    \t\t\t\t\t<th class=\"t-data__th t-data__th--sm sticky-th\" data-ng-click=\"$ctrl.sortBy('p3S_TransRef');\">\n    \t\t\t\t\t\t<span>Transaction ID</span>\n                            <span data-ng-show=\"$ctrl.propertyName == 'p3S_TransRef' && !$ctrl.reverse\">\n                                <i class=\"fas fa-angle-down fa-lg\"></i>\n                            </span>\n                            <span data-ng-show=\"$ctrl.propertyName == 'p3S_TransRef' && $ctrl.reverse\">\n                                <i class=\"fas fa-angle-up fa-lg\"></i>\n                            </span>    \t\t\t\t\t\n    \t\t\t\t\t</th>\n    \t\t\t\t\t<th class=\"t-data__th\" data-ng-click=\"$ctrl.sortBy('transTypeUI');\">\n    \t\t\t\t\t\t<span>Transaction Type</span>\n                            <span data-ng-show=\"$ctrl.propertyName == 'transTypeUI' && !$ctrl.reverse\">\n                                <i class=\"fas fa-angle-down fa-lg\"></i>\n                            </span>\n                            <span data-ng-show=\"$ctrl.propertyName == 'transTypeUI' && $ctrl.reverse\">\n                                <i class=\"fas fa-angle-up fa-lg\"></i>\n                            </span>    \t\t\t\t\t\t\t\t\t\n    \t\t\t\t\t</th>\t\t\t\t\t\n    \t\t\t\t\t<th class=\"t-data__th\" data-ng-click=\"$ctrl.sortBy('transStartDate');\">\n    \t\t\t\t\t\t<span>Transaction Initiated</span>\n                            <span data-ng-show=\"$ctrl.propertyName == 'transStartDate' && !$ctrl.reverse\">\n                                <i class=\"fas fa-angle-down fa-lg\"></i>\n                            </span>\n                            <span data-ng-show=\"$ctrl.propertyName == 'transStartDate' && $ctrl.reverse\">\n                                <i class=\"fas fa-angle-up fa-lg\"></i>\n                            </span>    \t\t\t\t\t\t\t\t\t\n    \t\t\t\t\t</th>\n    \t\t\t\t\t<th class=\"t-data__th\" data-ng-click=\"$ctrl.sortBy('transAmount_USD');\">\n    \t\t\t\t\t\t<span>Cost</span>\n                            <span data-ng-show=\"$ctrl.propertyName == 'transAmount_USD' && !$ctrl.reverse\">\n                                <i class=\"fas fa-angle-down fa-lg\"></i>\n                            </span>\n                            <span data-ng-show=\"$ctrl.propertyName == 'transAmount_USD' && $ctrl.reverse\">\n                                <i class=\"fas fa-angle-up fa-lg\"></i>\n                            </span> \n    \t\t\t\t\t</th>\n    \t\t\t\t\t<th class=\"t-data__th\" data-ng-click=\"$ctrl.sortBy('latestTransStatus');\">\n    \t\t\t\t\t\t<span>Status</span>\n                            <span data-ng-show=\"$ctrl.propertyName == 'latestTransStatus' && !$ctrl.reverse\">\n                                <i class=\"fas fa-angle-down fa-lg\"></i>\n                            </span>\n                            <span data-ng-show=\"$ctrl.propertyName == 'latestTransStatus' && $ctrl.reverse\">\n                                <i class=\"fas fa-angle-up fa-lg\"></i>\n                            </span> \t\t\t\t\t\t\t\t\n    \t\t\t\t\t</th>\n    \t\t\t\t\t<th class=\"t-data__th\">\n    \t\t\t\t\t\t<span>Application No.(s)</span>\n    \t\t\t\t\t</th>\n    \t\t\t\t</tr>\n    \t\t\t</thead>\n    \t\t\t<tbody class=\"sticky-tbody\">\n    \t\t\t    <tr data-ng-repeat=\"transaction in filtered=(transactions | filter:filterByPropertiesMatchingAND | filter:searchTransactions) | orderBy:$ctrl.propertyName:$ctrl.reverse as Result\" data-ng-click=\"$ctrl.rowSelect($event, transaction); $ctrl.select(transaction.p3s_TransRef)\"  class=\"t-data__row t-data__row--select\" data-ng-class=\"{active: transaction.p3s_TransRef == $ctrl.selected}\">\n    \t\t\t        <td class=\"t-data__td sticky-td\">\n    \t\t\t\t\t\t<a class=\"t-data__a\" data-ng-attr-id=\"{{transaction.p3s_TransRef}}\">{{transaction.p3s_TransRef}}</a>\n    \t\t\t        </td>\n    \t\t\t        <td class=\"t-data__td\">\n    \t\t\t        \t{{transaction.transTypeUI}}\n    \t\t\t        </td>\n    \t\t\t        <td class=\"t-data__td\">\n    \t\t        \t\t{{transaction.transStartDate | date: 'MM/dd/yy'}}\n    \t\t\t        </td>\n    \t\t\t        <td class=\"t-data__td\">\n    \t\t\t        \t$ {{transaction.transAmount_USD | number: 2}}\n    \t\t\t        </td>\n    \t\t\t        <td class=\"t-data__td\">\n    \t\t\t\t\t\t<p class=\"font-weight-bold m-b-xs\">\n                               <span data-ng-if=\"!transaction.hasFailed\">{{transaction.latestTransStatus}}</span>\n                               <span data-ng-if=\"transaction.hasFailed\">Failed</span>\n                            </p>\n    \t\t\t\t\t\t<div class=\"progress-tracker progress-trans\" data-ng-class=\"transaction.hasFailed ? 'progress-red' : 'progress-green'\" >\n    \t\t\t\t\t\t\t<uib-progress><uib-bar class=\"pill-radius tracker-item\" value=\"transaction.actionProgress\" max=\"100\"></uib-bar></uib-progress>\n    \t\t\t\t\t\t</div>\t\n    \t\t\t        </td>\t\t        \n    \t\t\t        <td class=\"t-data__td\">\n    \t\t\t\t\t\t<span data-ng-if=\"transaction.serviceUIs.length === 1\" data-ng-repeat=\"item in transaction.serviceUIs\">\n\t\t\t\t\t\t\t\t<span class=\"txt-grey\">\n\t\t\t\t\t\t\t\t\t{{item.appAndType }}\n\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t</span>\n    \t\t\t\t\t\t\t\t\t\n    \t\t\t\t\t\t<select \n    \t\t\t\t\t\t\tdata-ng-if=\"transaction.serviceUIs.length > 1\"\n    \t\t\t\t\t        data-ng-options=\"ui.appAndType for ui in transaction.serviceUIs\"\n    \t\t\t\t\t        data-ng-model=\"transaction.selectedUi\"\n    \t\t\t\t\t\t\tdata-ng-change=\"$ctrl.transactionListFilter(item,$index)\"\n    \t\t\t\t\t\t\tid=\"{{outerIndex}}\"\n    \t\t\t\t\t\t\tclass=\"pill-radius form-control font-body\"\n    \t\t\t\t\t\t\ttransaction-select=\"selectedItem\">\n    \t\t\t\t\t\t\t<option value=\"\">Multiple</option>\n    \t\t\t\t\t\t</select>\n    \t\t\t        </td>\n    \t\t\t    </tr>\n    \t\t\t \t<tr data-ng-show=\"Result.length==0\">\n    \t\t\t \t\t<td class=\"t-data__td text-left\" colspan=\"7\">\n    \t\t\t \t\t\tNo Results Found\n    \t\t\t \t\t</td>\n    \t\t\t \t</tr>\t\t\t\t\t\t    \t\t\t\t\t\t\n    \t\t\t</tbody>\n    \t\t</table>\n    \t</div><!--scrollable area end-->\n    </div>\n</div>\n\n<div data-ui-view=\"modal\" autoscroll=\"false\"></div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/global/directives/html/avatar.tpl.htm":
/***/ (function(module, exports, __webpack_require__) {

module.exports = "<div class=\"avatar\" data-ng-click=\"openUpload()\">\n\t<div class=\"avatar-container\">\t\n\t\t<div class=\"avatar-icon\"> \n\t\t\t<span class=\"fa-stack fa-2x\">\t\n\t\t\t\t<i class=\"fas fa-circle fa-stack-2x fa-inverse\"></i>\n\t\t\t\t<i class=\"fas fa-camera fa-stack-1x\"></i>\n\t\t\t</span>\n\t\t</div>\t\n\t\t<div class=\"avatar-img-container\">\n\t\t\t<img class=\"avatar-img\" data-ng-src=\"{{avatarImg}}\" data-ng-if=\"avatarImg\">\n\t\t\t<img src=\"" + __webpack_require__("./app/global/directives/media/avatar-default.png") + "\" data-ng-if=\"!avatarImg\"></i>\n\t\t</div>\n\t\t<div class=\"avatar-prompt-container d-flex align-items-center justify-content-center\">\n\t\t\t<div class=\"d-flex flex-column align-items-center justify-content-center\">\t\t\t\n\t\t\t\t<i class=\"far fa-edit fa-2x txt-white m-b-xs\"></i>\n\t\t\t\t<p class=\"font-h4 font-weight-medium txt-white\">Change Profile Pic</p>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/global/directives/html/help-panel-group.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"help-panel__group border-grey-xs br-1 pb-3\">\n\t<div class=\"p-4 border-grey-xs--btm \">\n\t\t<p class=\"font-h4 font-weight-bold\">{{heading}}</p>\n\t</div>\n \t<div ng-transclude></div>\n</div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/global/directives/html/help-panel.tpl.htm":
/***/ (function(module, exports) {

module.exports = "\r\n<div class=\"bg-phase-green p-5 d-flex align-items-center justify-content-between\">\r\n\t<button class=\"btn btn-no-bg\" data-ng-click=\"backOut()\">\r\n\t\t<i class=\"fas fa-angle-left fa-3x txt-white cursor-pointer\" ></i>\r\n\t</button>\r\n\t<div class=\"d-flex align-items-center\">\r\n\t\t<i class=\"fal fa-question-circle m-r-xs fa-3x txt-white \"></i><h4 class=\"font-h2 txt-white font-weight-medium\">Help</h4>\r\n\t</div>\r\n\t<button class=\"btn btn-no-bg\" data-ng-click=\"closeHelpPanel()\">\r\n\t\t<i class=\"fal fa-times fa-2x txt-white cursor-pointer\"></i>\r\n\t</button>\r\n\t\r\n</div>\r\n<div class=\"p-5 text-nowrap overflow-x-hidden\">\r\n\r\n\t<div class=\"position-relative overflow-x-hidden\">\r\n\t\t<div class=\"help-panel-default\"><!-- helpPanelId-->\r\n\t\t\t<help-panel-group data-ng-repeat=\"help in helpList track by $index\" heading=\"{{help.category}}\" class=\"help-panel__groups m-b-md\">\t\r\n\t\t\t\t<div class=\"help-panel__list\">\r\n\t\t\t\t\t<div class=\"help-panel__item\" data-ng-repeat=\"item in help.titles\" data-ng-click=\"helpItemSelected(help.category, item.index)\">\r\n\t\t\t\t\t\t<div class=\"px-4 py-2 d-flex justify-content-between\">\r\n\t\t\t\t\t\t\t<p class=\"font-h4 font-weight-bold\">{{item.title}}</p>\r\n\t\t\t\t\t\t\t<i class=\"far fa-angle-right fa-2x\"></i>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t \t<div ng-transclude></div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t</help-panel-group>\r\n\t\t</div>\r\n\t\t<help-information class=\"help-panel__information\"><!-- style=\"position: relative; right: -100%; top: 0;\" -->\r\n\t\t</help-information>\t\t\t\t\t\r\n\t</div>\t\t\t\t\t\r\n\r\n</div>\r\n\r\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/global/directives/html/open-help-button.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"open-help-panel\">\n\t<div class=\"btn-help-inner\" uib-popover-template=\"'openpaneltpl.html'\" popover-trigger=\"'none'\" popover-is-open=\"displayHelp\"  popover-placement=\"left\">\n\t\t<div class=\"btn btn-help d-flex align-items-center justify-content-center\" >\n\t\t\t<i class=\"fas fa-question fa-2x\"></i>\n\t\t</div>\n\t</div>\n</div>\n<script type=\"text/ng-template\" id=\"openpaneltpl.html\">\n    <button class=\"btn btn-no-bg mdtooltip-close\" data-ng-click=\"displayFirstHelp(false)\">\n        <i class=\"fal fa-times fa-lg txt-black\"></i>\n    </button>\n    <div>\n        <p>If you need help or information on any features within the application, just click on the question mark</p>\n    </div>\n</script>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/global/directives/html/password-meter.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<uib-progressbar value=\"value\" max=\"max\" type=\"{{ type }}\"> \n  \t<span class=\"font-body\" data-ng-class=\"{'txt-black': value == 0}\">{{ text }}</span>\n</uib-progressbar>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/global/directives/html/transaction-link.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<button type=\"button\" class=\"btn btn--lg btn--green pill-radius\">View Transaction</button>\n\n<!--data-ng-if=\"$ctrl.patent.portfolioUI.serviceStatus == ('Payment in progress' || 'EPO Instructed')\"-->\n<!-- data-ng-click=\"$ctrl.fetchItemTransaction($ctrl.patent.patentID)\"-->\n\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/global/html/modals/modal.idle.tpl.htm":
/***/ (function(module, exports, __webpack_require__) {

module.exports = "<div class=\"content-panel\">\n\t<div class=\"content-panel__body bg-white\">\n\t\t<div idle-countdown=\"countdown\" data-ng-init=\"countdown=30\" class=\"d-flex flex-column justify-content-center align-items-center\">\n\t\t\t<div class=\"m-b-xs\">\n\t\t\t\t<img src=\"" + __webpack_require__("./assets/imgs/icons/pp_icon.png") + "\">\n\t\t\t</div>\n\t\t\t<p class=\"font-body font-weight-medium\">It looks like you've been inactive so to assist with security we're logging you out in {{countdown}} seconds. But don't worry, you can login again at any time.</p>\n\t\t</div>\n\t</div>\n</div>\n\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/global/html/modals/modal.welcome-message.tpl.htm":
/***/ (function(module, exports, __webpack_require__) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n    <span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n\t<div class=\"m-b-sm\">\n\t\t<img src=\"" + __webpack_require__("./assets/imgs/logos/pp_icon.png") + "\" alt=\"patent place icon\">\t\n\t</div>\n    <h2 class=\"font-h2 font-weight-medium\">Welcome to Patent Place</h2>\n\t<p class=\"font-body w-100  m-b-sm m-t-sm\">It seems you do not have any patents added to the system yet. It is so easy to do so. All you have to do is navigate to the Portfolio page, and you will see the '+' symbol in the top right corner of the table. Click on that and you can start adding as many European patent cases as you like. Our system only requires the European application number (including check digit) to be entered. Patent Place will retrieve the rest of the information from the EPO register for you.</p>\n\t<p class=\"font-body w-100 m-b-sm \">If you need any more information then please access our <a href=\"http://thepatent.place/faqs\" target=\"__blank\" class=\"inline-link font-weight-bold\">FAQ section</a>.</p>\n    <button class=\"btn btn--lg btn--green pill-radius\" data-ng-click=\"$ctrl.dismissModal()\">Dismiss</button>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/global/vendors/ngCart/html/addtocart.htm":
/***/ (function(module, exports) {

module.exports = "<button data-ng-hide=\"inCart()\" class=\"btn btn--lg btn--green pill-radius cartbtn add font-weight-bold\" data-ng-click=\"ngCart.addItem(id, name, price, q, data)\">Add to basket</button>\n<button data-ng-show=\"inCart()\" class=\"btn btn--lg btn--red pill-radius cartbtn remove font-weight-bold\" data-ng-click=\"ngCart.removeItemById(id)\">Remove from basket</button>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/global/vendors/ngCart/html/cart.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"alert alert-warning\" role=\"alert\" data-ng-show=\"ngCart.getTotalItems() === 0\">\n    <span class=\"font-body\">Your basket is empty</span>\n</div>\n<div class=\"row\">\n    <div class=\"col-md-12\">\n        <div class=\"scrollable-area\" data-ng-if=\"ngCart.getTotalItems() > 0\">\n            <table class=\"t-data sticky-table\">\n                <thead class=\"sticky-thead\">\n                    <tr class=\"font-body font-weight-bold\">\n                        <th class=\"t-data__th text-left sticky-th\">Application No.</th>\n                        <th class=\"t-data__th text-left\">European Action</th>\n                        <th class=\"t-data__th text-left\">Client Reference</th>\n                        <th class=\"t-data__th text-left\">Amount</th>\n                        <th class=\"t-data__th text-left\"></th>\n                    </tr>\n                </thead>\n                <tbody class=\"sticky-tbody\">\n                    <tr class=\"t-data__tr\" data-ng-repeat=\"item in ngCart.getCart().items track by $index\">\n                        <td class=\"t-data__td sticky-td\">{{item.getData().ep_ApplicationNumber}}</td>\n                        <td class=\"t-data__td text-capitalize\">{{item._name}}</td>\n                        <td class=\"t-data__td\">\n                            <span data-ng-if=\"item.getData().clientRef == ''\" class=\"txt-grey\">[No client reference provided]</span>\n                            <span data-ng-if=\"item.getData().clientRef !== ''\">{{item.getData().clientRef}}</span>\n                        </td>\n                        <td class=\"t-data__td\">$ {{item._price | number: 2}}</td>\n                        <td class=\"t-data__td\">\n                            <button class=\"btn btn--lg btn--red pill-radius\" data-ng-click=\"ngCart.removeItemById(item.getId())\">\n                               Remove\n                            </button>\n                        </td>\n                    </tr>\n                </tbody>\n            </table>\n        </div>        \n    </div>\n</div>\n\n<div class=\"row m-b-md m-t-md\">\n    <div class=\"col-md-12 d-flex btn-default\">\n        <a class=\"btn btn--lg btn--green pill-radius\" data-ui-sref=\"portfolio\">Add More Actions</a>\n    </div>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/global/vendors/ngCart/html/checkout.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"row\" data-ng-if=\"ngCart.getTotalItems() !== 0\">\n    <div class=\"col-md-12 col-xl-6 lg-m-b-md\">\n        <div class=\"content-panel\">\n            <div class=\"content-panel__body  bg-white\">\n                <p class=\"font-h2 font-weight-medium m-b-sm\">Summary</p>\n                <div class=\"border-grey-xs--btm m-b-sm\"></div>\n                <p class=\"font-body m-b-xs\"><span class=\"font-weight-medium\">Date: </span> {{summary.date || date}}</p>\n                <p class=\"font-body\"><span class=\"font-weight-medium \">Total No of Patents: </span> {{summary.totalPatents}}</p>\n                <div class=\" border-grey-xs--btm m-b-sm m-t-sm\"></div>\n                <div class=\"row\">\n                    <div class=\"col-md-3 col-lg-3 col-xl-8\">\n                        <p class=\"font-weight-medium font-h4\">Fee</p>\n                    </div>\n                    <div class=\"col-md-3 col-lg-3 col-xl-4\">\n                        <p class=\"font-weight-medium font-h4 text-md-right text-lg-right text-xl-left\">Amount</p>\n                    </div>\n                    <div class=\"col-md-3 col-lg-3 d-xl-none\">\n                        <p class=\"font-weight-medium font-h4\">Fee</p>\n                    </div>\n                    <div class=\"col-md-3 col-lg-3 d-xl-none\">\n                        <p class=\"font-weight-medium font-h4 text-md-right text-lg-right\">Amount</p>\n                    </div>\n                </div>\n                <div class=\"border-grey-xs--btm m-t-sm m-b-sm\"></div>\n                    <div class=\"row\">\n                        <div class=\"col-md-6 d-md-block d-xl-none\">\n                            <div class=\"row m-b-sm\">\n                                <div class=\"col-md-6\">\n                                    <p class=\"font-weight-medium font-h4\">Official Fees</p>                        \n                                </div>\n                                <div class=\"col-md-6\">\n                                    <p class=\"font-h4 text-right\">$ {{(summary.fees.totalOfficialFeesUSD | number:2) || '0.00'}}</p>\n                                </div>\n                            </div>\n                        </div>\n                        <div class=\"col-md-6 d-md-block d-xl-none\">\n                            <div class=\"row m-b-sm\">\n                                <div class=\"col-md-6\">\n                                    <p class=\"font-weight-medium font-h4\">Patent Place Fees</p>\n                                </div>\n                                    <div class=\"col-md-6\">\n                                        <p class=\"font-h4 text-right\">$ {{(summary.fees.totalPatentPlaceFeesUSD | number:2) || '0.00' }}</p>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                        <div class=\"col-xl-12 d-none d-xl-block\">\n                            <div class=\"m-b-sm\">\n                                <div class=\"row\">\n                                    <div class=\"col-xl-8\">\n                                        <p class=\"font-weight-medium font-h4\">Official Fees</p>                        \n                                    </div>\n                                    <div class=\"col-xl-4\">\n                                        <p class=\"font-h4\">$ {{(summary.fees.totalOfficialFeesUSD | number:2) || '0.00'}}</p>\n                                    </div>                               \n                                </div>\n                            </div>\n                            <div class=\"m-b-sm\">\n                                <div class=\"row\">\n                                    <div class=\"col-xl-8\">\n                                        <p class=\"font-weight-medium font-h4\">Patent Place Fees</p>\n                                    </div>\n                                    <div class=\"col-xl-4\">\n                                        <p class=\"font-h4\">$ {{(summary.fees.totalPatentPlaceFeesUSD | number:2) || '0.00'}}</p>\n                                    </div>\n                                </div>\n                            </div>                       \n                        </div>                  \n                   \n                        <div class=\"border-grey-xs--btm m-b-md\"></div>\n                        <div class=\"d-none d-xl-block\">\n                            <div class=\"row\">\n                                <div class=\"col-xl-8\">\n                                    <p class=\"font-weight-bold font-h4\">Total:</p> \n                                </div>\n                                <div class=\"col-xl-4\">\n                                    <p class=\"font-weight-bold font-h4\">$ {{(summary.fees.totalCostUSD | number:2) || '0.00'}}</p>\n                                </div>\n                            </div>\n                        </div>\n                        <div class=\"d-xl-none\">\n                            <div class=\"row\">\n                                <div class=\"col-md-12 d-flex justify-content-end\">\n                                    <p class=\"font-weight-medium font-h4 m-r-sm\">Total:</p> \n                                    <p class=\"font-weight-medium font-h4\">$ {{(summary.fees.totalCostUSD | number:2) || '0.00'}}</p>                       \n                                </div>\n                            </div>\n                        </div>     \n                     </div>           \n                </div>            \n            </div>\n\n    <div class=\"col-md-12 col-xl-6\">\n        <div class=\"content-panel bg-white\">\n            <div class=\"content-panel__head border-grey-xs--btm\">\n                <p class=\"font-h2 font-weight-medium m-b-md\">Your Details</p>\n                <form class=\"form\" name=\"billingForm\" novalidate>\n                    <div class=\"row m-b-md\">\n                        <div class=\"col-12\">\n                            <div class=\"d-none d-xl-block hidden-cxl-up\">\n                                <div class=\"form-group row\">\n                                    <label class=\"col-form-label col-cxl-4 text-left font-body font-weight-medium\" for=\"firstName\">First Name</label>\n                                    <div class=\"col-cxl-8\">\n                                        <input class=\"form-control font-body pill-radius\" type=\"text\" name=\"firstName\" id=\"firstName\" data-ng-model=\"summary.firstName\" readonly>\n                                    </div>\n                                </div>\n                                 <div class=\"form-group row\">\n                                    <label class=\"col-form-label col-cxl-4 text-left font-body font-weight-medium\" for=\"lastName\">Last Name</label>\n                                    <div class=\"col-cxl-8\">\n                                        <input class=\"form-control font-body pill-radius\" type=\"text\" name=\"lastName\" id=\"lastName\" data-ng-model=\"summary.lastName\" readonly>\n                                    </div>                             \n                                </div>                                     \n                            </div>\n                            <div class=\"d-none d-md-block hidden-cxl d-xl-block\">\n                                <div class=\"form-group row\">\n                                    <label class=\"col-form-label col-2 text-left font-body font-weight-medium\" for=\"firstName\">First Name</label>\n                                    <div class=\"col-4\">\n                                        <input class=\"form-control font-body pill-radius\" type=\"text\" name=\"firstName\" id=\"firstNameMd\" data-ng-model=\"summary.firstName\" readonly>\n                                    </div>\n                                    <label class=\"col-form-label col-2 text-left font-body font-weight-medium\" for=\"lastName\">Last Name</label>\n                                    <div class=\"col-4\">\n                                        <input class=\"form-control font-body pill-radius\" type=\"text\" name=\"lastName\" id=\"lastNameMd\" data-ng-model=\"summary.lastName\" readonly>\n                                    </div>                             \n                                </div>\n                            </div>                        \n                        </div>\n                    </div>\n                    <div class=\"row m-b-sm\">\n                        <div class=\"col-md-12\">\n                            <div class=\"m-b-sm\">    \n                                <p class=\"font-h4 font-weight-medium\">Billing Address</p>\n                            </div>\n                            <div class=\"d-none d-xl-block hidden-cxl-up hidden-cxl-up\">\n                                <div class=\"form-group row\">\n                                    <label class=\"col-form-label col-cxl-4 text-left font-body font-weight-medium\" for=\"billingStreet\">Street</label>\n                                    <div class=\"col-cxl-8\">\n                                        <input class=\"form-control font-body pill-radius\" type=\"text\" name=\"billingStreet\" id=\"billingStreet\" data-ng-model=\"summary.billingDetails.billingStreet\" data-validate-address required>\n                                        <p class=\"font-body txt-phase-red\" data-ng-show=\"billingForm.businessStreet.$error.required && billingForm.businessStreet.$dirty\">Please fill out this field</p>\n                                        <p class=\"font-body txt-phase-red\" data-ng-show=\"billingForm.businessStreet.$error.validAddress && billingForm.businessStreet.$dirty\">Only letters, numbers, -, ., (), commas and spaces are valid charcters in this field.</p>                                \n                                    </div>\n                                </div>\n                                <div class=\"form-group row\">\n                                    <label class=\"col-form-label col-cxl-4 text-left font-body font-weight-medium\" for=\"billingCity\">City</label>\n                                    <div class=\"col-cxl-8\">\n                                        <input class=\"form-control font-body pill-radius\" type=\"text\" name=\"billingCity\" id=\"billingCity\" data-ng-model=\"summary.billingDetails.billingCity\" data-validate-address required>\n                                        <p class=\"font-body txt-phase-red\" data-ng-show=\"billingForm.billingCity.$error.required && billingForm.billingCity.$dirty\">Please fill out this field</p>\n                                        <p class=\"font-body txt-phase-red\" data-ng-show=\"billingForm.billingCity.$error.validAddress && billingForm.billingCity.$dirty\">Only letters, numbers, -, ., (), commas and spaces are valid charcters in this field.</p>                                        \n                                    </div>\n                                </div>\n                                <div class=\"form-group row\">\n                                    <label class=\"col-form-label col-cxl-4 text-left font-body font-weight-medium\" for=\"billingState\">State</label>\n                                    <div class=\"col-cxl-8\">\n                                        <input class=\"form-control font-body pill-radius\" type=\"text\" name=\"billingState\" id=\"billingState\" data-ng-model=\"summary.billingDetails.billingState\" data-validate-address required>\n                                        <p class=\"font-body txt-phase-red\" data-ng-show=\"billingForm.billingState.$error.required && billingForm.billingState.$dirty\">Please fill out this field</p>\n                                        <p class=\"font-body txt-phase-red\" data-ng-show=\"billingForm.billingState.$error.validAddress && billingForm.billingState.$dirty\">Only letters, numbers, -, ., (), commas and spaces are valid charcters in this field.</p>\n                                    </div>\n                                </div>\n                                <div class=\"form-group row\">\n                                    <label class=\"col-form-label col-cxl-4 text-left font-body font-weight-medium\" for=\"billingZip\">Zip</label>\n                                    <div class=\"col-cxl-8\">\n                                        <input class=\"form-control font-body pill-radius\" type=\"text\" name=\"billingZip\" id=\"billingZip\" data-ng-model=\"summary.billingDetails.billingZip\" data-validate-zip required>\n                                        <p class=\"font-body txt-phase-red\" data-ng-show=\"billingForm.billingZip.$error.required && billingForm.billingZip.$dirty\">Please fill out this field</p>\n                                        <p class=\"font-body txt-phase-red\" data-ng-show=\"billingForm.billingZip.$error.validAddress && billingForm.billingZip.$dirty\">Only letters, numbers, -, ., (), commas and spaces are valid charcters in this field.</p>\n                                    </div>\n                                </div>\n                            </div>                                   \n                            <div class=\"d-none d-md-block hidden-cxl d-xl-block\">\n                                <div class=\"form-group row\">\n                                    <label class=\"col-form-label col-2 text-left font-body font-weight-medium\" for=\"billingStreet\">Street</label>\n                                    <div class=\"col-4\">\n                                        <input class=\"form-control font-body pill-radius\" type=\"text\" name=\"businessStreet\" id=\"billingStreetMd\" data-ng-model=\"summary.billingDetails.billingStreet\" data-validate-address required>\n                                        <p class=\"font-body txt-phase-red\" data-ng-show=\"billingForm.businessStreet.$error.required && billingForm.businessStreet.$dirty\">Please fill out this field</p>\n                                        <p class=\"font-body txt-phase-red\" data-ng-show=\"billingForm.businessStreet.$error.validAddress && billingForm.businessStreet.$dirty\">Only letters, numbers, -, ., (), commas and spaces are valid charcters in this field.</p>                                \n                                    </div>\n                                    <label class=\"col-form-label col-2 text-left font-body font-weight-medium\" for=\"billingCity\">City</label>\n                                    <div class=\"col-4\">\n                                        <input class=\"form-control font-body pill-radius\" type=\"text\" name=\"billingCity\" id=\"billingCityMd\" data-ng-model=\"summary.billingDetails.billingCity\" data-validate-address required>\n                                        <p class=\"font-body txt-phase-red\" data-ng-show=\"billingForm.billingCity.$error.required && billingForm.billingCity.$dirty\">Please fill out this field</p>\n                                        <p class=\"font-body txt-phase-red\" data-ng-show=\"billingForm.billingCity.$error.validAddress && billingForm.billingCity.$dirty\">Only letters, numbers, -, ., (), commas and spaces are valid charcters in this field.</p>                                        \n                                    </div>\n                                </div>\n                                <div class=\"form-group row\">\n                                    <label class=\"col-form-label col-2 text-left font-body font-weight-medium\" for=\"billingState\">State</label>\n                                    <div class=\"col-4\">\n                                        <input class=\"form-control font-body pill-radius\" type=\"text\" name=\"billingState\" id=\"billingStateMd\" data-ng-model=\"summary.billingDetails.billingState\" data-validate-address required>\n                                        <p class=\"font-body txt-phase-red\" data-ng-show=\"billingForm.billingState.$error.required && billingForm.billingState.$dirty\">Please fill out this field</p>\n                                        <p class=\"font-body txt-phase-red\" data-ng-show=\"billingForm.billingState.$error.validAddress && billingForm.billingState.$dirty\">Only letters, numbers, -, ., (), commas and spaces are valid charcters in this field.</p>                                         \n                                    </div>\n                                    <label class=\"col-form-label col-2 text-left font-body font-weight-medium\" for=\"billingZip\">Zip</label>\n                                    <div class=\"col-4\">\n                                        <input class=\"form-control font-body pill-radius\" type=\"text\" name=\"billingZip\" id=\"billingZipMd\" data-ng-model=\"summary.billingDetails.billingZip\" data-validate-zip required>\n                                        <p class=\"font-body txt-phase-red\" data-ng-show=\"billingForm.billingZip.$error.required && billingForm.billingZip.$dirty\">Please fill out this field</p>\n                                        <p class=\"font-body txt-phase-red\" data-ng-show=\"billingForm.billingZip.$error.validZip && billingForm.billingZip.$dirty\">Only numbers and - are valid charcters in this field.</p>                                         \n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                    <div class=\"form-group row d-flex align-items-center justify-content-end\">\n                        <label class=\"form-check-label font-body m-r-xl\">\n                            I accept the <span class=\"font-weight-medium m-r-xs\"><a href=\"http://thepatent.place/terms\" target=\"__blank\" class=\"inline-link\">Terms and Conditions</a></span> <input type=\"checkbox\" name=\"terms-checkout\" data-ng-model=\"tcChecked\" class=\"form-check-input checkbox-round\">\n                        </label>\n                        <div class=\"text-right\">\n                            <button class=\"btn btn--lg btn--green pill-radius\" data-ng-if=\"service=='http' || service == 'log'\" data-ng-click=\"checkout()\" data-ng-disabled=\"!tcChecked || ngCart.getItems() == 0 || billingForm.$invalid\">Continue</button>                \n                        </div>                \n                    </div>\n                </form>\n            </div>\n        </div>\n    </div>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/global/vendors/ngCart/html/modal.confirm-add-action.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"bg-white px-5 py-5 flex-column br-1\">\n\t<span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n\n\t<div class=\"row m-b-lg\">\n\t\t<div class=\"col-md-12 d-flex justify-content-end align-items-center flex-column\">\t\n\t\t\t<p class=\"font-h2 font-weight-bold\"><span data-ng-bind=\"$ctrl.order.totalOrderLength\"></span> European Action added to your basket!</p>\n\t\t</div>\n\t</div>\t\n\t<div class=\"row m-b-lg\">\n\t\t<div class=\"col-xl-12\">\n\t\t\t<table>\n\t\t\t\t<thead>\n\t\t\t\t\t<tr class=\"py-2\">\n\t\t\t\t\t\t<td class=\"font-h4 font-weight-bold\">App No</td>\n\t\t\t\t\t\t<td class=\"font-h4 font-weight-bold\">European Action</td>\n\t\t\t\t\t\t<td class=\"font-h4 font-weight-bold\">Cost</td>\n\t\t\t\t\t</tr>\n\t\t\t\t</thead>\n\t\t\t\t<tbody>\n\t\t\t\t\t<tr class=\"py-2\">\n\t\t\t\t\t\t<td class=\"font-body\" data-ng-bind=\"$ctrl.order.ep_ApplicationNumber\"></td>\n\t\t\t\t\t\t<td class=\"font-body text-capitalize\" data-ng-if=\"$ctrl.order.euroAction.serviceType !== 'epct'\" data-ng-bind=\"$ctrl.order.euroAction.serviceType\"></td>\n\t\t\t\t\t\t<td class=\"font-body text-capitalize\" data-ng-if=\"$ctrl.order.euroAction.serviceType == 'epct'\">Euro-PCT</td>\n\t\t\t\t\t\t<td class=\"font-body text-uppercase\">$ <span data-ng-bind=\"$ctrl.order.price | number: 2\"></span></td>\n\t\t\t\t\t</tr>\n\t\t\t\t</tbody>\n\t\t\t</table>\n\t\t</div>\n\t</div>\n\t<div class=\"row\">\n\t\t<div class=\"col-xl-12\">\n\t\t\t<div class=\"d-flex justify-content-between flex-column\">\n\t\t\t\t<p class=\"font-h4 font-weight-medium m-b-lg text-center\">Would you like to proceed to checkout, or return to your portfolio?</p>\n\t\t\t\t<div class=\"d-flex justify-content-between\">\t\t\t\t\n\t\t\t\t\t<div>\n\t\t\t\t\t\t<button data-ng-click=\"$ctrl.dismissModal()\" class=\"btn btn--lg btn--green pill-radius\">Add more actions</button>\n\t\t\t\t\t</div>\n\t\t\t\t\t\n\t\t\t\t\t<div>\t\t\t\t\n\t\t\t\t\t\t<button data-ng-click=\"$ctrl.continueBasket()\" class=\"btn btn--lg btn--grey pill-radius\">Proceed to checkout</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/global/vendors/ngCart/html/modal.confirm-remove-action.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center p-5\">\n\t\t<span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n\t\t<div class=\"m-b-sm\">\n\t\t\t<p class=\"font-h2 font-weight-bold\">Action removed</p>\n\t\t</div>\n\t\t<p class=\"font-h4 w-100 text-center m-b-md m-t-xs\"><span data-ng-bind=\"$ctrl.order.totalOrderLength\"></span> European Action has been removed from your cart</p>\n\t    <button class=\"btn btn--lg btn--green pill-radius\" data-ng-click=\"$ctrl.dismissModal()\">Dismiss</button>\n</div>\n";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/global/vendors/ngCart/html/modal.validation-in-basket.tpl.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-flex flex-column align-items-center justify-content-center\">\n    <span class=\"modal-cross cursor-pointer\" data-ng-click=\"$ctrl.dismissModal()\"><i class=\"txt-grey fa fa-times fa-2x\"></i></span>\n    <div class=\"m-b-sm\">\n        <i class=\"fas fa-exclamation-circle fa-4x txt-phase-red\"></i>   \n    </div>\n    <p class=\"font-h3 font-weight-medium\">Processing multiple EP formalities: Validations</p>\n    <p class=\"font-body w-100 text-center m-b-sm m-t-xs\">It looks like you are trying to add different EP formalities to the basket. Our system currently doesn't provide the functionality to process validations with other EP formalities (Euro-PCT filing, Grant and Publishing fees, Renewals) in the same transaction. Please create seperate EP validation orders.</p>\n    <div class=\"d-flex\">\n        <button class=\"btn btn--lg btn--green pill-radius m-r-md\" data-ng-click=\"$ctrl.dismissModal()\">Dismiss</button>\n    </div>\n</div>";

/***/ }),

/***/ "./node_modules/html-loader/index.js!./app/global/vendors/ngCart/html/summary.htm":
/***/ (function(module, exports) {

module.exports = "<div class=\"d-flex align-items-center user-utils\">\n\t<i class=\"far fa-shopping-basket fa-2x\"></i>\n\t<span class=\"bg-phase-green txt-white circle-radius-xs d-flex justify-content-center align-items-center cart-total-pos\">\n\t\t{{ ngCart.getTotalItems() }}\n\t</span>\n\n</div>";

/***/ }),

/***/ "./src/js/app.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/angular/index.js");
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(angular__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var angular_ui_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/angular-ui-router/lib-esm/index.js");
/* harmony import */ var ng_idle_angular_idle_min_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/ng-idle/angular-idle.min.js");
/* harmony import */ var ng_idle_angular_idle_min_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(ng_idle_angular_idle_min_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _app_global_vendors_ngCart_ngCart_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./app/global/vendors/ngCart/ngCart.js");
/* harmony import */ var angular_moment__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/angular-moment/angular-moment.js");
/* harmony import */ var angular_moment__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(angular_moment__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var angular_nvd3__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./node_modules/angular-nvd3/index.js");
/* harmony import */ var angular_nvd3__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(angular_nvd3__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var angular_croppie_angular_croppie_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./node_modules/angular-croppie/angular-croppie.js");
/* harmony import */ var angular_croppie_angular_croppie_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(angular_croppie_angular_croppie_js__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var angular_recaptcha__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./node_modules/angular-recaptcha/index.js");
/* harmony import */ var angular_recaptcha__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(angular_recaptcha__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var angular_cookies__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("./node_modules/angular-cookies/index.js");
/* harmony import */ var angular_cookies__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(angular_cookies__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var zxcvbn__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("./node_modules/zxcvbn/lib/main.js");
/* harmony import */ var zxcvbn__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(zxcvbn__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _app_app_config_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("./app/app.config.js");
/* harmony import */ var _app_features_profile_services_profile_details_serv_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("./app/features/profile/services/profile.details.serv.js");
/* harmony import */ var _app_global_services_app_ppnumber_serv_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("./app/global/services/app.ppnumber.serv.js");
/* harmony import */ var _app_features_login_services_authorisation_serv_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("./app/features/login/services/authorisation.serv.js");
/* harmony import */ var _app_global_controllers_core_ctrl_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("./app/global/controllers/core.ctrl.js");
/* harmony import */ var _app_features_dashboard_index_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__("./app/features/dashboard/index.js");
/* harmony import */ var _app_features_sidenav_index_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__("./app/features/sidenav/index.js");
/* harmony import */ var _app_features_register_index_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__("./app/features/register/index.js");
/* harmony import */ var _app_global_directives_transactions_directive_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__("./app/global/directives/transactions.directive.js");
/* harmony import */ var _app_global_directives_validations_directive_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__("./app/global/directives/validations.directive.js");
/* harmony import */ var _app_global_directives_avatar_directive_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__("./app/global/directives/avatar.directive.js");
/* harmony import */ var _app_global_directives_dynamic_directive_js__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__("./app/global/directives/dynamic.directive.js");
/* harmony import */ var _app_global_directives_open_help_directive_js__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__("./app/global/directives/open-help.directive.js");
/* harmony import */ var _app_global_directives_mobile_redirect_directive_js__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__("./app/global/directives/mobile-redirect.directive.js");
/* harmony import */ var _fortawesome_fontawesome_pro_js_fontawesome__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__("./node_modules/@fortawesome/fontawesome-pro/js/fontawesome.js");
/* harmony import */ var _fortawesome_fontawesome_pro_js_fontawesome__WEBPACK_IMPORTED_MODULE_25___default = /*#__PURE__*/__webpack_require__.n(_fortawesome_fontawesome_pro_js_fontawesome__WEBPACK_IMPORTED_MODULE_25__);
/* harmony import */ var _fortawesome_fontawesome_pro_js_solid__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__("./node_modules/@fortawesome/fontawesome-pro/js/solid.js");
/* harmony import */ var _fortawesome_fontawesome_pro_js_solid__WEBPACK_IMPORTED_MODULE_26___default = /*#__PURE__*/__webpack_require__.n(_fortawesome_fontawesome_pro_js_solid__WEBPACK_IMPORTED_MODULE_26__);
/* harmony import */ var _fortawesome_fontawesome_pro_js_regular__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__("./node_modules/@fortawesome/fontawesome-pro/js/regular.js");
/* harmony import */ var _fortawesome_fontawesome_pro_js_regular__WEBPACK_IMPORTED_MODULE_27___default = /*#__PURE__*/__webpack_require__.n(_fortawesome_fontawesome_pro_js_regular__WEBPACK_IMPORTED_MODULE_27__);
/* harmony import */ var _fortawesome_fontawesome_pro_js_brands__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__("./node_modules/@fortawesome/fontawesome-pro/js/brands.js");
/* harmony import */ var _fortawesome_fontawesome_pro_js_brands__WEBPACK_IMPORTED_MODULE_28___default = /*#__PURE__*/__webpack_require__.n(_fortawesome_fontawesome_pro_js_brands__WEBPACK_IMPORTED_MODULE_28__);





































angular__WEBPACK_IMPORTED_MODULE_0___default.a.module('ppApp', ['ui.router', 'ngIdle', 'ngAnimate', 'ui.bootstrap', 'ngMaterial', 'ngTouch', 'angularMoment', 'LocalStorageModule', 'nvd3', 'ngCookies','angularCroppie', 'ngSanitize', 'ngFileUpload', 'angular-bind-html-compile', 'oc.lazyLoad', _app_features_profile_services_profile_details_serv_js__WEBPACK_IMPORTED_MODULE_12__[/* default */ "a"], _app_global_services_app_ppnumber_serv_js__WEBPACK_IMPORTED_MODULE_13__[/* default */ "a"], _app_features_login_services_authorisation_serv_js__WEBPACK_IMPORTED_MODULE_14__[/* default */ "a"], _app_global_vendors_ngCart_ngCart_js__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"], _app_global_controllers_core_ctrl_js__WEBPACK_IMPORTED_MODULE_15__[/* default */ "a"], _app_features_dashboard_index_js__WEBPACK_IMPORTED_MODULE_16__["default"], _app_features_sidenav_index_js__WEBPACK_IMPORTED_MODULE_17__[/* default */ "a"], _app_global_directives_transactions_directive_js__WEBPACK_IMPORTED_MODULE_19__[/* default */ "a"], _app_global_directives_validations_directive_js__WEBPACK_IMPORTED_MODULE_20__[/* default */ "a"], _app_global_directives_avatar_directive_js__WEBPACK_IMPORTED_MODULE_21__[/* default */ "a"], _app_global_directives_dynamic_directive_js__WEBPACK_IMPORTED_MODULE_22__[/* default */ "a"], _app_global_directives_open_help_directive_js__WEBPACK_IMPORTED_MODULE_23__[/* default */ "a"], _app_global_directives_mobile_redirect_directive_js__WEBPACK_IMPORTED_MODULE_24__[/* default */ "a"], _app_features_register_index_js__WEBPACK_IMPORTED_MODULE_18__["default"], angular_recaptcha__WEBPACK_IMPORTED_MODULE_8___default.a, ]).config(_app_app_config_js__WEBPACK_IMPORTED_MODULE_11__[/* default */ "a"]).constant('_', window._).run(startUpRun);

startUpRun.$inject = ['$state', '$cookies', '$location', '$http', 'Idle', '$rootScope', '$timeout', '$transitions', 'PpnumberService', 'CoreService', 'AuthorisationService'];

function startUpRun($state, $cookies, $location, $http, Idle, $rootScope, $timeout, $transitions, PpnumberService, CoreService, AuthorisationService) {

    $rootScope._ = window._;
    $rootScope.logout = false;

    Idle.watch();

    $rootScope.globals = $cookies.getObject('globals') || {};

    if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
    }

    $rootScope.$on('$locationChangeStart', function (event, next, current) {

        // redirect to login page if not logged in and trying to access a restricted page
        var restrictedPage = $.inArray($location.path(), ['/login', '/login_error','/register', '/prelogin/new-user-verify','/forgot-password', '/reset-password', '/prelogin/reset-password/']) === -1; //if it doesnt contain logi or registr
        var loggedIn = $rootScope.globals.currentUser;

        var phrase = $location.path();
        var myRegexp, match; 
        if(next.includes('reset-password')) {
            myRegexp = /prelogin\/reset-password\/(.*)/;
        } 

        if(next.includes('new-user-verify')) {
             myRegexp = /prelogin\/new-user-verify\/(.*)/;
        }

        if(myRegexp !== undefined) {
            var match = myRegexp.exec(phrase); //if match == null, means that they are not on reset-password
        }

        if(!restrictedPage || match !== null) { //if pre login or on reset-password
            $rootScope.authorised = false;
        }

        if (restrictedPage && !loggedIn && match == null) {
            $rootScope.authorised = false;
            $location.path('/login');
        }

        if(restrictedPage && loggedIn && match == null) {

            $rootScope.authorised = true;
            PpnumberService.fetchNumber()
            .then(
                function(response){
                    $rootScope.ppDetails = response;
                }
            )

            CoreService.checkCases()
            .then(
                function(response){

                    if(!response) {
                        $rootScope.firstTime = true;
                    }
                    
                }
            )            
        }
    });
};
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ })

},[["./src/js/app.js",1,0]]]);