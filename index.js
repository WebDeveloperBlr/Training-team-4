var config = require('./config'),
  restify = require('restify');
var candidatesController = require('./controllers/candidates');
var vacanciesController = require('./controllers/vacancies');
var fs = require('fs');
const corsMiddleware = require('restify-cors-middleware');

const cors = corsMiddleware({
  preflightMaxAge: 5, //Optional
  origins: ['http://localhost:4200', 'http://localhost:8080'],
  allowHeaders: ['API-Token'],
  exposeHeaders: ['API-Token-Expiry']
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
server.use(restify.plugins.bodyParser({
  mapParams: false,
}));
/*server.use(
  function crossOrigin(req,res,next){
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Methods", req.header("Access-Control-Request-Method"));
    res.header("Access-Control-Allow-Headers", req.header("Access-Control-Request-Headers"));
    return next();
  }
);*/


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
server.get('*', function handler(req, res, next) {
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

server.get('/candidatesAsync', candidatesController.all);
server.get('/vacanciesAsync', vacanciesController.all);
server.get('/candidatesAsync/:id', candidatesController.getById);


//rest api to create a new record into mysql database
server.post('/', candidatesController.create);
server.put('/candidatesAsync/:id', candidatesController.update);
server.post('/candidatesAsync/:id', (req, res) => {
  console.log(req);
});
server.del('/:id', candidatesController.delete);


