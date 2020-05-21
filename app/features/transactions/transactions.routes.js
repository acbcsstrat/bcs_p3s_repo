routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {

    $stateProvider
    .state('transactions', {
        url: '/transactions',
        template: require('html-loader!./html/transactions.tpl.htm'),
        controller: 'TransactionsController',
        controllerAs: '$ctrl',
        lazyLoad: function($transition$) {
            const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");
            
            // !!! Dynamic import !!!
            return import(/* webpackChunkName: "index" */ "./index.js")
            .then(mod => 
                $ocLazyLoad.inject(mod.default)
            )
            .catch(err => {
                throw new Error("Ooops, something went wrong, " + err);
            });
        },
        resolve: {
            transactions: ['$stateParams', '$q', 'TransactionService', function($stateParams, $q, TransactionService) {
                return TransactionService.fetchAllTransactions();
            }
        }
    })
    .state('transactions.modal', {
        abstract: true,
        views: {
            "modal": {
                template: require("./html/modal.html")
            }
        }
    })        
    .state('transactions.modal.transaction-item', {
        url: '/:transId',
        resolve: {            
            transactionItem: ['$stateParams', 'transactions', function($stateParams, transactions) {
                return transactions.find(function(transaction){
                    return transaction.p3s_TransRef == $stateParams.transId;
                })
            }]
        },
        lazyLoad: function($transition$) {
            const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");
            
            // !!! Dynamic import !!!
            return import(/* webpackChunkName: "index" */ "./index.js")
            .then(mod => 
                $ocLazyLoad.inject(mod.default)
            )
            .catch(err => {
                throw new Error("Ooops, something went wrong, " + err);
            });
        },        
        views: {
            "" : {
                template: require('html-loader!./html/transaction-item.tpl.htm'),
                controller: 'TransactionItemController',
                controllerAs: '$ctrl',                    
            },
            "details@transactions.modal.transaction-item" : {
                template: require('html-loader!./html/transaction-item.details.tpl.htm'),
                controller: 'TransactionDetailsController',
                controllerAs: '$ctrl',                    
            }                               

        },
        params: {
            transId: null
        }
    })    

}

