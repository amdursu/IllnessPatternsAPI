const validateToken = require('../utils').validateToken;
const controller = require('../controllers/patients');

module.exports = (router) => {
    router.get('/patients/getPatients', validateToken, controller.getPatients);
    router.get('/patients/getPatient', validateToken, controller.getPatient);
    router.post('/patients/sendDiagnosis', validateToken, controller.sendDiagnosis);
    router.post('/patients/patientSearch', validateToken, controller.patientSearch);
}