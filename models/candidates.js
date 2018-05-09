"use strict";
const db = require('../db');

var connection = db.get;


exports.all = function (limit, filter, cb) {
  var data = {};
  var error = [];
  console.log(filter);
  try{
    filter = JSON.parse(filter);
  }
  catch(e){
    filter = null;
  }

  var query = 'SELECT candidate.id_candidate,concat(per.firstName,\' \',per.secondName) \'name\',candidate.salary, pos.name "position", statusName.name "status" ' +
    'FROM `hr-app`.candidate ' +
    'INNER JOIN candidateStatus cs ON cs.id_candidate=candidate.id_candidate ' +
    'INNER JOIN statusName ON statusName.id_status = cs.id_status ' +
    'INNER JOIN candidatePosition cp ON cp.id_candidate = candidate.id_candidate ' +
    'INNER JOIN position pos ON pos.id_position = cp.id_position ' +
    'INNER JOIN person per ON per.id_person = candidate.id_person ';
  console.log(filter);

  if (filter&&filter.name!==undefined) {
    query += 'WHERE ( ';
    query += '(per.firstName LIKE \'%' + filter.name + '%\' OR  per.secondName LIKE \'%' + filter.name + '%\')';
    if(filter.statusName&&filter.statusName!=='Any'){
      query += 'AND statusName.name = \'' + filter.statusName + '\'';
    }
    query += ")"
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
  var data = {};
  var query = 'SELECT candidate.id_candidate,candidate.telephone,candidate.email,candidate.address,concat(per.firstName,\' \',per.secondName) "name",candidate.salary, pos.name "position", statusName.name "status" ' +
    '    FROM `hr-app`.candidate ' +
    '    INNER JOIN candidateStatus cs ON cs.id_candidate=candidate.id_candidate ' +
    '    INNER JOIN statusName ON statusName.id_status = cs.id_status ' +
    '    INNER JOIN candidatePosition cp ON cp.id_candidate = candidate.id_candidate ' +
    '    INNER JOIN position pos ON pos.id_position = cp.id_position ' +
    '    INNER JOIN person per ON per.id_person = candidate.id_person ' +
    ' WHERE candidate.id_candidate ='+id;
  var query2 = 'SELECT experience.id_experience,experience.company, experience.dateStart, experience.dateEnd, experience.position, experience.info FROM `hr-app`.experience\n' +
    'inner join candidate on candidate.id_candidate = experience.id_candidate\n' +
    'where experience.id_candidate ='+id +
    ' group by id_experience order by experience.dateStart\n' +
    ';';
  var query3 = 'SELECT skills.name FROM `hr-app`.candidate \n' +
    'INNER JOIN candidateSkills cs ON cs.id_candidate=candidate.id_candidate \n' +
    'INNER JOIN skills ON skills.id_skills = cs.id_skills \n' +
    'where candidate.id_candidate ='+id;
  var query4 = 'SELECT name FROM `hr-app`.statusName';
  var query5 = 'SELECT name FROM `hr-app`.position';
  var getAllSkills = 'SELECT name FROM `hr-app`.skills';
  var error = [];

  var promiseQuery1 = new Promise((res,rej)=>{
    connection.query(query, [id], function (error, results) {
      data.docs = results;
      res();
    });
  });
  var promiseQuery2 = new Promise((res,rej)=>{
    connection.query(query2, [id], function (error, results) {
      data.exp = results;
      res();
    });
  });
  var promiseQuery3 = new Promise((res,rej)=>{
    connection.query(query3, [id], function (error, results) {
      data.skills = results;
      res();
    });
  });
  var promiseQuery4 = new Promise((res,rej)=>{
    connection.query(query4, [id], function (error, results) {
      data.allStatuses = results;
      res();
    });
  });
  var promiseQuery5 = new Promise((res,rej)=>{
    connection.query(query5, [id], function (error, results) {
      data.allPositions = results;
      res();
    });
  });
  var promiseGetAllSkills = new Promise((res,rej)=>{
    connection.query(getAllSkills, [id], function (error, results) {
      data.allSkills = results;
      res();
    });
  });

  Promise.all([promiseQuery1,promiseQuery2,promiseQuery3,promiseQuery4,promiseQuery5,promiseGetAllSkills]).then(()=>{
    console.log(data);
    cb(error, data);
  });

};


/*exports.create = function (candidate, cb) {
  connection.query('INSERT INTO candidate SET ?', candidate, function (error, results) {
    cb(error, results);
  });
};*/
exports.update = function (id, candidate, cb) {
  //console.log(candidate);
  var promises = [];
  var errors = null;
  var updateCandidate = 'UPDATE `candidate` ' +
    'inner join person on person.id_person = candidate.id_person ' +
    'inner join candidatePosition cp on cp.id_candidate = candidate.id_candidate ' +
    'inner join position p on p.id_position = cp.id_position ' +
    'inner join candidateStatus cs on cs.id_candidate = candidate.id_candidate ' +
    'inner join statusName sn on sn.id_status = cs.id_status ' +
    'SET candidate.`salary`= ?, candidate.`telephone`= ?, ' +
    'candidate.`email`= ?, candidate.`address`= ?, ' +
    'person.`firstName`= ?,person.`secondName`= ?, ' +
    'cp.id_position=(select position.id_position from position where position.name = ?), ' +
    'cs.id_status=(select statusName.id_status from statusName where statusName.name= ?) '+
    'WHERE candidate.`id_candidate`= ?';
  var promiseUpdateCandidate = new Promise(function (res, rej) {
    connection.query(updateCandidate, [candidate.salary,candidate.telephone, candidate.email, candidate.address, candidate.firstName, candidate.lastName, candidate.position, candidate.status, id], function (error, results) {
      if(error){
        errors=error;
      }
      res();
    });
  });
  promises.push(promiseUpdateCandidate);


  if(candidate.newSkills.length>0){
    var addNewSkills = "";
    candidate.newSkills.forEach(function (item) {
      addNewSkills = 'insert into candidateSkills (candidateSkills.id_candidate, candidateSkills.id_skills) \n' +
        'values ('+id+',(select id_skills from skills where skills.name = \''+item+'\'));\n';
      var promiseAddNewSkills = new Promise((res,rej)=>{
        connection.query(addNewSkills, function (error, results) {
          if(error){
            errors=error;
          }
          res();
        });
      });
      promises.push(promiseAddNewSkills);
    });
  }
  if(candidate.oldSkills.length>0){
    var deleteQuery;
    candidate.oldSkills.forEach(function (item) {
      deleteQuery = 'DELETE candidateSkills FROM candidateSkills \n' +
        'WHERE candidateSkills.id_candidate = '+id+' and candidateSkills.id_skills=(select skills.id_skills from skills where skills.name="'+item+'")\n' +
        ';';
      var promiseDeleteOldSkills = new Promise((res,rej)=>{
        connection.query(deleteQuery, function (error, results) {
          if(error){
            errors=error;
          }
          res();
        });
      });
      promises.push(promiseDeleteOldSkills);
    });
  }

  if(candidate.exp.length>0){
    var updateExpQuery = '';
    candidate.exp.forEach((item)=>{
      if(item.dateEnd){
        updateExpQuery = 'UPDATE experience \n' +
          'SET experience.dateStart= "' + item.dateStart + '",' +
          'experience.dateEnd= "' + item.dateEnd + '",' +
          'experience.company= "' + item.company + '",' +
          'experience.position= "' + item.position + '",' +
          'experience.info= "' + item.info + '" ' +
          'WHERE experience.id_experience=' + item.id_experience + ';';
      }else{
        updateExpQuery = 'UPDATE experience \n' +
          'SET experience.dateStart= "' + item.dateStart + '",' +
          'experience.dateEnd= ' + null + ',' +
          'experience.company= "' + item.company + '",' +
          'experience.position= "' + item.position + '",' +
          'experience.info= "' + item.info + '" ' +
          'WHERE experience.id_experience=' + item.id_experience + ';';
      }

      console.log(updateExpQuery);
      var promiseUpdateExp = new Promise((res, rej)=>{
        connection.query(updateExpQuery, function (error, results) {
          if(error){
            errors=error;
          }
          res();
        })
      });
      promises.push(promiseUpdateExp);

    });
  }

  if(candidate.newExp.length>0){
    var addExpQuery;
    candidate.newExp.forEach(function (item) {
      addExpQuery = 'INSERT INTO experience (`company`, `dateStart`, `dateEnd`, `position`, `info`, `id_candidate`) ' +
        'VALUES ("'+item.company+'", "'+item.dateStart+'", "'+item.dateEnd+'", "'+item.position+'", "'+item.info+'" , ' + id + ');';
      var promiseAddNewExp = new Promise((res,rej)=>{
        connection.query(addExpQuery, function (error, results) {
          if(error){
            errors=error;
          }
          res();
        });
      });
      promises.push(promiseAddNewExp);
    });
  }

  if(candidate.oldExp.length>0){
    var deleteExpQuery;
    candidate.oldExp.forEach(function (item) {
      deleteExpQuery = 'DELETE experience FROM experience ' +
        'WHERE experience.id_experience = '+item.id_experience+';';
      var promiseDeleteOldExp = new Promise((res,rej)=>{
        connection.query(deleteExpQuery, function (error, results) {
          if(error){
            errors=error;
          }
          res();
        });
      });
      promises.push(promiseDeleteOldExp);
    });
  }

  Promise.all(promises).then(()=>{cb(errors,"ok")});
};
exports.delete = function (id, cb) {
  connection.query('DELETE FROM `candidate` WHERE `candidate_id`=?', [id], function (error, results) {
    cb(error, results);
  });
};
