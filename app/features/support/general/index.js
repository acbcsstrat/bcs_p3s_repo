import angular from 'angular';

import SupportService from './services/support.serv.js';

import GeneralSupportController from './controllers/general-support.controller';

export default angular.module('ppApp.support', [SupportService])
  	.controller('GeneralSupportController', GeneralSupportController)
  	.name;