routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {

    $stateProvider
    .state('portfolio.modal', {
        abstract: true,
        views: {
            "modal": {
                template: require("./html/modal.html")
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
            
            // !!! Dynamic import !!!
            return import(/* webpackChunkName: "index" */ "./index.js")
            .then(mod => {

                $ocLazyLoad.inject(mod.default);
            })
            .catch(err => {
                throw new Error("Ooops, something went wrong, " + err);
            });
        },        
        views:{
            "": {
                template: require('html-loader!./html/case.overview.tpl.htm'),
                controller: 'CaseOverviewController',
                controllerAs: '$ctrl'
            },
            "details@portfolio.modal.case": {
                template: require('html-loader!./html/details/case-details.tpl.htm'),
                controller: 'CaseDetailsController',
                controllerAs: '$ctrl'      
            },
            "reminders@portfolio.modal.case": {
                template: require('html-loader!./html/notifications/notifications.tpl.htm'),
                controller: 'RemindersController',
                controllerAs: '$ctrl',  
            },
            "form1200@portfolio.modal.case": {
                template: require('html-loader!./html/europct/europct.form1200.tpl.htm'),
                controller: 'Form1200ReadyController',
                controllerAs: '$ctrl',  
            },           
            "renewalhistory@portfolio.modal.case": {
                template: require('html-loader!./html/renewal/renewal.history.tpl.htm'),
                controller: 'RenewalHistoryController',
                controllerAs: '$ctrl',  
            },        
            "grantandpublishing@portfolio.modal.case": {
                template: require('html-loader!./html/grant/grant.tpl.htm'),
                controller: 'GrantController',
                controllerAs: '$ctrl',  
            },      
            "validation@portfolio.modal.case": {
                template: require('html-loader!./html/validation/validation.tpl.htm'),
                controller: 'ValidationController',
                controllerAs: '$ctrl',  
            },                                                
            "fee-breakdown@portfolio.modal.case": {
                template: require('html-loader!./html/feebreakdown/fee-breakdown.tpl.htm'),
                controller: 'FeeBreakDownController',
                controllerAs: '$ctrl',  
            },
            "fxchart@portfolio.modal.case": {
                template: require('html-loader!./html/fxchart/fxchart.tpl.htm'),
                controller: 'FxChartController',
                controllerAs: '$ctrl',  
            },
            "costchart@portfolio.modal.case": {
                template: require('html-loader!./html/costchart/costchart.tpl.htm'),
                controller: 'CostChartController',
                controllerAs: '$ctrl',  
            }
        },
        params: {
            caseId: null,
            prepareGrant: null,
            form1200generate: null
        }        
    })
}