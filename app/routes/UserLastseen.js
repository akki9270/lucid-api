const models = require('../models');
const Sequelize = require('sequelize');
const { STATUS_CODES: { UNAUTHORIZED, SERVER_ERROR, SUCCESS } } = require('../http_util');
// const HTTP_UTIL = require('../http_util');
const TIMELOGGER = require('../winston').TIMELOGGER;
// const jwt = require('jsonwebtoken');
// const config = require('../config');

async function getLastSeenPatients(req, res, next) {
    let logData = { method: 'getLastSeenPatients' };
    let pathParams = req.params;
    let userId = '';
    let whereClause = {};
    if (pathParams && pathParams.userId) {
        userId = pathParams.userId;
    }
    if (patientId) {
        whereClause = {
            ...whereClause,
            user_id: { [Sequelize.Op.eq]: userId }
        }
    }

    try {
        let lastSeenPatients = await models.UserLastseen.findAll({
            where: { ...whereClause }
        });
        return res.status(SUCCESS).send(lastSeenPatients);
    } catch (error) {
        TIMELOGGER.info(`getLastSeenPatients Err:  ${error.message}`, ...logData)
        return res.status(SERVER_ERROR).send();
    }
}

async function addPatientLastseenByUser(req, res, next) {
    let logData = req.headers.log_data ? JSON.parse(req.headers.log_data) : {};
    logData.method = 'addPatientLastseenByUser';
    TIMELOGGER.info(`params: ${JSON.stringify(req.body)}`, { ...logData });
    let data = req.body;    
    let { last_Seen, user_id, row_id } = data;
    try {
        let existingUser = await models.UserLastseen.findOne({ 
            where: { 
                user_id: user_id,
                row_id
             } }, { raw: true });
        // console.log('existingUser ', existingUser);
        if (existingUser) {
            TIMELOGGER.warn(`data: Existing User ${existingUser}`, { ...logData });
            return res.status(SUCCESS).send({message: 'User Already Exists with Same USER ID.'})
        }
        let result = await models.UserLastseen.create({ user_id, row_id, last_seen: last_Seen });
        res.status(SUCCESS).send(result);
    } catch (err) {
        TIMELOGGER.error(`Error: ${err.message}`, { ...logData });
        res.status(SERVER_ERROR).send(err.message);
    }
}


module.exports = { getLastSeenPatients, addPatientLastseenByUser }