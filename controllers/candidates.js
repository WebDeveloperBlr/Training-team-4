var Candidates = require("../models/candidates");
var fs = require('fs');

exports.all = function (req, res) {
  var limit;
  if (req.query.limit) {
    limit = (req.query.currentPage > 1) ? req.query.limit * (req.query.currentPage - 1) + ", " + req.query.limit : req.query.limit;
  } else {
    limit = "10";
  }
  Candidates.all(limit, req.query.filter, function (err, docs) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    res.send(docs);
  });

};
exports.getById = function (req, res) {
  Candidates.getByID(req.params.id, function (err, docs) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    res.send(docs);
  })
};
exports.create = function (req, res) {
  var candidate = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    position: req.body.position,
    candidateExperience_id: req.body.candidateExperience_id,
    skills: req.body.skills,
    adress: req.body.adress,
    email: req.body.email,
    telephone: req.body.telephone
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
  var candidate = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    position: req.body.position,
    candidateExperience_id: req.body.candidateExperience_id,
    skills: req.body.skills,
    adress: req.body.adress,
    email: req.body.email,
    telephone: req.body.telephone
  };
  Candidates.update(req.params.id, candidate, function (err, docs) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    res.send(candidate);
  })
};
exports.delete = function (req, res) {
  Candidates.delete(req.params.id, function (err, docs) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    res.send("Item with Id = " + req.params.id + " was deleted!");
  })
};