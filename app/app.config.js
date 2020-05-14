appConfig.$inject = ['$httpProvider', '$urlRouterProvider', '$uibModalProvider', '$compileProvider' ,'$qProvider', 'KeepaliveProvider', 'IdleProvider', 'localStorageServiceProvider', '$mdIconProvider', '$mdPanelProvider'];

export default function appConfig($httpProvider, $urlRouterProvider, $uibModalProvider, $compileProvider, $qProvider, KeepaliveProvider, IdleProvider, localStorageServiceProvider, $mdIconProvider, $mdPanelProvider) {

    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};    
    }    

    window.ppdomain = "http://localhost:8080/p3sweb/";

    $urlRouterProvider 
        .when('', '/dashboard')
        .otherwise("/dashboard")    

    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';

    $mdIconProvider
        .defaultFontSet('FontAwesome')
        .fontSet('fa', 'FontAwesome');


    IdleProvider.idle(500);
    IdleProvider.timeout(30);
    KeepaliveProvider.interval(20);



    $qProvider.errorOnUnhandledRejections(false);

    localStorageServiceProvider
        .setStorageType('sessionStorage')
        .setDefaultToCookie(false)
        .setNotify(true, true)

}