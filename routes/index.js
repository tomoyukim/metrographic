var express = require('express');
var router = express.Router();
var request = require('request');

var API_ENDPOINT = 'https://api.tokyometroapp.jp/api/v2/';
var DATAPOINTS_URL = API_ENDPOINT + 'datapoints';
var ACCESS_TOKEN = '5b9ad5a322d230e5a0f7d2189463e8a87deafdc0a2d5a823dbe9041d9b511255';

var query = {
    'rdf:type':'odpt:Train',
    'odpt:railway':'odpt.Railway:TokyoMetro.Chiyoda',
    'acl:comsumerKey':ACCESS_TOKEN
}

function getTrainPosition() {
    request.get({url:DATAPOINTS_URL, qs:query}, function(err, response, body){
	if(!err && response.statusCode == 200) {
	    var info = JSON.parse(body);
	    console.log(info);
	} else {
	    console.log(response.statusCode);
	}
    });
}

//setTimeout(callback, delay, [arg,…])：delayミリ秒後にコールバック関数を引数argで呼ぶ

/* GET home page. */
router.get('/', function(req, res) {
    getTrainPosition();
    res.render('index');
});

module.exports = router;
