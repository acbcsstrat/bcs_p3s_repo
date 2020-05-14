routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {

    $stateProvider
    .state('basket', {
        url: '/basket',
        template:  require('html-loader!./html/checkout.basket.tpl.htm'),
        controller: 'BasketController',
        controllerAs: '$ctrl'
    })
    .state('bank-transfer-preparation', {
        url: '/bank-transfer-preparation',
        template: require('html-loader!./html/checkout.bank-transfer-preparation.tpl.htm'),
        controller: 'BankTransferPrepController',
        controllerAs: '$ctrl',
        params: {
            orderObj: null,
            details: null
        }
    })
    .state('bank-transfer-success', {
        url: '/bank-transfer-success',
        template: require('html-loader!./html/checkout.bank-transfer-success.tpl.htm'),            
        controller: 'BankTransferSuccessController',
        controllerAs: '$ctrl',            
        params: {
            orderObj: null,
            details: null
        }
    })

}
