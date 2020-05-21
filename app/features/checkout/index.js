import angular from 'angular';

import BankTransferCommit from './services/checkout.bank-transfer-commit.serv.js';
import BasketService from './services/checkout.basket.serv.js';

import BasketController from './controllers/checkout.basket.controller';
import BankTransferPrepController from './controllers/checkout.bank-transfer-prep.controller';
import BankTransferSuccessController from './controllers/checkout.bank-transfer-success.controller';

export default angular.module('ppApp.checkout', [BankTransferCommit, BasketService])
	.controller('BasketController', BasketController)	
	.controller('BankTransferPrepController', BankTransferPrepController)
	.controller('BankTransferSuccessController', BankTransferSuccessController)
	.name