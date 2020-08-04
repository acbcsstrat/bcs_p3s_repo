import angular from 'angular';

import RegisterController from './controllers/register.controller.js';

import UserService from '../login/services/user-service.serv.js';
import TimezoneService from '../../global/services/app.timezone.serv.js';

import confrimPwTo from '../../global/directives/confirm-password-check.directive.js';

export default angular.module('ppApp.register', [UserService,  confrimPwTo, TimezoneService])
	.controller('RegisterController', RegisterController)
	.name