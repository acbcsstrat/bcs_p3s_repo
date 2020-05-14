import angular from 'angular';

import ProfileService from './services/profile.details.serv.js';
import UploadAvatarService from './services/profile.upload-avatar.serv.js';

import validationDirectives from '../../global/directives/validations.directive.js';

import TimezoneService from '../../global/services/app.timezone.serv.js';

import ProfileController from './controllers/profile.controller';

import routing  from './profile.routes';

export default angular.module('ppApp.profile', [ProfileService, UploadAvatarService, TimezoneService, validationDirectives]) //import dashboard view controllers
	.config(routing)
  	.controller('ProfileController', ProfileController)
  	.name;