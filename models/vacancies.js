"use strict";
const db = require('../db');
var connection = db.get;
exports.all = function(limit, filter, cb) {

  try{
    filter = JSON.parse(filter);
  }
  catch(e){
    filter = null;
  }
  console.log(filter);
    var data = {};
    var query;
    if(filter && filter.positionName !== undefined){
      console.log('fired');
      query = 'SELECT position.name \'position\', vacancy.requirements, vacancy.workExperience,vacancy.salary\n' + 'FROM `hr-app`.vacancy \n' + 'INNER JOIN `hr-app`.vacancyPosition ON vacancyPosition.id_vacancy=vacancy.id_vacancy \n' + 'INNER JOIN position ON position.id_position=vacancyPosition.id_position ' + 'WHERE (' + 'position.name LIKE \'%' + filter.positionName + '%\'';
      if (filter.exp && filter.exp.from) {
          query += 'AND vacancy.workExperience >= \'' + filter.exp.from + '\'';
      }
      if (filter.exp && filter.exp.to) {
          query += 'AND vacancy.workExperience <= \'' + filter.exp.to + '\'';
      }
      query += ') group by vacancy.id_vacancy';
    }else{
      query = 'SELECT position.name \'position\', vacancy.requirements, vacancy.workExperience,vacancy.salary\n' + 'FROM `hr-app`.vacancy \n' + 'INNER JOIN `hr-app`.vacancyPosition ON vacancyPosition.id_vacancy=vacancy.id_vacancy \n' + 'INNER JOIN position ON position.id_position=vacancyPosition.id_position group by vacancy.id_vacancy';
    }

    connection.query('SELECT count(*) "count" FROM(' + query + ') AS T;', function(error, results) {
        data.count = results[0].count;
        connection.query(query + ' ORDER BY vacancy.id_vacancy ASC LIMIT ' + limit + ';', function(error, results) {
            data.docs = results;
            cb(error, data);
        });
    });
};
exports.getByID = function(id, cb) {
    connection.query('select * from candidate WHERE candidate_id=?', [id], function(error, results) {
        cb(error, results);
    });
};
exports.create = function(candidate, cb) {
    connection.query('INSERT INTO candidate SET ?', candidate, function(error, results) {
        cb(error, results);
    });
};
exports.update = function(id, candidate, cb) {
    connection.query('UPDATE `candidate` SET `firstName`=?,`lastName`=?,`position`=?, `candidateExperience_id`=?, `skills`=?, `adress`=?, `email`=?, `telephone`=? where `candidate_id`=?', [candidate.firstName, candidate.lastName, candidate.position, candidate.candidateExperience_id, candidate.skills, candidate.adress, candidate.email, candidate.telephone, id], function(error, results) {
        cb(error, results);
    });
};
exports.delete = function(id, cb) {
    connection.query('DELETE FROM `candidate` WHERE `candidate_id`=?', [id], function(error, results) {
        cb(error, results);
    });
};
