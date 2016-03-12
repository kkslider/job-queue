/* jshint node: true */
'use strict';

var CONCURRENT_JOBS = 20;
var kue = require('kue');
var request = require('request');
var queue = kue.createQueue();

queue.watchStuckJobs();

queue.on('ready', function() {
	console.log('Queue is ready');
});

queue.on('error', function(err) {
	console.error('An error occurred in the queue');
	console.error(err);
	console.error(err.stack);
});

function getHtml(data, done) {
	console.log(data);
	request(data.url, function(err, res, body) {
		if (!err && res.statusCode === 200) {
			data.content = body;
			done();
		} 
	});
}

function createUrl(data, success, fail) {
	console.log('hello: ' + data);
	getHtml(data, function() {
		var job = queue.create('url', data) 
			.priority('normal')
			.attempts(5)
			.backoff(true)
			.removeOnComplete(false)
			.on('enqueue', function() {
				success(job);
			})
			.on('failed', function(err) {
				fail(err);
			})
			.save();		
	});
}

function getUrl(jobId, success, fail) {
	kue.Job.get(jobId, function(err, job) {
		if (err) {
			fail(err);
		} else {
			success(job);
		}
	});
}

queue.process('url', CONCURRENT_JOBS, function(job, done) {
	done();
});

module.exports = {
	create: function(data, success, fail) {
		createUrl(data, success, fail);
	},
	get: function(jobId, success, fail) {
		getUrl(jobId, success, fail);
	}
};