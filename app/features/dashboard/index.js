import './_dashboard.scss';

import angular from 'angular';

import DashboardService from './services/dashboard.service.js';
import FxService from '../../global/services/app.fx.service.js';
import CasesRestService from '../portfolio/services/portfolio.cases.serv.js';
import CalculateService from '../../global/services/app.calculate.service.js';
import CostAnalysisService from '../../global/services/app.cost-analysis.service.js';
import TransactionService from '../../features/transactions/services/transactions.service.js';

import DashboardController from './controllers/dashboard.controller';
import AvailableActionsController from './controllers/dashboard.actions-available.controller';
import DbFxChartController from './controllers/dashboard.fx-chart.controller';
import EuropctsDonutController from './controllers/dashboard.europcts-graph.controller';
import GrantsDonutController from './controllers/dashboard.grants-graph.controller';
import RenewalsDonutController from './controllers/dashboard.renewals-graph.controller';
import ValidationsDonutController from './controllers/dashboard.validations-graph.controller';

import routing  from './dashboard.routes';

export default angular.module('ppApp.dashboard', [DashboardService, CasesRestService, CalculateService, CostAnalysisService, TransactionService, FxService]) //import dashboard view controllers
	.config(routing)
  	.controller('DashboardController', DashboardController)
  	.controller('AvailableActionsController', AvailableActionsController)
  	.controller('DbFxChartController', DbFxChartController)
  	.controller('EuropctsDonutController', EuropctsDonutController)
  	.controller('GrantsDonutController', GrantsDonutController)
  	.controller('RenewalsDonutController', RenewalsDonutController)
  	.controller('ValidationsDonutController', ValidationsDonutController)
  	.name;
