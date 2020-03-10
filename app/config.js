/**********************************************
config.js

@desc - config file for test suite
@authors - Puneet Tiwari
@version - 1.0.0
**********************************************/
//var os = require('os');

/**********************
  Globals
**********************/
var ENVIRON = "PROD";

exports.HOST_URL = process.env.API_URL;
exports.ENVIRON = ENVIRON;

// SQL specifics
exports.SQL = {
  "username": process.env.DB_USERNAME || "root",
  //"password": "process.env.SQL_PASSWORD",
  "password": process.env.DB_PASSWORD || "password",
  "database": process.env.DB_NAME ||"lucid",
  "host": process.env.DB_HOST||"localhost",
     // "host":"localhost",
  // "host": "host.docker.internal", // for docker image
  "port": process.env.DB_PORT||"3306",
  "dialect": "mysql"
};

exports.SECRET = '9211dc48153ba70a02d0df6414520134';
exports.TOKENHEADER = 'x-access-token';
// exports.UPLOAD_FILE_PATH = '';
// exports.UPLOAD_BKUP_FILE_PATH = '';
exports.LOG_FILE_PATH = process.env.LOG_FOLDER||'../log/';
// exports.RANK_SERVICE_HOST = process.env.RANK_SERVICE_HOST||'localhost';
// exports.RANK_SERVICE_PORT = process.env.RANK_SERVICE_PORT||5000;
// exports.RANK_SERVICE_PATH = process.env.RANK_SERVICE_PATH||'/rank';
