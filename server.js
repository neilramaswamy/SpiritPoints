require('promise');
const express = require('express');
const fs = require('fs');
const authData = require('./auth');

const app = express();
const chartjs = require('chart.js');
const server = app.listen(4000, function() {
	console.log('Listening at 4000...');
});

const GRADES = ['Seniors', 'Juniors', 'Sophomores', 'Freshmen'];

app.use(express.static('images'));
app.use(express.static('public'));
app.set('views', './views');
app.set('view engine', 'pug');

// TODO: Send a "winning string" (that takes ties into accounts) to chart.pug 
// instead of recentEventWinners (an array of winning classes)
app.get('/', function(request, response) {
	var oauthClient = authData.getOauthToken();
	authData.getSpreadsheetData(oauthClient).then(function (data) {
		console.log(recentEventMessage(data));
		response.render('chart', {chartData: getClassScores(data), 
			recentEventMessage: recentEventMessage(data), recentEvent: recentEvent(data)});
	}, function (error) {
		console.log("error" + error);
	})
});

function getClassScores(data) {
	let scores = [0, 0, 0, 0];
	for (var key in data) {
		for (var i = 0; i < 4; i++) {
			var a = Number(data[key][i]);
			scores[i] = scores[i] + a;
		}
	}
	return scores;
}

function recentEvent(data) {
	var keys = Object.keys(data);
	return keys[keys.length-1];
}

/*
Find the highest scores and return the classes that correspond to them.
Example 1:
scores are [200, 150, 50, 100]
The array returned should be ['Seniors']
Example 2:
scores are [200, 200, 100, 50]
The array returned should be ['Seniors', 'Juniors']
*/
function recentEventMessage(data) {
	var keys = Object.keys(data)
	var last = data[recentEvent(data)];
	console.log(last);
	var max = Number.NEGATIVE_INFINITY;
	var index = -1;
	for (var i = 0; i < last.length; i++) {
		var current = Number(last[i]);
		if (current > max) {
			max = current;
			index = i;
		}
	}
	var winners = [];
	for (var i = 0; i < last.length; i++) {
		var current = Number(last[i]);
		if (current == max) winners.push(GRADES[i]);
	}
	var winnerMessage = '';
	if (winners.length == 1) 
		winnerMessage = 'The ' + winners[0] + ' just won the ' + recentEvent(data) + ' contest!';
	else if (winners.length == 2)
		winnerMessage = 'The ' + winners[0] + ' and the ' + winners[1] + ' tied for first in the ' + 
							recentEvent(data) + ' contest!';
	else if (winners.length == 3) 
		winnerMessage = 'The ' + winners[0] + ', ' + winners[1] + ', and the ' + winners[2] + 
						' all tied for first in the ' + recentEvent(data) + ' contest!';
	else winnerMessage = 'All grades tied for first in the ' + recentEvent(data) + ' contest!';
	return winnerMessage;
}

app.get('/history', function(request, response) {
	var oauthClient = authData.getOauthToken();
	authData.getSpreadsheetData(oauthClient).then(function (data) {
		response.render('history', {chartData: data, gradeLevels: GRADES});
	})
});

app.get('/eventDetails', function(request, response) {
	var eventName = request.query.e;
	console.log(eventName);
	if (!eventName) console.log("There's no event name!");
	var oauthClient = authData.getOauthToken();
	authData.getSpreadsheetData(oauthClient).then(function (data) {
		if (!data.hasOwnProperty(eventName))
			response.render('history', {chartData: data, gradeLevels: GRADES});
		else {
			var scores = data[eventName];
			response.render('eventDetail', {chartData: scores, eventName: eventName});
		}
	});
});