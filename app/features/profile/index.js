import angular from 'angular';

import ProfileService from './services/profile.details.serv.js';
import UploadAvatarService from './services/profile.upload-avatar.serv.js';

import validationDirectives from '../../global/directives/validations.directive.js';

import TimezoneService from '../../global/services/app.timezone.serv.js';

import ProfileController from './controllers/profile.controller';

import confrimPwTo from '../../global/directives/confirm-password-check.directive.js';
import zxPasswordMeter from '../../global/directives/zx-password-meter.directive.js';

export default angular.module('ppApp.profile', [ProfileService, UploadAvatarService, TimezoneService, validationDirectives]) //import dashboard view controllers
  	.controller('ProfileController', ProfileController)
  	.name;