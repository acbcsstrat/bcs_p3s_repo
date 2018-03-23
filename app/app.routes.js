angular.module('ppApp').config(['$stateProvider', '$urlRouterProvider', '$compileProvider' ,'$qProvider', 'KeepaliveProvider', 'IdleProvider', 'slickCarouselConfig', function($stateProvider, $urlRouterProvider, $compileProvider, $qProvider, KeepaliveProvider, IdleProvider, slickCarouselConfig) {

    IdleProvider.idle(500);
    IdleProvider.timeout(30);
    KeepaliveProvider.http(domain+'keep-session-alive/');
    KeepaliveProvider.interval(20);

    $urlRouterProvider
        .when('', '/dashboard')
        .when('/', '/dashboard')
        .otherwise('/dashboard');

    slickCarouselConfig.dots = true;
    slickCarouselConfig.autoplay = false;

    $qProvider.errorOnUnhandledRejections(false);

    $stateProvider
        .state('dashboard', {
            url: '/dashboard',
            resolve: {
                patents: ['patentsRestService', function(patentsRestService) {
                    return patentsRestService.fetchAllPatents();
                }],
                transactionHistory: ['transactionHistoryService', function(transactionHistoryService) {
                    return transactionHistoryService.fetchTransactionHistory();
                }],            
                fxRatesWeek: ['fxService', function(fxService) {
                    return fxService.fetchFxWeek();
                }],
                fxRatesMonth: ['fxService', function(fxService) {
                    return fxService.fetchFxMonth();
                }]                       
            },
            views: {
                '@': {
                    templateUrl: 'p3sweb/app/components/dashboard/views/dashboard.htm',
                    controller: 'dashboardCtrl',
                    controllerAs: '$ctrl'
                },
                'colourkeywidget@dashboard': {
                    templateUrl: 'p3sweb/app/components/dashboard/views/ui-views/colour-key-widget.htm',
                    controller: 'colourKeyCtrl',
                    controllerAs: '$ctrl'                
                },
                'graphdonutwidget@dashboard': {
                    controller: 'graphDonutCtrl',
                    controllerAs: '$ctrl',                
                    templateUrl: 'p3sweb/app/components/dashboard/views/ui-views/graph-donut-widget.htm',         
                },
                'renewalswidget@dashboard': {
                    templateUrl: 'p3sweb/app/components/dashboard/views/ui-views/renewals-widget.htm',
                    controller: 'renewalsCarouselCtrl',
                    controllerAs: '$ctrl'                
                },
                'fxrateswidget@dashboard': {
                    templateUrl: 'p3sweb/app/components/dashboard/views/ui-views/renewal-cost.htm',
                    controller: 'renewalCostCtrl',
                    controllerAs: '$ctrl'                
                },
                'fxrateswidgetmd@dashboard': {
                    templateUrl: 'p3sweb/app/components/dashboard/views/ui-views/renewal-cost.htm',
                    controller: 'renewalCostCtrl',
                    controllerAs: '$ctrl'                
                },            
                'fxchartwidget@dashboard': {
                    templateUrl: 'p3sweb/app/components/dashboard/views/ui-views/fxchart-widget.htm',
                    controller: 'fxChartCtrl',
                    controllerAs: '$ctrl'
                },
                'recentactivitywidget@dashboard': {
                    templateUrl: 'p3sweb/app/components/dashboard/views/ui-views/recent-activity-widget.htm',
                    controller: 'recentActivityCtrl',
                    controllerAs: '$ctrl'
                }            
            }
        })    
        .state('profile', {
            url: '/profile',
            templateUrl: 'p3sweb/app/components/user/views/user-profile.htm',
            controller: 'userProfileCtrl',
            controllerAs: '$ctrl'
        })
        .state('patents', {
            url: '/patents',
            templateUrl: 'p3sweb/app/components/patents/views/list-patents.htm',
            controller: 'listPatentsCtrl',
            controllerAs: '$ctrl',
            resolve: {
                patents: ['patentsRestService', function(patentsRestService) {                 
                    return patentsRestService.fetchAllPatents();
                }]
            },
            params: {
                navigation: 'patentnav'
            }
        })
        .state('patents.patent', {
            url: '/{patentId}/:patentHref',
            resolve: {
                patent: ['patents', '$stateParams', function(patents, $stateParams) {
                    return patents.find(function(patent){
                        return patent.id == $stateParams.patentId;
                    })
                }],
                costAnalysis: ['patentsRestService', '$stateParams',function(patentsRestService, $stateParams) { 
                    return  patentsRestService.fetchCostAnalysis($stateParams.patentId);  
                }],
                renewal: ['patentsRestService','$stateParams', function(patentsRestService, $stateParams){
                    return  patentsRestService.fetchRenewalHistory($stateParams.patentId);  
                }]
            },
            views: {
                '@patents': {
                    templateUrl: 'p3sweb/app/components/patents/views/patent-item.htm',
                    controller: 'patentItemCtrl',
                    controllerAs: '$ctrl'
                },
                'patentinfo@patents.patent': {
                    templateUrl: 'p3sweb/app/components/patents/views/ui-views/patent-info.htm',
                    controller: 'patentInfoCtrl',
                    controllerAs: '$ctrl'
                },
                'patentcostanalysis@patents.patent': {
                    templateUrl: 'p3sweb/app/components/patents/views/ui-views/patent-costanalysis.htm',
                    controller: 'patentCostAnalysisCtrl',
                    controllerAs: '$ctrl'
                },
                'patentrenewals@patents.patent': {
                    templateUrl: 'p3sweb/app/components/patents/views/ui-views/patent-renewals.htm',
                    controller: 'patentRenewalsCtrl',
                    controllerAs: '$ctrl'
                }
            },
            params: {
                patentHref: null
            }
        })
        .state('search-patent', {
            url: '/search-patent',
            templateUrl: 'p3sweb/app/components/patents/views/search-patent.htm',
            controller: 'searchPatentCtrl',
            controllerAs: '$ctrl',
            params: {
                navigation: 'patentnav'
            }
        })
        .state('search-patent.add-patent', {
            url: '?params',
            templateUrl: 'p3sweb/app/components/patents/views/ui-views/add-patent.htm',
            controller: 'addPatentCtrl',
            controllerAs: '$ctrl',
            params: {
                patent: null
            }
        })
        .state('current-transactions', {
            url: '/current-transactions',
            templateUrl: 'p3sweb/app/components/transactions/views/current-transactions.htm',
            controller: 'currentTransactionsCtrl',
            controllerAs: '$ctrl',
            resolve: {
                currentTransactions: ['currentTransactionsService', function(currentTransactionsService){
                    return currentTransactionsService.fetchCurrentTransactions();
                }]
            }
        })
        .state('current-transactions.current-transaction-item', {
            url: '/{transId}/:transHref',
            templateUrl: 'p3sweb/app/components/transactions/views/current-transaction-item.htm',
            controller: 'currentTransactionItemCtrl',
            controllerAs: '$ctrl',
            resolve: {
                currentTransactionItem: ['currentTransactions', '$stateParams', function(currentTransactions, $stateParams) {
                    return currentTransactions.find(function(transaction){
                        return transaction.id == $stateParams.transId;
                    })
                }]
            },
            params: {
                transHref: null
            }
        })
        .state('transaction-history', {
            url: '/transaction-history',
            templateUrl: 'p3sweb/app/components/transactions/views/transaction-history.htm',
            controller: 'transactionHistoryCtrl',
            controllerAs: '$ctrl',
            resolve: {
                transactionHistory: ['transactionHistoryService', function(transactionHistoryService){
                    return transactionHistoryService.fetchTransactionHistory();
                }]
            },
            params: {
                navigation: 'transactionnav'
            }
        })
        .state('transaction-history.transaction-history-item', {
            url: '/{transHistoryId}',
            templateUrl: 'p3sweb/app/components/transactions/views/transaction-history-item.htm',
            controller: 'transactionHistoryItemCtrl',
            controllerAs: '$ctrl',            
            resolve: {
                transactionHistoryItem: ['transactionHistory', '$stateParams', function(transactionHistory, $stateParams){
                    return transactionHistory.find(function(transaction){
                        return transaction.id == $stateParams.transHistoryId;
                    })
                }]
            }
        })
        .state('basket', {
            url: '/basket',
            templateUrl: 'p3sweb/app/components/checkout/views/basket.htm',
            controller: 'basketCtrl',
            controllerAs: '$ctrl'
        })
        .state('bank-transfer-preparation', {
            url: '/bank-transfer-preparation',
            templateUrl: 'p3sweb/app/components/checkout/views/bank-transfer-preparation.htm',
            controller: 'bankTransferPrepCtrl',
            controllerAs: '$ctrl',
            params: {
            	orderObj: null,
            	patentObj: null
            }
        })    
        .state('bank-transfer-success', {
            url: '/bank-transfer-success',
            templateUrl: 'p3sweb/app/components/checkout/views/bank-transfer-success.htm',            
            controller: 'bankTransferSuccessCtrl',
            controllerAs: '$ctrl',            
            params: {
                orderObj: null
            }
        })
}])

.config(function(localStorageServiceProvider) {

    localStorageServiceProvider
        .setStorageType('sessionStorage')
        .setDefaultToCookie(false)
        .setNotify(true, true)

})