routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {

    $stateProvider
    .state('transactions', {
        url: '/transactions',
        template: require('html-loader!./html/transactions.tpl.htm'),
        controller: 'TransactionsController',
        controllerAs: '$ctrl',
        params: {
            navigation: 'portfolio'
        }
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
            transactionItem: ['$stateParams', '$q', 'transactionService', function($stateParams, $q, TransactionService) {
                return TransactionService.fetchAllTransactions()
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
                controller: 'TransactionItemCtrl',
                controllerAs: '$ctrl',                    
            },
            "details@transactions.modal.transaction-item" : {
                templateUrl: 'app/templates/transactions/transactions.item.details.tpl.htm',
                controller: 'TransactionItemCtrl',
                controllerAs: '$ctrl',                    
            }                               

        },
        params: {
            transId: null
        }                       
    })    
}

