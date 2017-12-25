var ctx = document.getElementById("chart");
	var myChart = new Chart(ctx, {
	    type: 'bar',
	    data: {
	        labels: ["2018", "2019", "2020", "2021"],
	        datasets: [{
	            label: '# of Points',
	            data: spiritChartData,
	            backgroundColor: [
	                '#2ECC71',
	                '#F4D03F',
	                '#17202A',
	                '#FEFEFE'
	                ]
	            }]
	        },
	        options: {
	        	scales: {
	        		yAxes: [{
	        			ticks: {
	        				suggestedMin: 1000
	        			},
	        			gridLines: {
	        				display: false,
	        				drawBorder: false
	        			}
	        		}],
	        		xAxes: [{
	        			gridLines: {display: false, drawBorder: false},
	        		}]
	        	}, legend: {
	        		display: false,
	        	},
	        	animationEasing: 'easeInQuad',
	        	responsive: false,
	        },
	    });