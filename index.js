var config = require('./config'),
  restify = require('restify'),
  mysql = require('mysql');
var db=require("./db");
var connection=db.get;
var candidatesController = require('./controllers/candidates');
var vacanciesController = require('./controllers/vacancies');
var fs = require('fs');

var data = [];

var access=false;
setInterval(function(){
    access=false;
},120000);

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
  fs.readFile(__dirname + '/login.html',
    function (err, data) {
      if (err) {
        next(err);
        return;
      }
      res.write(data);
      res.end();
      next();
    });
});

server.get('/HR-app', function handler(req, res, next) {
    if(access){
    fs.readFile(__dirname + '/HR-app.html',
        function (err, data) {
            if (err) {
                next(err);
                return;
            }
            res.write(data);
            res.end();
            next();
        });
    }else{
        fs.readFile(__dirname + '/login.html',
            function (err, data) {
                if (err) {
                    next(err);
                    return;
                }
                res.write(data);
                res.end();
                next();
            });
    }
});

server.get('/vacancies__schedule', function handler(req, res, next) {
    fs.readFile(__dirname + '/vacancies__schedule.html',
        function (err, data) {
            if (err) {
                next(err);
                return;
            }
            res.write(data);
            res.end();
            next();
        });
});

server.post("/authentication",function(req,res,next){
    connection.query("SELECT * FROM `hr-app`.Authentication",function(err,results){
        var count=0;
        results.forEach(function(row,i,results){
            if(req.body.userLogin==row.login){
                if(req.body.userPassword==row.password){

                    fs.readFile(__dirname+ "/HR-app.html",function(err,content){
                        if(err) throw err;
                        else{
                            count++;
                            access=true;
                            console.log(row.login+"  "+"logged in");
                            res.end("true");
                        }
                    });
                }else {
                    console.log("false");
                    res.end("false");
                }
            }else {
                console.log("false");
                res.end("false");
            }
        });
    });
});

server.get('/candidates', candidatesController.all);
server.get('/vacancies', vacanciesController.all);
server.get('/candidates/:id', candidatesController.getById);


//rest api to create a new record into mysql database
server.post('/', candidatesController.create);
server.put('/candidates/:id', candidatesController.update);
server.del('/:id', candidatesController.delete);


