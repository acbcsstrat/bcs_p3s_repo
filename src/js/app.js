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

import "../scss/main.scss";


angular.module('ppApp', ['ui.router', 'ngIdle', 'ngAnimate', 'ui.bootstrap', 'ngCart', 'ngMaterial', 'ngTouch', 'angularMoment', 'LocalStorageModule', 'nvd3', 'ngCookies','angularCroppie', 'ngSanitize', uirouter, userService, routes ,coreCtrl]).config(config)

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

// require("localScripts/js/config.js");
// require("localScripts/js/polyfillers.js")

// require("app/app.module.js");
// require("app/app.config.js");
// require("app/app.routes.js");

// require("app/directives/app.dir.js");
// require("app/directives/form1200.dir.js");
// require("app/directives/checkout.dir.js");
// require("app/directives/current-transactions.transactions.dir.js");
// require("app/directives/patents.list-patents.dir.js");
// require("app/directives/user.dir.js");
// require("app/directives/transactions.dir.js");
// require("app/directives/patents.search-patent.dir.js");
// require("app/directives/portfolio.nav.dir.js");
// require('app/directives/vendors/ngCart.directives.js');
// require('app/directives/avatar.dir.js');
// require('app/directives/mobile-redirect.dir.js');
// require('app/directives/select-avatar.dir.js');
// require('app/directives/open-help.dir.js');
// require('app/directives/help-panel.dir.js');
// require("app/directives/help-panel-group.dir.js");
// require("app/directives/question-panel.dir.js");

// require("app/directives/vendors/ngCart.directives.js");
// require("app/services/app.core.serv.js");
// require("app/services/app.organiseText.serv.js");
// require("app/services/app.organiseColour.serv.js");
// require("app/services/app.calculate.serv.js");
// require("app/services/app.chunkData.serv.js");
// require("app/services/app.fx.serv.js");
// require("app/services/app.fxCalculation.serv.js");
// require("app/services/app.mainNav.serv.js");
// require("app/services/app.timezone.serv.js");
// require("app/services/app.CostAnalysis.serv.js")
// require("app/services/app.helpInfo.serv.js");
// require("app/services/checkout.bankTransferCommit.serv.js");
// require("app/services/checkout.basket.serv.js");

// require("app/services/patent.euroPct.serv.js");
// require("app/services/europct.form1200.serv.js");
// require("app/services/patents.patents.serv.js");
// require("app/services/patents.patentsRest.serv.js");
// require("app/services/patents.searchPatent.serv.js");
// require("app/services/renewal.renewalRest.serv.js")
// require("app/services/transactions.transactionHistory.serv.js");
// require("app/services/transactions.currentTransactions.serv.js");
// require("app/services/user.user.serv.js");
// require("app/services/vendors/ngCart.fulfilment.js");
// require("app/services/app.uploadAvatar.serv.js");
// require("app/services/grant.serv.js");
// require("app/services/notification.serv.js");
// require("app/services/activeTab.serv.js")

// require("app/controllers/checkout.bankTransferPrep.ctrl.js");
// require("app/controllers/checkout.bankTransferSuccess.ctrl.js");
// require("app/controllers/checkout.basket.ctrl.js");
// require("app/controllers/core.core.ctrl.js");

// require("app/controllers/europct.form1200.ctrl.js");
// require("app/controllers/grant.ctrl.js");// !!!!!!! GRANT TEST DATA
// require("app/controllers/grant-ready.ctrl.js");// !!!!!!! GRANT TEST DATA
// require("app/controllers/europct.form1200generated.ctrl.js");
// require("app/controllers/portfolio.ctrl.js");
// require("app/controllers/patents.addPatent.ctrl.js");
// require("app/controllers/patents.searchPatent.ctrl.js");
// require("app/controllers/renewal.renewalHistory.ctrl.js");
// require("app/controllers/transactions.currentTransactionItem.ctrl.js");
// require("app/controllers/transactions.currentTransactions.ctrl.js");
// require("app/controllers/transactions.transactionHistory.ctrl.js");
// require("app/controllers/transactions.transactionHistoryItem.ctrl.js");
// require("app/controllers/user.userProfile.ctrl.js");
// require("app/controllers/fee-breakdown.ctrl.js")
// require("app/controllers/fxchart.ctrl.js")
// require("app/controllers/costchart.ctrl.js")
// require("app/controllers/notifications.ctrl.js")
// require("app/controllers/patent.case-overview.ctrl.js");
// require("app/controllers/patent.details.ctrl.js");


// require("app/components/core.mainNav.comp.js");
// require("app/components/transactions.transNav.comp.js");