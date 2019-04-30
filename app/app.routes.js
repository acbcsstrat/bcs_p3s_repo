angular.module('ppApp').config(appRoutes);

appRoutes.$inject = ['$stateProvider'];

function appRoutes($stateProvider) {

    $stateProvider
        .state('dashboard', {
            url: '/dashboard',
            resolve: {
                patentIds: ['patentsRestService', '$q', '$timeout', function(patentsRestService, $q, $timeout) {
                    return patentsRestService.fetchAllPatents();
                }],
                fxRatesMonth: ['fxService', function(fxService) {
                    return fxService.fetchFxMonth();
                }]
            },
            views: {
                '@': {
                    templateUrl: 'app/templates/dashboard/dashboard.tpl.htm',
                    controller: 'dashboardCtrl',
                    controllerAs: '$ctrl'
                },
                'colourkeywidget@dashboard': {
                    templateUrl: 'app/templates/dashboard/dashboard.colour-key-widget.tpl.htm',
                    controller: 'colourKeyCtrl',
                    controllerAs: '$ctrl'
                },
                'graphdonutwidget@dashboard': {
                    controller: 'graphDonutCtrl',
                    controllerAs: '$ctrl',
                    templateUrl: 'app/templates/dashboard/dashboard.graph-donut-widget.tpl.htm',         
                },
                'renewalswidget@dashboard': {
                    templateUrl: 'app/templates/dashboard/dashboard.renewals-widget.tpl.htm',
                    controller: 'renewalsCarouselCtrl',
                    controllerAs: '$ctrl'                
                },
                'fxrateswidget@dashboard': {
                    templateUrl: 'app/templates/dashboard/dashboard.renewal-cost.tpl.htm',
                    controller: 'renewalCostCtrl',
                    controllerAs: '$ctrl'
                },
                'fxrateswidgetmd@dashboard': {
                    templateUrl: 'app/templates/dashboard/dashboard.renewal-cost.tpl.htm',
                    controller: 'renewalCostCtrl',
                    controllerAs: '$ctrl'                
                },            
                'fxchartwidget@dashboard': {
                    templateUrl: 'app/templates/dashboard/dashboard.fxchart-widget.tpl.htm',
                    controller: 'dbfxChartCtrl',
                    controllerAs: '$ctrl',
                },
                'recentactivitywidget@dashboard': {
                    templateUrl: 'app/templates/dashboard/dashboard.recent-activity-widget.tpl.htm',
                    controller: 'recentActivityCtrl',
                    controllerAs: '$ctrl'
                }
            }
        })
        .state('profile', {
            url: '/profile',
            templateUrl: 'app/templates/user/user.user-profile.tpl.htm',
            controller: 'userProfileCtrl',
            controllerAs: '$ctrl'
        })
        .state('portfolio', {
            url: '/portfolio',
            templateUrl: 'app/templates/portfolio/portfolio.tpl.htm',
            controller: 'portfolioCtrl',
            controllerAs: '$ctrl',
            resolve: {
                patents: ['patentsRestService', function(patentsRestService) {
                    return patentsRestService.fetchAllPatents();
                }]
            },
            params: {
                navigation: 'portfolio'
            }
        })
        .state('portfolio.patent', {
            url: '/:patentId',
            resolve: {
                patent: ['patents', '$stateParams', 'patentsRestService', function(patents, $stateParams, patentsRestService) {
                    var match = patents.find(function(patent){
                        return patent.id == $stateParams.patentId;
                    })
                    return patentsRestService.fetchPatentItem(match.id);
                }],
                ca: ['costAnalysisService', '$stateParams', 'patent', function(costAnalysisService, $stateParams, patent) {
                    return costAnalysisService.fetchCa(patent);  
                }]
            },
            params: {
                patentId: null
            },
            views:{
                "": {
                    controller: 'caseOverviewCtrl',
                    controllerAs: '$ctrl',
                    templateUrl: 'app/templates/patent/case-overview.tpl.htm',
                },
                "details@portfolio.patent": {
                    templateUrl: 'app/templates/patent/patent-details.tpl.htm',
                    controller: 'patentDetailsCtrl',
                    controllerAs: '$ctrl'      
                },
                "notifications@portfolio.patent": {
                    templateUrl: 'app/templates/notifications/notifications.tpl.htm',
                    controller: 'notificationsCtrl',
                    controllerAs: '$ctrl',  
                },
                "fee-breakdown@portfolio.patent": {
                    templateUrl: 'app/templates/fee-breakdown/fee-breakdown.tpl.htm',
                    controller: 'feeBreakDownCtrl',
                    controllerAs: '$ctrl',  
                },
                "fxchart@portfolio.patent": {
                    templateUrl: 'app/templates/fxchart/fxchart.tpl.htm',
                    controller: 'fxChartCtrl',
                    controllerAs: '$ctrl',  
                },
                "costchart@portfolio.patent": {
                    templateUrl: 'app/templates/costchart/costchart.tpl.htm',
                    controller: 'costChartCtrl',
                    controllerAs: '$ctrl',  
                }                                        
            }            
        })
        .state('search-patent', {
            url: '/search-patent',
            templateUrl: 'app/templates/patents/patents.search-patent.tpl.htm',
            controller: 'searchPatentCtrl',
            controllerAs: '$ctrl',
            params: {
                navigation: 'portfolio'
            }
        })
        .state('search-patent.add-patent', {
            url: '?params',
            templateUrl: 'app/templates/patents/patents.add-patent.tpl.htm',
            controller: 'addPatentCtrl',
            controllerAs: '$ctrl',
            params: {
                patent: null
            }
        })
        .state('current-transactions', {
            url: '/current-transactions',
            templateUrl: 'app/templates/transactions/transactions.current-transactions.tpl.htm',
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
            templateUrl: 'app/templates/transactions/transactions.current-transaction-item.tpl.htm',
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
            templateUrl: 'app/templates/transactions/transactions.transaction-history.tpl.htm',
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
            templateUrl: 'app/templates/transactions/transactions.transaction-history-item.tpl.htm',
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
            templateUrl: 'app/templates/checkout/checkout.basket.tpl.htm',
            controller: 'basketCtrl',
            controllerAs: '$ctrl'
        })
        .state('bank-transfer-preparation', {
            url: '/bank-transfer-preparation',
            templateUrl: 'app/templates/checkout/checkout.bank-transfer-preparation.tpl.htm',
            controller: 'bankTransferPrepCtrl',
            controllerAs: '$ctrl',
            params: {
                orderObj: null
            }
        })
        .state('bank-transfer-success', {
            url: '/bank-transfer-success',
            templateUrl: 'app/templates/checkout/checkout.bank-transfer-success.tpl.htm',            
            controller: 'bankTransferSuccessCtrl',
            controllerAs: '$ctrl',            
            params: {
                orderObj: null
            }
        })
}