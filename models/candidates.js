"use strict";
const db = require('../db');

var connection = db.get;

exports.all = function (limit, filter, cb) {
  var data = {};
  var error = null;
  let promises = [];
  try {
    filter = JSON.parse(filter);
  }
  catch (e) {
    filter = null;
  }

  var getAllStatusesQuery = 'select statusName.name from statusName;';
  let promiseGetAllStatuses = new Promise((res) => {
    connection.query(getAllStatusesQuery, (error, results) => {
      if (error) {
        console.log(error);
      }
      data.allStatuses = results;
      res();
    });
  });
  promises.push(promiseGetAllStatuses);


  var getCandidatesQuery = 'SELECT candidate.id_candidate,concat(per.firstName,\' \',per.secondName) \'name\',candidate.salary, pos.name "position", statusName.name "status" ' +
    'FROM `hr-app`.candidate ' +
    'INNER JOIN candidatePosition cp ON cp.id_candidate = candidate.id_candidate ' +
    'INNER JOIN statusName ON statusName.id_status = cp.id_status ' +
    'INNER JOIN position pos ON pos.id_position = cp.id_position ' +
    'INNER JOIN person per ON per.id_person = candidate.id_person ';
  if (filter && filter.name !== undefined) {
    getCandidatesQuery += 'WHERE ( ';
    getCandidatesQuery += '(per.firstName LIKE \'%' + filter.name + '%\' OR  per.secondName LIKE \'%' + filter.name + '%\')';
    if (filter.statusName && filter.statusName !== 'Any') {
      getCandidatesQuery += 'AND statusName.name = \'' + filter.statusName + '\'';
    }
    if (filter.position) {
      getCandidatesQuery += 'AND pos.name LIKE \'%' + filter.position + '%\'';
    }
    getCandidatesQuery += ")"
  }

  let promiseGetCandidates = new Promise((res) => {
    connection.query('SELECT count(*) "count" FROM(' + getCandidatesQuery + 'group by id_candidate ) AS T;', function (error, results) {
      data.count = results[0].count;
      connection.query(getCandidatesQuery + 'group by id_candidate ORDER BY id_candidate ASC LIMIT ' + limit + ';', function (error, results) {
        data.docs = results;
        res();
      });
    });
  });
  promises.push(promiseGetCandidates);

  Promise.all(promises).then(() => {
    cb(error, data);
  });
};

function extend(a, b) {
  for (var prop in b) {
    if (Object.prototype.toString.call(b[prop]) == '[object Array]' &&
      Object.prototype.toString.call(a[prop]) == '[object Array]') { // is array?
      a[prop] = a[prop].concat(b[prop]);
    } else {
      if (b[prop] === Object(b[prop]) &&
        a[prop] === Object(a[prop])) { // is object?
        extend(a[prop], b[prop]);
      }
      else {
        a[prop] = b[prop];
      }
    }
  }
}

