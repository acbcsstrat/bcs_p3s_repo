import '../transactions/_transactions.scss';

import angular from 'angular';

import TransactionService from '../transactions/services/transactions.service.js';

import TransactionItemController from './controllers/transaction.item.controller';

import routing  from './transaction-item.routes';

export default angular.module('ppApp.transactionitem', [TransactionService]) //import dashboard view controllers
	.config(routing)
  	.controller('TransactionItemController', TransactionItemController)
  	.name;