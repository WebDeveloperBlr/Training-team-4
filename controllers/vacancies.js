var  Vacancies = require("./../models/Vacancies");

exports.all = function(req, res){
  var limit;
  if(req.query.limit){
    limit = (req.query.currentPage>1)?req.query.limit*(req.query.currentPage-1)+", "+req.query.limit:req.query.limit;
  }else{
    limit = "10";
  }


  Vacancies.all(limit,req.query.filter,function (err, docs) {
    if(err){
      console.log(err);
      return res.sendStatus(500);
    }
    res.send(docs);
  });

};
exports.getById = function (req,res) {
  Vacancies.getByID(req.params.id, function (err, docs) {
    if(err){
      console.log(err);
      return res.sendStatus(500);
    }
    res.send(docs);
  })
};
exports.create = function (req,res) {
  var Vacancies ={
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    position: req.body.position,
    VacanciesExperience_id: req.body.VacanciesExperience_id,
    skills: req.body.skills,
    adress: req.body.adress,
    email: req.body.email,
    telephone: req.body.telephone
  };
  Vacancies.create(Vacancies, function (err, docs) {
    if(err){
      console.log(err);
      return res.sendStatus(500);
    }
    res.send(Vacancies);
  })
};
exports.update = function (req,res) {
  var Vacancies ={
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    position: req.body.position,
    VacanciesExperience_id: req.body.VacanciesExperience_id,
    skills: req.body.skills,
    adress: req.body.adress,
    email: req.body.email,
    telephone: req.body.telephone
  };
  Vacancies.update(req.params.id,Vacancies, function (err, docs) {
    if(err){
      console.log(err);
      return res.sendStatus(500);
    }
    res.send(Vacancies);
  })
};
exports.delete = function (req,res) {
  Vacancies.delete(req.params.id, function (err, docs) {
    if(err){
      console.log(err);
      return res.sendStatus(500);
    }
    res.send("Item with Id = "+req.params.id+" was deleted!");
  })
};