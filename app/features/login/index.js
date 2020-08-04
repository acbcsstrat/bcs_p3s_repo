import angular from 'angular';

import AuthorisationService from './services/authorisation.serv.js';

import LoginController from './controllers/login.controller';

export default angular.module('ppApp.login', [AuthorisationService]) //import dashboard view controllers
  	.controller('LoginController', LoginController)
  	.name;