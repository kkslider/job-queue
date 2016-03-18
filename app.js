/* jshint node: true */
'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var kue = require('kue');
var urls = require('./routes/urls');

var port = process.env.PORT || '3000';
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/urls', urls);
app.listen(port);

module.exports = app;
