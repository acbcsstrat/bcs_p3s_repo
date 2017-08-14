app.factory('transactionHistoryTabService', function() {

    var factory = {};

        factory.tabs = [{
            title: 'Transaction Information',
            url: 'transaction-history-info.htm'
        }, {
            title: 'Transaction Status',
            url: 'transaction-history-status.htm'
        }];

        factory.currentTab = 'transaction-history-info.htm';

        factory.onClickTab = function (tab) {
            factory.currentTab = tab.url; //the tabs array is passed as a parameter from the view. The function returns the url property value from the array of objects.
        }

        factory.isActiveTab = function(tabUrl) {
            return tabUrl == factory.currentTab; //for styling purposes
        }

    return factory;

});