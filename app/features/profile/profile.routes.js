routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {

    $stateProvider
    .state('profile', {
        url: '/profile',
        template: require('html-loader!./html/profile.tpl.htm'),
        controller: 'ProfileController',
        controllerAs: '$ctrl',
        lazyLoad: function($transition$) {
            const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");
            
            // !!! Dynamic import !!!
            return import(/* webpackChunkName: "index" */ "./index.js")
            .then(mod => {
                $ocLazyLoad.inject(mod.default)
            })
            .catch(err => {
                throw new Error("Ooops, something went wrong, " + err);
            });
        },             
    })
}

