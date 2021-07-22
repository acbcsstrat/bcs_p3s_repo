import angular from 'angular';

import GeneralSupportController from './controllers/general-support.controller';
import angularFileUpload from 'angular-file-upload';

export default angular.module('ppApp.support', ['angularFileUpload'])
  	.controller('GeneralSupportController', GeneralSupportController)
  	.name;