app.factory('fxCalculateService', function(){

	return {
		
	}

	function patentFx(i) {

		vm.selectedPatent = vm.phaseArr[i];

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
    					vm.todaysPriceUSD = parseFloat(fees.subTotalEUR * todaysFx).toFixed(2);
    					vm.todaysPriceEUR = parseFloat(fees.subTotalEUR).toFixed(2);
    				}
    				// console.log(vm.todaysPriceUSD, dateArr, data)
    				//yesterday
    				// if(item == dateArr[1]) {
    				 if(item == dateArr[1]) {	
    					var yesterdayFx = data[index].rate;
    					vm.yesterdaysPriceUSD = parseFloat(fees.subTotalEUR * yesterdayFx).toFixed(2);
    					vm.yesterdaysPriceEUR = parseFloat(fees.subTotalEUR).toFixed(2);
    				}
    				//weekly
    				if(item == dateArr[7]) { 
    					var lastWeekFx = data[index].rate;
    					vm.lastWeeksPriceUSD = parseFloat(fees.subTotalEUR * lastWeekFx).toFixed(2);
    					vm.lastWeeksPriceEUR = parseFloat(fees.subTotalEUR).toFixed(2);
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
    					vm.lastMonthsPriceUSD = parseFloat(fees.subTotalEUR * lastMonthFx).toFixed(2);
    					vm.lastMonthsPriceEUR = parseFloat(fees.subTotalEUR).toFixed(2);
    				}
    			});

    			$timeout(function() {
    				var fwSaving = parseFloat(vm.todaysPriceUSD - vm.lastMonthsPriceUSD).toFixed(2);
    				if(fwSaving < 0) {
    					vm.variationSave = true;
    					vm.fourWeekVariation = fwSaving.toString().replace('-', '');
    				} else {
    					vm.variationSave = false;
    					vm.fourWeekVariation = fwSaving;
    				}		        				
    			}, 100);
    			
    		},
    		function(error){

    		}
		);

	} //function end

})