app.config(['$stateProvider', '$urlRouterProvider', '$compileProvider' ,'$qProvider', 'KeepaliveProvider', 'IdleProvider', 'slickCarouselConfig', function($stateProvider, $urlRouterProvider, $compileProvider, $qProvider, KeepaliveProvider, IdleProvider, slickCarouselConfig) {

    $compileProvider.debugInfoEnabled(false);

    IdleProvider.idle(500);
    IdleProvider.timeout(30);
    KeepaliveProvider.http(domain+'keep-session-alive/');
    KeepaliveProvider.interval(20)

    $qProvider.errorOnUnhandledRejections(false);

    $urlRouterProvider
        .when('', '/dashboard')
        .when('/', '/dashboard')
        .otherwise('/dashboard');

    slickCarouselConfig.dots = true;
    slickCarouselConfig.autoplay = false;

    $stateProvider
    .state('login', {
        url: '/login',
        component: 'login'
    })
    .state('register', {
        url: '/register',
        component: 'register'
    })
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
        component: 'user',
        resolve: {
            user: ['userService', function(userService) {
                return userService.fetchUser();
            }],
            timezones: ['timezoneService', function(timezoneService){
                return timezoneService.fetchUsaTimeZones();
            }]
        }
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
        component: 'patent',
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
        params: {
            patentHref: null
        }
    })
    .state('search-patent', {
        url: '/search-patent',
        component: 'searchpatent',
        params: {
            navigation: 'patentnav',
            patent: null
        }
    })
    .state('add-patent', {
        url: '^/add-patent',
        component: 'addpatent',
        params: {
            navigation: 'patentnav',
            obj: null
        }
    })
    .state('current-transactions', {
        url: '/current-transactions',
        component: 'currentTransactions',
        resolve: {
            transactions: ['currentTransactionsService', function(currentTransactionsService) {
                return currentTransactionsService.fetchCurrentTransactions();
            }]
        },
        params: {
            navigation: 'transactionnav'
        }
    })
    .state('current-transactions.current-transaction-item', {
        url: '/{transId}/:transHref',
        component: 'currentTransaction',
        resolve: {
            transaction: ['transactions', '$stateParams', function(transactions, $stateParams) {
                return transactions.find(function(transaction){
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
        component: 'transactionHistory',
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
        component: 'transactionHistoryItem',
        resolve: {
            transactionHistoryItem: ['transactionHistory', '$stateParams', function(transactionHistory, $stateParams){
                return transactionHistory.find(function(transaction){

                    return transaction.id == $stateParams.transHistoryId;
                })
            }]
        },
        params: {
            navigation: 'transactionnav'
        }
    })
    .state('basket', {
        url: '/basket',
        component: 'basket'
    })
    .state('bank-transfer-preparation', {
        url: '/bank-transfer-preparation',
        component: 'bankTransferPreparation',
        params: {
        	orderObj: null,
        	patentObj: null
        }
    })    
    .state('bank-transfer-success', {
        url: '/bank-transfer-success',
        component: 'bankTransferSuccess',
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