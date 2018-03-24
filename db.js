'use strict';
var mysql      = require('mysql');
module.exports = {

  get : mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'hr-app'
  })

};