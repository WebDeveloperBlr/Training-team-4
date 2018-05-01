var config = require('./config'),
  restify = require('restify');
var candidatesController = require('./controllers/candidates');
var vacanciesController = require('./controllers/vacancies');
var fs = require('fs');
const db = require('./db');
var connection = db.get;

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
server.get('*.js', restify.plugins.serveStatic({
  directory: __dirname + "/dist/"
}));

server.get('/', function handler(req, res, next) {
  fs.readFile(__dirname + '/dist/index.html',
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

server.get("/getNewCandidates",function(req,res,next){
  connection.query("SELECT c.id_candidate,p.firstName, p.secondName,c.salary,name " +
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
  connection.query("SELECT id_event,dateStart,timeStart,timeEnd,title " +
    "from event e " +
    "INNER JOIN importance im " +
    "on e.id_importance=im.id_importance " +
    "INNER join interviewer viewer " +
    "on e.id_interviewer=viewer.id_interviewer;",function(err,results){
    if(err) throw err;
    res.end(JSON.stringify(results));
  });
});

server.get('/candidates', candidatesController.all);
server.get('/vacancies', vacanciesController.all);
server.get('/candidates/:id', candidatesController.getById);


//rest api to create a new record into mysql database
server.post('/', candidatesController.create);
server.put('/candidates/:id', candidatesController.update);
server.del('/:id', candidatesController.delete);


