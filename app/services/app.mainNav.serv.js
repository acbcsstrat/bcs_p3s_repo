angular.module('ppApp').factory('mainNavService', mainNavService)

export default function mainNavService(){
	
		var sections = [{
  		name: 'Dashboard',
  		type: 'link',
  		state: 'dashboard',
  		icon: 'assets/imgs/icons/menu/menu_dashboard_icon.png'
		}];


  	sections.push({
  		name: 'Patents',
  		type: 'toggle',
  		pages: [
  			{
      		name: 'List Patents',
      		type: 'link',
      		state: 'patents',

			},
			{
				name: 'Add Patents',
				type: 'link',
				state: 'search-patent',

			}
		],
		icon: 'assets/imgs/icons/menu/menu_patent_icon.png'
  	})

  	sections.push({
  		
  		name: 'Transactions',
  		type: 'toggle',
  		pages: [
  			{
            name: 'Current',
            state: 'current-transactions',
            type: 'link',
        },
        {
            name: 'History',
            state: 'transaction-history',
            type: 'link',
        }
      ],
      icon: 'assets/imgs/icons/menu/menu_transaction_icon.png'
	})
     
     	// console.log(sections)

 	var self;

    return self = {
      sections: sections,

    	toggleSelectSection: function (section) {
      	self.openedSection = (self.openedSection === section ? null : section);
    	},
      	isSectionSelected: function (section) {
       		return self.openedSection === section;
      	},
      	selectPage: function (section, page) {
        	page && page.url && $location.path(page.url);
          self.currentSection = section;
          self.currentPage = page;
      	}
    };

};