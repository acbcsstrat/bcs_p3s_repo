import './_dashboard.scss';

import angular from 'angular';

import DashboardService from './services/dashboard.service.js';
import PatentsRestService from '../../services/patents.patentsRest.serv.js';
import CalculateService from '../../services/calculate.service.js';
import CostAnalysisService from '../../services/cost-analysis.service.js';
import TransactionHistoryService from '../../services/transaction-history.service.js';
import CurrentTransactionsService from '../../services/current-transactions.service.js';

import DashboardController from './controllers/dashboard.controller';
import AvailableActionsController from './controllers/actions-available.controller';
import GraphDonutController from './controllers/donut-chart.controller';
import FxChartController from './controllers/fx-chart.controller';
import ActionCostController from './controllers/action-cost.controller';
import RecentActivityController from './controllers/recent-activity.controller';

import routing  from './dashboard.routes';

export default angular.module('ppApp.dashboard', [DashboardService, PatentsRestService, CalculateService, CostAnalysisService, TransactionHistoryService, CurrentTransactionsService]) //import dashboard view controllers
	.config(routing)
  	.controller('DashboardController', DashboardController)
  	.controller('AvailableActionsController', AvailableActionsController)
  	.controller('GraphDonutController', GraphDonutController)
  	.controller('FxChartController', FxChartController)
  	.controller('ActionCostController', ActionCostController)
  	.controller('RecentActivityController', RecentActivityController)
  	.name;
