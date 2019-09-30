

// angular.module('ppApp').config(appConfig);

appConfig.$inject = ['$httpProvider', '$uibModalProvider', '$compileProvider' ,'$qProvider', 'KeepaliveProvider', 'IdleProvider', 'localStorageServiceProvider'];

export default function appConfig($httpProvider, $uibModalProvider, $compileProvider, $qProvider, KeepaliveProvider, IdleProvider, localStorageServiceProvider) {

    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};    
    }    

    window.ppdomain = "http://localhost:8080/p3sweb/";

    // Answer edited to include suggestions from comments
    // because previous version of code introduced browser-related errors

    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';


    IdleProvider.idle(500);
    IdleProvider.timeout(30);
    KeepaliveProvider.http(ppdomain+'keep-session-alive/');
    KeepaliveProvider.interval(20);



    $qProvider.errorOnUnhandledRejections(false);

    localStorageServiceProvider
        .setStorageType('sessionStorage')
        .setDefaultToCookie(false)
        .setNotify(true, true)

}