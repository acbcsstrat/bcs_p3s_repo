app.config(['$stateProvider', '$urlRouterProvider', '$qProvider', 'KeepaliveProvider', 'IdleProvider', '$mdThemingProvider', 'slickCarouselConfig', function($stateProvider, $urlRouterProvider, $qProvider, KeepaliveProvider, IdleProvider, $mdThemingProvider, slickCarouselConfig) {

    var customBlueMap =  $mdThemingProvider.extendPalette('light-blue', {
        'contrastDefaultColor': 'light',
        'contrastDarkColors': ['50'],
        '50': 'ffffff'
    });

    $mdThemingProvider.definePalette('customBlue', customBlueMap);
    $mdThemingProvider.theme('default')
        .primaryPalette('customBlue', {
          'default': '500',
          'hue-1': '50'
        })
        .accentPalette('pink');
    $mdThemingProvider.theme('altTheme')
    .primaryPalette('purple')


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
        component: 'dashboard',
        resolve: {
            patents: ['patentsRestService', function(patentsRestService) {
                return patentsRestService.fetchAllPatents();
            }],
            currTrans: ['currentTransactionsService', function(currentTransactionsService) {
                return currentTransactionsService.fetchCurrentTransactions();
            }],       
            transHistory: ['transactionHistoryService', function(transactionHistoryService) {
                return transactionHistoryService.fetchTransactionHistory();
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
            patents: ['patentsRestService', function(patentsRestService) {
                return patentsRestService.fetchAllPatents();
            }]
        },
        data: {
            customPatents:'patentsRestService'
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