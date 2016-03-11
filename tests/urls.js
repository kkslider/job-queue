'use strict';

var supertest = require('supertest');
var app = require('../app');

var api = supertest(app);
var test = require('tape');

test('api test', function(t) {
	api
		.post('/urls')
		.expect('Content-Type', /html/)
		.expect(200)
		.end(function(err, res) {
			if (err) {
				t.fail();
				t.end();
			}

			if (res) {
				t.ok(res.body, 'Should respond with html body');
				t.end();
			}
		}); 
}, {
	timeout: 500
});