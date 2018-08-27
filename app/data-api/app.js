var bodyParser = require('body-parser'),
    createError = require('http-errors'),
    express = require('express'),
    logger = require('morgan'),
    mongoose = require('mongoose')
    
require('./models/mongo/flights')
require('./models/mongo/latest')
    
mongoose.Promise = global.Promise

var apiRouter = require('./routes/api')

var app = express()

mongoose.connect(process.env.MONGODB_URI, {
  user: process.env.MONGODB_USER,
  pass: process.env.MONGODB_PASSWORD,
  useNewUrlParser: true
})

var db = mongoose.connection

db.on('error', (err) => {
  console.log(err)
})

db.once('open', () => {
  console.log('connection success with Mongo')
})

app.use(logger('dev'))
app.use(bodyParser.json({limit:'2mb'}))
app.use('/', apiRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

app.use(function(req, res, next) {

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  )
  next()
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.send(err)
})

module.exports = app
