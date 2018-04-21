var config = require('./config'),
  restify = require('restify'),
  mysql = require('mysql');
var db = require("./db");
var connection = db.get;
var candidatesController = require('./controllers/candidates');
var vacanciesController = require('./controllers/vacancies');
var fs = require('fs');
var sendFile = require("./controllers/sendFile");


var data = [];


var access = false;

setInterval(function () {
  access = false;
}, 60000);

const server = restify.createServer({
  name: config.name,
  version: config.version,
  url: config.hostname
});


server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

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
  if (access)
    sendFile(req, res, next, '/HR-app.html');
  else
    sendFile(req, res, next, '/login.html');
  
});

server.get('/vacancies__schedule', function handler(req, res, next) {
  if (access)
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
  connection.query("SELECT * FROM `hr-app`.Authentication", function (err, results) {
    results.forEach(function (row, i, results) {
      bcrypt.compare(req.body.userPassword, row.password, function (err, resHash) {
        if (resHash) {
          access = true;
          console.log(row.login + "  " + "logged in");
          res.end("true");
        }
        if (i == (results.length - 1) && access == false) {
          res.end("false");
        }
      });
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
      connection.query('INSERT INTO `hr-app`.Authentication VALUES ("' + req.body.login + '","' + hashedPassword + '");', function (err, results) {
        if (err) {
          res.end("false");
          throw err;
        } else {
          access = true;
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
        if(req.body.currentLogin==row.login) {
          res.end("taken");
          count++;
        }
      });
      if (count==0){
        res.end("free");}
    }
  });
});

server.get('/candidates', candidatesController.all);
server.get('/vacancies', vacanciesController.all);
server.get('/candidates/:id', candidatesController.getById);


//rest api to create a new record into mysql database
server.post('/', candidatesController.create);
server.put('/candidates/:id', candidatesController.update);
server.del('/:id', candidatesController.delete);


