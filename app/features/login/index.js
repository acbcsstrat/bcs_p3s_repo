import angular from 'angular';

import AuthorisationService from './services/authorisation.serv.js';
import CoreService from '../../global/services/app.core.serv.js';

import LoginController from './controllers/login.controller';
import LoginErrorController from './controllers/login-error.controller';

export default angular.module('ppApp.login', [AuthorisationService, CoreService]) //import dashboard view controllers
  	.controller('LoginController', LoginController)
  	.controller('LoginErrorController', LoginErrorController)
  	.name;