import "../scss/main.scss";

import angular from 'angular';
import lodash from "lodash";
import uirouter from 'angular-ui-router';
import ngIdle from "ng-idle/angular-idle.min.js";
import ngCart from "../../app/global/vendors/ngCart/ngCart.js";
import angularMoment from "angular-moment";
import nvd3 from "angular-nvd3";
import croppie from "angular-croppie/angular-croppie.js";
import RecaptchaModule from 'angular-recaptcha';

import zxcvbn from 'zxcvbn';

import config from '../../app/app.config.js';

import ProfileService from '../../app/features/profile/services/profile.details.serv.js';
import PpnumberService from '../../app/global/services/app.ppnumber.serv.js';
import AuthorisationService from '../../app/features/login/services/authorisation.serv.js';

import coreCtrl from '../../app/global/controllers/core.ctrl.js';
import dashboard from '../../app/features/dashboard/index.js';
import sidenav from '../../app/features/sidenav/index.js';
import register from '../../app/features/register/index.js';
import transactionlink from '../../app/global/directives/transactions.directive.js';
import validationrules from '../../app/global/directives/validations.directive.js';
import selectavatar from '../../app/global/directives/avatar.directive.js';
import dynamic from '../../app/global/directives/dynamic.directive.js';
import helppanel from '../../app/global/directives/open-help.directive.js';
import mobileredirect from '../../app/global/directives/mobile-redirect.directive.js';

import '@fortawesome/fontawesome-pro/js/fontawesome';
import '@fortawesome/fontawesome-pro/js/solid';
import '@fortawesome/fontawesome-pro/js/regular';
import '@fortawesome/fontawesome-pro/js/brands';

angular.module('ppApp', ['ui.router', 'ngIdle', 'ngAnimate', 'ui.bootstrap', 'ngMaterial', 'ngTouch', 'angularMoment', 'LocalStorageModule', 'nvd3', 'ngCookies','angularCroppie', 'ngSanitize', 'ngFileUpload', 'angular-bind-html-compile', 'oc.lazyLoad',  uirouter, ProfileService, PpnumberService, AuthorisationService, ngCart, coreCtrl, dashboard, sidenav, transactionlink, validationrules, selectavatar, dynamic, helppanel, mobileredirect, register, RecaptchaModule, ]).config(config).constant('_', window._).run(startUpRun);

startUpRun.$inject = ['$state', '$cookies', '$location', '$http', 'Idle', '$rootScope', '$timeout', '$transitions', 'PpnumberService', 'CoreService', 'AuthorisationService'];

function startUpRun($state, $cookies, $location, $http, Idle, $rootScope, $timeout, $transitions, PpnumberService, CoreService, AuthorisationService) {

    $rootScope._ = window._;
    $rootScope.logout = false;

    Idle.watch();

    $rootScope.globals = $cookies.getObject('globals') || {};

    if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
    }

    $rootScope.$on('$locationChangeStart', function (event, next, current) {

        // redirect to login page if not logged in and trying to access a restricted page
        var restrictedPage = $.inArray($location.path(), ['/login', '/login_error','/register', '/prelogin/new-user-verify','/forgot-password', '/reset-password', '/prelogin/reset-password/']) === -1; //if it doesnt contain logi or registr
        var loggedIn = $rootScope.globals.currentUser;

        var phrase = $location.path();
        var myRegexp, match; 
        if(next.includes('reset-password')) {
            myRegexp = /prelogin\/reset-password\/(.*)/;
        } 

        if(next.includes('new-user-verify')) {
             myRegexp = /prelogin\/new-user-verify\/(.*)/;
        }

        if(myRegexp !== undefined) {
            var match = myRegexp.exec(phrase); //if match == null, means that they are not on reset-password
        }

        if(!restrictedPage || match !== null) { //if pre login or on reset-password
            $rootScope.authorised = false;
        }

        if (restrictedPage && !loggedIn && match == null) {
            $rootScope.authorised = false;
            $location.path('/login');
        }

        if(restrictedPage && loggedIn && match == null) {

            $rootScope.authorised = true;
            PpnumberService.fetchNumber()
            .then(
                function(response){
                    $rootScope.ppDetails = response;
                }
            )

            CoreService.checkCases()
            .then(
                function(response){
                    if(!response) {
                        $rootScope.firstTime = true;
                    }
                    
                }
            )            
        }
    });


};