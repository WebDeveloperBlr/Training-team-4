var config = require('./config'),
  restify = require('restify'),
  mysql = require('mysql');
var db = require("./db");
var connection = db.get;
var candidatesController = require('./controllers/candidates');
var vacanciesController = require('./controllers/vacancies');
var fs = require('fs');
var sendFile = require("./controllers/sendFile");
var session=require("express-session");

var data = [];

const server = restify.createServer({
  name: config.name,
  version: config.version,
  url: config.hostname
});


server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
server.use(session({ secret: 'really beautiful august sunrise', cookie: { maxAge: null }}));

server.listen(process.env.PORT || 8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});


//rest api to get all results
server.get('/assets/*.*', restify.plugins.serveStatic({
  directory: __dirname
}));

server.get('/', function handler(req, res, next) {
  sendFile(req, res, next, '/login.html');
});

server.get('/HR-app', function handler(req, res, next) {
  if (req.session.access)
    sendFile(req, res, next, '/HR-app.html');
  else
    sendFile(req, res, next, '/login.html');

});

server.get('/vacancies__schedule', function handler(req, res, next) {
  if (req.session.access)
    sendFile(req, res, next, '/vacancies__schedule.html');
  else
    sendFile(req, res, next, '/login.html');
});
server.get("/register", function (req, res, next) {
  sendFile(req, res, next, '/register.html')
});

var bcrypt = require('bcrypt');
const saltRounds = 10;



server.post("/authentication", function (req, res, next) {
  connection.query("SELECT * FROM `hr-app`.Authentication", function (err, queryResults) {
    queryResults.forEach(function (row, i, results) {
      if (req.body.userLogin == row.login){
        if(bcrypt.compareSync(req.body.userPassword, row.password)){
          console.log(row.login + "  " + "logged in");
          req.session.access = true;
          console.log("true is sent");
          res.end("true");
        }else{
          // console.log("false inner");
          res.end("false");
        }
      }
      if(i==queryResults.length-1 && !req.session.access){
        // console.log("false outer");
        res.end("false");
      }
    });
  });
});


server.post("/registration", function (req, res, next) {
  var hashedPassword;
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    if (err)
      throw err;
    else {
      hashedPassword = hash;
      connection.query('INSERT INTO `hr-app`.Authentication VALUES ("' + req.body.login + '","' + hashedPassword + '",1);', function (err, results) {
        if (err) {
          res.end("false");
          throw err;
        } else {
          req.session.access=true;
          res.end("true");
        }
      });
    }
  });
});

server.post("/oninputLoginReg",function(req,res,next){
  var count=0;
  connection.query('SELECT login FROM `hr-app`.Authentication', function (err, queryResults) {
    if (err) {
      console.log(err);
      throw err;
    } else {
      queryResults.forEach(function(row,i,results){
        if(req.body.currentLogin.toLowerCase()==row.login.toLowerCase()) {
          res.end("taken");
          count++;
        }
      });
      if (count==0){
        res.end("free");}
    }
  });
});

server.get("/getNotificationCandidates",function(req,res,next){
  connection.query("SELECT p.firstName, p.secondName,c.salary,name " +
    "FROM candidate c " +
    "INNER JOIN person p " +
    "on c.id_person=p.id_person " +
    "INNER JOIN candidatePosition cP " +
    "on c.id_candidate=cP.id_candidatePosition " +
    "INNER JOIN position ps " +
    "on cP.id_position=ps.id_position " +
    "inner JOIN candidateStatus cS " +
    "on c.id_candidate=cS.id_candidate " +
    "where cS.id_status=5;",function(err, results){
    if(err) throw err;
    res.end(JSON.stringify(results));
  });
});

server.get("/getNextInterviews",function(req,res,next){
  connection.query("SELECT id_event,dateStart,dateEnd,e.id_interviewer,info,place,isRepeatable, e.id_importance,title,isVacant,name as importanceLevel,firstName,lastName " +
    "from event e " +
    "INNER JOIN importance im " +
    "on e.id_importance=im.id_importance " +
    "INNER join interviewer viewer " +
    "on e.id_interviewer=viewer.id_interviewer;",function(err,results){
    if(err) throw err;
    res.end(JSON.stringify(results));
  });
});

server.get("/getEvents",function(req,res,next){
  connection.query("SELECT id_event,dateStart,timeStart,dateEnd,timeEnd,e.id_interviewer,info,place,isRepeatable, e.id_importance,title,isVacant,name as importanceLevel,firstName,lastName,allDay " +
    "from event e " +
    "INNER JOIN importance im " +
    "on e.id_importance=im.id_importance " +
    "INNER join interviewer viewer " +
    "on e.id_interviewer=viewer.id_interviewer;",function(err, results){
    if(err) throw err;
    res.end(JSON.stringify(results));
  });
});

server.post("/eventCreate",function(req,res,next){
  var defStart="09:00:00";
  var defEnd="10:00:00";
  var defInfo="No info yet";
  var defPlace="No place yet";
  connection.query('INSERT INTO `hr-app`.event(dateStart,dateEnd,title,timeStart,timeEnd,id_interviewer,info,place,isRepeatable,id_importance,isVacant,allDay)'+
    'VALUES("'+req.body.start+'","'+req.body.end+'","'+req.body.title+'","'+defStart+'","'+defEnd+'","'+1+'","'+defInfo+'","'+defPlace+'","'+false+'","'+1+'","'+true+'","'+false+'");',function(err,results){
    if (err) throw err;
    else res.end();
  });
});

server.get("/getInterviewers",function(req,res,next){
  connection.query("SELECT * FROM interviewer ;",function(err,results){
    if
    (err) throw err;
    else
      res.end(JSON.stringify(results));
  });
});

server.post("/updateEvent",function(req,res,next){
  connection.query(' ' +
    'update event ' +
    'set ' +
    'dateStart="'+req.body.start.split(`T`)[0]+'", ' +
    '  timeStart="'+req.body.start.split(`T`)[1]+'", ' +
    '  dateEnd="'+req.body.end.split(`T`)[0]+'", ' +
    '  timeEnd="'+req.body.end.split(`T`)[1]+'", ' +
    '  id_interviewer='+req.body.interviewer+', ' +
    '  info="'+req.body.info+'", ' +
    '  place="'+req.body.place+'", ' +
    '  isRepeatable='+req.body.repeat+', ' +
    '  id_importance='+(req.body.colorIndex+1)+', ' +
    '  title="'+req.body.title+'", ' +
    '  isVacant='+req.body.isVacant+', ' +
    '  allDay='+req.body.allDay+' ' +
    'where id_event='+req.body.id+';',function(err,results){
    if (err) throw err;
    res.end();
  });
});


server.get('/candidates', candidatesController.all);
server.get('/vacancies', vacanciesController.all);
server.get('/candidates/:id', candidatesController.getById);


//rest api to create a new record into mysql database
server.post('/', candidatesController.create);
server.put('/candidates/:id', candidatesController.update);
server.del('/:id', candidatesController.delete);

