angular.module('ppApp').factory('fxCalculationService', fxCalculationService);

fxCalculationService.$inject = ['$q', '$timeout', 'fxService']

function fxCalculationService($q, $timeout, fxService) {

	return {

		currentFx: '',

		selectedPatent: '',

	    setFx: function(patent) {
	    	
			if(patent.feeUI) {

				this.selectedPatent = patent;

				var fxRateData = {};

				fxRateData.todaysPriceEUR = patent.feeUI.subTotalEUR;

				fxService.fetchFxWeek()
		    	.then(
		    		function(data){

		    			var dateArr = [];
		    			//weekly
		    			data.forEach(function(item){
		    				dateArr.push(item.rateActiveDate);
		    			});

		    			dateArr.sort(function(a, b){
		    				return a - b;
		    			});

		    			dateArr.forEach(function(item, index){

		    				if(item == dateArr[0]) {

		    					var todaysFx = data[index].rate;
		    					fxRateData.todaysFx = todaysFx;
		    					fxRateData.todaysPriceUSD = parseFloat(patent.feeUI.subTotalEUR * todaysFx).toFixed(2);
		    				}
		    				//yesterday
		    				 if(item == dateArr[1]) {	
		    					var yesterdayFx = data[index].rate;
		    					fxRateData.yesterdaysPriceUSD = parseFloat(patent.feeUI.subTotalEUR * yesterdayFx).toFixed(2);
		    				}
		    				//weekly
		    				if(item == dateArr[7]) { 
		    					var lastWeekFx = data[index].rate;
		    					fxRateData.lastWeeksPriceUSD = parseFloat(patent.feeUI.subTotalEUR * lastWeekFx).toFixed(2);
		    				}
		    			});

		    		},
		    		function(error){

		    		}
				);

				fxService.fetchFxMonth()
		    	.then(
		    		function(data){

		    			var tD = new Date();
		    			var lmD = tD.setMonth(tD.getMonth() - 1);
		    			var lastMonthD = new Date(lmD).getDay();
		    			var lastMonthDt = new Date(lmD).getDate();

		    			data.forEach(function(item, index){
		    				if((new Date(item.rateActiveDate).getDay() == lastMonthD) && (new Date(item.rateActiveDate).getDate() == lastMonthDt)) {
		    					var lastMonthFx = item.rate;
		    					fxRateData.lastMonthsPriceUSD = parseFloat(patent.feeUI.subTotalEUR * lastMonthFx).toFixed(2);
		    				}
		    			});

		    			$timeout(function(){

		    				var fwSaving = parseFloat(fxRateData.todaysPriceUSD - fxRateData.lastMonthsPriceUSD).toFixed(2);

		    				if(fwSaving < 0) {
		    					fxRateData.variationSave = true;
		    					fxRateData.fourWeekVariation = fwSaving.toString().replace('-', '');
		    				} else {	
		    					fxRateData.variationSave = false;
		    					fxRateData.fourWeekVariation = fwSaving;
		    				}

		    			}, 300)

		    			
		    		},
		    		function(error){

		    		}
				);

				this.currentFx = fxRateData;

		    } else {//if end
		    	this.currentFx = null;
		    } 
	    }, //factory end
	    getSelectedPatent: function() {
	    	return this.selectedPatent;
	    },

		getFx: function() {
			return this.currentFx;
		}

	}



}