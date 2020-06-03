export default angular.module('services.activetab-service', []).service('ActiveTabService', ActiveTabService).name;

ActiveTabService.$inject = ['$q', '$http'];

function ActiveTabService($q, $http) {

    var factory = {
        setTab: setTab,
        getTab: 0
    }

    function setTab(index) {
        factory.getTab = index;
    }

    return factory;

}