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
import profile from '../../app/features/profile/index.js';
import sidenav from '../../app/features/sidenav/index.js';
import checkout from '../../app/features/checkout/index.js';
import transactions from '../../app/features/transactions/index.js';

import '@fortawesome/fontawesome-pro/js/fontawesome';
import '@fortawesome/fontawesome-pro/js/solid';
import '@fortawesome/fontawesome-pro/js/regular';
import '@fortawesome/fontawesome-pro/js/brands';



angular.module('ppApp', ['ui.router', 'ngIdle', 'ngAnimate', 'ui.bootstrap', 'ngMaterial', 'ngTouch', 'angularMoment', 'LocalStorageModule', 'nvd3', 'ngCookies','angularCroppie', 'ngSanitize', 'ngFileUpload', 'angular-bind-html-compile', 'oc.lazyLoad', uirouter, ProfileService, ngCart, coreCtrl, dashboard, sidenav, profile, checkout, transactions]).config(config).run(startUpRun)

startUpRun.$inject = ['Idle', '$rootScope', '$timeout'];

function startUpRun(Idle, $rootScope, $timeout) {
    Idle.watch();
};