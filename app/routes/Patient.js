const models = require('../models');
const Sequelize = require('sequelize');
const { STATUS_CODES: { UNAUTHORIZED, SERVER_ERROR, SUCCESS } } = require('../http_util');
const TIMELOGGER = require('../winston').TIMELOGGER;

async function getPatients(req, res, next) {
    let logData = { method: 'getPatients' };
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
        if (matchedRows.length) {
            let conditionData = []
            matchedRows.forEach(item => {
                conditionData.push({
                [Sequelize.Op.and]: [
                    { patient_id: item.patient_id },
                    { intake_id: item.intake_id }
                ]})
            })
            matcheWhereClause[Sequelize.Op.or] = conditionData;
        }
        // fetch data from patient table for matched rows
        let matchedPatients = await models.Patient.findAll({
            where: matcheWhereClause,
            include: [
                {
                    model: models.Key_Indicator,
                    as: 'key_indicator'
                },
                {
                    model: models.Service,
                    as: 'service'
                },
                {
                    model: models.UserLastseen,
                    as: 'userLastSeen'
                }
            ],
            order: [[{model: models.UserLastseen, as: 'userLastSeen'},'last_seen', 'DESC']]
            // raw: true
        });
        if (!matchedPatients) {
            matchedPatients = [];
        } else {
            resultPatients.push(...matchedPatients);
        }
        // console.log('matched Patients ', matchedPatients.length);
        if (matchedPatients.length < 10) {
            let patients = await models.Patient.findAll({
                where: { ...whereClause },
                // order: [
                //     ['last_seen', 'DESC'],
                // ],
                include: [
                    {
                        model: models.Key_Indicator,
                        as: 'key_indicator'
                    },
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




module.exports = { getPatients }