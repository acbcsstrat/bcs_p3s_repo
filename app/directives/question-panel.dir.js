angular.module('ppApp').directive('questionPanel', questionPanel);

questionPanel.$inject = ['$rootScope', '$timeout', 'form1200Service', 'grantService'];

function questionPanel($rootScope, $timeout, form1200Service, grantService) {

	return {
		restrict: 'EA',
		scope: true,
		controller: ['$scope', function($scope) {


			var animateLeft, slideLeft, actionService; //REQUIRED FOR SLIDER
			var newIndex = 0; //REQUIRED FOR SLIDER
			var currentIndex = 0; //REQUIRED FOR SLIDER
			var groupResult = document.getElementsByClassName("question-slide-group"); //REQUIRED FOR SLIDER
			var slideResult = document.getElementsByClassName("question-slide"); //REQUIRED FOR SLIDER
			var questionReachedIndex = 0; //TRACKS THE HIGHEST INDEX
			$scope.questionCount = 1; //REQUIRED FOR QUESTION TITLE IN VIEW
			$scope.buttons = [];
			$scope.nextBtnDisabled = true;
			$scope.firstQ = true;
			$scope.lastQ = false;
			$scope.questions = '';

            function checkValidity(value) {
            	if(value === true) {
            		return true;
            	}
            	return false;
            }

            $scope.nextElement = function () {

			    if (angular.element(groupResult).is(':animated')) {  
			      	return;
			    }
			    newIndex += 1;   

                if ($scope.questions[newIndex]) { //if array item exists
                    $scope.selectQuestion(newIndex);
                } else {
                    newIndex -= 1; //undo the increment
                }
            }

            $scope.prevElement = function () {
			    if (angular.element(groupResult).is(':animated')) {  
			      	return;
			    } 
			    newIndex -= 1;         	
                if ($scope.questions[newIndex]) {
                    $scope.selectQuestion(newIndex);
                } else {
                    newIndex += 1;
                }
            }


			$scope.selectQuestion = function(index) { //REQUIRED OR ANIMATION OF QUESTIONS

				newIndex = index;
				var question =  $scope.questions[newIndex];
				$scope.questionCount = (newIndex + 1);

				if(questionReachedIndex < newIndex) { //UPDAE THE HIGHEST INDEX POINT REACHED
					questionReachedIndex++
				}

				if(checkValidity(question.valid)) {
					$scope.nextBtnDisabled = false; //DISABLE NEXT BTN IF ANSWER IS NOT VALID
				} else {
					$scope.nextBtnDisabled = true;
				}

				for(var i = 0; i < $scope.buttons.length; i ++) { //DISABLED PROCEEDING Q LINKS
					if(i <= questionReachedIndex) {
						$scope.buttons[i].disabled = false;
					} else {
						$scope.buttons[i].disabled = true;
					}
				}

				if(newIndex === 0) {
					$scope.firstQ = true;
					$scope.lastQ = false;
				} else if(newIndex === $scope.questions.length - 1) {
					$scope.lastQ = true;
					$scope.firstQ = false;
				} else {
					$scope.firstQ = false;
					$scope.lastQ = false;
				}

			    if (angular.element(groupResult).is(':animated') || currentIndex === newIndex) {  
			      	return;
			    }

			    if (newIndex > currentIndex) {   // If new item > current
			      	slideLeft = '100%';            // Sit the new slide to the right //not the slides that animate, its the group as a whole
			      	animateLeft = '-100%';         // Animate the current group to the left
			    } else {                         // Otherwise
			      	slideLeft = '-100%';           // Sit the new slide to the left
			      	animateLeft = '100%';          // Animate the current group to the right
			    }

			    angular.element(slideResult).eq(newIndex).css( {left: slideLeft, display: 'block'} );
				angular.element(groupResult).animate({
					"left": animateLeft
				}, function(){

				    angular.element(groupResult).css( {left: animateLeft})
			      	angular.element(slideResult).eq(currentIndex).css( {display: 'none'} ); // Hide previous slide      
			      	angular.element(slideResult).eq(newIndex).css( { left: 0 } ); // Set position of the new item
			      	angular.element(groupResult).css( {left: 0} );               // Set position of group of slides
			      	currentIndex = newIndex;               // Set currentIndex to the new image

				})

			}


	      	$scope.submitFormData = function(service){
	        	$rootScope.$emit(service, {data: $scope.formData, service: service});
	      	};			

			this.service = '';

			this.setService = function(value) {
				if(value === 'grantService') { 
					this.service = 'grantquestions'; 
					$scope.questions = grantService.getQuestions();
				}
				if(value === 'form1200Service') { 
					this.service = 'form1200questions'; 
					$scope.questions = form1200Service.getQuestions() 
				}
			}

			this.isOptionValid = function(value, item) { //INVOKED FROM PANEL CONTENT
				if(value === undefined || typeof value === 'undefined' || value === false) {
					$scope.nextBtnDisabled = true; //DISABLE NEXT BTN 
					$scope.questions[item.index].valid = false;
				} else {
					$scope.nextBtnDisabled = false;
					$scope.questions[item.index].valid = true;
				}
			}

			this.initalSelect = $scope.selectQuestion; //USED FOR INITAL LOAD

			this.createButtons = function(question) {
				var counter = $scope.buttons.length;
				$scope.questions[counter].index = counter;
				$scope.buttons.push({
					index: counter,
					disabled: true
				})
			}

		    this.formData = {};

		    $scope.formData = this.formData; //expose formData to scope so view can add from properties to model 

		}]
	}

}

angular.module('ppApp').directive('questionContent', questionContent);

questionContent.$inject = ['$rootScope', '$compile', '$timeout'];

function questionContent($rootScope, $compile, $timeout) {

	return {
		restrict: 'EA',
		require: '^^questionPanel',
		scope: true,
		template: '<div data-ng-include="questionTemplate"></div> ',
		link: function(scope, elem, attr, ctrl) {

			scope.validModel = {};

			ctrl.createButtons();

			scope.question = scope.question;
			scope.requiredYes = true;
			scope.requiredNo = true;			

		    if(scope.question.checkItems) {
		        Object.keys(scope.question.checkItems).forEach(function(item){
		          	ctrl.formData[item] = scope.question.checkItems[item];
		        })
		        
		    }

			if(scope.$parent.$last === true) {
				$timeout(function() {
					ctrl.initalSelect(0);
				});
			}

			//CHECK WHETHER USER INPUT IS VALID
			scope.isOptionValid = function(value) {
				ctrl.isOptionValid(value, scope.question)
			}
    
      		scope.updateChecklist = function(checklist, property, value) {
        		ctrl.formData[checklist].map(function(item){
          			if(property == item.stateCode) {
            			item.checked = value;
          			}
         			return item;
    			})
      		}

      		scope.addToFormData = function(property, value) {
        		if(property === ''){ return; }
    			ctrl.formData[property] = value
      		}


			scope.questionTemplate = 'app/templates/directives/' + ctrl.service +'/' + scope.question.template + '.question.tpl.htm';


		}
	}

}

angular.module('ppApp').directive('postAction', postAction);

postAction.$inject = [];

function postAction() {

	return {
		restrict: 'A',
		scope: {},
		require: '^^questionPanel',
		link: function(scope, elem, attr, ctrl) {
			ctrl.setService(attr.postAction)
		}
	}

}