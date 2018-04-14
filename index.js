var express = require('express')
var app = express();
app.use(express.static(__dirname));
var request = require('request');
var darkSkySecretKey = 'be7c4a9b6bdfc48b7d949856cf9bfede';


//CALL TO DARKSKY API
app.get('/backend/forecast/:lat,:lon', function(req, res){
	var url = 'https://api.darksky.net/forecast/' + darkSkySecretKey + '/' +req.params.lat + ',' + req.params.lon+ '?units=us&exclude=minutely,alerts,flags';
	request(url, function(error, response, body){
		if(error || response.statusCode !== 200) {
			//TODO error
		} else {
			res.send(body);	
		}
	});
});


app.listen(process.env.PORT || 8888);