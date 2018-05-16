var express = require('express');
var path = require('path');
var logger = require('morgan');
var compression = require('compression');
var methodOverride = require('method-override');
var session = require('express-session');
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var dotenv = require('dotenv');
var nunjucks = require('nunjucks');
var mongoose = require('mongoose');
var passport = require('passport');
var helmet = require('helmet');

dotenv.load();
require('./config/passport')(passport);

var app = express();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URL, {useMongoClient: true})
  .then(function() {
  console.log('Connected to database: ' + process.env.DB_URL)
  })
  .catch(function(err) {
    console.log('Error connecting to database: ' + err);
  })



nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.use(session({
  secret: 'youjustsolvedeveryproblemofmylife',
	name: 'mother_flower',
	proxy: true,
	resave: true,
	saveUninitialized : true
}));

app.set('view engine', 'html');
app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(expressValidator());
app.use(methodOverride('_method'));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
app.use(helmet());
app.disable('x-powered-by');

// Require routes
var user = require('./routes/user');
var index = require('./routes/index');
var document = require('./routes/document');
var activitylogs = require('./routes/activitylogs');
var department = require('./routes/department');
var stats = require('./routes/stats');

// Use routes
app.use('/', index);
app.use('/user', user);
app.use('/document', document);
app.use('/logs', activitylogs);
app.use('/department', department);
app.use('/stats', stats);


app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
