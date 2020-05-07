// import './_dashboard.scss';

import angular from 'angular';

import DashboardService from './services/dashboard.service.js';
import FxService from '../../global/services/fx.service.js';
import PatentsRestService from '../portfolio/services/patents.patentsRest.serv.js';
import CalculateService from '../../global/services/calculate.service.js';
import CostAnalysisService from '../../global/services/cost-analysis.service.js';
import TransactionService from '../../features/transactions/services/transactions.service.js';

import DashboardController from './controllers/dashboard.controller';
import AvailableActionsController from './controllers/dashboard.actions-available.controller';
import FxChartController from './controllers/dashboard.fx-chart.controller';
import EuropctsDonutController from './controllers/dashboard.europcts-graph.controller';
import GrantsDonutController from './controllers/dashboard.grants-graph.controller';
import RenewalsDonutController from './controllers/dashboard.renewals-graph.controller';
import ValidationsDonutController from './controllers/dashboard.validations-graph.controller';

import routing  from './dashboard.routes';

export default angular.module('ppApp.dashboard', [DashboardService, PatentsRestService, CalculateService, CostAnalysisService, TransactionService, FxService]) //import dashboard view controllers
	.config(routing)
  	.controller('DashboardController', DashboardController)
  	.controller('AvailableActionsController', AvailableActionsController)
  	.controller('FxChartController', FxChartController)
  	.controller('EuropctsDonutController', EuropctsDonutController)
  	.controller('GrantsDonutController', GrantsDonutController)
  	.controller('RenewalsDonutController', RenewalsDonutController)
  	.controller('ValidationsDonutController', ValidationsDonutController)
  	.name;
