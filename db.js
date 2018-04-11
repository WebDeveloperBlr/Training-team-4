'use strict';
var mysql      = require('mysql');
module.exports = {

  get : mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'hr-app',
    timezone: 'utc'
  })
  /*get : mysql.createPool({
    host     : 'eu-cdbr-west-02.cleardb.net',
    user     : 'be2b4689fc4d41',
    password : '0043d210',
    database : 'heroku_073019326e44d60'
  })*/

};