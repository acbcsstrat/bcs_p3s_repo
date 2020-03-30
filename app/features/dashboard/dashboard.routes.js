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
            fxRatesMonth: ['fxService', function(fxService) {
                console.log('shoudl initiate')
                return fxService.fetchFxMonth();
            }]                    
        },
        views: {
            views: {
                'europctsgraph@dashboard': {
                    controller: 'EuropctsGraphController',
                    controllerAs: '$ctrl',
                    templateUrl: require('html-loader!./html/dashboard.europcts-graph.tpl.htm'),         
                },
                'renewalsgraph@dashboard': {
                    controller: 'RenewalsGraphController',
                    controllerAs: '$ctrl',
                    templateUrl: require('html-loader!./html/dashboard.renewals-graph.tpl.htm'),
                },                
                'grantsgraph@dashboard': {
                    controller: 'GrantsGraphController',
                    controllerAs: '$ctrl',
                    templateUrl: require('html-loader!./html/dashboard.grants-graph.tpl.htm'),
                },
                'validationsgraph@dashboard': {
                    controller: 'ValidationsGraphController',
                    controllerAs: '$ctrl',
                    templateUrl: require('html-loader!./html/dashboard.validations-graph.tpl.htm'),
                },                                
                'actionsavailable@dashboard': {
                    controller: 'AvailableActionsController',
                    controllerAs: '$ctrl',
                    templateUrl: require('html-loader!./html/dashboard.actions-available.tpl.htm'),
                },           
                'fxchartwidget@dashboard': {
                    templateUrl: require('html-loader!./html/dashboard.fxchart-widget.tpl.htm'),
                    controller: 'FxChartController',
                    controllerAs: '$ctrl'
                }
            }            
        }
    });
}

