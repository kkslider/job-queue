/* jshint node: true */
'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var kue = require('kue');

var urls = require('./routes/urls');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/queue', kue.app);
app.use('/urls', urls);

module.exports = app;
