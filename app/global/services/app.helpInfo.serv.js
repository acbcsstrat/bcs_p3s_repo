export default angular.module('services.helpinfo-service', []).service('FetchHelpService', FetchHelpService).name;

FetchHelpService.$inject = [];

function FetchHelpService() {

	var factory = {
		getSelectedInformation: getSelectedInformation,
		getAllInformation: getAllInformation
	}

	var helpList = [
		{	
			category: 'Portfolio',
			titles: [
				{
					index: 0, 
					title: 'What is the portfolio?',
					info: [
						{
							title: 'Portfolio page',
							content: 'From this page you can add patents and view them in the Portfolio table. The concept of the Portfolio page is to be able to access all Patent Details and available European actions from a single  location. A user can select a patent  from the Portfolio table, which will display all relevant content below in the case-overview panel'
						}
					]
				},
				{ 
					index: 1, 
					title: 'Portfolio table',
					info: [
						{
							title: 'Client Ref',
							content: 'This is a user defined reference allowing for easier portfolio management. These can be altered at any time.'
						},
						{
							title: 'Client Description',
							content: 'This is intended for users to provide a short description of the invention, typically a shortended version of the application title.'
						},
						{
							title: 'European Action',
							content: 'This value indicates to user what European action is available for the patent.'
						},
						{
							title: 'Patent Place Status',
							content: 'This is a status assigned by Patent Place that indicates the current progress of a European action and what features are or are not available. If the European action has been committed to a transaction via Patent Place then a it will display a transactional status.'
						},													
						{
							title: 'European action (EP formality)',
							content: 'This column displays what European action is available for each European patent case. (Renewal, Euro-PCT, Grant, Validation). If the application has been validated and/or there are no more actions available, this will be signifed by the symbols \'----\''
						},
						{
							title: 'Current and next phases',
							content: 'If the window for an EP formality has opened and an action is available, Patent Place will provide the current and next color phase, including the costs. Some EP formalities require steps to be taken to be able to view the phases and their costs. For example, a validation order requires the user to request a quote, providing the states in which they wish to validate the patent.'
						}						
					]
				},
				{ 
					index: 2, 
					title: 'Adding patent applications',
					info: [
						{
							title: 'Adding patent applications',
							content: 'To add a patent, click the add symbol on the portfolio page and enter the required EP Application number (please ensure the check digit is correct while adding the patent). Upon search, the system will provide you with the Euopean patent case, where you have the option to add a client reference and/or description '
						}
					]					
				},
				{ 
					index: 3, 
					title: 'Case-overview',
					info: [
						{
							title: 'Case-overview',
							content: 'This panel provides the user with all informatin relevant to the patent selected from the Portoflio table. From this panel the user can access basic details, notification settings, fee breakdown and any functions required for processing a European action.  From here the user can also add the action to the basket or remove the patent from the system'
						},
						{
							title: 'Notifications',
							content: 'Patent Place provide notifications via email. The user can configure when they receive these notifications via the Case-overview, though default notification settings are initially applied when the patent is added to the system. Notiications are there to help users keep track of what stage of a color phase the european action is at.'
						},
						{
							title: 'Renewal History',
							content: 'This tab provides the history of renewals that have been processed via The Patent Place. All relevant documents such as the Renewal certificate, receipt and invoice are avaiable for download.'
						},
						{
							title: 'Cost Chart',
							content: 'The cost chart illustrates the cost of a European action at the various color phases. The total cost can vary depending on FX fluctuation, color phase and EPO fees. Hovering over the chart displays the cost and due date.'
						},
						{
							title: 'FX Chart',
							content: 'This chart shows the price variation depending on FX rate for the last 7 weeks. Hovering over the chart shows the total transaction cost on that day.'
						},
						{
							title: 'Fee Breakdown',
							content: 'This displays the breakdown of the total cost, split between the official EPO fees and Patent Place fees. It also provides further details relevant to the action such as the current color phase, next color phase, how much money can be saved by processing the action now and when the deadline is.'
						},
						{
							title: 'EP formality tabs',
							content: 'Dynamic tabs are provided witih varying information and tools, depending on the progress of the European patent application, and the status of the oustanding European patent formality. The purpose of these tabs are to help prepare instructions for either Grant (rule 71(3)), European phase entry (Form 1200) or validation.'
						},						
					]	
				}
			]
		},
		{
			category: 'Transactions',
			titles: [
				{
					index: 0,
					title: 'Transaction list',
					info: [
						{
							title: 'Transaction list',
							content: 'All transactions whether current or historic are available from one location under the transactions page. If required, to help filter and find a specific transaction, users are provided with filtering and sorting tools in the transaction table. If you would like find further information on a transaction, such as the fee breakdown, select one of the transactions from the table and a transaction overview modal will be displayed. Any invoices or other documents, such as receipts from the EPO, can be found in the transaction overview panel, where they can be downloaded and printed off.'
						}
					]
				},
				{
					index: 2,
					title: 'Transaction ID',
					info: [
						{						
							title: 'Transaction ID',
							content: 'A Patent Place assigned unique ID for each transaction.'
						}
					]
				},
				{
					index: 3,
					title: 'Trans Initiated',
					info: [
						{						
							title: 'Trans Initiated',
							content: 'The date the transaction was inititated.'
						}
					]
				},
				{
					index: 4,
					title: 'Cost',
					info: [
						{
							title: 'Cost',
							content: 'This column displays the total cost of the transaction.'
						}
					]
				},
				{
					index: 5,
					title: 'Trans Status',
					info: [
						{
							title: 'Trans Status',
							content: 'The Patent Place assigns a status to help users keep track of progress of transactions.'
						}
					]
				}	
			]
		},
		{
			category: 'Dashboard',
			titles: [
				{
					index: 0,
					title: 'Actions available',
					info: [
						{
							title: 'Actions available',
							content: 'This widget displays all patents that have an European action availale tp process. Clicking on these items will display further details of the cost in the \'Action cost\' widget.'

						}
					]
				},
				{
					index: 1,
					title: 'EP Formality totals',
					info: [
						{
							title: 'EP Formality totals',
							content: 'Patent Place provide pie charts to help summarize each EP formality type, representing the total formalities in each color phase.'

						}
					]
				},
				{
					index: 2,
					title: 'FX Chart',
					info: [
						{
							title: 'FX Chart',
							content: 'The FX chart displays a months history of daily foreign exchange rates of USD to EUR provided by Money Corp.'

						}
					]
				}

			]
		},
		{	
			category: 'Account',
			titles: [
				{ 
					index: 0, 
					title: 'Email Notifications',
					info: [
						{
							title: 'Email Notifications',
							content: 'Users can turn notifications on or off via the switch. Turning them off results in no notifciation emails being sent when European actions are transitioning through the colour phases.'
						}
					]					
				},
				{ 
					index: 1, 
					title: 'Company Users',
					info: [
						{
							title: 'Company Users',
							content: 'The is a list of all users registered to the company.'
						},
					]
				},
				{ 
					index: 2, 
					title: 'Account Details',
					info: [
						{
							title: 'Account Details',
							content: 'This page displays both user and business details provided by the user when registering. The fields that are edtiable are indidcated by an edit icon in the input field.'
						}
					]	
				},
				{ 
					index: 3, 
					title: 'Business Address',
					info: [
						{
							title: 'Business Address',
							content: 'This page displays both user and business details provided by the user when registering. The fields that are edtiable are indidcated by an edit icon in the input field.'
						}
					]	
				},
				{ 
					index: 4, 
					title: 'Billing Address',
					info: [
						{
							title: 'Billing Address',
							content: 'This segment displays the company account billing address. These fields are editable.'
						}
					]	
				}				
			]
		}			

	]

	function getAllInformation() {
		return helpList;
	}

	function getSelectedInformation(cat, item) {

		var index = helpList.findIndex(function(elem){
			return elem.category === cat;
		})

		var info = helpList[index].titles.find(function(elem){
			return elem.index === item;
		})

		return info

	}

	return factory;

}