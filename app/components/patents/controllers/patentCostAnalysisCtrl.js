function patentCostAnalysisCtrl(patent, costAnalysis, $timeout) {

	var vm = this;

	var costAnalysisFee = costAnalysis.fee;

	

	if(costAnalysisFee) {

		vm.feeBreakDown = {
			renewalFeeEUR: costAnalysisFee.renewalFeeEUR,
			renewalFeeUSD: costAnalysisFee.renewalFeeUSD,
			extensionFeeEUR: costAnalysisFee.extensionFeeEUR,
			extensionFeeUSD: costAnalysisFee.extensionFeeUSD,
			processingFeeEUR: costAnalysisFee.processingFeeEUR,
			processingFeeUSD: costAnalysisFee.processingFeeUSD,
			expressFeeUSD: costAnalysisFee.expressFeeUSD,
			expressFeeEUR: costAnalysisFee.expressFeeEUR,
			urgentFeeUSD: costAnalysisFee.urgentFeeUSD,
			latePayPenaltyUSD: costAnalysisFee.latePayPenaltyUSD,
			fxRate: costAnalysisFee.fxRate,
			subTotalEUR: costAnalysisFee.subTotalEUR,
			subTotalUSD: costAnalysisFee.subTotalUSD,
			bandSaving: function() {
				var item = {};
				switch(patent.costBandColour) {
					case 'Green':
						item.savings =  Math.round(costAnalysis.amberStageCost - costAnalysis.greenStageCost);
						item.renewBefore = patent.costBandEndDate;
					break;
					case 'Amber':
						item.savings =  Math.round(costAnalysis.redStageCost - costAnalysis.amberStageCost);
						item.renewBefore = patent.costBandEndDate;
					break;
					case 'Red':
						item.savings =  Math.round(costAnalysis.blueStageCost - costAnalysis.redStageCost);
						item.renewBefore = patent.costBandEndDate;
					break;
					case 'Blue':
						item.savings =  Math.round(costAnalysis.blackStageCost - costAnalysis.blueStageCost);
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
	
	}

	var lineChart = costAnalysis.lineChart
	var lineDataArr = [];
	var lineLabelArr = [];


	for (var property in lineChart) { //change lineChart
	    if (lineChart.hasOwnProperty(property)) {
			const dayData = lineChart[property];
			lineLabelArr.push(dayData.feeActiveDate.slice(0, -5));
			lineDataArr.push(dayData.subTotal_USD);
	    }
	}

	const barDataArr = [];
	const barLabelArr = [];

	for (var property in costAnalysis) {
	    if (costAnalysis.hasOwnProperty(property)) {

			const dayData = costAnalysis[property];
		
			if ((property.includes('StartDate')) && (!property.includes ('UI'))) {

					var d = new Date(dayData);
					var date = d.getDate();
					var month = d.getMonth() + 1;
					var year = d.getFullYear();
					var dates = month  +'/'+ date +'/'+year;
					barLabelArr.push(dates);
			}

			if (property.includes('StageCost')) {
				barDataArr.push(dayData);
			}
	    }
	}

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
	
}

app.controller('patentCostAnalysisCtrl', patentCostAnalysisCtrl);