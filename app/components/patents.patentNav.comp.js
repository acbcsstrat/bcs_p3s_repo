angular.module('ppApp').component('patentnav', {
    template: ['$stateParams', function($stateParams) {
        var navigation = $stateParams.navigation || 'default';
        return '<div data-ng-include="\'app/templates/nav.' + navigation + '.tpl.htm\'"></div>'
    }]
})