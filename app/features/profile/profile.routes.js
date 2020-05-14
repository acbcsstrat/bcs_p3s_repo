routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {

    $stateProvider
    .state('profile', {
        url: '/profile',
        template: require('html-loader!./html/profile.tpl.htm'),
        controller: 'ProfileController',
        controllerAs: '$ctrl',
    })
}

