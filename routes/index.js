const auth = require('./auth');
const patients = require('./patients');

module.exports = (router) => {
    auth(router);
    patients(router);
    return router;
}