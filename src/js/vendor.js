
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
import "oclazyload/dist/ocLazyLoad.min.js";

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

import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/fontawesome-pro-solid';
import { fal } from '@fortawesome/fontawesome-pro-light';
import { far } from '@fortawesome/fontawesome-pro-regular';
import { fab } from '@fortawesome/fontawesome-pro-regular';

library.add(fas, fal, far)

import 'bootstrap';
import "bootstrap/scss/bootstrap.scss";