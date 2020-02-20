routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {

    $stateProvider
    .state('portfolio.modal', {
        abstract: true,
        views: {
            "modal": {
                template: require("../html/modal.html")
            }
        }
    })    
    .state('portfolio.modal.case', {
        url: '/:caseId',
        resolve: {
            caseSelected: ['$stateParams', 'CasesRestService', '$state', function($stateParams, CasesRestService, $state) {
                return CasesRestService.fetchcaseItem($stateParams.caseId)
                .then(
                    function(response){
                        return CasesRestService.fetchcaseItem($stateParams.caseId);
                    },
                    function(errResponse){
                        $state.go('portfolio', {}, {reload: true})
                    }
                )
                
                
            }],
            ca: ['CostAnalysisService', 'caseSelected', function(CostAnalysisService,  caseSelected) {
                return CostAnalysisService.fetchCa(caseSelected.caseID, caseSelected.p3sServicesWithFees);  
            }]
        },
        params: {
            caseId: null,
            prepareGrant: null,
            form1200generate: null
        },
        views:{
            "": {
                template: require('html-loader!./html/case/case.overview.tpl.htm',
                controller: 'CaseOverviewController',
                controllerAs: '$ctrl',

            },
            "details@portfolio.modal.case": {
                template: require('.html/case/details/case-details.tpl.htm'),
                controller: 'CaseDetailsController',
                controllerAs: '$ctrl'      
            },
            "notifications@portfolio.modal.case": {
                template: require('.html/case/notifications/notifications.tpl.htm'),
                controller: 'NotificationsController',
                controllerAs: '$ctrl',  
            },
            "form1200@portfolio.modal.case": {
                template: require('.html/case/europct/europct.form1200.tpl.htm'),
                controller: 'Form1200Controller',
                controllerAs: '$ctrl',  
            },           
            "renewalhistory@portfolio.modal.case": {
                template: require('.html/case/renewal/renewal.history.tpl.htm'),
                controller: 'RenewalHistoryController',
                controllerAs: '$ctrl',  
            },        
            "grantandpublishing@portfolio.modal.case": {
                template: require('.html/case/grant/grant.tpl.htm'),
                controller: 'GrantController',
                controllerAs: '$ctrl',  
            },      
            "validation@portfolio.modal.case": {
                template: require('.html/case/validation/validation.tpl.htm'),
                controller: 'ValidationController',
                controllerAs: '$ctrl',  
            },                                                
            "fee-breakdown@portfolio.modal.case": {
                template: require('.html/case/fee-breakdown/fee-breakdown.tpl.htm'),
                controller: 'FeeBreakDownController',
                controllerAs: '$ctrl',  
            },
            "fxchart@portfolio.modal.case": {
                template: require('.html/case/fxchart/fxchart.tpl.htm'),
                controller: 'FxChartController',
                controllerAs: '$ctrl',  
            },
            "costchart@portfolio.modal.case": {
                template: require('.html/case/costchart/costchart.tpl.htm'),
                controller: 'CostChartController',
                controllerAs: '$ctrl',  
            }
        }
    })
}