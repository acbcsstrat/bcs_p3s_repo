import './_transactions.scss';

import angular from 'angular';

import TransactionService from './services/transactions.service.js';

import TransactionsController from './controllers/transactions.controller';

import routing  from './transactions.routes';

export default angular.module('ppApp.transactions', [TransactionService]) //import dashboard view controllers
	.config(routing)
  	.controller('TransactionsController', TransactionsController)
  	.name;