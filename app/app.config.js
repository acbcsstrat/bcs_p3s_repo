appConfig.$inject = ['$httpProvider', '$urlRouterProvider', '$uibModalProvider', '$compileProvider' ,'$qProvider', 'KeepaliveProvider', 'IdleProvider', 'localStorageServiceProvider', '$mdIconProvider', '$mdPanelProvider', '$stateProvider'];

export default function appConfig($httpProvider, $urlRouterProvider, $uibModalProvider, $compileProvider, $qProvider, KeepaliveProvider, IdleProvider, localStorageServiceProvider, $mdIconProvider, $mdPanelProvider, $stateProvider) {

    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};    
    }    

    window.ppdomain = "http://localhost:8080/p3sweb/";

    $urlRouterProvider 
        .when('', '/dashboard')
        .otherwise("/dashboard")    

    $stateProvider
    .state('portfolio.modal', {
        abstract: true,
        views: {
            "modal": {
                template: require("./features/case/html/modal.html")
            }
        }
    })
    .state('portfolio.modal.case', {
        url: '/:caseId',
        resolve: {
            caseSelected: ['$stateParams', 'CasesRestService', '$state', function($stateParams, CasesRestService, $state) {
                return CasesRestService.fetchCase($stateParams.caseId)
                .then(
                    function(response){
                        return CasesRestService.fetchCase($stateParams.caseId);
                    },
                    function(errResponse){
                        $state.go('portfolio', {}, {reload: true})
                    }
                )
                
                
            }],
            ca: ['CostAnalysisService', 'caseSelected', function(CostAnalysisService,  caseSelected) {
                return CostAnalysisService.fetchCa(caseSelected.patentID, caseSelected.p3sServicesWithFees);  
            }]
        },
        lazyLoad: function($transition$) {
            const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");
            return import(/* webpackChunkName: "index" */ "./features/case/index.js")
            .then(mod => {
                $ocLazyLoad.inject(mod.default);
            })
            .catch(err => {
                throw new Error("Ooops, something went wrong, " + err);
            });
        },      
        views:{
            "": {
                template: require('html-loader!./features/case/html/case.overview.tpl.htm'),
                controller: 'CaseOverviewController',
                controllerAs: '$ctrl',
            },
            "details@portfolio.modal.case": {
                template: require('html-loader!./features/case/html/details/case-details.tpl.htm'),
                controller: 'CaseDetailsController',
                controllerAs: '$ctrl'              
            },
            "reminders@portfolio.modal.case": {
                template: require('html-loader!./features/case/html/notifications/notifications.tpl.htm'),
                controller: 'RemindersController',
                controllerAs: '$ctrl',                 
            },
            "form1200@portfolio.modal.case": {
                template: require('html-loader!./features/case/html/europct/europct.form1200.tpl.htm'),
                controller: 'Form1200ReadyController',
                controllerAs: '$ctrl'                

            },           
            "renewalhistory@portfolio.modal.case": {
                template: require('html-loader!./features/case/html/renewal/renewal.history.tpl.htm'),
                controller: 'RenewalHistoryController',
                controllerAs: '$ctrl'                

            },        
            "grantandpublishing@portfolio.modal.case": {
                template: require('html-loader!./features/case/html/grant/grant.tpl.htm'),
                controller: 'GrantController',
                controllerAs: '$ctrl'                
            },      
            "validation@portfolio.modal.case": {
                template: require('html-loader!./features/case/html/validation/validation.tpl.htm'),
                controller: 'ValidationController',
                controllerAs: '$ctrl'                
            },                                                
            "fee-breakdown@portfolio.modal.case": {
                template: require('html-loader!./features/case/html/feebreakdown/fee-breakdown.tpl.htm'),
                controller: 'FeeBreakDownController',
                controllerAs: '$ctrl'                
            },
            "fxchart@portfolio.modal.case": {
                template: require('html-loader!./features/case/html/fxchart/fxchart.tpl.htm'),
                controller: 'FxChartController',
                controllerAs: '$ctrl'  
            },
            "costchart@portfolio.modal.case": {
                template: require('html-loader!./features/case/html/costchart/costchart.tpl.htm'),
                controller: 'CostChartController',
                controllerAs: '$ctrl'                
            }
        },
        params: {
            caseId: null,
            prepareGrant: null,
            form1200generate: null
        }        
    })

    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';

    $mdIconProvider
        .defaultFontSet('FontAwesome')
        .fontSet('fa', 'FontAwesome');


    IdleProvider.idle(500);
    IdleProvider.timeout(30);
    KeepaliveProvider.interval(20);



    $qProvider.errorOnUnhandledRejections(false);

    localStorageServiceProvider
        .setStorageType('sessionStorage')
        .setDefaultToCookie(false)
        .setNotify(true, true)

}