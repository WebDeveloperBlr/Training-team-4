"use strict";
const db = require('../db');

var connection = db.get;

exports.getNextInterviews=function(callback){
  connection.query("SELECT id_event,dateStart,timeStart,timeEnd,title " +
    "from event e " +
    "INNER JOIN importance im " +
    "on e.id_importance=im.id_importance " +
    "INNER join interviewer viewer " +
    "on e.id_interviewer=viewer.id_interviewer;",function(err,results){
    if(err) throw err;
    callback(results);
  });
};
