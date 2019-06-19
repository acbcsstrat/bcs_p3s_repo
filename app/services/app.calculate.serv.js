angular.module('ppApp').factory('calculateService', calculateService);

calculateService.$inject = ['$q', '$timeout', 'patentsRestService', 'fxService'];

function calculateService($q, $timeout, patentsRestService, fxService) {

	var factory = {
		calculateHours: calculateHours,
		recentActivity: recentActivity
	};

	return factory;

	function calculateHours(costband, response) {

		var date = new Date().getTime();
		var hours = '';

        switch(costband) {
            case 'Green':
            	hours =  date - response.greenStartDate;
			break;
			case 'Amber':
				hours =  date - response.amberStartDate;
			break;
			case 'Red':
				hours =  date - response.redStartDate;
			break;
			case 'Blue':
				hours =  date - response.blueStartDate;
			break;
			case 'Black':
				if(data.renewalStatus == 'Show price') {
					hours =  date - response.blackStartDate;
				} 							
		} //switch end

		return hours;		
	}

	function recentActivity(millisec) {
		
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

        if (hours !== '' && hours < 48) { //if within 48 hours
            return true;
        }

    } //recentActivity end

}