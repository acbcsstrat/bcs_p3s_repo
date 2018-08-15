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
        .state('portfolio', {
            url: '/portfolio',
            templateUrl: 'app/templates/portfolio.tpl.htm',
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
            url: '/{patentId}/:patentHref',
            resolve: {
                patent: ['patents', '$stateParams', function(patents, $stateParams) {
                    return patents.find(function(patent){
                        return patent.id == $stateParams.patentId;
                    })
                }],
                costAnalysis: ['patentsRestService', '$stateParams', 'patent', function(patentsRestService, $stateParams, patent) {
                    if(patent) {
                        return patentsRestService.fetchCostAnalysis(patent.id);  
                    }
                }],
                renewal: ['patentsRestService', '$stateParams', 'patent', function(patentsRestService, $stateParams, patent){
                    if(patent) {
                        return patentsRestService.fetchRenewalHistory(patent.id);
                    }
                }]
            },
            views: {
                '@portfolio': {
                    templateUrl: 'app/templates/patent.patent-item.tpl.htm',
                    controller: 'patentItemCtrl',
                    controllerAs: '$ctrl'
                },
                'patentinfo@portfolio.patent': {
                    templateUrl: 'app/templates/patent.patent-info.tpl.htm',
                    controller: 'patentInfoCtrl',
                    controllerAs: '$ctrl'
                },
                'euroPct@portfolio.patent': {
                    templateUrl: 'app/templates/patent.europct.tpl.htm',
                    controller: 'euroPctCtrl',
                    controllerAs: '$ctrl',
                },
                'euroPct.euroPctInfo@portfolio.patent': {
                    templateUrl: 'app/templates/europct.info.tpl.htm',
                    controller: 'euroPctInfoCtrl',
                    controllerAs: '$ctrl'
                },
                'euroPct.form1200@portfolio.patent': {
                    templateUrl: 'app/templates/europct.form1200.tpl.htm',
                    controller: 'form1200Ctrl',
                    controllerAs: '$ctrl'
                },
                'euroPct.form1200.form1200intro@portfolio.patent': {
                    templateUrl: 'app/templates/europct.form1200.intro.tpl.htm',
                    controller: 'form1200IntroCtrl',
                    controllerAs: '$ctrl'
                },
                'euroPct.form1200.form1200questionnaire@portfolio.patent': {
                    templateUrl: 'app/templates/europct.form1200.questionnaire.tpl.htm',
                    controller: 'form1200questionnaireCtrl',
                    controllerAs: '$ctrl'
                },                
                'euroPct.euroPctCostAnalysis@portfolio.patent': {
                    templateUrl: 'app/templates/europct.costanalysis.tpl.htm',
                    controller: 'euroPctCostAnalysisCtrl',
                    controllerAs: '$ctrl'
                },
                'renewal@portfolio.patent': {
                    templateUrl: 'app/templates/patent.renewal.tpl.htm',
                    controller: 'renewalCtrl',
                    controllerAs: '$ctrl'
                },
                'renewal.renewalInfo@portfolio.patent': {
                    templateUrl: 'app/templates/renewal.info.tpl.htm',
                    controller: 'renewalInfoCtrl',
                    controllerAs: '$ctrl'
                },
                'renewal.renewalHistory@portfolio.patent': {
                    templateUrl: 'app/templates/renewal.history.tpl.htm',
                    controller: 'renewalHistoryCtrl',
                    controllerAs: '$ctrl'
                },
                'renewal.renewalCostAnalysis@portfolio.patent': {
                    templateUrl: 'app/templates/renewal.cost-analysis.tpl.htm',
                    controller: 'renewalCaCtrl',
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
                navigation: 'portfolio'
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