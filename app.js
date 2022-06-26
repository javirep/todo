var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require("mongoose");
var session = require("express-session");
var cors = require("cors");
var MongoStore = require("connect-mongo")(session);

require("dotenv").config();


var app = express();

//mongoose connection

mongoose
// MONGODB_URI = mongodb://localhost:27017/todo-app
.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
.then(x => {
  console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
})
.catch(err => {
  console.error('Error connecting to mongo', err)
});

app.use(
  cors({
    credentials: true,
    origin: [process.env.PUBLIC_DOMAIN],
  }),
);

app.use(session({
  secret: "basic-auth-secret",
  cookie: { maxAge: 6000000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 * 1000 // 1 day
  })
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var indexRouter = require('./routes/index.js');
var privRouter = require('./routes/priv.js');
var authRouter = require("./routes/auth.js")

app.use('/', indexRouter);
app.use('/priv', privRouter);
app.use("/auth", authRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
