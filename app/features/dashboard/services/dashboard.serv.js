import angular from 'angular';

export default angular.module('services.DashboardService', []).factory('DashboardService', DashboardService).name;

DashboardService.$inject = ['$http', '$q', 'CasesRestService']

function DashboardService($http, $q, CasesRestService) {

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
            }
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


        var result = [].concat.apply([], newPatents);

        result.forEach(function(patent){
            patent.p3sServices.forEach(function(action, idx){
                var string = action.currentStageColour.toLowerCase();
                var capitalized = string.charAt(0).toUpperCase() + string.slice(1);     
                if(action.serviceType == 'validation') {
                    obj.validation.Green.push(patent); //handle validation manual processing
                }
                if(action.serviceType !== 'postgrant' && action.serviceType !== 'validation' && action.serviceType !== '----') { //validated changed fro postvalidation
                    obj[action.serviceType][capitalized].push(patent);
                }
                
            })
        })
        
        factory.getPatents = obj;
    }
    

};