exports.getByID = function (id, position, cb) {
  var data = {
    docs: {
      exp: [],
      skills: []
    }
  };
  var query = 'SELECT candidate.id_candidate,candidate.telephone,candidate.email,candidate.address,concat(per.firstName,\' \',per.secondName) "name",candidate.salary ' +
    '    FROM `hr-app`.candidate ' +
    '    INNER JOIN person per ON per.id_person = candidate.id_person ' +
    ' WHERE candidate.id_candidate =' + id;
  if (position) {
    query += ' AND cp.id_position = (select id_position from position where position.name = "' + position + '")';
  }
  var query2 = 'SELECT experience.id_experience,experience.company, experience.dateStart, experience.dateEnd, experience.position, experience.info FROM `hr-app`.experience\n' +
    'inner join candidate on candidate.id_candidate = experience.id_candidate\n' +
    'where experience.id_candidate =' + id +
    ' group by id_experience order by experience.dateStart\n' +
    ';';
  var query3 = 'SELECT skills.name FROM `hr-app`.candidate \n' +
    'INNER JOIN candidateSkills cs ON cs.id_candidate=candidate.id_candidate \n' +
    'INNER JOIN skills ON skills.id_skills = cs.id_skills \n' +
    'where candidate.id_candidate =' + id;
  var query4 = 'SELECT name FROM `hr-app`.statusName';
  var query5 = 'SELECT name FROM `hr-app`.position';
  var getAllSkills = 'SELECT name FROM `hr-app`.skills';
  let queryCandidatePositions = 'select position.id_position ,position.name, statusName.name "status" ' +
    'from candidatePosition ' +
    'inner join position on position.id_position = candidatePosition.id_position ' +
    'inner join statusName on statusName.id_status = candidatePosition.id_status ' +
    'where candidatePosition.deleted=0 AND candidatePosition.id_candidate =' + id;
  console.log(queryCandidatePositions);
  var error = [];

  var promiseQuery1 = new Promise((res, rej) => {
    connection.query(query, [id], function (error, results) {
      if (results && results[0]) {
        extend(data.docs, results[0]);
      }
      res();
    });
  });
  var promiseQuery2 = new Promise((res, rej) => {
    connection.query(query2, [id], function (error, results) {
      data.docs.exp = results;
      res();
    });
  });
  var promiseQuery3 = new Promise((res, rej) => {
    connection.query(query3, [id], function (error, results) {
      data.docs.skills = results;
      res();
    });
  });
  var promiseQuery4 = new Promise((res, rej) => {
    connection.query(query4, [id], function (error, results) {
      data.allStatuses = results;
      res();
    });
  });
  var promiseQuery5 = new Promise((res, rej) => {
    connection.query(query5, [id], function (error, results) {
      data.allPositions = results;
      res();
    });
  });
  var promiseGetAllSkills = new Promise((res, rej) => {
    connection.query(getAllSkills, [id], function (error, results) {
      data.allSkills = results;
      res();
    });
  });
  let promiseCandidatePositions = new Promise((res, rej) => {
    connection.query(queryCandidatePositions, (error, results) => {
      data.docs.positions = results;
      res();
    })
  });

  Promise.all([promiseQuery1, promiseQuery2, promiseQuery3, promiseQuery4, promiseQuery5, promiseGetAllSkills, promiseCandidatePositions]).then(() => {
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
    'SET candidate.`salary`= ?, candidate.`telephone`= ?, ' +
    'candidate.`email`= ?, candidate.`address`= ?, ' +
    'person.`firstName`= ?,person.`secondName`= ? ' +
    'WHERE candidate.`id_candidate`= ?';
  console.log(candidate);
  var promiseUpdateCandidate = new Promise(function (res, rej) {
    connection.query(updateCandidate,
      [candidate.salary, candidate.telephone, candidate.email,
        candidate.address, candidate.firstName, candidate.lastName, id],
      function (error, results) {
        if (error) {
          errors = error;
        }
        res();
      });
  });
  promises.push(promiseUpdateCandidate);


  if (candidate.newSkills) {
    var addNewSkills = "";
    candidate.newSkills.forEach(function (item) {
      addNewSkills = 'insert into candidateSkills (candidateSkills.id_candidate, candidateSkills.id_skills) \n' +
        'values (' + id + ',(select id_skills from skills where skills.name = \'' + item.name + '\'));\n';
      var promiseAddNewSkills = new Promise((res, rej) => {
        connection.query(addNewSkills, function (error, results) {
          if (error) {
            errors = error;
          }
          res();
        });
      });
      promises.push(promiseAddNewSkills);
    });
  }
  if (candidate.oldSkills) {
    var deleteQuery;
    candidate.oldSkills.forEach(function (item) {
      deleteQuery = 'DELETE candidateSkills FROM candidateSkills \n' +
        'WHERE candidateSkills.id_candidate = ' + id + ' and candidateSkills.id_skills=(select skills.id_skills from skills where skills.name="' + item.name + '")\n' +
        ';';
      var promiseDeleteOldSkills = new Promise((res, rej) => {
        connection.query(deleteQuery, function (error, results) {
          if (error) {
            errors = error;
          }
          res();
        });
      });
      promises.push(promiseDeleteOldSkills);
    });
  }

  if (candidate.exp) {
    var updateExpQuery = '';
    candidate.exp.forEach((item) => {
      if (item.dateEnd) {
        updateExpQuery = 'UPDATE experience \n' +
          'SET experience.dateStart= "' + item.dateStart + '",' +
          'experience.dateEnd= "' + item.dateEnd + '",' +
          'experience.company= "' + item.company + '",' +
          'experience.position= "' + item.position + '",' +
          'experience.info= "' + item.info + '" ' +
          'WHERE experience.id_experience=' + item.id_experience + ';';
      } else {
        updateExpQuery = 'UPDATE experience \n' +
          'SET experience.dateStart= "' + item.dateStart + '",' +
          'experience.dateEnd= ' + null + ',' +
          'experience.company= "' + item.company + '",' +
          'experience.position= "' + item.position + '",' +
          'experience.info= "' + item.info + '" ' +
          'WHERE experience.id_experience=' + item.id_experience + ';';
      }

      var promiseUpdateExp = new Promise((res, rej) => {
        connection.query(updateExpQuery, function (error, results) {
          if (error) {
            errors = error;
          }
          res();
        })
      });
      promises.push(promiseUpdateExp);

    });
  }

  if (candidate.newExp) {
    var addExpQuery;
    candidate.newExp.forEach(function (item) {
      addExpQuery = 'INSERT INTO experience (`company`, `dateStart`, `dateEnd`, `position`, `info`, `id_candidate`) ' +
        'VALUES ("' + item.company + '", "' + item.dateStart + '", "' + item.dateEnd + '", "' + item.position + '", "' + item.info + '" , ' + id + ');';
      var promiseAddNewExp = new Promise((res, rej) => {
        connection.query(addExpQuery, function (error, results) {
          if (error) {
            errors = error;
          }
          res();
        });
      });
      promises.push(promiseAddNewExp);
    });
  }

  if (candidate.oldExp) {
    var deleteExpQuery;
    candidate.oldExp.forEach(function (item) {
      deleteExpQuery = 'DELETE experience FROM experience ' +
        'WHERE experience.id_experience = ' + item.id_experience + ';';
      var promiseDeleteOldExp = new Promise((res, rej) => {
        connection.query(deleteExpQuery, function (error, results) {
          if (error) {
            errors = error;
          }
          res();
        });
      });
      promises.push(promiseDeleteOldExp);
    });
  }

  if (candidate.newPositions && candidate.newPositions.length > 0) {
    candidate.newPositions.forEach((newPos) => {
      let addPositionQuery = 'insert into candidatePosition (`id_candidate`,`id_position`,`id_status`) ' +
        'values (' + id + ', ' +
        '(select position.id_position from position where position.name= "' + newPos.name + '"), ' +
        '(select statusName.id_status from statusName where statusName.name = "' + newPos.status + '") ' +
        ');';
      let promiseAddPosition = new Promise((res, rej) => {
        connection.query(addPositionQuery, function (error, results) {
          if (error) {
            errors = error;
          }
          res();
        });
      });
      promises.push(promiseAddPosition);
    });
  }

  if (candidate.positions && candidate.positions.length > 0) {
    candidate.positions.forEach((position, index) => {
      let updatePositionQuery = 'UPDATE candidate ' +
        'Inner join candidatePosition cp on cp.id_candidate = candidate.id_candidate ' +
        'set cp.id_status = (select id_status from statusName where statusName.name =?) ' +
        'where candidate.id_candidate=? AND cp.id_position =? ';
      let promiseUpdatePosition = new Promise((res, rej) => {
        connection.query(updatePositionQuery, [position.status, id, position.id_position], function (error, results) {
          if (error) {
            console.log(error);
          }
          res();
        })
      });
      promises.push(promiseUpdatePosition);
    });
  }

  if (candidate.oldPositions && candidate.oldPositions.length > 0 && candidate.oldPositions.length < candidate.positions.length) {
    candidate.oldPositions.forEach((oldPos) => {
      let removePositionQuery = 'update candidatePosition set candidatePosition.deleted = 1 ' +
        'where candidatePosition.id_position = ' +
        '(select position.id_position from position where position.name= "' + oldPos.name + '") AND ' +
        'candidatePosition.id_candidate = ' + id +
        ' ;';
      console.log(removePositionQuery);
      let promiseRemovePosition = new Promise((res, rej) => {
        connection.query(removePositionQuery, function (error, results) {
          if (error) {
            errors = error;
          }
          res();
        });
      });
      promises.push(promiseRemovePosition);
    });
  }

  Promise.all(promises).then(() => {
    cb(errors, "ok")
  });
};
exports.delete = function (id, cb) {
  connection.query('DELETE FROM `candidate` WHERE `candidate_id`=?', [id], function (error, results) {
    cb(error, results);
  });
};


exports.getNewCandidates = function (callback) {
  connection.query("SELECT c.id_candidate,p.firstName, p.secondName,c.salary,name " +
    "FROM candidate c " +
    "INNER JOIN person p " +
    "on c.id_person=p.id_person " +
    "INNER JOIN candidatePosition cP " +
    "on c.id_candidate=cP.id_candidatePosition " +
    "INNER JOIN position ps " +
    "on cP.id_position=ps.id_position " +
    "where cP.id_status=5;", function (err, results) {
    if (err) throw err;
    callback(results);
  })
}
