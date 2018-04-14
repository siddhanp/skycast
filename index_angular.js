var Myapp = angular.module('MySkyCast', ['ngResource']);

Myapp.controller('MainController',['$scope', '$resource' ,'$window',  function($scope, $resource) {
	
	
	$scope.displayCity = "";
    $scope.weather = undefined;
    var weatherIconMap = {
		'clear-day': 'day-sunny',
		rain: 'rain',
		snow: 'snow',
		'clear-night': 'night-clear',
		wind: 'strong-wind',
		fog: 'fog',
		sleet: 'sleet',		
		'partly-cloudy-day': 'day-cloudy',
		cloudy: 'cloudy',
		'partly-cloudy-night': 'night-cloudy'
	};

	Highcharts.setOptions({
  		global: {
    		useUTC: false
  		}
	});

	var input = document.getElementById('searchTextField');
  	var autocomplete = new google.maps.places.Autocomplete(input); 
	autocomplete.addListener('place_changed', function() {
			getCoordinates();
		});




	// OBTAIN LATITUDE AND LONGITUDE VALUES
    function getCoordinates() {
		
		var place = autocomplete.getPlace();
		var str = String(place.geometry.location);
		var co_ordinates = str.split(",");
		var latitude = co_ordinates[0].replace("(", "").trim();
		var longitude = co_ordinates[1].replace(")", "").trim();
		$scope.displayCity = JSON.stringify(place.formatted_address).replace(/"/g, '');   
		getWeather(latitude, longitude);
  	
	}


	// CALL TO BACKEND WITH LATITUDE AND LONGITUDE VALUES, GETS BACK DARKSKY WEATHER
	function getWeather(latitude, longitude) {
		
		var res = $resource('/backend/forecast/' + latitude +',' + longitude);
		$scope.weather = res.get(function() {
			showWeather();
			addToHistory();
		}, function() {
			//TODO Error
		});

	};


	// PRECIPITATION FIELD DISPLAY FUNCTION
	$scope.precipType = function(str) {

		if(str === undefined) {
			return "precipitation";
		}
		return str;

	}


	// RENDER APPROPRIATE WEATHER ICONS
	$scope.getWeatherIconClass = function(icon) {

		var result = weatherIconMap[icon];
		return 'wi-' + result;

	}
	

	// FORMAT UTC TEMPERATURE VALUES FOR HOURLY CHART
	function FormatNumberLength(num) {

    	var r = "" + num;
    	while (r.length < 13) {
        	r = r + "0";
    	}
    	return parseInt(r);

	}
	

	// BUILD AND DISPLAY HOURLY CHART
	function showWeather() {

		var hourlyWeather = [];
		var hourlyTemperature = [];
		var next24Hours = $scope.weather.hourly.data.slice(0,24);

		for(var i=0; i<next24Hours.length; i++) {
			var tempArray = [];
			tempArray.push(FormatNumberLength(next24Hours[i].time));
			tempArray.push(Math.round(next24Hours[i].temperature));
			hourlyTemperature.push(Math.round(next24Hours[i].temperature));
			hourlyWeather.push(tempArray);
		}
		
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
	
	
	// STORE SEARCH QUERY IN LOCAL STORAGE
	function addToHistory() {

		if (localStorage.getItem("history") === null) {
  			var cities = [];
  			localStorage.setItem("history", JSON.stringify(cities));
		}
		var history = JSON.parse(localStorage.getItem("history"));
		history.push($scope.displayCity);
		localStorage.setItem("history", JSON.stringify(history));

	}


	// RETRIEVE & DISPLAY PREVIOUS SEARCH QUERIES
	$scope.retrieveHistory = function() {

		if (localStorage.getItem("history") === null) {
			$scope.historyOptions = [];
		}
		else{
			$scope.historyOptions = JSON.parse(localStorage.getItem("history"));
		}

	}


	// CLEAR SEARCH QUERY HISTORY
	$scope.clearHistory = function() {
			
		localStorage.removeItem("history");
		$scope.historyOptions = null;
	
	}


	// SEARCH QUERY FROM HISTORY
	$scope.dropboxItemSelected = function(city) {
			
		document.getElementById('searchTextField').value="";
		document.getElementById('searchTextField').value=city; 
	
	}
	
}]);


