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
					title: 'List Patents',
					info: [
						{
							title: 'Client Ref',
							content: 'This is a user defined reference allowing for easier portfolio management. These can be altered at any time'
						},
						{
							title: 'Add Patent',
							content: 'This shows the current colour stage of the application and the stage it will changing to. The cost of filing in these stages is displayed'
						},
						{
							title: 'Case Overview',
							content: 'This column displays what action is available for each application. (Renewal, Generate Form 1200, No Action Available.)'
						}
					]
				},
				{ 
					index: 1, 
					title: 'Add Patent',
					info: [
						{
							title: 'Cliasdfasdent Ref',
							content: 'This is  any time'
						},
						{
							title: 'Add Patasdfent',
							content: 'This snd the stage it will changing to. The cost of filing in these stages is displayed'
						},
						{
							title: 'Case Oversdfgsaaaaview',
							content: 'This colation. (Renewal, Generate Form 1200, No Action Available.)'
						}
					]					
				},
				{ 
					index: 2, 
					title: 'Case Overview',
					info: [
						{
							title: 'Cliasdfasdent Ref',
							content: 'This iaence allowing for easier portfolio management. These can be altered at any time'
						},
						{
							title: 'Add Patasdfasdfasdfent',
							content: 'Thisasdfasdf showasdfs the current cohe cost of filing in these stages is displayed'
						},
						{
							title: 'Case Oversdfgsaaaaview',
							content: 'This coasdfanewal, Generate Form 1200, No Action Available.)'
						}
					]	
				}
			]
		},
		{	
			category: 'User Profile',
			titles: [
				{ 
					index: 0, 
					title: 'User',
					info: [
						{
							title: 'Client Ref',
							content: 'This is a  altered at any time'
						},
						{
							title: 'Add Patent',
							content: 'This shhese stages is displayed'
						},
						{
							title: 'Case Overview',
							content: 'Thisction Available.)'
						}
					]
				},
				{ 
					index: 1, 
					title: 'Notifications',
					info: [
						{
							title: 'Cliasdfasdent Ref',
							content: 'd at any time'
						},
						{
							title: 'Add Patasdfent',
							content: 'This showasdfs the current cosdfgsdgflour stage of the application and the stage it will changing to. The cost of filing in these stages is displayed'
						},
						{
							title: 'Case Oversdfgsaaaaview',
							content: 'This colaaaaaaaaaumn displays what action is available for each application. (Renewal, Generate Form 1200, No Action Available.)'
						}
					]					
				},
				{ 
					index: 2, 
					title: 'Company',
					info: [
						{
							title: 'Cliasdfasdent Ref',
							content: 'This iasdfasdfs aasdfasfd user defined reference allowing for easier portfolio management. These can be altered at any time'
						},
						{
							title: 'Add Patasdfasdfasdfent',
							content: 'Thisasdfasdf showasdfs the current cosdfgsdgflour stage of the application and the stage it will changing to. The cost of filing in these stages is displayed'
						},
						{
							title: 'Case Oversdfgsaaaaview',
							content: 'This coasdfasdfasdfaslaaaaaaaaaumn displays what action is available for each application. (Renewal, Generate Form 1200, No Action Available.)'
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