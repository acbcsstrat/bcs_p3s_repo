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

        obj.Total = patents.length;

        for(var i = 0; i < patents.length; i++) {

            var item =  patents[i].p3sServices;

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
                    if(obj[property][0].p3sServices.length === 0) {
                        phase = 'Grey';
                    }
                    if(obj[property][0].p3sServices.length > 0) {
                        phase = obj[property][0].p3sServices[0].currentStageColour;
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

        patentsRestService.fetchPatentItem(patent.patentID)
        .then(
            function(patent){

                var service = patent.p3sServicesWithFees;

                var fee = Object.keys(service[0]).find(function(el){
                    if(el.indexOf('FeeUI') > 0 && service[0][el] !== null) {
                        return true;
                    }
                    return false
                })

                if(service[0][fee]) {
                    if(service[0].saleType === 'Online' || service[0].saleType === 'Offline') {
                        patent.cartService = fee.replace('FeeUI','');
                        patent.serviceCost = service[0][fee];
                    }
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