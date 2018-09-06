angular.module('ppApp').config(appRoutes);

appRoutes.$inject = ['$stateProvider'];

function appRoutes($stateProvider) {

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
                currentTransactions: ['currentTransactionsService', function(currentTransactionsService) {
                    return currentTransactionsService.fetchCurrentTransactions();
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
                    templateUrl: 'app/templates/dashboard.tpl.htm',
                    controller: 'dashboardCtrl',
                    controllerAs: '$ctrl'
                },
                'colourkeywidget@dashboard': {
                    templateUrl: 'app/templates/dashboard.colour-key-widget.tpl.htm',
                    controller: 'colourKeyCtrl',
                    controllerAs: '$ctrl'                
                },
                'graphdonutwidget@dashboard': {
                    controller: 'graphDonutCtrl',
                    controllerAs: '$ctrl',                
                    templateUrl: 'app/templates/dashboard.graph-donut-widget.tpl.htm',         
                },
                'renewalswidget@dashboard': {
                    templateUrl: 'app/templates/dashboard.renewals-widget.tpl.htm',
                    controller: 'renewalsCarouselCtrl',
                    controllerAs: '$ctrl'                
                },
                'fxrateswidget@dashboard': {
                    templateUrl: 'app/templates/dashboard.renewal-cost.tpl.htm',
                    controller: 'renewalCostCtrl',
                    controllerAs: '$ctrl'                
                },
                'fxrateswidgetmd@dashboard': {
                    templateUrl: 'app/templates/dashboard.renewal-cost.tpl.htm',
                    controller: 'renewalCostCtrl',
                    controllerAs: '$ctrl'                
                },            
                'fxchartwidget@dashboard': {
                    templateUrl: 'app/templates/dashboard.fxchart-widget.tpl.htm',
                    controller: 'fxChartCtrl',
                    controllerAs: '$ctrl'
                },
                'recentactivitywidget@dashboard': {
                    templateUrl: 'app/templates/dashboard.recent-activity-widget.tpl.htm',
                    controller: 'recentActivityCtrl',
                    controllerAs: '$ctrl'
                }            
            }
        })    
        .state('profile', {
            url: '/profile',
            templateUrl: 'app/templates/user.user-profile.tpl.htm',
            controller: 'userProfileCtrl',
            controllerAs: '$ctrl'
        })
        .state('patents', {
            url: '/patents',
            templateUrl: 'app/templates/patents.list-patents.tpl.htm',
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
                    templateUrl: 'app/templates/patents.patent-item.tpl.htm',
                    controller: 'patentItemCtrl',
                    controllerAs: '$ctrl'
                },
                'patentinfo@patents.patent': {
                    templateUrl: 'app/templates/patents.patent-info.tpl.htm',
                    controller: 'patentInfoCtrl',
                    controllerAs: '$ctrl'
                },
                'patentcostanalysis@patents.patent': {
                    templateUrl: 'app/templates/patents.patent-costanalysis.tpl.htm',
                    controller: 'patentCostAnalysisCtrl',
                    controllerAs: '$ctrl'
                },
                'patentrenewals@patents.patent': {
                    templateUrl: 'app/templates/patents.patent-renewals.tpl.htm',
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
            templateUrl: 'app/templates/patents.search-patent.tpl.htm',
            controller: 'searchPatentCtrl',
            controllerAs: '$ctrl',
            params: {
                navigation: 'patentnav'
            }
        })
        .state('search-patent.add-patent', {
            url: '?params',
            templateUrl: 'app/templates/patents.add-patent.tpl.htm',
            controller: 'addPatentCtrl',
            controllerAs: '$ctrl',
            params: {
                patent: null
            }
        })
        .state('current-transactions', {
            url: '/current-transactions',
            templateUrl: 'app/templates/transactions.current-transactions.tpl.htm',
            controller: 'currentTransactionsCtrl',
            controllerAs: '$ctrl',
            resolve: {
                currentTransactions: ['currentTransactionsService', function(currentTransactionsService){
                    return currentTransactionsService.fetchCurrentTransactions();
                }]
            },
            params: {
                navigation: 'transactionnav'
            }            
        })
        .state('current-transactions.current-transaction-item', {
            url: '/{transId}/:transHref',
            templateUrl: 'app/templates/transactions.current-transaction-item.tpl.htm',
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
            templateUrl: 'app/templates/transactions.transaction-history.tpl.htm',
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
            templateUrl: 'app/templates/transactions.transaction-history-item.tpl.htm',
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
            templateUrl: 'app/templates/checkout.basket.tpl.htm',
            controller: 'basketCtrl',
            controllerAs: '$ctrl'
        })
        .state('bank-transfer-preparation', {
            url: '/bank-transfer-preparation',
            templateUrl: 'app/templates/checkout.bank-transfer-preparation.tpl.htm',
            controller: 'bankTransferPrepCtrl',
            controllerAs: '$ctrl',
            params: {
            	orderObj: null,
            	patentObj: null
            }
        })
        .state('bank-transfer-success', {
            url: '/bank-transfer-success',
            templateUrl: 'app/templates/checkout.bank-transfer-success.tpl.htm',            
            controller: 'bankTransferSuccessCtrl',
            controllerAs: '$ctrl',            
            params: {
                orderObj: null
            }
        })
}