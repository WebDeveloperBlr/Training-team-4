var config = require('./config'),
  restify = require('restify');
var candidatesController = require('./controllers/candidates');
var vacanciesController = require('./controllers/vacancies');
var eventsController=require("./controllers/events");
var fs = require('fs');
const db = require('./db');
var connection = db.get;
const corsMiddleware = require('restify-cors-middleware');

const cors = corsMiddleware({
  preflightMaxAge: 5, //Optional
  origins: ['http://localhost:4200'],
  allowHeaders: ['application/json']
});




const server = restify.createServer({
  name: config.name,
  version: config.version,
  url: config.hostname
});

server.pre(cors.preflight);
server.use(cors.actual);
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


server.get("/getNewCandidates",candidatesController.getNewCandidates);
server.get("/getNextInterviews",eventsController.getNextInterviews);

server.get('/candidates', candidatesController.all);
server.get('/vacancies', vacanciesController.all);
server.get('/candidates/:id', candidatesController.getById);


//rest api to create a new record into mysql database
server.post('/', candidatesController.create);
server.put('/candidates/:id', candidatesController.update);
server.del('/:id', candidatesController.delete);


