const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const compression = require('compression');
const winston = require('winston');
const config = require('./config/settings');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const RateLimit = require('express-rate-limit');
const morgan = require('morgan');
const cors = require('cors'); 

const asyncMiddleware = require('./utils/asyncMiddleware');


mongoose.connect(config.database, config.options).then(
  () => { console.log('opened') },
  err => { console.log('error') }
);
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
let corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(compression())
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.use(bodyParser.json());
//app.use(bodyParser({ limit: '50MB' }));
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser());
//app.use(bodyParser.json({ limit: '50mb' }));

app.use((req, res, next) => {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
//app.use(morgan('combined', { stream: winston.stream }));

const index = require('./routes/index');
//const airports = require('./routes/airports');
const users = require('./routes/users');
//const profile = require('./routes/profile');
const profile = require('./routes/profile/profile');
const search = require('./routes/search');
const admin = require('./routes/admin/admin');

app.use('/', index);
app.use('/api', users);
//app.use('/profile', profile);
app.use('/profile', profile)
app.use('/search', search);
app.use('/admin', admin)

// Add headers


// catch 404 and forward to error handler
app.use((req, res, next) => {
  /*let err = new Error('Not Found');
  err.status = 404;
  next(err);*/

});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)

var limiter = new RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  delayMs: 0 // disable delaying - full speed until the max limit is reached
});

//  apply to all requests
app.use(limiter);
/*process.on('uncaughtException', function (err) {
  console.log("=================")
  console.log(err);

  winston.error(err);
  // process.exit(1);
})*/
module.exports = app;
