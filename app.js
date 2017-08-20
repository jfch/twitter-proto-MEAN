var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var users = require('./routes/users');
var app = express();
//label add
var passport = require('passport');
var session = require('express-session');



// //mysql connection, js file
var routes = require('./routes/index');
var mysql = require('mysql');
var signin = require('./routes/signin');
var home = require('./routes/home');
var tweet = require('./routes/tweet');
var user = require('./routes/user');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
//label add
app.use(cookieParser('cookieSecret'));
//app.use(express.session({secret:'sessionSecret'})); //express 3.0
app.use(session({ resave: true,
    saveUninitialized: true,
    secret: 'sessionSecret' })); //express 4.0
//app.use(session({ resave: true, saveUninitialized: true, secret: 'uwotm8' })); //express 4.0

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

//app.get('/signin', home.signin); label 
app.get('*', function(req,res,next){
	if(req.session.user){
		//make user visible among pages ejs //default pass data to all pages
		res.locals.user = req.session.user || null;		
	}
	next();	
});
app.get('/', home.red_index); 
app.post('/login', signin.login);
app.post('/register', signin.register);
app.get('/userhome', home.userhome); //home or userhome???
app.get('/logout', signin.logout); 
app.post('/tweet', tweet.post_tweet);
app.get('/user/:user', user.get_user);  //label ??? /:user
app.get('/follow/:id', user.get_follow);
app.get('/unfollow/:id', user.get_unfollow);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// //mysql connection
var connection = mysql.createConnection({
	    host     : 'localhost',
	    user     : 'root',
	    password : '23001288',
	    database : 'twitter_db',
	    port	 : 3306
	});
////mysql connection; connect()'s return will feed into function(error)
connection.connect(function(error){
	if(error){
		console.log('database connection fail');
		process.exit(code=0);
	}
	console.log('database connected')
});




module.exports = app;
