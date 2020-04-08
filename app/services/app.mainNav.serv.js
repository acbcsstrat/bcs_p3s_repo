angular.module('ppApp').factory('mainNavService', mainNavService)

function mainNavService(){
	
		var sections = [{
  		name: 'Dashboard',
  		type: 'link',
  		state: 'dashboard',
  		icon: 'far fa-tachometer-alt'
		}];    
  	sections.push({
  		name: 'Portfolio',
  		type: 'link',
      state: 'portfolio',
		  icon: 'far fa-folders'
    })

  	sections.push({
  		
  		name: 'Transactions',
  		type: 'link',
      state: 'transactions',
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