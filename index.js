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
  connection.query("SELECT id_event,dateStart,timeStart,dateEnd,timeEnd,e.id_interviewer,info,place,isRepeatable, e.id_importance,title,isVacant,name as importanceLevel,viewer.firstName,viewer.lastName,allDay,e.id_candidate,per.firstName as candName, per.secondName as candSurname \n" +
    "from event e  \n" +
    "INNER JOIN importance im  \n" +
    "on e.id_importance=im.id_importance  \n" +
    "INNER join interviewer viewer  \n" +
    "on e.id_interviewer=viewer.id_interviewer \n" +
    "INNER join candidate can \n" +
    "on e.id_candidate=can.id_candidate\n" +
    "INNER join person per \n" +
    "on can.id_person=per.id_person;",function(err, results){
    if(err) throw err;
    res.end(JSON.stringify(results));
  });
});

server.post("/eventCreate",function(req,res,next){
  var defStart="09:00:00";
  var defEnd="10:00:00";
  var defInfo="No info yet";
  var defPlace="No place yet";
  connection.query('INSERT INTO `hr-app`.event(dateStart,dateEnd,title,timeStart,timeEnd,id_interviewer,info,place,isRepeatable,id_importance,isVacant,allDay,id_candidate)'+
    'VALUES("'+req.body.start+'","'+req.body.end+'","'+req.body.title+'","'+defStart+'","'+defEnd+'","'+1+'","'+defInfo+'","'+defPlace+'","'+false+'","'+1+'","'+true+'","'+false+'","'+1+'");',function(err,results){
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

server.get("/getCandidates",function(req,res,next){
  connection.query("SELECT id_candidate,firstName,secondName\n" +
    "from candidate c\n" +
    "INNER JOIN person p\n" +
    "on c.id_person=p.id_person\n" +
    "ORDER by secondName;",function(err,results){
    if (err)
      throw err;
    res.end(JSON.stringify(results));
  })
});

server.post("/updateEvent",function(req,res,next){
  connection.query(' ' +
    'update event ' +
    'set ' +
    '  dateStart="'+req.body.dateStart+'", ' +
    '  timeStart="'+req.body.timeStart+'", ' +
    '  dateEnd="'+req.body.dateStart+'", ' +
    '  timeEnd="'+req.body.timeStart+'", ' +
    '  id_interviewer='+req.body.id_interviewer+', ' +
    '  info="'+req.body.info+'", ' +
    '  place="'+req.body.place+'", ' +
    '  isRepeatable='+true+', ' +
    '  id_importance='+req.body.id_importance+', ' +
    '  title="'+req.body.title+'" ,' +
    '  isVacant='+true+', ' +
    '  allDay='+false+',' +
    '  id_candidate='+req.body.id_candidate+
    '  where id_event='+req.body.id_event+';',function(err,results){
    if (err) throw err;
    res.end();
  });
});




server.post('/updateEventDate',function(req,res,next){
  connection.query(' UPDATE event \n' +
    ' set\n' +
    ' dateStart="'+req.body.dateStart+'", \n' +
    ' timeStart="'+req.body.timeStart+'" \n' +
    ' where id_event='+req.body.id_event+';',function(err,results){
    if (err) throw err;
    res.end();
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


