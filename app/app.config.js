angular.module('ppApp').config(appConfig);

appConfig.$inject = ['$urlRouterProvider', '$compileProvider' ,'$qProvider', 'KeepaliveProvider', 'IdleProvider', 'slickCarouselConfig', 'localStorageServiceProvider'];

export default function appConfig($urlRouterProvider, $compileProvider, $qProvider, KeepaliveProvider, IdleProvider, slickCarouselConfig, localStorageServiceProvider) {

    IdleProvider.idle(500);
    IdleProvider.timeout(30);
    KeepaliveProvider.http(domain+'keep-session-alive/');
    KeepaliveProvider.interval(20);

    $urlRouterProvider
        .when('', '/dashboard')
        .when('/', '/dashboard')
        .otherwise('/dashboard');

    slickCarouselConfig.dots = true;
    slickCarouselConfig.autoplay = false;

    $qProvider.errorOnUnhandledRejections(false);

    localStorageServiceProvider
        .setStorageType('sessionStorage')
        .setDefaultToCookie(false)
        .setNotify(true, true)

}