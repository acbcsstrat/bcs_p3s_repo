angular.module('ppApp').factory('dashboardService', dashboardService);

dashboardService.$inject = ['$http', '$q', 'organiseColourService', 'organiseTextService', 'patentsRestService']

function dashboardService($http, $q, organiseColourService, organiseTextService, patentsRestService) {

    var factory = {
        sortPatents: sortPatents,
        getPatents: {},
    };

    return factory;



    function sortPatents(patents) {

        var obj = {
            epct: {           
                Green: [],
                Amber: [],
                Red: [],
                Grey: []
            },
            renewal: {           
                Green: [],
                Amber: [],
                Red: [],
                Blue: [],
                Black: [],
                Grey: []
            },
            grant: {           
                Green: [],
                Amber: [],
                Red: [],
                Grey: []
            },
            validation: {           
                Green: [],
                Grey: []
            },                                    
        }

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
                var capitalized = string.charAt(0).toUpperCase() + string.slice(1);
                obj[action.serviceType][capitalized].push(patent);
            })
        })
        
        factory.getPatents = obj;
    }


    

};