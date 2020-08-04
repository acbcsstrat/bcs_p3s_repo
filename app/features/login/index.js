import angular from 'angular';

import UserService from './services/user-service.serv.js';
import AuthorisationService from './services/authorisation.serv.js';


import LoginController from './controllers/login.controller';

export default angular.module('ppApp.login', [AuthorisationService, UserService]) //import dashboard view controllers
  	.controller('LoginController', LoginController)
  	.name;