export default angular.module('services.organise-colour-service', []).factory('organiseColourService', organiseColourService).name

organiseColourService.$inject = ['$http', '$q'];

function organiseColourService($http, $q) {

    var factory = {
        getNextColour:  getNextColour,
        getCurrColour:  getCurrColour

    }

    function getCurrColour(colour, item) {

        var color;

        if(item === 'text') {
            switch(colour) {
                case 'Green':
                    color =  'txt-phase-green'
                break;
                case 'Amber':
                    color =  'txt-phase-amber'
                break;
                case 'Red':
                    color = 'txt-phase-red'
                break;
                case 'Blue':
                    color =  'txt-phase-blue'
                break;
                case 'Black':
                    color = 'txt-phase-black'
            } //switch end

        }

        if(item === 'bg') {
            switch(colour) {
                case 'Green':
                    color =  'bg-phase-green'
                break;
                case 'Amber':
                    color =  'bg-phase-amber'
                break;
                case 'Red':
                    color = 'bg-phase-red'
                break;
                case 'Blue':
                    color =  'bg-phase-blue'
                break;
                case 'Black':
                    color = 'bg-phase-black'
            } //switch end
           
        }

        return color
    }

    function getNextColour(colour, item) {
        var color;

        if(item === 'bg') {
            switch(colour) {
                case 'Green':
                    color =  'bg-phase-amber'
                break;
                case 'Amber':
                    color =  'bg-phase-red'
                break;
                case 'Red':
                    color = 'bg-phase-blue'
                break;
                case 'Blue':
                    color =  'bg-phase-black'
                break;
                case 'Black':
                    color = 'bg-white'
            } //switch end
           
        }
         return color
    }    

    return factory;

}