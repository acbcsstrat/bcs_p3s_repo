// import "localScripts/config/config.js";
require("localScripts/js/config.js");
require("localScripts/js/polyfillers.js")

require("app/app.module.js");
require("app/app.config.js");
require("app/app.routes.js");

require("app/directives/app.dir.js");
require("app/directives/form1200.dir.js");
require("app/directives/checkout.dir.js");
require("app/directives/current-transactions.transactions.dir.js");
require("app/directives/patents.list-patents.dir.js");
require("app/directives/user.dir.js");
require("app/directives/transactions.dir.js");
require("app/directives/patents.search-patent.dir.js");
require("app/directives/portfolio.nav.dir.js");
require('app/directives/vendors/ngCart.directives.js');
require('app/directives/avatar.dir.js');
require('app/directives/mobile-redirect.dir.js');
require('app/directives/select-avatar.dir.js');
require('app/directives/open-help.dir.js');
require('app/directives/help-panel.dir.js');
require("app/directives/help-panel-group.dir.js");

require("app/directives/vendors/ngCart.directives.js");
require("app/services/app.core.serv.js");
require("app/services/app.organiseText.serv.js");
require("app/services/app.organiseColour.serv.js");
require("app/services/app.calculate.serv.js");
require("app/services/app.chunkData.serv.js");
require("app/services/app.fx.serv.js");
require("app/services/app.fxCalculation.serv.js");
require("app/services/app.mainNav.serv.js");
require("app/services/app.timezone.serv.js");
require("app/services/app.CostAnalysis.serv.js")
require("app/services/app.helpInfo.serv.js");
require("app/services/checkout.bankTransferCommit.serv.js");
require("app/services/checkout.basket.serv.js");
require("app/services/dashboard.dashboard.serv.js");
require("app/services/patent.euroPct.serv.js");
require("app/services/europct.form1200.serv.js");
require("app/services/patents.patentPhases.serv.js");
require("app/services/patents.patents.serv.js");
require("app/services/patents.patentsRest.serv.js");
require("app/services/patents.searchPatent.serv.js");
require("app/services/renewal.renewalRest.serv.js")
require("app/services/transactions.transactionHistory.serv.js");
require("app/services/transactions.currentTransactions.serv.js");
require("app/services/user.user.serv.js");
require("app/services/vendors/ngCart.fulfilment.js");
require("app/services/app.uploadAvatar.serv.js");
require("app/services/grant.serv.js");

require("app/controllers/checkout.bankTransferPrep.ctrl.js");
require("app/controllers/checkout.bankTransferSuccess.ctrl.js");
require("app/controllers/checkout.basket.ctrl.js");
require("app/controllers/core.core.ctrl.js");
require("app/controllers/dashboard.dashboard.ctrl.js");
require("app/controllers/dashboard.fxChart.ctrl.js");
require("app/controllers/dashboard.graphDonut.ctrl.js");
require("app/controllers/dashboard.recentActivity.ctrl.js");
require("app/controllers/dashboard.action-cost.ctrl.js");
require("app/controllers/dashboard.actions-available.ctrl.js");
require("app/controllers/europct.form1200.ctrl.js");
require("app/controllers/grant.ctrl.js");// !!!!!!! GRANT TEST DATA
require("app/controllers/grant-ready.ctrl.js");// !!!!!!! GRANT TEST DATA
require("app/controllers/europct.form1200generated.ctrl.js");
require("app/controllers/portfolio.ctrl.js");
require("app/controllers/patents.addPatent.ctrl.js");
require("app/controllers/patents.searchPatent.ctrl.js");
require("app/controllers/renewal.renewalHistory.ctrl.js");
require("app/controllers/transactions.currentTransactionItem.ctrl.js");
require("app/controllers/transactions.currentTransactions.ctrl.js");
require("app/controllers/transactions.transactionHistory.ctrl.js");
require("app/controllers/transactions.transactionHistoryItem.ctrl.js");
require("app/controllers/user.userProfile.ctrl.js");

require("app/controllers/fee-breakdown.ctrl.js")
require("app/controllers/fxchart.ctrl.js")
require("app/controllers/costchart.ctrl.js")
require("app/controllers/notifications.ctrl.js")
require("app/controllers/patent.case-overview.ctrl.js");
require("app/controllers/patent.details.ctrl.js");

require("app/services/notification.serv.js");
require("app/services/activeTab.serv.js")

require("app/components/core.mainNav.comp.js");
require("app/components/core.caseoverviewNav.comp.js");
require("app/components/transactions.transNav.comp.js");