import angular from 'angular';

import RegisterController from './controllers/register.controller.js';
import VerifyAccountController from './controllers/verify-account.controller.js';

import RegisterService from './services/register-service.serv.js';
import TimezoneService from '../../global/services/app.timezone.serv.js';

import confrimPwTo from '../../global/directives/confirm-password-check.directive.js';

import zxPasswordMeter from '../../global/directives/zx-password-meter.directive.js';

export default angular.module('ppApp.register', [RegisterService, confrimPwTo, zxPasswordMeter, TimezoneService])
	.controller('RegisterController', RegisterController)
	.controller('VerifyAccountController', VerifyAccountController)
	.name