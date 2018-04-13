var express = require('express')
var app = express();


app.use(express.static(__dirname));
var request = require('request');

var googleGeocodingAPIKey = 'AIzaSyAzOEUqx934VbVOoZmCKXBx3yNrLw_tEO8';
var darkSkySecretKey = 'be7c4a9b6bdfc48b7d949856cf9bfede';

app.get('/dynamic/geocoding/:query', function(req, res){
	var url = 'https://maps.googleapis.com/maps/api/geocode/json?address="' +
			encodeURIComponent(req.params.query) + '"'+
			'&key=' + googleGeocodingAPIKey;
	request(url, function(error, response, body){
		if(error || response.statusCode !== 200) {
			//TODO error
		} else {
			var result = JSON.parse(body).results[0];
			res.send(result);
		}
	});
});


app.get('/dynamic/forecast/:lat,:lon', function(req, res){
	var url = 'https://api.darksky.net/forecast/' + darkSkySecretKey + '/' +
			req.params.lat + ',' + req.params.lon
			+ '?units=us&exclude=minutely,alerts,flags';
	request(url, function(error, response, body){
		if(error || response.statusCode !== 200) {
			//TODO error
		} else {
			res.send(body);	
		}
	});
});


app.listen(3000);
