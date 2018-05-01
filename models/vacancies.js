"use strict";
const db = require('../db');
var connection = db.get;
exports.all = function(limit, filter, cb) {
  console.log(filter);
    var data = {};
    var query
    filter = undefined;
    if(filter){
      query = 'SELECT position.name \'position\', vacancy.requirements, vacancy.workExperience,vacancy.salary\n' + 'FROM `hr-app`.vacancy \n' + 'INNER JOIN `hr-app`.vacancyPosition ON vacancyPosition.id_vacancy=vacancy.id_vacancy \n' + 'INNER JOIN position ON position.id_position=vacancyPosition.id_position ' + 'WHERE (' + 'position.name LIKE \'%' + filter[0][0]||'' + '%\'';

    if (filter[1][0] && filter[1][1]) {
        query += 'AND vacancy.workExperience >= \'' + filter[1][0] + '\'' + 'AND vacancy.workExperience < \'' + filter[1][1] + '\'';
    }
    if (filter[2][0] !== "") {
        query += 'AND vacancy.salary >= ' + filter[2][0];
    }
    if (filter[3][0] !== "") {
        query += 'AND vacancy.salary <= ' + filter[3][0];
    }
    query += ') group by vacancy.id_vacancy';
    }else{
      query = 'SELECT position.name \'position\', vacancy.requirements, vacancy.workExperience,vacancy.salary\n' + 'FROM `hr-app`.vacancy \n' + 'INNER JOIN `hr-app`.vacancyPosition ON vacancyPosition.id_vacancy=vacancy.id_vacancy \n' + 'INNER JOIN position ON position.id_position=vacancyPosition.id_position group by vacancy.id_vacancy';
    }
    
    connection.query('SELECT count(*) "count" FROM(' + query + ') AS T;', function(error, results) {
        console.log(results);
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