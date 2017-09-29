app.config(['$stateProvider', '$urlRouterProvider', '$qProvider', 'KeepaliveProvider', 'IdleProvider', function($stateProvider, $urlRouterProvider, $qProvider, KeepaliveProvider, IdleProvider) {

    IdleProvider.idle(600);
    IdleProvider.timeout(60);
    KeepaliveProvider.interval(5);

    $qProvider.errorOnUnhandledRejections(false);

    $urlRouterProvider
        .when('', '/patents')
        .when('/', '/patents')
        .otherwise('/patents');

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
        component: 'dashboard',
        resolve: {
            patents: ['patentsService', function(patentsService) {
                return patentsService.fetchAllPatents();
            }]
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
        component: 'patents',
        resolve: {
            patents: ['patentsService', function(patentsService) {
                return patentsService.fetchAllPatents();
            }],
            renewals: ['patentsService', function(patentsService) {
                return  patentsService.fetchRenewalHistory();
            }]
        },
        params: {
            navigation: 'patentnav'
        }
    })
    .state('patents.patent', {
        url: '/{patentId}',
        component: 'patent',
        resolve: {
            patent: ['patents', '$stateParams', function(patents, $stateParams) {
                return patents.find(function(patent){
                    return patent.id == $stateParams.patentId;
                })
            }],
            graph: ['patentsService', '$stateParams',function(patentsService, $stateParams) { 
                return  patentsService.fetchGraphData($stateParams.patentId);  
            }],
            renewal: ['renewals', function(renewals){
                return renewals;
            }]
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
        url: '/{transId}',
        component: 'currentTransaction',
        resolve: {
            transaction: ['transactions', '$stateParams', function(transactions, $stateParams) {
                return transactions.find(function(transaction){
                    return transaction.id == $stateParams.transId;
                })
            }]
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
}]);