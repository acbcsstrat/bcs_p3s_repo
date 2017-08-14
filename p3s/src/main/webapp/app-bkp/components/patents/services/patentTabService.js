app.factory('patentTabService', function() {

    var factory = {};

        factory.tabs = [{
            title: 'Patent Information',
            url: 'patent-info.htm'
        }, {
            title: 'Cost Analysis',
            url: 'cost-analysis.htm'
        }, {
            title: 'Renewal History',
            url: 'renewal-history.htm'
        }];

        factory.currentTab = 'patent-info.htm';

        factory.onClickTab = function (tab) {
            factory.currentTab = tab.url; //the tabs array is passed as a parameter from the view. The function returns the url property value from the array of objects.
        }

        factory.isActiveTab = function(tabUrl) {
            return tabUrl == factory.currentTab; //for styling purposes
        }

    return factory;

});