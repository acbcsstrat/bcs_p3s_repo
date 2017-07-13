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
    })
    .state('app.patents', {
        url: '/patents',
        component: 'patents',
        resolve: {
            patents: function(patentsService) {
                return patentsService.fetchAllPatents();
            },
            graphs: function(patentsService) {
                return  patentsService.fetchGraphData();
            }
        },
        params: {
            navigation: 'patentnav'
        }
    })
    .state('app.patents.patent', {
        url: '/{patentId}',
        component: 'patent',
        resolve: {
            patent: function(patents, $stateParams) {
                return patents.find(function(patent){ 
                    return patent.id == $stateParams.patentId;
                })
            },
            graph: function(graphs, $stateParams) {
                return graphs.dataset.find(function(graph){
                    return graph.id == $stateParams.patentId;
                })
            }
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
        component: 'transactionhistory',   
        params: {
            navigation: 'transactionnav'
        }
    })    

}]);