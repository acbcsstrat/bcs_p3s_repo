angular.module('ppApp').factory('patentPhasesService', patentPhasesService);

patentPhasesService.$inject = ['$timeout', '$q', '$rootScope', 'calculateService', 'patentsRestService', 'organiseTextService']

function patentPhasesService($timeout, $q, $rootScope, calculateService, patentsRestService, organiseTextService) {
	
	var factory = {
		sortPatentNumbers: sortPatentNumbers,
		patentNumbers: '',
		setPatents: setPatents,
		getIndex: '',
		getPatents: '',
		setPatent: setPatent,
		getPatent: ''
	};

		var obj = {
			Green: [],
			Amber: [],
			Red: [],
			Blue: [],
			Black: [],
			Grey: []
		}

		var phase;

		function sortPatentNumbers(patents)	 {

				for(var property in obj) {
					if(obj.hasOwnProperty(property)){
						if(Array.isArray(obj[property])) {
							obj[property].length = 0;
						} else {
							obj[property] = 0; //for totoal obj.Total
						}
						
					}
				}			

				if((Array.isArray(patents) && patents.length === 0) || patents === null) {
					setPatents(null)
					return;
				}

				obj.Total = patents.length;

				for(var i = 0; i < patents.length; i++) {
					
					var item =  patents[i].serviceList;

					if(item.length !== 0) {
						obj[item[0].currentStageColour].push(patents[i]);
					} else {
						obj.Grey.push(patents[i]);
					}
				}

				factory.patentNumbers = obj;

				for(var property in obj) {
					if(obj.hasOwnProperty(property)) {

						if(obj[property].length > 0) {
							if(obj[property][0].serviceList.length === 0) {
								phase = 'Grey'
							}
							if(obj[property][0].serviceList.length > 0) {
								phase = obj[property][0].serviceList[0].currentStageColour;
							}
							break;
						}
					}
				}	
				

				setPatents(phase)

			
		}

		function setPatents(phase){

			if(phase === null) {
			    factory.getPatents = '';
				factory.getPatent = '';
				return;
			}

			var patents;

			if(phase == 'Green') factory.getIndex = 0;
			if(phase == 'Amber') factory.getIndex = 1;
			if(phase == 'Red') factory.getIndex = 2;
			if(phase == 'Blue') factory.getIndex = 3;
			if(phase == 'Black') factory.getIndex = 4;
			if(phase == 'Grey') factory.getIndex = 5;

			for(var property in obj) {
				if(obj.hasOwnProperty(property)){
					patents = obj[phase];
					if(patents.length > 0) {
						if(patents[0].serviceList.length === 0) {
							factory.getPatents = '';
						} else {
							factory.getPatents = patents;
							factory.getPatent = patents[0].serviceList[0];
						}
					} else {
						factory.getPatents = '';
						factory.getPatent = '';
					}
				}
			}

		}

		function setPatent(patent) {
			if(patent.serviceList.length > 0) {
				patent.serviceList[0].id = patent.id;
				factory.getPatent = patent;
			} else {
				factory.getPatent = '';
			}

			
		}


	return factory;

}