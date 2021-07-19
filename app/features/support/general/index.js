import angular from 'angular';

import GeneralSupportController from './controllers/general-support.controller';

export default angular.module('ppApp.transactions', []) //import dashboard view controllers
  	.controller('GeneralSupportController', GeneralSupportController)
  	.name;