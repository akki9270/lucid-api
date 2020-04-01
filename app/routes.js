/**
 * Created by mac on 02/11/18.
 */
// app/routes.js

// grab the claim model we just created

const config = require('./config');
const Patients = require('./routes/Patient');
const Tags = require('./routes/Tag');
const Timeline = require('./routes/Timeline');
const Notes = require('./routes/Notes');
const Users = require('./routes/Users');
const UserLastseen = require('./routes/UserLastseen');
const path = require('path');

const passport = require('passport');
require('./passport'); // Include Own passport strategy.. 

//require('./passport'); // Include Own passport strategy.. 
var checkValidity = function(req, res, next) {
    if (req.path.indexOf('login') > -1 || req.path.indexOf('logout') > -1) {
        next();
    } else {
        let user = req.headers.user;
        let isValidToken = Users.UserLoginStatus[user];
        isValidToken ? next() : res.status(401).send('Unauthorized');
    }
}


module.exports = function (app) {

    // server routes ===========================================================
    // handle things like api calls
    // authentication routes


    // protected route
    // app.get('/protected', passport.authenticate('jwt', { session: false }), function (req, res) {
    //     res.json('Success! You can now see this without a token.');
    // });

    // route to handle creating goes here (app.post)
    // route to handle delete goes here (app.delete)

    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('/api', function (req, res) {
        res.send('Success');
    });
    app.post('/api/login', Users.login);
    app.get('/api/logout', Users.logout);
    app.get('/api/getUsers/', passport.authenticate('jwt', {session: false}), checkValidity, Users.getUsers);
    app.post('/api/user/add', passport.authenticate('jwt', {session: false}), checkValidity, Users.addUser);
    app.post('/api/user/update', passport.authenticate('jwt', {session: false}), checkValidity, Users.updateUser)
    app.post('/api/user/isactivate', passport.authenticate('jwt', {session: false}), checkValidity, Users.toggleActiveUser)
    app.post('/api/user/isadmin', passport.authenticate('jwt', {session: false}), checkValidity, Users.toggleAdminUser)
    app.get('/api/getPatients', passport.authenticate('jwt', {session: false}), checkValidity, Patients.getPatients);
    app.get('/api/getPatients/:patientId', passport.authenticate('jwt', {session: false}), checkValidity, Patients.getPatients);
    app.get('/api/getPatientsFilterData/:query/:field', passport.authenticate('jwt', {session: false }),checkValidity, Patients.getFilterPatientData);
    app.get('/api/getPatientsSortedData/:direction', passport.authenticate('jwt', {session: false }),checkValidity, Patients.getSortedPatientData);
    app.get('/api/getTags/', passport.authenticate('jwt', {session: false}), checkValidity, Tags.getTags);
    app.get('/api/getTimeline/:patientId/:intakeId', passport.authenticate('jwt', {session: false}), checkValidity, Timeline.getTimeline);
    app.get('/api/getNotes/:patientId', passport.authenticate('jwt', {session: false}), checkValidity, Notes.getNotes);
    app.get('/api/getNotes/:patientId/:intakeId', passport.authenticate('jwt', {session: false}), checkValidity, Notes.getNotes);
    app.get('/api/getLastSeenPatients/:userId/:rowId', passport.authenticate('jwt', {session: false}), checkValidity, UserLastseen.getLastSeenPatients);
    app.post('/api/addPatientLastseen', passport.authenticate('jwt', {session: false}), checkValidity, UserLastseen.addPatientLastseenByUser);
    app.get('/api/getPatientsAnalyticsData', passport.authenticate('jwt', {session: false}), checkValidity, Patients.getPatientsAnalytics);
  
    app.get('*', function (req, res) {
        res.sendFile(path.resolve() + '/public/index.html')
        // res.sendFile(config.isProd ? './public/dist/index.html' : './public/index.html'); // load our public/index.html file
    });

};