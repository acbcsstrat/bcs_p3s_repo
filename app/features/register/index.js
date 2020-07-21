import angular from 'angular';

import RegisterController from './controllers/register.controller.js';

import UserService from '../login/services/user-service.serv.js';

export default angular.module('ppApp.register', [UserService])
	.controller('RegisterController', RegisterController)
	.name