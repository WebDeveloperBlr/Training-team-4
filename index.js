var config = require('./config'),
  restify = require('restify'),
  mysql = require('mysql');
var db=require("./db");
var connection=db.get;
var candidatesController = require('./controllers/candidates');
var vacanciesController = require('./controllers/vacancies');
var fs = require('fs');
var sendFile=require("./controllers/sendFile");


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
  sendFile(req,res,next,'/login.html');
});

server.get('/HR-app', function handler(req, res, next) {
    if(access)
        sendFile(req,res,next,'/HR-app.html');
    else
        sendFile(req,res,next,'/login.html');

});

server.get('/vacancies__schedule', function handler(req, res, next) {
    if(access)
        sendFile(req,res,next,'/vacancies__schedule.html');
    else
        sendFile(req,res,next,'/login.html');
});
server.get("/register",function(req,res,next){
    sendFile(req,res,next,'/register.html')
});

server.post("/authentication",function(req,res,next){
    connection.query("SELECT * FROM `hr-app`.Authentication",function(err,results){
        var count=0;
        results.forEach(function(row,i,results){
            if(req.body.userLogin==row.login){
                if(req.body.userPassword==row.password){
                     count++;
                     access=true;
                     console.log(row.login+"  "+"logged in");
                     res.end("true");
                }
            }
        });
        if(!access)
            res.end("false");
    });
});

server.post("/registration",function(req,res,next){
    connection.query('INSERT INTO `hr-app`.Authentication VALUES ("'+req.body.login+'","'+req.body.password+'");',function(err,results){
        if(err){
            console.error(err);
            throw err;
            res.end("false");
        }else{
            access=true;
            console.log(req.body.login+" inserted into db with pass-> "+req.body.password);
            res.end("true");
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


