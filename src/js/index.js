// import "localScripts/config/config.js";
require("localScripts/js/config.js");
require("localScripts/js/polyfillers.js")

require("app/app.module.js");
require("app/app.config.js");
require("app/app.routes.js");

require('app/directives/app.dir.js');

require('app/directives/checkout.dir.js');
require('app/directives/current-transactions.transactions.dir.js');
require('app/directives/patents.list-patents.dir.js');
require('app/directives/user.dir.js');
require('app/directives/vendors/ngCart.directives.js');

require("app/services/app.calculate.serv.js");
require("app/services/app.chunkData.serv.js");
require("app/services/app.fx.serv.js");
require("app/services/app.fxCalculation.serv.js");
require("app/services/app.mainNav.serv.js");
require("app/services/app.timezone.serv.js");
require("app/services/checkout.bankTransferCommit.serv.js");
require("app/services/checkout.basket.serv.js");
require("app/services/dashboard.dashboard.serv.js");
require("app/services/dashboard.selectPhase.serv.js");
require("app/services/patents.patentPhases.serv.js");
require("app/services/patents.patents.serv.js");
require("app/services/patents.patentsRest.serv.js");
require("app/services/patents.searchPatent.serv.js");
require("app/services/transactions.transactionHistory.serv.js");
require("app/services/transactions.currentTransactions.serv.js");
require("app/services/user.user.serv.js");
require("app/services/vendors/ngCart.fulfilment.js");

require("app/controllers/checkout.bankTransferPrep.ctrl.js");
require("app/controllers/checkout.bankTransferSuccess.ctrl.js");
require("app/controllers/checkout.basket.ctrl.js");
require("app/controllers/core.core.ctrl.js");
require("app/controllers/core.mainNav.ctrl.js");
require("app/controllers/dashboard.colourKey.ctrl.js");
require("app/controllers/dashboard.dashboard.ctrl.js");
require("app/controllers/dashboard.fxChart.ctrl.js");
require("app/controllers/dashboard.graphDonut.ctrl.js");
require("app/controllers/dashboard.recentActivity.ctrl.js");
require("app/controllers/dashboard.renewalCost.ctrl.js");
require("app/controllers/dashboard.renewalsCarousel.ctrl.js");
require("app/controllers/patents.addPatent.ctrl.js");
require("app/controllers/patents.listPatents.ctrl.js");
require("app/controllers/patents.patentCostAnalysis.ctrl.js");
require("app/controllers/patents.patentInfo.ctrl.js");
require("app/controllers/patents.patentItem.ctrl.js");
require("app/controllers/patents.patentRenewals.ctrl.js");
require("app/controllers/patents.searchPatent.ctrl.js");
require("app/controllers/transactions.currentTransactionItem.ctrl.js");
require("app/controllers/transactions.currentTransactions.ctrl.js");
require("app/controllers/transactions.transactionHistory.ctrl.js");
require("app/controllers/transactions.transactionHistoryItem.ctrl.js");
require("app/controllers/user.userProfile.ctrl.js");