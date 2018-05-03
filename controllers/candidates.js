var Candidates = require("./../models/candidates");
var fs = require('fs');

exports.all = function (req, res) {
  var limit;
  if (req.query.limit) {
    limit = (req.query.currentPage > 1) ? req.query.limit * (req.query.currentPage - 1) + ", " + req.query.limit : req.query.limit;
  } else {
    limit = "10";
  }
  res.header('Access-Control-Allow-Origin','*');
  Candidates.all(limit, req.query.filter, function (err, docs) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    res.send(docs);
  });

};
exports.getById = function (req, res) {
  res.header('Access-Control-Allow-Origin','*');
  Candidates.getByID(req.params.id, function (err, docs) {
    if (err.length>0) {
      console.log(err[0]);
      return res.send(err[0]);
    }
    res.send(docs);
  })
};
exports.create = function (req, res) {
  res.header('Access-Control-Allow-Origin','*');
  var candidate = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    position: req.body.position,
    candidateExperience_id: req.body.candidateExperience_id,
    skills: req.body.skills,
    adress: req.body.adress,
    email: req.body.email,
    telephone: req.body.telephone,
    status: req.body.status
  };
  Candidates.create(candidate, function (err, docs) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    res.send(candidate);
  })
};
exports.update = function (req, res) {
  res.header('Access-Control-Allow-Origin','*');
  var candidate = {
    firstName: req.body.docs[0].firstName||"",
    lastName: req.body.docs[0].lastName||"",
    position: req.body.docs[0].position||"",
    address: req.body.docs[0].address||"",
    email: req.body.docs[0].email||"",
    telephone: req.body.docs[0].telephone||"",
    salary: req.body.docs[0].salary||"",
    status: req.body.docs[0].status||"",
    newSkills: req.body.newSkills||[],
    oldSkills: req.body.oldSkills||[],
    exp: req.body.exp||[],
    newExp: req.body.newExp||[],
    oldExp: req.body.oldExp||[]
  };

 // console.log(candidate);
  //console.log(req.body.docs);
  Candidates.update(req.params.id, candidate, function (err, docs) {
    if (err) {
      console.log(err);
      return res.send(err);
    }
    res.send("ok");
  })
};
exports.delete = function (req, res) {
  res.header('Access-Control-Allow-Origin','*');
  Candidates.delete(req.params.id, function (err, docs) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    res.send("Item with Id = " + req.params.id + " was deleted!");
  })
};

exports.getNewCandidates=function(req,res){
  Candidates.getNewCandidates(function(results){
    res.end(JSON.stringify(results));
  });
};
