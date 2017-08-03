app.factory('currentTransactionTabService', function() {

    var factory = {};

        factory.tabs = [{
            title: 'Transaction Information',
            url: 'current-transaction-info.htm'
        }, {
            title: 'Transaction Status',
            url: 'current-transaction-status.htm'
        }];

        factory.currentTab = 'current-transaction-info.htm';

        factory.onClickTab = function (tab) {
            factory.currentTab = tab.url; //the tabs array is passed as a parameter from the view. The function returns the url property value from the array of objects.
        }

        factory.isActiveTab = function(tabUrl) {
            return tabUrl == factory.currentTab; //for styling purposes
        }

    return factory;

});