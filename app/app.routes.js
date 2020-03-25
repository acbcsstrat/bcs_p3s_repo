angular.module('ppApp').config(appRoutes);

appRoutes.$inject = ['$stateProvider'];

function appRoutes($stateProvider) {

    $stateProvider
        .state('dashboard', {
            url: '/dashboard',
            templateUrl: 'app/templates/dashboard/dashboard.tpl.htm',
            controller: 'dashboardCtrl',
            controllerAs: '$ctrl'
        })
        .state('dashboard.content', {
            params: {
                patents: null
            },
            resolve: {
                fxRatesMonth: ['fxService', function(fxService) {
                    return fxService.fetchFxMonth();
                }]                    
            },
            views: {
                'europctsgraph@dashboard': {
                    controller: 'europctsGraphCtrl',
                    controllerAs: '$ctrl',
                    templateUrl: 'app/templates/dashboard/dashboard.europcts-graph.tpl.htm',         
                },
                'renewalsgraph@dashboard': {
                    controller: 'renewalsGraphCtrl',
                    controllerAs: '$ctrl',
                    templateUrl: 'app/templates/dashboard/dashboard.renewals-graph.tpl.htm',         
                },                
                'grantsgraph@dashboard': {
                    controller: 'grantsGraphCtrl',
                    controllerAs: '$ctrl',
                    templateUrl: 'app/templates/dashboard/dashboard.grants-graph.tpl.htm',         
                },
                'validationsgraph@dashboard': {
                    controller: 'validationsGraphCtrl',
                    controllerAs: '$ctrl',
                    templateUrl: 'app/templates/dashboard/dashboard.validations-graph.tpl.htm',         
                },                                
                'actionsavailable@dashboard': {
                    templateUrl: 'app/templates/dashboard/dashboard.actions-available.tpl.htm',
                    controller: 'renewalsCarouselCtrl',
                    controllerAs: '$ctrl'                
                },           
                'fxchartwidget@dashboard': {
                    templateUrl: 'app/templates/dashboard/dashboard.fxchart-widget.tpl.htm',
                    controller: 'dbfxChartCtrl',
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
                validationQuote: null,
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
        .state('transactions', {
            url: '/transactions',
            templateUrl: 'app/templates/transactions/transactions.tpl.htm',
            controller: 'transactionsCtrl',
            controllerAs: '$ctrl'
        })
        .state('transactions.modal', {
            abstract: true,
            views: {
                "modal": {
                    templateUrl: "app/templates/transactions/modal.html"
                }
            }
        })   
        .state('transactions.modal.transaction-item', {
            url: '/:transId',
            resolve: {
                transactionItem: ['$stateParams', '$q', 'transactionService', function($stateParams, $q, transactionService) {
                    return transactionService.fetchAllTransactions()
                    .then(
                        function(response){
                            return response.find(function(transaction){
                                return transaction.id == $stateParams.transId;
                            })
                        },
                        function(errResponse) {
                            console.error('Error fetching trans item. Error: ', errResponse)
                        }
                    )
          
                }]
            },
            views: {
                "" : {
                    templateUrl: 'app/templates/transactions/transactions.item.tpl.htm',
                    controller: 'transactionItemCtrl',
                    controllerAs: '$ctrl',                    
                },
                "details@transactions.modal.transaction-item" : {
                    templateUrl: 'app/templates/transactions/transactions.item.details.tpl.htm',
                    controller: 'transactionItemCtrl',
                    controllerAs: '$ctrl',                    
                }                               

            },
            params: {
                transId: null
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
                orderObj: null,
                details: null
            }
        })
        .state('bank-transfer-success', {
            url: '/bank-transfer-success',
            templateUrl: 'app/templates/checkout/checkout.bank-transfer-success.tpl.htm',            
            controller: 'bankTransferSuccessCtrl',
            controllerAs: '$ctrl',            
            params: {
                orderObj: null,
                details: null
            }
        })
}