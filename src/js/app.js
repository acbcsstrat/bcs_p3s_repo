
import "localScripts/js/config.js";;
import "localScripts/js/polyfillers.js";

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
import "ng-file-upload/dist/ng-file-upload.min.js";
import "angular-bind-html-compile/angular-bind-html-compile.min.js";

import "tether/dist/js/tether.min.js";
import "bootstrap/dist/js/bootstrap.min.js";
import "angular-ui-bootstrap/dist/ui-bootstrap-tpls.js";
import "popper.js/dist/popper.min.js";

import "moment/min/moment.min.js";
import "moment-timezone/builds/moment-timezone.min.js";
import "moment-timezone/builds/moment-timezone-with-data-2012-2022.min.js";

import "d3/d3.min.js";
import "nvd3/build/nv.d3.min.js";
import "angular-nvd3/dist/angular-nvd3.min.js";

import "../scss/main.scss";

import angular from 'angular';
import uirouter from 'angular-ui-router';
import ngIdle from "ng-idle/angular-idle.min.js";
import ngCart from "../../app/global/vendors/ngCart/ngCart.js";
import angularMoment from "angular-moment";
import nvd3 from "angular-nvd3";
import croppie from "angular-croppie/angular-croppie.js";

import config from '../../app/app.config.js';

import ProfileService from '../../app/features/profile/services/profile.details.serv.js';



import coreCtrl from '../../app/global/controllers/core.ctrl.js';
import dashboard from '../../app/features/dashboard/index.js';
import portfolio from '../../app/features/portfolio/index.js';
import caseoverview from '../../app/features/case/index.js';
import transactions from '../../app/features/transactions/index.js';
import profile from '../../app/features/profile/index.js';
import sidenav from '../../app/features/sidenav/index.js';
import checkout from '../../app/features/checkout/index.js';

import '@fortawesome/fontawesome-pro/js/fontawesome';
import '@fortawesome/fontawesome-pro/js/solid';
import '@fortawesome/fontawesome-pro/js/regular';
import '@fortawesome/fontawesome-pro/js/brands';



angular.module('ppApp', ['ui.router', 'ngIdle', 'ngAnimate', 'ui.bootstrap', 'ngMaterial', 'ngTouch', 'angularMoment', 'LocalStorageModule', 'nvd3', 'ngCookies','angularCroppie', 'ngSanitize', 'ngFileUpload', 'angular-bind-html-compile', uirouter, ProfileService, ngCart, coreCtrl, dashboard, portfolio, caseoverview, transactions, sidenav, profile, checkout]).config(config).run(startUpRun)

startUpRun.$inject = ['Idle', '$rootScope', '$timeout'];

function startUpRun(Idle, $rootScope, $timeout) {
    Idle.watch();
};