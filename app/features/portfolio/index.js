import './_portfolio.scss';

import angular from 'angular';

import PatentsRestService from '../../services/patents.patentsRest.serv.js';
import SearchPatentService from './services/portfolio.search-patent.serv.js';

import PortfolioController from './controllers/portfolio.controller';

import routing  from './portfolio.routes';

export default angular.module('ppApp.portfolio', [PatentsRestService, SearchPatentService]) //import dashboard view controllers
	.config(routing)
  	.controller('PortfolioController', PortfolioController)
  	.name;