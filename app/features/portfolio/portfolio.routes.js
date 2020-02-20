routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {

    $stateProvider
    .state('portfolio', {
        url: '/portfolio',
        template: require('html-loader!./html/portfolio.tpl.htm'),
        controller: 'PortfolioController',
        controllerAs: '$ctrl',
        params: {
            navigation: 'portfolio'
        }
    })
}

