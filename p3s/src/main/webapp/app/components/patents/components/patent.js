app.component('patent', {
	bindings: { 
		patent: '<',
		costAnalysis: '<',
		renewal: '<'
	},
	templateUrl: 'p3sweb/app/components/patents/views/patent-item.htm',
	controller: ['patentsRestService', '$state', '$timeout','$scope', 'fxService', 'patentsService', 'currentTransactionsService', '$uibModal', function(patentsRestService, $state, $timeout, $scope, fxService, patentsService, currentTransactionsService, $uibModal) {

		var vm = this;

		vm.activePatentItemMenu = 'Patent Info';

		$scope.$on('renewalHistory', function() {		
			vm.activePatentItemMenu = 'Renewal History';
			vm.activeSelectedTab = 2;
		});

		vm.chartActive = 'Stage Cost Chart';

		vm.fetchItemRenewal = function() {
			patentsService.activePatentItemMenu();
		};

		vm.fetchItemTransaction = function(id) {
			currentTransactionsService.fetchCurrentTransactions()
			.then(
				function(response) {
					response.forEach(function(data) {

						const transId = data.id;
						
						data.renewalUIs.forEach(function(data, i) {
							if(data.patentUI.id == id) {
								$state.go('current-transactions.current-transaction-item',{transId: transId});
							}
						});
					});
				},
				function(errResponse) {
					console.log(errResponse);
				}
			);
		};

		vm.colourKey = function(colour) {

			switch(colour) {
				case 0:
					vm.colourPhaseTitle = {
						title: 'Green',
						descrip: 'lorem',
						color: '#53ab58'
					};
				break;
				case 1:
					vm.colourPhaseTitle = {
						title: 'Amber',
						descrip: 'loremmm',
						color: '#f9b233'						
					};
				break;
				case 2:
					vm.colourPhaseTitle = {
						title: 'Red',
						descrip: 'lorem ipsum',
						color: '#e30613'
					};
				break;
				case 3:
					vm.colourPhaseTitle = {
						title: 'Blue',
						descrip: '24 Week Extension',
						color: '#0097ce'					
					};
				break;
				case 4:
					vm.colourPhaseTitle = {
						title: 'Black',
						descrip: 'herisuhimas',
						color: '#3c3c3b'
					};
			}
		};

		vm.openUpdateConfirmModal = function(id) {

			var modalInstance = $uibModal.open({
				templateUrl: 'p3sweb/app/components/patents/views/modals/modal-update-patent-template.htm',
				appendTo: undefined,
				scope: $scope,
				controller: function($uibModalInstance ,$scope) {
				  	$scope.dismissModal = function () {
				    	$uibModalInstance.close();
				  	};
				}
			});

		    modalInstance.result.then(function() {
     			console.log('good');
		    }, function() {
	       		console.log('bad');
		    });
		};

		vm.openDeleteConfirmModal = function(id) {
			var modalInstance = $uibModal.open({
				templateUrl: 'p3sweb/app/components/patents/views/modals/modal-remove-patent-template.htm',
				appendTo: undefined,
				scope: $scope,
				controller: function($uibModalInstance ,$scope){

					$scope.dismissModal = function () {
				    	$uibModalInstance.close();
				  	};

				  	$scope.deletePatent = function () {
			  			vm.deletePatent(id);
			  			$timeout(function() {
							$uibModalInstance.close();
			  			}, 300);
				  	};

				  	$scope.cancelDeletion = function() {
				  		$uibModalInstance.dismiss('cancel');
				  	};
				}
			});

		    modalInstance.result.then(function(response) {
		     	console.log(response);
		    }, function(errResponse) {
		       console.log(errResponse);
		    });
		};

		Chart.elements.Rectangle.prototype.draw = function() {
	    
		    var ctx = this._chart.ctx;
		    var vm = this._view;
		    var left, right, top, bottom, signX, signY, borderSkipped, radius, width, nextCornerId, height, x, y, nextCorner;
		    var borderWidth = vm.borderWidth;
		    // Set Radius Here
		    // If radius is large enough to cause drawing errors a max radius is imposed
		    var cornerRadius = 40;

		    vm.height = 25;

		    if (!vm.horizontal) {
		        // bar
		        left = vm.x - vm.width / 2;
		        right = vm.x + vm.width / 2;
		        top = vm.y;
		        bottom = vm.base;
		        signX = 1;
		        signY = bottom > top? 1: -1;
		        borderSkipped = vm.borderSkipped || 'bottom';
		    } else {
		        // horizontal bar
		        left = 0;
		        right = vm.x;
		        top = vm.y - vm.height / 2;
		        bottom = vm.y + vm.height / 2;
		        signX = right > left? 1: -1;
		        signY = 1;
		        borderSkipped = vm.borderSkipped || 'left';
		    }

		    // Canvas doesn't allow us to stroke inside the width so we can
		    // adjust the sizes to fit if we're setting a stroke on the line
		    if (borderWidth) {
		        // borderWidth shold be less than bar width and bar height.
		        var barSize = Math.min(Math.abs(left - right), Math.abs(top - bottom));
		        borderWidth = borderWidth > barSize? barSize: borderWidth;
		        var halfStroke = borderWidth / 2;
		        // Adjust borderWidth when bar top position is near vm.base(zero).
		        var borderLeft = left + (borderSkipped !== 'left'? halfStroke * signX: 0);
		        var borderRight = right + (borderSkipped !== 'right'? -halfStroke * signX: 0);
		        var borderTop = top + (borderSkipped !== 'top'? halfStroke * signY: 0);
		        var borderBottom = bottom + (borderSkipped !== 'bottom'? -halfStroke * signY: 0);
		        // not become a vertical line?
		        if (borderLeft !== borderRight) {
		            top = borderTop;
		            bottom = borderBottom;
		        }
		        // not become a horizontal line?
		        if (borderTop !== borderBottom) {
		            left = borderLeft;
		            right = borderRight;
		        }
		    }

		    ctx.beginPath();
		    ctx.fillStyle = vm.backgroundColor;
		    ctx.strokeStyle = vm.borderColor;
		    ctx.lineWidth = borderWidth;

		    // Corner points, from bottom-left to bottom-right clockwise
		    // | 1 2 |
		    // | 0 3 |
		    var corners = [
		        [left, bottom],
		        [left, top],
		        [right, top],
		        [right, bottom]
		    ];

		    // Find first (starting) corner with fallback to 'bottom'
		    var borders = ['bottom', 'left', 'top', 'right'];
		    var startCorner = borders.indexOf(borderSkipped, 0);
		    if (startCorner === -1) {
		        startCorner = 0;
		    }

		    function cornerAt(index) {
		        return corners[(startCorner + index) % 4];
		    }

		    // Draw rectangle from 'startCorner'
		    var corner = cornerAt(0);
		    ctx.moveTo(corner[0], corner[1]);

		    for (var i = 1; i < 4; i++) {
		        corner = cornerAt(i);
		        nextCornerId = i+1;
		        if(nextCornerId == 4){
		            nextCornerId = 0;
		        }

		        nextCorner = cornerAt(nextCornerId);

		        width = corners[2][0] - corners[1][0];
		        height = corners[0][1] - corners[1][1];
		        x = corners[1][0];
		        y = corners[1][1];
		        
		        radius = cornerRadius;
		        
		        // Fix radius being too large
		        if(radius > height/2){
		            radius = height/2;
		        }if(radius > width/2){
		            radius = width/2;
		        }

		        ctx.moveTo(x + radius, y);
		        ctx.lineTo(x + width - radius, y);
		        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
		        ctx.lineTo(x + width, y + height - radius);
		        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
		        ctx.lineTo(x + radius, y + height);
		        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
		        ctx.lineTo(x, y + radius);
		        ctx.quadraticCurveTo(x, y, x + radius, y);

		    }

		    ctx.fill();
		    if (borderWidth) {
		        ctx.stroke();
		    }
		}; 

        function usdFxEur() {
        	var fx = eval(1 / vm.costAnalysis.fee.fxRate);
        	fx = fx.toFixed(2);
        	vm.usd2eur = fx;
        }
		
     	vm.$onChanges = function(changeObj) {

            if(changeObj.patent) {

            	vm.selectedPatent =  changeObj.patent.currentValue;

	            var patent = vm.patent;
	            var costBand = vm.costAnalysis;
	            var caFee = costBand.fee;
	            var status = patent.renewalStatus;
				var caLine = vm.costAnalysis.lineChart;
            	var lineDataArr = [];
            	var lineLabelArr = [];	            

	            vm.renewalHistory = vm.renewal;         

	            if((status == 'Show price') || (status == 'Payment in progress') || (status == 'EPO Instructed')) {
	            	vm.displayCost = true;
	            	vm.hideCost = false;
	            } else {
	            	vm.displayCost = false;
	            	vm.hideCost = true;
	            }
            	
            	if(caFee !== null) {
            		usdFxEur();
	            	vm.feeBreakDown = {
	            		renewalFeeEUR: caFee.renewalFeeEUR,
	            		renewalFeeUSD: caFee.renewalFeeUSD,
	            		extensionFee: caFee.extensionFeeEUR,
	            		extensionFeeEur: caFee.extensionFeeEUR,
	            		extensionFeeUSD: caFee.extensionFeeUSD,
	            		processingFeeEUR: caFee.processingFeeEUR,
	            		processingFeeUSD: caFee.processingFeeUSD,
	            		expressFeeUSD: caFee.expressFeeUSD,
	            		urgentFeeUSD: caFee.urgentFeeUSD,
	            		latePayPenaltyUSD: caFee.latePayPenaltyUSD,
	            		fxRate: caFee.fxRate,
	            		subTotalEUR: caFee.subTotalEUR,
	            		subTotalUSD: caFee.subTotalUSD,
	            		bandSaving: function() {
	            			var item = {};
	            			switch(patent.costBandColour) {
	            				case 'Green':
	            					item.savings =  Math.round(costBand.amberStageCost - costBand.greenStageCost);
	            					item.renewBefore = patent.costBandEndDate;
	            				break;
	            				case 'Amber':
	            					item.savings =  Math.round(costBand.redStageCost - costBand.amberStageCost);
	            					item.renewBefore = patent.costBandEndDate;
	            				break;
	            				case 'Red':
	            					item.savings =  Math.round(costBand.blueStageCost - costBand.redStageCost);
	            					item.renewBefore = patent.costBandEndDate;
	            				break;
	            				case 'Blue':
	            					item.savings =  Math.round(costBand.blackStageCost - costBand.blueStageCost);
	            					item.renewBefore = patent.costBandEndDate;
	            				break;
	            				case 'Black':
	            					item.savings =  'N/A';
	            					item.renewBefore = 'N/A';

	            			}
	            			return item;
	            		}
	            	};      		
            	}

				Object.keys(caLine).forEach(day => {
					const dayData = caLine[day];
					lineLabelArr.push(dayData.feeActiveDate.slice(0, -5));
					lineDataArr.push(dayData.subTotal_USD);
				});

				const caBar = vm.costAnalysis;
				const barDataArr = [];
				const barLabelArr = [];

				Object.keys(caBar).forEach(data => {
					
					const dayData = caBar[data];
					
					if ((data.includes('StartDate')) && (!data.includes ('UI'))) {

							var d = new Date(dayData);
							var date = d.getDate();
							var month = d.getMonth() + 1;
							var year = d.getFullYear();
							var dates = month  +'/'+ date +'/'+year;
							barLabelArr.push(dates);
					}

					if (data.includes('StageCost')) {
						barDataArr.push(dayData);
					}
				});

            	vm.charts = {
            		line: {
						data: lineDataArr,
						labels: lineLabelArr,
		     		  	series: ['Series A', 'Series B'],
					  	datasetoverride: [
					  		{ yAxisID: 'y-axis-1' }, 
					  		{ yAxisID: 'y-axis-2' },
				  		],
					  	options: {
					  		tooltips: {
								titleFontSize: 12,
								bodyFontSize: 14,
								bodyFontStyle: 'bold',
								xPadding: 15,
								yPadding: 15,
								enabled: true,
								position: 'nearest',
								custom: function(tooltip) {
									tooltip.displayColors = false;
								},
								callbacks: {
									label: function(x, y) {
										return '$ ' + x.yLabel;
									},
									title: function(tooltipItem, data) {
							          return;
							        }
								}
							},
					    	scales: {
					      		yAxes: [
						        	{
							          id: 'y-axis-1',
							          type: 'linear',
							          display: true,
							          position: 'left'
							        }
						      	]
						    },
				     		elements: {
					            line: {
					            	borderColor: '#c6c6c6',
					            	borderWidth: 2,
					            	width: '10',
					            	fill: null,
					                tension: 0, // disables bezier curves
					                pointStyle: 'cross'
					            }
					        }

					  	}
            		},
            		bar: {
						colours: ['#3c3c3b','#0097ce', '#e30613', '#f9b233','#53ab58'],
					  	labels: barLabelArr.slice(0, 5).sort(function(a, b){return b-a;}),
					  	data: barDataArr.slice(0, 5).sort(function(a, b){return b-a;}),
						series: ['Series A', 'Series B'],
						options: {
							tooltips: {
								titleFontSize: 12,
								bodyFontSize: 14,
								bodyFontStyle: 'bold',
								xPadding: 15,
								yPadding: 15,
								enabled: true,
								position: 'nearest',
								custom: function(tooltip) {
									tooltip.displayColors = false;
								},
								callbacks: {
									label: function(x, y) {
										return '$ ' + x.xLabel;
									},
									title: function(tooltipItem, data) {
							          return;
							        }
								}
							},
			                scaleShowGridLines: false,
				            barShowStroke : false,
				            barDatasetSpacing : 0
					  	}
            		}
            	}; //charts end

            	//PROGRESS BAR

	            $timeout(function() {
	            	vm.progressBar = vm.patent.progressBar;
	            }, 200);
 			
		        vm.nextStage = function() {
	        		var nextStage;
	        		switch(vm.patent.costBandColour) {
	        			case 'Green':
	        				nextStage = 'Amber';
	        			break;
	        			case 'Amber':
	        				nextStage = 'Red';
	        			break;
	        			case 'Red':
	        				nextStage = 'Blue';
	        			break;
	        			case 'Blue':
	        				nextStage = 'Black';
	        			break;
	        			case 'Black':
	        				nextStage = 'End';		
	        		}
	        		return nextStage;
	        	};

	        	//NOTIFICATIONS//////////////////

				vm.patentNotifications = {
					green: 'Green',
					amber: 'Amber',
					red: 'Red',
					blue: 'Blue',
					black: 'Black'
				};

				// vm.colourPhase = 'Green';

				vm.displayNotifications = function(phase) {

					function phaseNotifications(phase) {
				  		var notificationsArr = changeObj.patent.currentValue.notificationUIs;
				  		var notifications = [];
			  			
				  		notificationsArr.forEach(function(data){
				  			if(data.costbandcolor == phase) {
				  				notifications.push(data);
				  			}
				  		});

				  		return notifications;

			  		}

		        	var chunkArr = [];

		        	function chunk(arr, size) {
		        		for (var i=0; i < arr.length; i+=size) {
			        		chunkArr.push(arr.slice(i, i+size));
			        	}
			        	return chunkArr;
		        	}       	

		        	vm.chunkedData = chunk(phaseNotifications(phase), 8);

				};


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
	        					vm.todaysPriceUSD = Math.floor(vm.costAnalysis.fee.subTotalEUR * todaysFx);
	        				}        				
	        				//yesterday
	        				if(item == dateArr[1]) {
	        					var yesterdayFx = data[index].rate;
	        					vm.yesterdaysPriceUSD = Math.floor(vm.costAnalysis.fee.subTotalEUR * yesterdayFx);
	        				}
	        				//weekly
	        				if(item == dateArr[7]) { 
	        					var lastWeekFx = data[index].rate;
	        					vm.lastWeeksPriceUSD = Math.floor(vm.costAnalysis.fee.subTotalEUR * lastWeekFx);
	        					vm.lastWeeksPriceEUR = Math.floor(vm.costAnalysis.fee.subTotalEUR);
	        				}
	        			});
	        		},
	        		function(error){

	        		}
	    		); //fxService end

	    		fxService.fetchFxMonth()
	        	.then(
	        		function(data){

	        			var dateArr = [];

	        			data.forEach(function(item){
	        				dateArr.push(item.rateActiveDate);
	        			});

	        			dateArr.sort(function(a, b){
	        				return a - b;
	        			});

	        			var tD = new Date();
	        			var lmD = tD.setMonth(tD.getMonth() - 1);
	        			var lastMonthD = new Date(lmD).getDay();
	        			var lastMonthDt = new Date(lmD).getDate();
	        			dateArr.forEach(function(item, index){
	        				if((new Date(item).getDay() == lastMonthD) && (new Date(item).getDate() == lastMonthDt)) {
	        					var lastMonthFx = data[index].rate;
	        					vm.lastMonthsPriceUSD = Math.floor(vm.costAnalysis.fee.subTotalEUR * lastMonthFx);
	        					vm.lastMonthsPriceEUR = Math.floor(vm.costAnalysis.fee.subTotalEUR);
	        				}
	        			});
	        			$timeout(function(){
	        				vm.fourWeekVariation =  Math.floor(vm.todaysPriceUSD - vm.lastMonthsPriceUSD);
	        				if(vm.fourWeekVariation < 0) {
	        					vm.variationSave = false;
	        				} else {
	        					vm.variationSave = true;
	        				}
	        			}, 100);
	        		},
	        		function(error){

	        		}
	    		); //fxService end
          	
        	} //if end
    	}; //onchanges end



        // PATENT INFORMATION //////////////////////


     	vm.deletePatent = function(id){
	        patentsRestService.deletePatent(id)
	            .then(function(){
	             	$state.go('patents', {}, {reload: true})
             		.then(function(){
	             		$timeout(function(){patentsRestService.fetchAllPatents()}, 400);
	             	});
	             },
	            function(errResponse){
	                console.error('Error while deleting Patent');
	            }
	        );
	    };

        vm.updatePatent = function(patent) {
        	var id = patent.id;
        	patentsRestService.updatePatent(patent, id);
        };

	    vm.editing=[];

	    vm.editItem = function (index) {
	        vm.editing[index] = true;
	    };

	    vm.doneEditing = function (index) {
	        vm.editing[index] = false;
	    };

		$timeout(function() {
			vm.colourKey(0);
			vm.displayNotifications(vm.patentNotifications.green);
		}, 100);

	  	
	}]

});