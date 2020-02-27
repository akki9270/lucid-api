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
//require('./passport'); // Include Own passport strategy.. 

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
    app.get('/api', function(req, res) {
        res.send('Success');
    });
    app.get('/api/getPatients',Patients.getPatients);
    app.get('/api/getPatients/:patientId',Patients.getPatients);
    app.get('/api/getTags/',Tags.getTags);
    app.get('/api/getTimeline/',Timeline.getTimeline);
    app.get('/api/getNotes/',Notes.getNotes);
    app.get('*', function (req, res) {
        res.sendFile( config.isProd ? './public/dist/index.html' : './public/index.html'); // load our public/index.html file
    });

};