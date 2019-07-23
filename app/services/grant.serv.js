angular.module('ppApp').factory('grantService', grantService);

grantService.$inject = ['$http', '$q', '$timeout'];

function grantService($http, $q, $timeout){

	var factory = {};
		
	factory.prepareOrder = function() {
		
	 	var deferred = $q.defer();

  		setTimeout(function() {
	      	deferred.resolve('Hello, ' + 'name' + '!');
	  	}, 500);

	  	return deferred.promise;

	};



	factory.fetchQuestions = function() {

		var questions = [
			{
				index: 0,
				category: 'amendments',
				number: 'Q.1',
				title: 'Have any significant amendments been made to the application?',
				cannotProceedMsg: 'Because all additional page fees have not been paid we can\'t process it automatically. If you confirm that not all aditional page fees have not been paid you be re-directed for manual processing.'
			},
			{
				index: 1,
				category: 'claimFees',
				number: 'Q.2',
				title: 'Are there any outstanding claims fees?',
				cannotProceedMsg: 'Because all additional claim fees have not been paid we can\'t process it automatically. If you contact us: : support@ip.place, we\'ll be able to help offline.'				
			},
			{
				index: 2,
				category: 'addPages',
				number: 'Q.3',
				title: 'Are there any outstanding additional page fees?',
				cannotProceedMsg: 'Because amendments have been made to the application we can\'t process it automatically. If you contact us: : support@ip.place, we\'ll be able to help offline.'
			},
			{
				index: 3,
				category: 'notifyValidation',
				number: 'Q.4',
				title: 'Do you want to be notified when the validaiton window opens?',
				cannotProceedMsg: ''
			},					
		]

	 	var deferred = $q.defer();

  		setTimeout(function() {
  			deferred.resolve(questions);
  		}, 300)

		return deferred.promise;

	};

	

	return factory;

}