'use strict';
var mysql      = require('mysql');
module.exports = {
  name: 'hr-app',
  hostname : process.env.OPENSHIFT_NODEJS_IP || 'http://localhost',
  version: '0.0.1',
  env: process.env.NODE_ENV || 'development',
  port: process.env.OPENSHIFT_NODEJS_PORT || 8080
};