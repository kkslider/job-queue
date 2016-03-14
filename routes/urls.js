/* jshint node: true */
'use strict';

var router = require('express').Router();
var url = require('../queue/urls');

router.post('/', function(req, res) {
	url.create(req.body, function(job) {
		if (job) {
			return res.json({
				jobId: job.id
			});
		}
	}, function(err) {
		if (err) {
			return res.json({
				error: err
			});
		} 
	});
});

router.get('/:id*', function(req, res) {
	var jobId = req.params.id;
	return url.get(jobId, function(job) {
		return res.json(job);
	}, function(err) {
		if (err) {
			return res.json({
				error: err
			});
		}
	});
});

module.exports = router;