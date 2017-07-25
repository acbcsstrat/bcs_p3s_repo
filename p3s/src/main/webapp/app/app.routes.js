app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

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
            }]
        }
    })
    .state('app.add-patent', {
        url: '/add-patent',
        component: 'addpatent',
        params: {
            navigation: 'patentnav'
        }
    })
    .state('app.transactions', {
        url: '/transactions',
        component: 'transactions',
        params: {
            navigation: 'transactionnav'
        }
    })
    .state('app.transactions.transaction', {
        url: '/{transId}',
        component: 'transaction'
    })
    .state('app.transaction-history', {
        url: '/transaction-history',
        component: 'transactions',   
        resolve: {
            patents: ['transactionsService', function(transactionsService) {
                return transactionsService.fetchAllHistoricTransactions();
            }]
        },
        params: {
            navigation: 'transactionnav'
        }
    })    

}]);