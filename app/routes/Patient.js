const models = require('../models');
const Sequelize = require('sequelize');
const { STATUS_CODES: { SERVER_ERROR, SUCCESS } } = require('../http_util');
const TIMELOGGER = require('../winston').TIMELOGGER;

// eslint-disable-next-line
async function getFilterPatientData(req, res, next) {
    let logData = req.headers.log_data ? JSON.parse(req.headers.log_data) : {};    
    logData.user = req.headers.user ? req.headers.user : undefined
    logData.page = 'Patients';   
    logData.method = 'getFilterPatientData';    
    TIMELOGGER.info(`Comment: Entry, params: ${JSON.stringify(req.params)}`, { ...logData });    
    let params;
    let whereClauseStr;
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

// eslint-disable-next-line
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
            order: [['last_seen', 'desc']],
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
        TIMELOGGER.error(`getPatients Err:  ${error.message}`, ...logData)
        return res.status(SERVER_ERROR).send();
    }
}

// eslint-disable-next-line
async function getSortedPatientData(req, res, next) {    
    let logData = req.headers.log_data ? JSON.parse(req.headers.log_data) : {};    
    logData.user = req.headers.user ? req.headers.user : undefined
    logData.method = 'getSortedPatientData';
    logData.page = 'Patients';    
    let params;
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
        TIMELOGGER.error(`getSortedPatientData Err:  ${error.message}`, ...logData)
        return res.status(SERVER_ERROR).send();
    }
}

// eslint-disable-next-line
async function getPatientsAnalytics(req, res, next) {
    let logData = req.headers.log_data ? JSON.parse(req.headers.log_data) : {};    
    logData.user = req.headers.user ? req.headers.user : undefined
    logData.method = 'getPatientsAnalytics';
    logData.page = 'Analytics';    
    let params;
    // let result;
    TIMELOGGER.info(`Comment: Entry`, {...logData});
    try {
        params = req.params;    
        let { from, to} = params;
        // Need to code
        let fromDate = new Date(from).getFullYear() + '-' + (new Date(from).getMonth() + 1) + '-' + new Date(from).getDate();
        let toDate = new Date(to).getFullYear() + '-' + (new Date(to).getMonth() + 1) + '-' + new Date(to).getDate();
        
        // eslint-disable-next-line
         let [results, metadata] = await models.sequelize.query(`
            SELECT SUM(urgent = 1) as urgent,
            SUM(escalation = 1) as escalation,
            SUM(facility_discharge = 1) as facility_discharge
            FROM Patient WHERE last_seen >= '${fromDate}' AND 
            last_seen <= '${toDate}'
         `);
        //  console.log('result ', results);
        TIMELOGGER.info(`Comment: Entry, params: ${JSON.stringify(req.params)}`, { ...logData });
        return res.status(SUCCESS).send(results);
    } catch (error) {
        TIMELOGGER.error(`getPatientsAnalytics Err:  ${error.message}`, ...logData)
        return res.status(SERVER_ERROR).send();
    }
}

// eslint-disable-next-line
async function getPatientCallCount(req,  res, next) {
    let logData = req.headers.log_data ? JSON.parse(req.headers.log_data) : {};    
    logData.user = req.headers.user ? req.headers.user : undefined
    logData.method = 'getPatientCallCount';
    logData.page = 'Analytics';    
    let params;
    // let result;
    TIMELOGGER.info(`Comment: Entry`, {...logData});
    try {
        params = req.params;    
        let { from, to} = params;
        // Need to code
        let fromDate = new Date(from).getFullYear() + '-' + (new Date(from).getMonth() + 1) + '-' + new Date(from).getDate();
        let toDate = new Date(to).getFullYear() + '-' + (new Date(to).getMonth() + 1) + '-' + new Date(to).getDate();

        // eslint-disable-next-line
        let [results, metadata] = await models.sequelize.query(`
            SELECT 
            call_count, COUNT(*) as total
            FROM
                Patient
            WHERE
                last_seen >= '${fromDate}'
                    AND last_seen <= '${toDate}'
            GROUP BY call_count
        `);
        console.log('result ', results);
        TIMELOGGER.info(`Comment: Entry, params: ${JSON.stringify(req.params)}`, { ...logData });
        return res.status(SUCCESS).send(results);
    } catch(error) {
        TIMELOGGER.error(`getPatientCallCount Err:  ${error.message}`, ...logData)
        return res.status(SERVER_ERROR).send();
    }
}

// eslint-disable-next-line
async function getPatientMSOC(req, res, next) {
    let logData = req.headers.log_data ? JSON.parse(req.headers.log_data) : {};    
    logData.user = req.headers.user ? req.headers.user : undefined
    logData.method = 'getPatientMSOC';
    logData.page = 'Analytics';    
    let params;
    // let result;
    TIMELOGGER.info(`Comment: Entry`, {...logData});
    try {
        params = req.params;
        let { entered } = params;
        // console.log('entered ', entered);
        // Need to code
        let enteredDate = new Date(entered).getFullYear() + '-' + (new Date(entered).getMonth() + 1) + '-' + new Date(entered).getDate();
        // console.log('enteredDate ', enteredDate);
        // eslint-disable-next-line
        let [results, metadata] = await models.sequelize.query(`
            SELECT 
                count(*) as count
            FROM
                Service
            WHERE
            DATEDIFF(DATE(start_date), '${enteredDate}') > 0
            AND DATEDIFF(DATE(start_date), '${enteredDate}') <= 10;
        `);
        // console.log('result ', results);
        TIMELOGGER.info(`Comment: Entry, params: ${JSON.stringify(req.params)}`, { ...logData });
        return res.status(SUCCESS).send(results);
    } catch (error) {
        TIMELOGGER.error(`getPatientMsoc Err:  ${error.message}`, ...logData)
        return res.status(SERVER_ERROR).send();
    }
}

module.exports = { getPatients,
     getFilterPatientData,
     getSortedPatientData,
     getPatientsAnalytics,
     getPatientCallCount,
     getPatientMSOC }