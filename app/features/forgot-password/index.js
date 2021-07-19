import angular from 'angular';

import AuthorisationService from '../login/services/authorisation.serv.js';

import ForgotPasswordController from './controllers/forgot-password.controller';
import ResetPasswordController from './controllers/reset-password.controller';

export default angular.module('ppApp.login', [AuthorisationService]) //import dashboard view controllers
  	.controller('ForgotPasswordController', ForgotPasswordController)
  	.controller('ResetPasswordController', ResetPasswordController)
  	.name;