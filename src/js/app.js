import "../scss/main.scss";

import angular from 'angular';
import lodash from "lodash";
import uirouter from 'angular-ui-router';
import ngIdle from "ng-idle/angular-idle.min.js";
import ngCart from "../../app/global/vendors/ngCart/ngCart.js";
import angularMoment from "angular-moment";
import nvd3 from "angular-nvd3";
import croppie from "angular-croppie/angular-croppie.js";


import config from '../../app/app.config.js';

import ProfileService from '../../app/features/profile/services/profile.details.serv.js';
import PpnumberService from '../../app/global/services/app.ppnumber.serv.js';
import AuthorisationService from '../../app/features/login/services/authorisation.serv.js';

import coreCtrl from '../../app/global/controllers/core.ctrl.js';
import dashboard from '../../app/features/dashboard/index.js';
import sidenav from '../../app/features/sidenav/index.js';
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

angular.module('ppApp', ['ui.router', 'ngIdle', 'ngAnimate', 'ui.bootstrap', 'ngMaterial', 'ngTouch', 'angularMoment', 'LocalStorageModule', 'nvd3', 'ngCookies','angularCroppie', 'ngSanitize', 'ngFileUpload', 'angular-bind-html-compile', 'oc.lazyLoad', uirouter, ProfileService, PpnumberService, AuthorisationService, ngCart, coreCtrl, dashboard, sidenav, transactionlink, validationrules, selectavatar, dynamic, helppanel, mobileredirect]).config(config).constant('_', window._).run(startUpRun);

startUpRun.$inject = ['$state', 'Idle', '$rootScope', '$timeout', '$transitions', 'PpnumberService', 'CoreService', 'AuthorisationService'];

function startUpRun($state, Idle, $rootScope, $timeout, $transitions, PpnumberService, CoreService, AuthorisationService) {

    $rootScope._ = window._;

    Idle.watch();

	PpnumberService.fetchNumber()
	.then(
		function(response){
			$rootScope.ppDetails = response;
		}
	)

    CoreService.checkCases()
    .then(
        function(response){

        	if(response) {
        		$rootScope.firstTime = false;
        	}
            
        }
    )

    $transitions.onStart({}, function(transition) { //restrict access to the states which were given the authorization

        console.log('transition', transition.to())
        console.log('whattttttt', AuthorisationService.authorised)
        $rootScope.authorised = AuthorisationService.authorised;
        
        
        if(!AuthorisationService.authorised && _.has(transition.to(), 'data.authorisation') && _.has(transition.to(), 'data.redirectTo')) {
            return transition.router.stateService.target(transition.to().data.redirectTo);
        }
    });


};