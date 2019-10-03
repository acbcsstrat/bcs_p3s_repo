angular.module('ppApp').service('activeTabService', activeTabService);

activeTabService.$inject = ['$q', '$http'];

function activeTabService($q, $http) {

    var factory = {
        setTab: setTab,
        getTab: 0
    }

    function setTab(index) {
        factory.getTab = index;
    }

    return factory;

}