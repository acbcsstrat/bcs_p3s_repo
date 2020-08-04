import angular from 'angular';

import RegisterController from './controllers/register.controller.js';

import RegisterService from './services/register-service.serv.js';
import TimezoneService from '../../global/services/app.timezone.serv.js';

import confrimPwTo from '../../global/directives/confirm-password-check.directive.js';

export default angular.module('ppApp.register', [RegisterService, confrimPwTo, TimezoneService])
	.controller('RegisterController', RegisterController)
	.name