import angular from 'angular';

import SupportService from './services/support.serv.js';

import GeneralSupportController from './controllers/general-support.controller';
import angularFileUpload from 'angular-file-upload';

export default angular.module('ppApp.support', ['angularFileUpload', SupportService])
  	.controller('GeneralSupportController', GeneralSupportController)
  	.name;