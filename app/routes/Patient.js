const models = require('../models');
const Sequelize = require('sequelize');
const { STATUS_CODES: { UNAUTHORIZED, SERVER_ERROR, SUCCESS } } = require('../http_util');
const TIMELOGGER = require('../winston').TIMELOGGER;

async function getFilterPatientData(req, res, next) {
    let logData = req.headers.log_data ? JSON.parse(req.headers.log_data) : {};    
    logData.user = req.headers.user ? req.headers.user : undefined
    logData.page = 'Patients';   
    logData.method = 'getFilterPatientData';    
    TIMELOGGER.info(`Comment: Entry, params: ${JSON.stringify(req.params)}`, { ...logData });    
    let params;
    try {
        params = req.params;
        whereClauseStr = '';
        let limit = 10;
        whereClauseStr += " CAST(`" + params.field.toString() + "` as CHAR) like '%" + params.query + "%'"

        let filterData = await models.Patient.findAll({
            where: models.sequelize.literal(whereClauseStr),
            include: [
                {
                    model: models.Service,
                    as: 'service'
                }
            ],
            limit: limit
        });
        return res.status(200).send(filterData);
    } catch (err) {
        TIMELOGGER.error(`Error: ${err.message}`, { ...logData });
        res.status(500).send(err.message);
    }
}

async function getPatients(req, res, next) {
    let logData = req.headers.log_data ? JSON.parse(req.headers.log_data) : {};    
    logData.user = req.headers.user ? req.headers.user : undefined
    logData.method = 'getPatients';
    logData.page = 'Patients';    
    TIMELOGGER.info(`Comment: Entry`, {...logData});
    let pathParams = req.params;
    let { user } = req.headers;
    let patientId = '';
    let whereClause = {};
    let resultPatients = [];
    if (pathParams && pathParams.patientId) {
        patientId = pathParams.patientId;
    }
    if (patientId) {
        whereClause = {
            ...whereClause,
            patient_id: { [Sequelize.Op.eq]: patientId }
        }
    }
    try {
        // check for matched rows in userLastSeen for loagged in user
        let matchedRows = await models.UserLastseen.findAll({
            where: { user_id: { [Sequelize.Op.eq]: user } },
            limit: 10,
            order: [['last_seen', 'asc']],
            raw: true
        });
        // console.log('matched ', matchedRows.length);

        // create condition for getting data which matches to patient table
        let matcheWhereClause = {};
        let matchedPatients;
        if (matchedRows.length) {
            let conditionData = []
            matchedRows.forEach(item => {
                conditionData.push({
                    [Sequelize.Op.and]: [
                        { patient_id: item.patient_id },
                        { intake_id: item.intake_id }
                    ]
                })
            })
            matcheWhereClause[Sequelize.Op.or] = conditionData;
        // }
        // fetch data from patient table for matched rows
        matchedPatients = await models.Patient.findAll({
            where: matcheWhereClause,
            include: [
                {
                    model: models.Service,
                    as: 'service'
                },
                {
                    model: models.UserLastseen,
                    as: 'userLastSeen'
                }
            ],
            limit: 10,
            order: [[{ model: models.UserLastseen, as: 'userLastSeen' }, 'last_seen', 'DESC']]
            // raw: true
        });
        }
        let filterPatients = [];
        if (!matchedPatients) {
            matchedPatients = [];
        } else {
            resultPatients.push(...matchedPatients);
            matchedPatients.forEach(item => {
                filterPatients.push({
                    [Sequelize.Op.and]:
                    [
                        { patient_id: { [Sequelize.Op.ne]: item.patient_id } },
                        { intake_id: { [Sequelize.Op.ne]: item.intake_id } } ]
                });
            });
        }
        // console.log('matched Patients ', matchedPatients.length);
        if (matchedPatients.length) {
            whereClause = {
                ...whereClause,
                [Sequelize.Op.and]: filterPatients
            }
        }
        if (matchedPatients.length < 10) {
            let patients = await models.Patient.findAll({
                where: { ...whereClause },
                // order: [
                //     ['last_seen', 'DESC'],
                // ],
                include: [
                    {
                        model: models.Service,
                        as: 'service'
                    }
                ],
                limit: (10 - matchedRows.length)
            });
            resultPatients.push(...patients);
        }
        return res.status(SUCCESS).send(resultPatients);
    } catch (error) {
        TIMELOGGER.info(`getPatients Err:  ${error.message}`, ...logData)
        return res.status(SERVER_ERROR).send();
    }
}

async function getSortedPatientData(req, res, next) {    
    let logData = req.headers.log_data ? JSON.parse(req.headers.log_data) : {};    
    logData.user = req.headers.user ? req.headers.user : undefined
    logData.method = 'getSortedPatientData';
    logData.page = 'Patients';    
    // TIMELOGGER.info(`Comment: Entry`, {...logData});
    try {
        params = req.params;
        let patientIds = await models.Service.findAll({
            attributes:[['patient_id', 'patientId']],
            where: models.sequelize.literal('datediff(now(), `start_date`) > 0'),
            order:[[models.sequelize.literal('datediff(now(), `start_date`) ' + params.direction)]],
            raw: true
        });
        let Ids = patientIds.map(item => item.patientId);
        let patients = await models.Patient.findAll({
            where: {patient_id: {[Sequelize.Op.in]: Ids}},
            include: [
                {
                    model: models.Service,
                    as: 'service'
                }
            ],
            limit: 10,
        });
        TIMELOGGER.info(`Comment: Entry, params: ${JSON.stringify(req.params)}`, { ...logData });
        return res.status(SUCCESS).send(patients);
    } catch (error) {
        TIMELOGGER.info(`getSortedPatientData Err:  ${error.message}`, ...logData)
        return res.status(SERVER_ERROR).send();
    }
}

async function getPatientsAnalytics(req, res, next) {
    let logData = req.headers.log_data ? JSON.parse(req.headers.log_data) : {};    
    logData.user = req.headers.user ? req.headers.user : undefined
    logData.method = 'getPatientsAnalytics';
    logData.page = 'Patients';    
    TIMELOGGER.info(`Comment: Entry`, {...logData});
    try {
        params = req.params;    
        // Need to code
        TIMELOGGER.info(`Comment: Entry, params: ${JSON.stringify(req.params)}`, { ...logData });
        return res.status(SUCCESS).send();
    } catch (error) {
        TIMELOGGER.info(`getPatientsAnalytics Err:  ${error.message}`, ...logData)
        return res.status(SERVER_ERROR).send();
    }
}


module.exports = { getPatients, getFilterPatientData, getSortedPatientData, getPatientsAnalytics }