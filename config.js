'use strict';
var mysql      = require('mysql');
module.exports = {
  name: 'hr-app',
  hostname : 'http://localhost',
  version: '0.0.1',
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 8080
};
