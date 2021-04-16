//  
//   Pat's workflow process involves a specific file : /webapp/app/app.config.js
//  
//   Pat's process needs that file to exist, but once the FE is delivered for merging with BE, the file is unused.
//  
//   That file causes the BE developer’s Eclipse to report 14 errors. Whilst not affecting P3S operation, these errors could cause real errors to be overlooked.
//  
//   So - once the FE code is delivered to the BE team, it’s desirable that that file is removed, or its errant content removed. Preferably automatically.
//  
//   Attempts to automatically delete the file using maven-antrun-plugin have failed. But file copy (inc. overwrite) using maven-resources-plugin, work.
//  
//   Hence THIS file, stored in /resources, is used to overwrite the errant file in webapp/app
//  
//   The copy is implemented by a plugin in pom.xml. Any operation (inc. ‘refresh’) causes the copy to execute. 
//   So it’s not even necessary to perform clean, build or maven/update to remove the errant file.
//  
//   Andy Chapman
//   11th September 2020
//  

appConfig.$inject = ['$httpProvider', '$urlRouterProvider', '$uibModalProvider', '$compileProvider' ,'$qProvider', 'KeepaliveProvider', 'IdleProvider', 'localStorageServiceProvider', '$mdIconProvider', '$mdPanelProvider', '$stateProvider'];

