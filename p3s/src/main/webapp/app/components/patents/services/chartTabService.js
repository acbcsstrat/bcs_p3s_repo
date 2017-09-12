app.factory('chartTabService', function() {

    var factory = {};

        factory.tabs = [{
            title: 'Stage Cost Chart',
            url: 'band-chart.htm'
        }, {
            title: 'FX Rate',
            url: 'fx-chart.htm'
        }];

        factory.currentTab = 'band-chart.htm';

        factory.onClickTab = function (tab) {
            factory.currentTab = tab.url; //the tabs array is passed as a parameter from the view. The function returns the url property value from the array of objects.
        }

        factory.isActiveTab = function(tabUrl) {
            return tabUrl == factory.currentTab; //for styling purposes
        }

    return factory;

});