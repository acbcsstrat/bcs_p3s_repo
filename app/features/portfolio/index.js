import angular from 'angular';

import CasesRestService from './services/portfolio.cases.serv.js';
import SearchPatentService from './services/portfolio.search-patent.serv.js';

import PortfolioController from './controllers/portfolio.controller';

export default angular.module('ppApp.portfolio', [CasesRestService, SearchPatentService]) //import dashboard view controllers
  	.controller('PortfolioController', PortfolioController)
  	.name;