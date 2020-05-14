import angular from 'angular';

import CasesRestService from '../portfolio/services/portfolio.cases.serv.js';
import Form1200Service from './services/case.form1200.serv.js';
import GrantService from './services/case.grant.serv.js';
import RemindersService from './services/case.reminders.serv.js';
import RenewalHistoryService from './services/case.renewal.serv.js';
import ValidationService from './services/case.validation.serv.js';

import ActiveTabService from '../../global/services/app.activeTab.serv.js';
import CoreService from '../../global/services/app.core.serv.js';
import ChunkDataService from '../../global/services/app.chunkData.serv.js';

import dynamic from '../../global/directives/dynamic.directive.js';
import validationDirectives from '../../global/directives/validations.directive.js';

import CaseOverviewController from './controllers/case.overview.controller';
import CostChartController from './controllers/case.costchart.controller';
import CaseDetailsController from './controllers/case.details.controller';
import Form1200GeneratedController from './controllers/case.form1200-generated.controller';
import Form1200ReadyController from './controllers/case.form1200-ready.controller';
import FxChartController from './controllers/case.fxchart.controller';
import GrantController from './controllers/case.grant.controller';
import RemindersController from './controllers/case.reminders.controller';
import RenewalHistoryController from './controllers/case.renewal-history.controller';
import ValidationController from './controllers/case.validation.controller';
import FeeBreakDownController from './controllers/case.fee-breakdown.controller';

import routing  from './case.routes';

export default angular.module('ppApp.caseoverview', [CasesRestService, Form1200Service, GrantService, RemindersService, RenewalHistoryService, ValidationService, ActiveTabService, CoreService, ChunkDataService, dynamic])
	.config(routing)
  	.controller('CaseOverviewController', CaseOverviewController)
  	.controller('CostChartController', CostChartController)
  	.controller('CaseDetailsController', CaseDetailsController)
  	.controller('Form1200GeneratedController', Form1200GeneratedController)
  	.controller('Form1200ReadyController', Form1200ReadyController)
  	.controller('FxChartController', FxChartController)
  	.controller('GrantController', GrantController)
  	.controller('RemindersController', RemindersController)
  	.controller('RenewalHistoryController', RenewalHistoryController)
    .controller('ValidationController', ValidationController)
    .controller('FeeBreakDownController', FeeBreakDownController)
  	.name;