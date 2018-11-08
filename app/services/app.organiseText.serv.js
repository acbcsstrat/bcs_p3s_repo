angular.module('ppApp').service('organiseTextService', organiseTextService);

organiseTextService.$inject = ['coreService'];

function organiseTextService(coreService) {
    
    var factory = {
        uiStatus: uiStatus,
        actionStatus: actionStatus
    }

    var partnerName, partnerPhone;

    coreService.ppContact()
    .then(
        function(response){
            partnerName = response.partnerName;
            partnerPhone = response.partnerPhone;
        },
        function(errResponse){
            partnerName = 'N/A';
            partnerPhone = 'N/A';
        }
    )

    var actionableStatuses = [
        {text: 'Show price', uiTextl: 'Open for Renewal'},
        {text: 'Epct available', uiText: 'Euro-PCT Ready'},
        {text: 'Epct saved', uiText: 'Euro-PCT Saved'},
        {text: 'Epct being generated', uiText: 'Euro-PCT Generating'},
        {text: 'EPO Instructed', uiText: 'EPO Instructed'},
        {text: 'Too late to renew', uiText: 'Call '+partnerName+' on '+partnerPhone},    
    ]

    var availableStatuses = [
        {text: 'Show price', uiText: 'Open for Renewal'},
        {text: 'Epct available', uiText: 'Euro-PCT Ready'},
        {text: 'Epct saved', uiText: 'Euro-PCT Saved'},
        {text: 'Epct being generated', uiText: 'Euro-PCT Generating'},
        {text: 'EPO Instructed', uiText: 'EPO Instructed'},
        {text: 'Too late to renew', uiText: 'Call '+partnerName+' on '+partnerPhone},
    ]          

    function uiStatus(text) {

        var uiText;

        if(typeof text === 'undefined') {
            return;
        }

        availableStatuses.forEach(function(el){
            if(el.text == text) {
                uiText = el.uiText;
            }
        })

        return uiText;

    }

    function actionStatus(status) {

        var match;

        for(var i = 0;i < actionableStatuses.length; i++) {
            if(actionableStatuses[i].text.indexOf(status) > -1) {
                match = true;
                break;
            }
            match = false;
        }
        return match;
    }

    return factory;

}