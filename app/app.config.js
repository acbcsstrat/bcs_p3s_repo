angular.module('ppApp').config(appConfig);

appConfig.$inject = ['$httpProvider', '$urlRouterProvider', '$uibModalProvider', '$compileProvider' ,'$qProvider', 'KeepaliveProvider', 'IdleProvider', 'localStorageServiceProvider', '$mdIconProvider', '$mdPanelProvider'];

function appConfig($httpProvider, $urlRouterProvider, $uibModalProvider, $compileProvider, $qProvider, KeepaliveProvider, IdleProvider, localStorageServiceProvider, $mdIconProvider, $mdPanelProvider) {

    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};    
    }    

    // Answer edited to include suggestions from comments
    // because previous version of code introduced browser-related errors

    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    // extra
    // $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    // $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';    

    // $uibModalProvider.options.windowClass = 'show';
    // $uibModalProvider.options.backdropClass = 'show';




    $mdIconProvider
        .defaultFontSet('FontAwesome')
        .fontSet('fa', 'FontAwesome');


    IdleProvider.idle(500);
    IdleProvider.timeout(30);
    KeepaliveProvider.interval(20);

    $urlRouterProvider
        .when('', '/dashboard')
        .when('/', '/dashboard')
        .otherwise('/dashboard');

    // slickCarouselConfig.dots = true;
    // slickCarouselConfig.autoplay = false;

    $qProvider.errorOnUnhandledRejections(false);

    localStorageServiceProvider
        .setStorageType('sessionStorage')
        .setDefaultToCookie(false)
        .setNotify(true, true)

}