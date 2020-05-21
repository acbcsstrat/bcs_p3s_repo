import angular from 'angular';

import TransactionsService from './services/transactions.service.js';

import TransactionsController from './controllers/transactions.controller';
import TransactionItemController from './controllers/transaction-item.controller';
import TransactionDetailsController from './controllers/transaction-item.details.controller';

export default angular.module('ppApp.transactions', [TransactionsService]) //import dashboard view controllers
  	.controller('TransactionsController', TransactionsController)
  	.controller('TransactionItemController', TransactionItemController)
  	.controller('TransactionDetailsController', TransactionDetailsController)
  	.name;