export default function appConfig($httpProvider, $urlRouterProvider, $uibModalProvider, $compileProvider, $qProvider, KeepaliveProvider, IdleProvider, localStorageServiceProvider, $mdIconProvider, $mdPanelProvider, $stateProvider) {

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
        template: require('html-loader!./features/login/html/login.tpl.htm'),
        controller: 'LoginController',
        controllerAs: '$ctrl',
        lazyLoad: function($transition$) {

            const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");
            
            // !!! Dynamic import !!!
            return import(/* webpackChunkName: "index" */ "./features/login/index.js")
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
        template: require('html-loader!./features/forgot-password/html/forgot-password.tpl.htm'),
        controller: 'ForgotPasswordController',
        controllerAs: '$ctrl',
        lazyLoad: function($transition$) {
            const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");
            
            // !!! Dynamic import !!!
            return import(/* webpackChunkName: "index" */ "./features/forgot-password/index.js")
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
        template: require('html-loader!./features/forgot-password/html/reset-password.tpl.htm'),
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
                            template: require('html-loader!./features/forgot-password/html/modals/modal.reset-password-verification-error.tpl.htm'),
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
            return import(/* webpackChunkName: "index" */ "./features/forgot-password/index.js")
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
        template: require('html-loader!./features/register/html/register.tpl.htm'),
        controller: 'RegisterController',
        controllerAs: '$ctrl',
        lazyLoad: function($transition$) {

            const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");
            
            // !!! Dynamic import !!!
            return import(/* webpackChunkName: "index" */ "./features/register/index.js")
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
        template: require('html-loader!./features/register/html/verification.tpl.htm'),
        controller: 'VerifyAccountController',
        controllerAs: '$ctrl',
        lazyLoad: function($transition$) {

            const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");
            
            // !!! Dynamic import !!!
            return import(/* webpackChunkName: "index" */ "./features/register/index.js")
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
                                template: require('html-loader!./features/register/html/modals/modal.verify-success.tpl.htm'),
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
                                template: require('html-loader!./features/register/html/modals/modal.verify-error.tpl.htm'),
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
                        template: require('html-loader!./features/register/html/modals/modal.verify-error.tpl.htm'),
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
        template: require('html-loader!./features/profile/html/profile.tpl.htm'),
        controller: 'ProfileController',
        controllerAs: '$ctrl',
        lazyLoad: function($transition$) {
            const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");
            
            // !!! Dynamic import !!!
            return import(/* webpackChunkName: "index" */ "./features/profile/index.js")
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
        template: require('html-loader!./features/dashboard/html/dashboard.tpl.htm'),
        controller: 'DashboardController',
        controllerAs: '$ctrl',
        lazyLoad: function($transition$) {
            const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");
            
            // !!! Dynamic import !!!
            return import(/* webpackChunkName: "index" */ "./features/dashboard/index.js")
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
                template: require('html-loader!./features/dashboard/html/dashboard.actions-available.tpl.htm')
            },           
            'fxchartwidget@dashboard': {
                controller: 'DbFxChartController',
                controllerAs: '$ctrl',
                template: require('html-loader!./features/dashboard/html/dashboard.fxchart-widget.tpl.htm')
            },
            'europctsgraph@dashboard': {
                controller: 'EuropctsDonutController',
                controllerAs: '$ctrl',
                template: require('html-loader!./features/dashboard/html/dashboard.europcts-graph.tpl.htm')     
            },
            'renewalsgraph@dashboard': {
                controller: 'RenewalsDonutController',
                controllerAs: '$ctrl',
                template: require('html-loader!./features/dashboard/html/dashboard.renewals-graph.tpl.htm')
            },                
            'grantsgraph@dashboard': {
                controller: 'GrantsDonutController',
                controllerAs: '$ctrl',
                template: require('html-loader!./features/dashboard/html/dashboard.grants-graph.tpl.htm')
            },
            'validationsgraph@dashboard': {
                controller: 'ValidationsDonutController',
                controllerAs: '$ctrl',
                template: require('html-loader!./features/dashboard/html/dashboard.validations-graph.tpl.htm')
            }                          
        }
    })
    .state('portfolio', {
        url: '/portfolio',
        template: require('html-loader!./features/portfolio/html/portfolio.tpl.htm'),
        controller: 'PortfolioController',
        controllerAs: '$ctrl',
        lazyLoad: function($transition$) {
            const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");

            return import(/* webpackChunkName: "index" */ "./features/portfolio/index.js")
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
                template: require("./features/case/html/modal.html")
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
            return import(/* webpackChunkName: "index" */ "./features/case/index.js")
            .then(function(mod) {
                $ocLazyLoad.inject(mod.default);
            })
            .catch(err => {
                throw new Error("Ooops, something went wrong, " + err);
            });
        },      
        views:{
            "": {
                template: require('html-loader!./features/case/html/case.overview.tpl.htm'),
                controller: 'CaseOverviewController',
                controllerAs: '$ctrl',
            },
            "details@portfolio.modal.case": {
                template: require('html-loader!./features/case/html/details/case-details.tpl.htm'),
                controller: 'CaseDetailsController',
                controllerAs: '$ctrl'              
            },
            "reminders@portfolio.modal.case": {
                template: require('html-loader!./features/case/html/notifications/notifications.tpl.htm'),
                controller: 'RemindersController',
                controllerAs: '$ctrl',                 
            },
            "form1200@portfolio.modal.case": {
                template: require('html-loader!./features/case/html/europct/europct.form1200.tpl.htm'),
                controller: 'Form1200ReadyController',
                controllerAs: '$ctrl'                

            },           
            "renewalhistory@portfolio.modal.case": {
                template: require('html-loader!./features/case/html/renewal/renewal.history.tpl.htm'),
                controller: 'RenewalHistoryController',
                controllerAs: '$ctrl'                

            },        
            "grantandpublishing@portfolio.modal.case": {
                template: require('html-loader!./features/case/html/grant/grant.tpl.htm'),
                controller: 'GrantController',
                controllerAs: '$ctrl'                
            },      
            "validation@portfolio.modal.case": {
                template: require('html-loader!./features/case/html/validation/validation.tpl.htm'),
                controller: 'ValidationController',
                controllerAs: '$ctrl'                
            },                                                
            "fee-breakdown@portfolio.modal.case": {
                template: require('html-loader!./features/case/html/feebreakdown/fee-breakdown.tpl.htm'),
                controller: 'FeeBreakDownController',
                controllerAs: '$ctrl'                
            },
            "fxchart@portfolio.modal.case": {
                template: require('html-loader!./features/case/html/fxchart/fxchart.tpl.htm'),
                controller: 'FxChartController',
                controllerAs: '$ctrl'  
            },
            "costchart@portfolio.modal.case": {
                template: require('html-loader!./features/case/html/costchart/costchart.tpl.htm'),
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
        template: require('html-loader!./features/transactions/html/transactions.tpl.htm'),
        controller: 'TransactionsController',
        controllerAs: '$ctrl',
        lazyLoad: function($transition$) {
            const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");
            
            // !!! Dynamic import !!!
            return import(/* webpackChunkName: "index" */ "./features/transactions/index.js")
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
                template: require("./features/transactions/html/modal.html")
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
            return import(/* webpackChunkName: "index" */ "./features/transactions/index.js")
            .then(function(mod) {
                $ocLazyLoad.inject(mod.default)
            })
            .catch(err => {
                throw new Error("Ooops, something went wrong, " + err);
            });
        },        
        views: {
            "" : {
                template: require('html-loader!./features/transactions/html/transaction-item.tpl.htm'),
                controller: 'TransactionItemController',
                controllerAs: '$ctrl',                    
            },
            "details@transactions.modal.transaction-item" : {
                template: require('html-loader!./features/transactions/html/transaction-item.details.tpl.htm'),
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
    .state('basket', {
        url: '/basket',
        template:  require('html-loader!./features/checkout/html/checkout.basket.tpl.htm'),
        controller: 'BasketController',
        controllerAs: '$ctrl',
        lazyLoad: function($transition$) {
            const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");
            
            // !!! Dynamic import !!!
            return import(/* webpackChunkName: "index" */ "./features/checkout/index.js")
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
        template: require('html-loader!./features/checkout/html/checkout.bank-transfer-preparation.tpl.htm'),
        controller: 'BankTransferPrepController',
        controllerAs: '$ctrl',
        lazyLoad: function($transition$) {
            const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");
            
            // !!! Dynamic import !!!
            return import(/* webpackChunkName: "index" */ "./features/checkout/index.js")
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
        template: require('html-loader!./features/checkout/html/checkout.bank-transfer-success.tpl.htm'),            
        controller: 'BankTransferSuccessController',
        controllerAs: '$ctrl',
        lazyLoad: function($transition$) {
            const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");
            
            // !!! Dynamic import !!!
            return import(/* webpackChunkName: "index" */ "./features/checkout/index.js")
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