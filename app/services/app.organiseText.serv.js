angular.module('ppApp').service('organiseTextService', organiseTextService);

organiseTextService.$inject = ['coreService', '$timeout'];

function organiseTextService(coreService, $timeout) {
    
    var factory = {
        uiStatus: uiStatus,
        actionStatus: actionStatus,
        paymentStatus: paymentStatus
    }

    var actionableStatuses = [
        {text: 'Show price', uiText: 'Open for Renewal'},
        {text: 'Epct rejected', uiText: 'Euro-PCT Rejected'},
        {text: 'Epct available', uiText: 'Euro-PCT Ready'},
        {text: 'Epct saved', uiText: 'Euro-PCT Saved'},
        {text: 'Epct being generated', uiText: 'Euro-PCT Generating'},
        // {text: 'EPO Instructed', uiText: 'EPO Instructed'},
        {text: 'Too late to renew', uiText: 'Call Pure Ideas Ltd on +44 1992 563964'},
        {text: 'Await pdf gen start', uiText: 'Euro-PCT Generating'}        
    ]

    var paymentStatuses = [
        {text: 'EPO Instructed', uiText: 'EPO Instructed'},
        {text: 'Payment in progress', uiText: 'Payment in Progress'}
    ]

    var availableStatuses = [
        {text: 'Show price', uiText: 'Open for Renewal'},
        {text: 'Renewal in place', uiText: 'Renewal In Place'},
        {text: 'No renewal needed', uiText: 'No Renewal Needed'},
        {text: 'EPO Instructed', uiText: 'EPO Instructed'},
        {text: 'Payment in progress', uiText: 'Payment in Progress'},
        {text: 'Too early', uiText: 'Too Early'},
        {text: 'Too late', uiText: 'Too Late'},
        {text: 'Way too late to renew', uiText: 'LAPSED'},
        {text: 'Epct available', uiText: 'Euro-PCT Ready'},
        {text: 'Epct not available', uiText: 'Manual Processing Only'},
        {text: 'Epct saved', uiText: 'Euro-PCT Saved'},
        {text: 'Epct being generated', uiText: 'Euro-PCT Generating'},
        {text: 'Await pdf gen start', uiText: 'Euro-PCT Generating'},
        {text: 'EPO Instructed', uiText: 'EPO Instructed'},
        {text: 'Too late to renew', uiText: 'Call Pure Ideas Ltd on +44 1992 563964'},
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

    function paymentStatus(status) {
        var match;

        for(var i = 0;i < paymentStatuses.length; i++) {
            if(paymentStatuses[i].text.indexOf(status) > -1) {
                match = true;
                break;
            }
            match = false;
        }
        return match;
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