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
                return fxService.fetchFxMonth();
            }]                    
        },
        views: {
            'graphdonutwidget@dashboard': {
                template: require('html-loader!./html/dashboard.graph-donut-widget.tpl.htm'),
                controller: 'GraphDonutController',
                controllerAs: '$ctrl',
            },
            'actionsavailable@dashboard': {
                template: require('html-loader!./html/dashboard.actions-available.tpl.htm'),
                controller: 'AvailableActionsController',
                controllerAs: '$ctrl'                
            },
            'actioncost@dashboard': {
                template: require('html-loader!./html/dashboard.action-cost.tpl.htm'),
                controller: 'ActionCostController',
                controllerAs: '$ctrl'
            },
            'actioncostmd@dashboard': {
                template: require('html-loader!./html/dashboard.action-cost.tpl.htm'),
                controller: 'ActionCostController',
                controllerAs: '$ctrl'
            },            
            'fxchartwidget@dashboard': {
                template: require('html-loader!./html/dashboard.fxchart-widget.tpl.htm'),
                controller: 'FxChartController',
                controllerAs: '$ctrl',
            },
            'recentactivitywidget@dashboard': {
                template: require('html-loader!./html/dashboard.recent-activity-widget.tpl.htm'),
                controller: 'RecentActivityController',
                controllerAs: '$ctrl'
            }
        }
    });
}

