appConfig.$inject = ['$httpProvider', '$urlRouterProvider', '$uibModalProvider', '$compileProvider' ,'$qProvider', 'KeepaliveProvider', 'IdleProvider', 'localStorageServiceProvider', '$mdIconProvider', '$mdPanelProvider', '$stateProvider'];

export default function appConfig($httpProvider, $urlRouterProvider, $uibModalProvider, $compileProvider, $qProvider, KeepaliveProvider, IdleProvider, localStorageServiceProvider, $mdIconProvider, $mdPanelProvider, $stateProvider) {

    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};    
    }    

    window.ppdomain = "http://localhost:8080/p3sweb/";

    $urlRouterProvider 
        .when('', '/dashboard')
        .otherwise("/dashboard")

    $stateProvider
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
        }        
    })
    .state('transactions.modal', {
        abstract: true,
        views: {
            "modal": {
                template: require("./features/transactions/html/modal.html")
            }
        }
    })        
    .state('transactions.modal.transaction-item', {
        url: '/:transId',
        resolve: {            
            transactionItem: ['$stateParams', '$q', 'TransactionService', function($stateParams, $q, TransactionService) {
                return TransactionService.fetchAllTransactions()
                .then(
                    function(response){
                        return response.find(function(transaction){
                            return transaction.p3s_TransRef == $stateParams.transId;
                        })
                    },
                    function(errResponse) {
                        console.error('Error fetching trans item. Error: ', errResponse)
                    }
                )
      
            }]
        },
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
        }
    })    

    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';

    $mdIconProvider
        .defaultFontSet('FontAwesome')
        .fontSet('fa', 'FontAwesome');


    IdleProvider.idle(500);
    IdleProvider.timeout(30);
    KeepaliveProvider.interval(20);



    $qProvider.errorOnUnhandledRejections(false);

    localStorageServiceProvider
        .setStorageType('sessionStorage')
        .setDefaultToCookie(false)
        .setNotify(true, true)

}