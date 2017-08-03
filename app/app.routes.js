app.config(['$stateProvider', '$urlRouterProvider', '$qProvider', function($stateProvider, $urlRouterProvider, $qProvider) {

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
    .state('app', {
        url: ''
        // resolve: {
        //     currentAuth: ['authentication', function(authentication) {
        //         return authentication.requireAuth();
        //     }]
        // }
    })
    .state('app.profile', {
        url: '/profile',
        component: 'profile'
    })
    .state('app.userprofile', {
        url: '/userprofile',
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
    .state('app.patents', {
        url: '/patents',
        component: 'patents',
        resolve: {
            patents: ['patentsService', function(patentsService) {
                return patentsService.fetchAllPatents();
            }],
            graphs: ['patentsService', function(patentsService) {
                return  patentsService.fetchGraphData();
            }],
            renewals: ['patentsService', function(patentsService) {
                return  patentsService.fetchRenewalHistory();
            }]
        },
        params: {
            navigation: 'patentnav'
        }
    })
    .state('app.patents.patent', {
        url: '/{patentId}',
        component: 'patent',
        resolve: {
            patent: ['patents', '$stateParams', function(patents, $stateParams) {
                return patents.find(function(patent){
                    return patent.id == $stateParams.patentId;
                })
            }],
            graph: ['graphs', '$stateParams', function(graphs, $stateParams) {
                return graphs.dataset.find(function(graph){
                    return graph.id == $stateParams.patentId;
                })
            }],
            renewal: ['renewals', function(renewals){
                return renewals;
            }]
        }
    })
    .state('app.search-patent', {
        url: '/search-patent',
        component: 'searchpatent',
        params: {
            navigation: 'patentnav'
        }
    })
    .state('app.add-patent', {
        url: '^/add-patent',
        component: 'addpatent',
        params: {
            navigation: 'patentnav',
            obj: null
        }
    })
    .state('app.current-transactions', {
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
    .state('app.current-transactions.current-transaction-item', {
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
    .state('app.transaction-history', {
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
    .state('app.transaction-history.transaction-history-item', {
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
}]);