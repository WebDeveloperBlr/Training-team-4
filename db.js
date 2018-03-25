'use strict';
var mysql      = require('mysql');
module.exports = {

  get : mysql.createPool({
    host     : process.env.OPENSHIFT_MONGODB_DB_URL || 'localhost',
    user     : 'root',
    password : '',
    database : 'hr-app'
  })

};