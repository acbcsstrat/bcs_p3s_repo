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

        var newPatents = patents.map(function(patent){
            return patent.p3sServices.map(function(serv){
                return {                
                    patentID: patent.patentID,
                    ep_ApplicationNumber: patent.ep_ApplicationNumber,
                    clientRef: patent.clientRef,
                    p3sServices: [serv]
                }
            })
        })


        var result = [].concat(...newPatents);

        result.forEach(function(patent){
            patent.p3sServices.forEach(function(action, idx){
                var string = action.currentStageColour.toLowerCase();
                var capitlized = string.charAt(0).toUpperCase() + string.slice(1);
                obj[capitlized].push(patent);
            })
        })

        factory.getPatents = obj;
    }

    function actionStatus(text) {
        return organiseTextService.actionStatus(text)
    }    

    function setActionCost(patent) {

        if(patent === undefined || patent.saleType === 'Not In Progress') {
            factory.actionCost = undefined;
            return
        }

        var action = patent.p3sServices[0].serviceType;

        patentsRestService.fetchPatentItem(patent.patentID)
        .then(
            function(patent){

                var service = patent.p3sServicesWithFees.filter(function(el){
                    return el.serviceType == action;
                });

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