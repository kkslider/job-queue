/* jshint node: true */
'use strict';

var supertest = require('supertest');
var test = require('tape');
var app = require('../app');
var api = supertest(app);

test.onFinish(function() {
	process.exit();
});

var jobId;

test('User sends a POST request to /urls', function(t) {
	var request = {
		url: 'https://www.google.com'
	};
	
	api
		.post('/urls')
		.send(request)
		.expect('Content-Type', /json/)
		.expect(200)
		.end(function(err, res) {
			t.error(err, 'No errors');
			jobId = res.body.jobId;
			t.ok(res.body.jobId, 'Should respond with a job id');
			t.end();
		}); 
});

test('User sends a GET request to /urls/id', function(t) {
	api
		.get('/urls/' + jobId)
		.expect(200)
		.end(function(err, res) {
			t.error(err, 'No errors');
			t.ok(res.body.state, 'Should respond with a job status for the user');
			t.end();
		}); 
});