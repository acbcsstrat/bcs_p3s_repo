import "babel-polyfill";
import $ from 'jquery'; //neede to prevent error with slick-carousel
window.jQuery = $;
window.$ = $;
import "jquery/dist/jquery.min.js";
import "angular/angular.min.js";
import "angular-cookies/angular-cookies.min.js";
import "angular-animate/angular-animate.min.js";
import "angular-sanitize/angular-sanitize.js";
import "angular-aria/angular-aria.min.js";
import "angular-material/angular-material.min.js";
import 'angular-touch/angular-touch.min.js';
import "angular-local-storage/dist/angular-local-storage.min.js";
import "ng-idle/angular-idle.min.js";
import "tether/dist/js/tether.min.js";
import "bootstrap/dist/js/bootstrap.min.js";
import "angular-ui-bootstrap/dist/ui-bootstrap-tpls.js";
import "popper.js/dist/popper.min.js";
import "@uirouter/angularjs/release/angular-ui-router.min.js";

angular.module('ppApp', ['ui.router', 'ngIdle', 'ngAnimate', 'ui.bootstrap', 'ngCart', 'ngMaterial', 'ngTouch', 'angularMoment', 'LocalStorageModule', 'nvd3', 'ngCookies','angularCroppie', 'ngSanitize']);

angular.module('ppApp').run(startUpRun)

startUpRun.$inject = ['Idle', 'userService', '$rootScope', '$timeout'];

function startUpRun(Idle, userService, $rootScope, $timeout) {

    userService.fetchUser()
    .then(
        function(response){
            $rootScope.user = response;
        },
        function(errResponse){
            console.log(errResponse)
        }
    )

    Idle.watch();

};