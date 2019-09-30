// routes.$inject = ['$stateProvider'];


//     $stateProvider
//         .state('dashboard', {
//             url: '/dashboard',
//             resolve: {
//                 patentIds: ['patentsRestService', '$q', '$timeout', function(patentsRestService, $q, $timeout) {
//                     return patentsRestService.fetchAllPatents();
//                 }],
//                 fxRatesMonth: ['fxService', function(fxService) {
//                     return fxService.fetchFxMonth();
//                 }]
//             },
//             views: {
//                 '@': {
//                     template: require('html-loader!./dashboard.tpl.htm'),
//                     controller: 'DashboardController',
//                     controllerAs: '$ctrl'
//                 },
//                 'graphdonutwidget@dashboard': {
//                     controller: 'graphDonutCtrl',
//                     controllerAs: '$ctrl',
//                     template: require('html-loader!./dashboard.graph-donut-widget.tpl.htm',        ) 
//                 },
//                 'actionsavailable@dashboard': {
//                     template: require('html-loader!./dashboard.actions-available.tpl.htm'),
//                     controller: 'renewalsCarouselCtrl',
//                     controllerAs: '$ctrl'                
//                 },
//                 'actioncost@dashboard': {
//                     template: require('html-loader!./dashboard.action-cost.tpl.htm'),
//                     controller: 'renewalCostCtrl',
//                     controllerAs: '$ctrl'
//                 },
//                 'actioncostmd@dashboard': {
//                     template: require('html-loader!./dashboard.action-cost.tpl.htm'),
//                     controller: 'renewalCostCtrl',
//                     controllerAs: '$ctrl'                
//                 },            
//                 'fxchartwidget@dashboard': {
//                     template: require('html-loader!./dashboard.fxchart-widget.tpl.htm'),
//                     controller: 'dbfxChartCtrl',
//                     controllerAs: '$ctrl',
//                 },
//                 'recentactivitywidget@dashboard': {
//                     template: require('html-loader!./dashboard.recent-activity-widget.tpl.htm'),
//                     controller: 'recentActivityCtrl',
//                     controllerAs: '$ctrl'
//                 }
//             }
//         })

routes.$inject = ['$stateProvider'];
console.log('routes')
export default function routes($stateProvider) {
    console.log('inside routes')
  $stateProvider
    .state('dashboard', {
        url: '/dashboard',
        resolve: {
            patentIds: ['patentsRestService', '$q', '$timeout', function(patentsRestService, $q, $timeout) {
                console.log(patentsRestService.fetchAllPatents())
                return patentsRestService.fetchAllPatents();
            }],
            fxRatesMonth: ['fxService', function(fxService) {
                return fxService.fetchFxMonth();
            }]
        },
        views: {
            '@': {
                template: require('html-loader!./dashboard.tpl.htm'),
                controller: 'DashboardController',
                controllerAs: '$ctrl'
            },
            'graphdonutwidget@dashboard': {
                template: require('html-loader!./dashboard.graph-donut-widget.tpl.htm'),
                controller: 'graphDonutCtrl',
                controllerAs: 'dashboard',
            },
            'actionsavailable@dashboard': {
                template: require('html-loader!./dashboard.actions-available.tpl.htm'),
                controller: 'renewalsCarouselCtrl',
                controllerAs: '$ctrl'                
            },
            'actioncost@dashboard': {
                template: require('html-loader!./dashboard.action-cost.tpl.htm'),
                controller: 'renewalCostCtrl',
                controllerAs: '$ctrl'
            },
            'actioncostmd@dashboard': {
                template: require('html-loader!./dashboard.action-cost.tpl.htm'),
                controller: 'renewalCostCtrl',
                controllerAs: '$ctrl'                
            },            
            'fxchartwidget@dashboard': {
                template: require('html-loader!./dashboard.fxchart-widget.tpl.htm'),
                controller: 'dbfxChartCtrl',
                controllerAs: '$ctrl',
            },
            'recentactivitywidget@dashboard': {
                template: require('html-loader!./dashboard.recent-activity-widget.tpl.htm'),
                controller: 'recentActivityCtrl',
                controllerAs: '$ctrl'
            }
        }
    });
}