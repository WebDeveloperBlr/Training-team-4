"use strict";
const db = require('../db');


var connection = db.get;


exports.all = function (limit, filter, cb) {
  var data = {};
  var error = [];
  console.log(filter);
  var query = 'SELECT candidate.id_candidate,concat(per.firstName,\' \',per.secondName) \'name\',candidate.salary, pos.name "position", statusName.name "status" ' +
    'FROM `hr-app`.candidate ' +
    'INNER JOIN candidateStatus cs ON cs.id_candidate=candidate.id_candidate ' +
    'INNER JOIN statusName ON statusName.id_status = cs.id_status ' +
    'INNER JOIN candidatePosition cp ON cp.id_candidate = candidate.id_candidate ' +
    'INNER JOIN position pos ON pos.id_position = cp.id_position ' +
    'INNER JOIN person per ON per.id_person = candidate.id_person ';
  if (typeof filter!=='undefined'&&filter[0][0] !== '') {
    query += 'WHERE ( statusName.name = \'' + filter[0][0] + '\' ) ';
  }
  connection.query('SELECT count(*) "count" FROM(' + query + 'group by id_candidate ) AS T;', function (error, results) {
    data.count = results[0].count;
    connection.query(query + 'group by id_candidate ORDER BY id_candidate ASC LIMIT ' + limit + ';', function (error, results) {
      data.docs = results;
      cb(error, data);
    });
  });


};
exports.getByID = function (id, cb) {
  var query = 'SELECT candidate.id_candidate,concat(per.firstName,per.secondName) "name",candidate.salary, pos.name "position", statusName.name "status" ' +
    '    FROM `hr-app`.candidate ' +
    '    INNER JOIN candidateStatus cs ON cs.id_candidate=candidate.id_candidate ' +
    '    INNER JOIN statusName ON statusName.id_status = cs.id_status ' +
    '    INNER JOIN candidatePosition cp ON cp.id_candidate = candidate.id_candidate ' +
    '    INNER JOIN position pos ON pos.id_position = cp.id_position ' +
    '    INNER JOIN person per ON per.id_person = candidate.id_person ' +
    ' WHERE candidate.id_candidate ='+id;
  console.log(query+id);
  connection.query(query, [id], function (error, results) {
    cb(error, results);
  });
};
exports.create = function (candidate, cb) {
  connection.query('INSERT INTO candidate SET ?', candidate, function (error, results) {
    cb(error, results);
  });
};
exports.update = function (id, candidate, cb) {
  connection.query('UPDATE `candidate` SET `firstName`=?,`lastName`=?,`position`=?, `candidateExperience_id`=?, `skills`=?, `adress`=?, `email`=?, `telephone`=? where `candidate_id`=?', [candidate.firstName, candidate.lastName, candidate.position, candidate.candidateExperience_id, candidate.skills, candidate.adress, candidate.email, candidate.telephone, id], function (error, results) {
    cb(error, results);
  });
};
exports.delete = function (id, cb) {
  connection.query('DELETE FROM `candidate` WHERE `candidate_id`=?', [id], function (error, results) {
    cb(error, results);
  });
};