angular.module('ppApp').service('fetchHelpService', fetchHelpService);

fetchHelpService.$inject = [];

function fetchHelpService() {

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
					title: 'Portfolio',
					info: [
						{
							title: 'Portfolio page',
							content: 'From this page you can add patents and view them in the Portfolio table. The concept of the Portfolio page is to be able to access all Patent Details and available European actions from a single  location. A user can select a patent  from the Portfolio table, which will display all relevant content below in the Case Overview panel'
						}
					]
				},
				{ 
					index: 1, 
					title: 'List Patents',
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
							title: 'Case Overview',
							content: 'This column displays what action is available for each application. (Renewal, Generate Form 1200, No Action Available.)'
						}
					]
				},
				{ 
					index: 2, 
					title: 'Add Patent',
					info: [
						{
							title: 'Adding a patent',
							content: 'Users can add patents by providing the EP Application number. Please ensure the check digit is correct while adding the patent.'
						}
					]					
				},
				{ 
					index: 3, 
					title: 'Case Overview',
					info: [
						{
							title: 'Case Overview',
							content: 'This panel provides the user with all informatin relevant to the patent selected from the Portoflio table. From this panel the user can access basic details, notification settings, fee breakdown and any functions required for processing a European action. \n From here the user can also add the action to the basket or remove the patent from the system'
						},
						{
							title: 'Notifications',
							content: 'Patent Place provide notifications via email. The user can configure when they receive these notifications via the Case Overview, though default notification settings are initially applied when the patent is added to the system. Notiications are there to help users keep track of what stage of a color phase the european action is at.'
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
					]	
				}
			]
		},
		{
			category: 'Transactions',
			titles: [
				{
					index: 0,
					title: 'Current transactions',
					info: [
						{

							title: 'Current transactions',
							content: 'This displays the details of all ongoing transactions. Once a individial item is completed, the relevant documents will be available to download when a transaction has been selected from the table.'
						}
					]
				},
				{
					index: 1,
					title: 'Transaction history',
					info: [
						{	
							title: 'Transaction History',
							content: 'This displays the details of all completed or failed transactions. All relevant doucments will be available for download when a transaction has been selected from the table.'
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
					title: 'No. of Actions',
					info: [
						{						
							title: 'No. of Actions',
							content: 'This shows how many European actions were inlcuded in a single transaction.'
						}
					]
				},
				{
					index: 4,
					title: 'Trans Initiated',
					info: [
						{						
							title: 'Trans Initiated',
							content: 'The date the transaction was inititated.'
						}
					]
				},
				{
					index: 5,
					title: 'Cost',
					info: [
						{
							title: 'Cost',
							content: 'This column displays the total cost of the transaction.'
						}
					]
				},
				{
					index: 6,
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
					title: 'Action Cost',
					info: [
						{
							title: 'Action Cost',
							content: 'The cost of an action depending on the FX varitaions for the selected time period can be viewed in this panel which is displayed when a user selects an item from the \'Actions available\' table.'

						}
					]
				},
				{
					index: 2,
					title: 'Recent Activity',
					info: [
						{
							title: 'Recent Activity',
							content: 'This widget displays a list of actions that have transititioned into a new colour phase or a transaction that has been initiated in the last 48 hours.'

						}
					]
				},
				{
					index: 3,
					title: 'Total Patents',
					info: [
						{
							title: 'Total Patents',
							content: 'This widget helpfully displays the total number of patents in the portfolio, and indicating how mnay are in each color phase. Hovering over the colored segments in donut chart displays how many patents are in that color phase.'

						}
					]
				},
				{
					index: 4,
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