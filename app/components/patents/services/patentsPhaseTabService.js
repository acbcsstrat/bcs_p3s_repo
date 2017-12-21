app.factory('patentsPhaseTabService', function() {

    var factory = {};

        factory.tabs = [{
            title: 'View All',
            url: 'list-patents.htm'
        },  {
            title: 'Green',
            url: 'list-green-phase.htm'
        },  {
            title: 'Amber',
            url: 'list-amber-phase.htm'
        },  {
            title: 'Red',
            url: 'list-red-phase.htm'
        },  {
            title: 'Blue',
            url: 'list-blue-phase.htm'
        } , {
            title: 'Black',
            url: 'list-black-phase.htm'
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