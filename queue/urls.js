/* jshint node: true */
'use strict';

var CONCURRENT_JOBS = 20;
var redis = require('redis');
var kue = require('kue');
var request = require('request');

var redisClient = redis.createClient();
var queue = kue.createQueue();

redisClient.on('connect', function() {
	console.log('Connected to Redis');
});

queue.watchStuckJobs();

queue.on('job complete', function(id, result) {
	kue.Job.get(id, function(err, job) {
		if (err) {
			return;
		}

		redisClient.hset(job.id, 'state', 'complete');
	});
});

function getHtml(data, done) {
	request(data.url, function(err, res, body) {
		if (!err && res.statusCode === 200) {
			data.content = body;
			done();
		} 
	});
}

function createUrl(data, success, fail) {
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
}

function getUrl(jobId, success, fail) {
	redisClient.hgetall(jobId, function(err, res) {
		if (err) {
			fail(err);
			return;
		}
		
		if (res && res.state === 'complete') {
			success(res);
		} else {
			success({ state: 'Job not complete' });
		}
	});
}

queue.process('url', CONCURRENT_JOBS, function(job, done) {
	getHtml(job.data, function() {
		redisClient.hmset(job.id, {
			jobId: job.id,
			url: job.data.url,
			html: job.data.content
		}, done);
	});
});

module.exports = {
	create: function(data, success, fail) {
		createUrl(data, success, fail);
	},
	get: function(jobId, success, fail) {
		getUrl(jobId, success, fail);
	}
};