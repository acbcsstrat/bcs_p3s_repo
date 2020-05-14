routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {

    $stateProvider
    .state('dashboard', {
        url: '/dashboard',
        template: require('html-loader!./html/dashboard.tpl.htm'),
        controller: 'DashboardController',
        controllerAs: '$ctrl'
    })    
    .state('dashboard.content', {
        params: {
            patents: null
        },
        resolve: {
            fxRatesMonth: ['FxService', function(FxService) {
                return FxService.fetchFxMonth();
            }]                    
        },
        views: {
            'actionsavailable@dashboard': {
                controller: 'AvailableActionsController',
                controllerAs: '$ctrl',
                template: require('html-loader!./html/dashboard.actions-available.tpl.htm')
            },           
            'fxchartwidget@dashboard': {
                controller: 'DbFxChartController',
                controllerAs: '$ctrl',
                template: require('html-loader!./html/dashboard.fxchart-widget.tpl.htm')
            },
            'europctsgraph@dashboard': {
                controller: 'EuropctsDonutController',
                controllerAs: '$ctrl',
                template: require('html-loader!./html/dashboard.europcts-graph.tpl.htm')     
            },
            'renewalsgraph@dashboard': {
                controller: 'RenewalsDonutController',
                controllerAs: '$ctrl',
                template: require('html-loader!./html/dashboard.renewals-graph.tpl.htm')
            },                
            'grantsgraph@dashboard': {
                controller: 'GrantsDonutController',
                controllerAs: '$ctrl',
                template: require('html-loader!./html/dashboard.grants-graph.tpl.htm')
            },
            'validationsgraph@dashboard': {
                controller: 'ValidationsDonutController',
                controllerAs: '$ctrl',
                template: require('html-loader!./html/dashboard.validations-graph.tpl.htm')
            }                          
        }
    });
}

