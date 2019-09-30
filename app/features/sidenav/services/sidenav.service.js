export default angular.module('services.sidenav', []).factory('SidenavService', SidenavService).name;

function SidenavService(){
	
		var sections = [{
  		name: 'Dashboard',
  		type: 'link',
  		state: 'dashboard',
  		icon: 'far fa-tachometer-alt'
		}];    
  	sections.push({
  		name: 'Portfolio',
  		type: 'toggle',
  		pages: [
  			{
      		name: 'Portfolio',
      		type: 'link',
      		state: 'portfolio'
		    },
		    {
				  name: 'Add Patent',
				  type: 'link',
				  state: 'search-patent'
		    }
		  ],
		  icon: 'far fa-folders'
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
      icon: 'far fa-money-check-alt'
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