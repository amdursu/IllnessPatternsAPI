const validateToken = require('../utils').validateToken;
const controller = require('../controllers/patients');

module.exports = (router) => {
    router.get('/patients/getPatients', controller.getPatients);
    router.get('/patients/getPatient', controller.getPatient);
    router.post('/patients/sendDiagnosis', controller.sendDiagnosis);
}