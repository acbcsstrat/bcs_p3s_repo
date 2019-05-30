angular.module('ppApp').factory('dashboardService', dashboardService);

dashboardService.$inject = ['$http', '$q', 'organiseColourService', 'organiseTextService', 'patentsRestService']

function dashboardService($http, $q, organiseColourService, organiseTextService, patentsRestService) {

    var factory = {
        sortPatents: sortPatents,
        getPatents: {},
        setActionCost: setActionCost,
        fetchActionCost: fetchActionCost,
        actionCost: '',
    };

    return factory;



    function sortPatents(patents) {

        var obj = {
            Green: [],
            Amber: [],
            Red: [],
            Blue: [],
            Black: [],
            Grey: []
        }

        var phase;

        for(var property in obj) {
            if(obj.hasOwnProperty(property)){
                if(Array.isArray(obj[property])) {
                    obj[property].length = 0;
                } else {
                    obj[property] = 0; //for totoal obj.Total
                }
                
            }
        }           

        // if((Array.isArray(patents) && patents.length === 0) || patents === null) {
        //     setActionCosts(null)
        //     return;
        // }

        obj.Total = patents.length;

        for(var i = 0; i < patents.length; i++) {
            
            var item =  patents[i].serviceList;

            if(item.length !== 0) {
                patents[i].cssCurrent = organiseColourService.getCurrColour(item[0].currentStageColour, 'text')
                patents[i].cssNext = organiseColourService.getCurrColour(item[0].nextStageColour, 'text')
                obj[item[0].currentStageColour].push(patents[i]);
            } else {    
                obj.Grey.push(patents[i]);
            }
        }

        for(var property in obj) {
            if(obj.hasOwnProperty(property)) {

                if(obj[property].length > 0) {
                    if(obj[property][0].serviceList.length === 0) {
                        phase = 'Grey'
                    }
                    if(obj[property][0].serviceList.length > 0) {
                        phase = obj[property][0].serviceList[0].currentStageColour;
                    }
                    break;
                }
            }
        }   

        factory.getPatents = obj;
    }

    function actionStatus(text) {
        return organiseTextService.actionStatus(text)
    }    

    function setActionCost(patent) {

        if(patent === undefined || typeof patent === 'undefined') {
            factory.actionCost = patent;
            return;
        }

        if((patent.serviceStatus === 'Too late to renew') || (patent.serviceStatus === 'Too late' && patent.serviceList[0].currentStageColour == 'Red')) {
            factory.actionCost = undefined;
            return
        }

        patentsRestService.fetchPatentItem(patent.id)
        .then(
            function(response){
                return response;
            }
        )
        .then(
            function(patent){
                if(patent == null || patent == undefined) {
                    patent = null;
                    return;
                }

                if(patent.renewalFeeUI !== null) {
                    if(actionStatus(patent.renewalStatus) && patent.renewalStatus !== 'Payment in progress' && patent.renewalStatus !== 'EPO Instructed') {
                        patent.cartService = 'Renewal';
                    }
                    patent.serviceCost = patent.renewalFeeUI;
                } else {
                    if(actionStatus(patent.epctStatus) && patent.epctStatus !== 'Payment in progress' && patent.epctStatus !==  'EPO Instructed'  && patent.epctStatus !==  'Epct being generated' && patent.epctStatus !==  'Epct available') {
                        patent.cartService = 'Epct';
                    }
                    patent.serviceCost = patent.form1200FeeUI;
                }
                
                return patent
            }
        )
        .then(
            function(patent){
                factory.actionCost = patent;
        })

    }

    function fetchActionCost() {
        return factory.actionCost;
    }
    

};