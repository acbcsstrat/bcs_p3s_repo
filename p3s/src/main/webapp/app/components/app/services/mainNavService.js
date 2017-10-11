app.factory('mainNavService', function(){
	
		var sections = [{
	      		name: 'Dashboard',
	      		type: 'link',
	      		state: 'dashboard',
	      		icon: 'fa fa-dashboard'
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
  			icon: 'fa fa-clipboard'
      	})

      	sections.push({
      		
      		name: 'Transactions',
      		type: 'toggle',
          icon: 'fa fa-credit-card',
      		pages: [
      			{
		            name: 'Current Transactions',
		            state: 'current-transactions',
		            type: 'link',
		        },
		        {
		            name: 'Transaction History',
		            state: 'transaction-history',
		            type: 'link',
		        }
	        ],
          icon: 'fa fa-credit-card'
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