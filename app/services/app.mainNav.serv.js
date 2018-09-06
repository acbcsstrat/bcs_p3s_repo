angular.module('ppApp').factory('mainNavService', mainNavService)

function mainNavService(){
	
		var sections = [{
  		name: 'Dashboard',
  		type: 'link',
  		state: 'dashboard',
  		icon: 'assets/imgs/icons/menu/menu_dashboard_icon_sm.png'
		}];

    // sections.push({
    //   name: 'Portfolio',
    //   type: 'link',
    //   state: 'portfolio',
    //   icon: 'assets/imgs/icons/menu/menu_portfolio_icon_sm.png'
    // })    
    // sections.push({
    //   name: 'EPE',
    //   type: 'toggle',
    //   pages: [
    //     {
    //       name: 'Form 1200 Generator',
    //       type: 'link',
    //       state: 'epeForm'
    //     }
    //   ],
    //   icon: 'assets/imgs/icons/menu/menu_erp_icon_sm.png'
    // })        
  	sections.push({
  		name: 'Renewals',
  		type: 'toggle',
  		pages: [
  			{
      		name: 'List Patents',
      		type: 'link',
      		state: 'patents'
		    },
		    {
				  name: 'Add Patent',
				  type: 'link',
				  state: 'search-patent'
		    }
		  ],
		  icon: 'assets/imgs/icons/menu/menu_patent_icon_sm.png'
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
      icon: 'assets/imgs/icons/menu/menu_transaction_icon_sm.png'
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