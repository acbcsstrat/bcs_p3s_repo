app.factory('calculationsService', function(){

	var factory = {};


		factory.millsToHours = function(millisec) {

	        var seconds = (millisec / 1000).toFixed(0);
	        var minutes = Math.floor(seconds / 60);
	        var hours = "";

	        if (minutes > 59) {
	            hours = Math.floor(minutes / 60);
	            hours = (hours >= 10) ? hours : "0" + hours;
	            minutes = minutes - (hours * 60);
	            minutes = (minutes >= 10) ? minutes : "0" + minutes;
	        }

	        seconds = Math.floor(seconds % 60);
	        seconds = (seconds >= 10) ? seconds : "0" + seconds;

	        if (hours < 48) {
	            return true;
	        }

	    }
	    
	    factory.calcProgress = function(start, end){

	    	var today = new Date().getTime();

			var total = end - start;
			var progress = today - start;

			return Math.round(((progress) / (total)) * 100);
	    }

		factory.recentActivity = function(item, millisec) {

	        var seconds = (millisec / 1000).toFixed(0);
	        var minutes = Math.floor(seconds / 60);
	        var hours = "";

	        if (minutes > 59) {
	            hours = Math.floor(minutes / 60);
	            hours = (hours >= 10) ? hours : "0" + hours;
	            minutes = minutes - (hours * 60);
	            minutes = (minutes >= 10) ? minutes : "0" + minutes;
	        }

	        seconds = Math.floor(seconds % 60);
	        seconds = (seconds >= 10) ? seconds : "0" + seconds;

	        if (hours < 48) {
	            vm.recentStageArr.push(item);
	        }
		}

	

	return factory;


})