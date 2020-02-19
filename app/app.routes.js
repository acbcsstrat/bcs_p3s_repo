import DashboardController from './features/dashboard/dashboard.controller';


export default angular.module('ppApp.routes', []).config(appRoutes).name;

appRoutes.$inject = ['$stateProvider', '$urlRouterProvider'];

function appRoutes($stateProvider, $urlRouterProvider) {

    $urlRouterProvider
        .when('', '/dashboard')
        .when('/', '/dashboard')
        .otherwise('/dashboard');

    $stateProvider
        .state('profile', {
            url: '/profile',
            templateUrl: '../app/templates/user/user.user-profile.tpl.htm',
            controller: 'userProfileCtrl',
            controllerAs: '$ctrl'
        })
        .state('portfolio', {
            url: '/portfolio',
            templateUrl: '../app/templates/portfolio/portfolio.tpl.htm',
            controller: 'portfolioCtrl',
            controllerAs: '$ctrl',
            params: {
                navigation: 'portfolio'
            }
        })
        .state('portfolio.modal', {
            abstract: true,
            views: {
                "modal": {
                    templateUrl: "app/templates/patent/modal.html"
                }
            }
        })
        .state('portfolio.modal.patent', {
            url: '/:patentId',
            resolve: {
                patent: ['$stateParams', 'patentsRestService', '$state', function($stateParams, patentsRestService, $state) {
                    return patentsRestService.fetchPatentItem($stateParams.patentId)
                    .then(
                        function(response){
                            return patentsRestService.fetchPatentItem($stateParams.patentId);
                        },
                        function(errResponse){
                            $state.go('portfolio', {}, {reload: true})
                        }
                    )
                    
                    
                }],
                ca: ['costAnalysisService', 'patent', function(costAnalysisService,  patent) {
                    return costAnalysisService.fetchCa(patent.patentID, patent.p3sServicesWithFees);  
                }]
            },
            params: {
                patentId: null,
                prepareGrant: null,
                form1200generate: null
            },
            views:{
                "": {
                    templateUrl: 'app/templates/patent/case-overview.tpl.htm',
                    controller: 'caseOverviewCtrl',
                    controllerAs: '$ctrl',

                },
                "details@portfolio.modal.patent": {
                    templateUrl: 'app/templates/patent/patent-details.tpl.htm',
                    controller: 'patentDetailsCtrl',
                    controllerAs: '$ctrl'      
                },
                "notifications@portfolio.modal.patent": {
                    templateUrl: 'app/templates/notifications/notifications.tpl.htm',
                    controller: 'notificationsCtrl',
                    controllerAs: '$ctrl',  
                },
                "form1200@portfolio.modal.patent": {
                    templateUrl: 'app/templates/europct/europct.form1200.tpl.htm',
                    controller: 'form1200Ctrl',
                    controllerAs: '$ctrl',  
                },           
                "renewalhistory@portfolio.modal.patent": {
                    templateUrl: 'app/templates/renewal/renewal.history.tpl.htm',
                    controller: 'renewalHistoryCtrl',
                    controllerAs: '$ctrl',  
                },        
                "grantandpublishing@portfolio.modal.patent": {
                    templateUrl: 'app/templates/grant/grant.tpl.htm',
                    controller: 'grantCtrl',
                    controllerAs: '$ctrl',  
                },      
                "validation@portfolio.modal.patent": {
                    templateUrl: 'app/templates/validation/validation.tpl.htm',
                    controller: 'validationCtrl',
                    controllerAs: '$ctrl',  
                },                                                
                "fee-breakdown@portfolio.modal.patent": {
                    templateUrl: 'app/templates/fee-breakdown/fee-breakdown.tpl.htm',
                    controller: 'feeBreakDownCtrl',
                    controllerAs: '$ctrl',  
                },
                "fxchart@portfolio.modal.patent": {
                    templateUrl: 'app/templates/fxchart/fxchart.tpl.htm',
                    controller: 'fxChartCtrl',
                    controllerAs: '$ctrl',  
                },
                "costchart@portfolio.modal.patent": {
                    templateUrl: 'app/templates/costchart/costchart.tpl.htm',
                    controller: 'costChartCtrl',
                    controllerAs: '$ctrl',  
                }
            }
        })
        .state('current-transactions', {
            url: '/current-transactions',
            templateUrl: '../app/templates/transactions/transactions.current-transactions.tpl.htm',
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
            templateUrl: '../app/templates/transactions/transactions.current-transaction-item.tpl.htm',
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
            templateUrl: '../app/templates/transactions/transactions.transaction-history.tpl.htm',
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
            templateUrl: '../app/templates/transactions/transactions.transaction-history-item.tpl.htm',
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
            templateUrl: '../app/templates/checkout/checkout.basket.tpl.htm',
            controller: 'basketCtrl',
            controllerAs: '$ctrl'
        })
        .state('bank-transfer-preparation', {
            url: '/bank-transfer-preparation',
            templateUrl: '../app/templates/checkout/checkout.bank-transfer-preparation.tpl.htm',
            controller: 'bankTransferPrepCtrl',
            controllerAs: '$ctrl',
            params: {
                orderObj: null,
                details: null
            }
        })
        .state('bank-transfer-success', {
            url: '/bank-transfer-success',
            templateUrl: '../app/templates/checkout/checkout.bank-transfer-success.tpl.htm',            
            controller: 'bankTransferSuccessCtrl',
            controllerAs: '$ctrl',            
            params: {
                orderObj: null,
                details: null
            }
        })
}