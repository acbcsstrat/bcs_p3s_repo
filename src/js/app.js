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

import "tether/dist/js/tether.min.js";
import "bootstrap/dist/js/bootstrap.min.js";
import "angular-ui-bootstrap/dist/ui-bootstrap-tpls.js";
import "popper.js/dist/popper.min.js";

import "moment/min/moment.min.js";
import "moment-timezone/builds/moment-timezone.min.js";
import "moment-timezone/builds/moment-timezone-with-data-2012-2022.min.js";
// import 'bootstrap/dist/css/bootstrap.css';

import "d3/d3.min.js";
import "nvd3/build/nv.d3.min.js";
import "angular-nvd3/dist/angular-nvd3.min.js";

import angular from 'angular';
import uirouter from 'angular-ui-router';
import ngIdle from "ng-idle/angular-idle.min.js";
import ngCart from "localScripts/js/vendors/ngCart.js";
import angularMoment from "angular-moment";
import nvd3 from "angular-nvd3";
import croppie from "angular-croppie/angular-croppie.js";
import routes from "../../app/app.routes.js"

import config from '../../app/app.config.js';

import userService from '../../app/services/user.user.serv.js';

import coreCtrl from '../../app/controllers/core.core.ctrl.js'

import '../scss/main.scss'

angular.module('ppApp', ['ui.router', 'ngIdle', 'ngAnimate', 'ui.bootstrap', 'ngCart', 'ngMaterial', 'ngTouch', 'angularMoment', 'LocalStorageModule', 'nvd3', 'ngCookies','angularCroppie', 'ngSanitize', userService, routes ,coreCtrl]).config(config)

angular.module('ppApp').run(startUpRun)

startUpRun.$inject = ['Idle', 'userService', '$rootScope', '$timeout'];

function startUpRun(Idle, userService, $rootScope, $timeout) {

    // userService.fetchUser()
    // .then(
    //     function(response){
    //         $rootScope.user = response;
    //     },
    //     function(errResponse){
    //         console.log(errResponse)
    //     }
    // )

    Idle.watch();

};