/**
 * Created by mac on 02/11/18.
 */
// server.js

// modules =================================================
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var models = require('./app/models');
var fs = require('fs');
// const { createTriggers } = require('./app/manager/trigger');
// const { update_color_range } = require('./app/manager/procedure')
const config = require('./app/config');
config.isProd = process.argv.includes('--production');
// import passport and passport-jwt modules
// const passport = require('passport');
const helmet = require('helmet');
const { TIMELOGGER } = require('./app/winston');
// configuration ===========================================

// config files
// var db = require('./config/db');

// set our port
var port = process.env.APP_PORT || 8081;

// app.use(passport.initialize());
app.use(helmet());



// connect to our mongoDB database
// (uncomment after you enter in your own credentials in config/db.js)
// mongoose.connect(db.url, {
//     useNewUrlParser: true
// }).then(function (data) {});

// mongoose.connection.on('error', function () {});

// var models_path = __dirname + '/app/models';

// fs.readdirSync(models_path).forEach(function (file) {
//     if (~file.indexOf('.js')) {
//         require(models_path + '/' + file)
//     }
// });

// get all data/stuff of the body (POST) parameters
// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + (config.isProd ? '/public/dist' : '/public')));

// routes ==================================================
require('./app/routes')(app); // configure our routes

// Sync sequelize
models.sequelize.sync().then(async function () {
    // start app ===============================================
    // startup our app at http://localhost:8080
    app.listen(port);
}).catch(function(err) {
    // console.log(' SEQUEL ERR ', err);
    TIMELOGGER.error(`SEQUEL Error: ${err.message}`, {});
});

// shoutout to the user
console.log('server running on port ' + port);
TIMELOGGER.info(`server running on port ${port}`)

// expose app
exports = module.exports = app;
