var app = angular.module('myApp', ['ui.router', 'chart.js', 'ui.bootstrap']);

app.run(["$state", '$transitions', '$q', '$rootScope',
    function($state, $transitions, $q, $rootScope) {

//  //redirects to login page if we're not signed in
//    $transitions.onBefore({to: 'app.**'}, function(trans) {
//        var deferred = $q.defer();
//
//        authentication.requireAuth().then(function() {
//          //we're signed in, so proceed to home.**
//            deferred.resolve();
//        }).catch(function(error) {
//            //we're not signed in and home.** requires Auth
//            //so resolve with the state you want to reroute to, refreshing
//            //the url w/ reload === true
//            if (error === 'AUTH_REQUIRED') {
//                $rootScope.message = 'You must be logged in to be view this content';
//                var params = { reload: true };
//                deferred.resolve($state.target('login', undefined, params));
//            } else {
//                $rootScope.message = 'Unknown error has occured. Please try again later'
//            }
//        });
//
//        return deferred.promise;
//    });
//
//  //redirects to home page if we're signed in
//    $transitions.onBefore({to: 'login.**', from: '**'}, function(trans) {
//
//        var deferred = $q.defer();
//
//        authentication.requireAuth().then(function() {
//          //we're signed in, so lets avoid going to login, and instead
//          //go to our authenticated state
//            var params = { reload: true };
//            deferred.resolve($state.target('patents', undefined, params));
//        }).catch(function() {
//          //we're not signed in, so continue to login.**
//            deferred.resolve(); 
//        });
//
//        return deferred.promise;
//    });

}]);



