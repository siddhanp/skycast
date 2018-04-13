var Myapp = angular.module('MySkyCast', ['ngResource']);


/*
if (localStorage.getItem("history") === null) {
  var cities = [];
  localStorage.setItem("history", JSON.stringify(cities));
}
*/

Myapp.controller('MainController',['$scope', '$resource' ,'$window',  function($scope, $resource){
	
	
	//window.alert("Loaded Controller");
	$scope.currentCoordinates={};
        $scope.weather = undefined;
	//$scope.inputCity = "";
	
	//$scope.historyOptions = JSON.parse(localStorage.getItem("history"));
    	$scope.getCoordinates = function(inputCity) {
        	$scope.inputCity = inputCity;
		
		window.alert("You entered: "+ $scope.inputCity);
		
		var res = $resource('/dynamic/geocoding/:query', {query: $scope.inputCity});
		window.alert(" Done1 ");

		$scope.currentCoordinates = res.get(function() {

  		 	window.alert("Successful Coordinates "+ $scope.inputCity); 
			$scope.displayCity = $scope.inputCity;
			getWeather();	
		
		}, function(){
		});

		window.alert(" Done ");     	

	};


	function getWeather() {
		
		window.alert("You entered getWeather Function() ");

		var res = $resource('/dynamic/forecast/' + $scope.currentCoordinates.geometry.location.lat +
				',' + $scope.currentCoordinates.geometry.location.lng);
		$scope.weather = res.get(function(){

			window.alert("Successful Forecast "+ $scope.inputCity); 
			showWeather();
			//addToHistory();

		}, function(){
		});

		window.alert(" Done Forecast ");
		
	};






	/**Returns the argument unless it is undefined, in which case this returns "precipitation".*/
	$scope.precipType = function(str) {
		if(str === undefined) {
			return "precipitation";
		}
		return str;
	}
	
	
	var weatherIconMap = {
		'clear-day': 'day-sunny',
		'clear-night': 'night-clear',
		rain: 'rain',
		snow: 'snow',
		sleet: 'sleet',
		wind: 'strong-wind',
		fog: 'fog',
		cloudy: 'cloudy',
		'partly-cloudy-day': 'day-cloudy',
		'partly-cloudy-night': 'night-cloudy'
	};

	/*Takes an icon string from the Dark Sky Forecast API
	and converts it into one of our weather icon classes.*/
	$scope.getWeatherIconClass = function(icon) {
		var result = weatherIconMap[icon];
		if(result === undefined) {
			result = 'alien';//fun
		}
		return 'wi-' + result;
	}

	Highcharts.setOptions({
  		global: {
    			useUTC: false
  			}
	});

	function FormatNumberLength(num) 
	{
		
    		var r = "" + num;
    		while (r.length < 13) 
		{
        		r = r + "0";
    		}
	
    	return parseInt(r);
	}

	function showWeather() {

		var hourlyWeather = [];
		var hourlyTemperature = [];
		var next24Hours = $scope.weather.hourly.data.slice(0,24);
		for(var i=0; i<next24Hours.length; i++)
		{
			var tempArray = [];
			tempArray.push(FormatNumberLength(next24Hours[i].time));
			tempArray.push(Math.round(next24Hours[i].temperature));
			hourlyTemperature.push(Math.round(next24Hours[i].temperature));
			hourlyWeather.push(tempArray);
		}
		//window.alert(hourlyTemperature);
		//window.alert(Math.min.apply(Math,hourlyTemperature));
		Highcharts.chart('weatherGraph', {
		chart: {
        		type: 'area'
    		},
		exporting: { enabled: false },
		title: {
        		text: null
    		},
		plotOptions: {
        		series: {
            			dataLabels: {
                			enabled: true
            			}
        		}
    		},
		yAxis: {
			visible: false,
			max:Math.max.apply(Math,hourlyTemperature)+5,
			min:Math.min.apply(Math,hourlyTemperature)-5,
		},
		xAxis: {
			type: 'datetime',
   			title: {
    				enabled: false
   			}
		},
		series: [{ 
			name:'°F' ,
   			showInLegend: false,
   			data: hourlyWeather,
			color: '#FFFF99'
			}],
			
		});
	
	}
	
	/*

	function addToHistory(){
		
		window.alert("In addToHistory"+ $scope.inputCity);
		var history = JSON.parse(localStorage.getItem("history"));
		window.alert("In addToHistory"+history);
		history.push($scope.inputCity);
		window.alert("In addToHistory"+history);
		localStorage.setItem("history", JSON.stringify(history));
		$scope.historyOptions = JSON.parse(localStorage.getItem("history"));
		retrieveHistory();

	}

	function retrieveHistory(){

		window.alert("In retrieveHistory");
		var h = JSON.parse(localStorage.getItem("history"));
		window.alert("In 2retrieveHistory"+h);
		for (var j = 0; j < h.length; j++) {
  			window.alert(h[j]);
		}

	}
		
	function clearHistory(){
			
		window.alert("In Clear History");
		//localStorage.clear();
	
	}

	*/
}]);


