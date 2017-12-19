app.factory('mainNavService', function(){
	
		var sections = [{
	      		name: 'Dashboard',
	      		type: 'link',
	      		state: 'dashboard',
	      		icon: 'p3sweb/assets/imgs/icons/menu/menu_dashboard_icon.png'
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
  			icon: 'p3sweb/assets/imgs/icons/menu/menu_patent_icon.png'
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
          icon: 'p3sweb/assets/imgs/icons/menu/menu_transaction_icon.png'
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

        // function sortByHumanName(a, b) {
        //   return (a.humanName < b.humanName) ? -1 :
        //     (a.humanName > b.humanName) ? 1 : 0;
        // }

})