const validateToken = require('../utils').validateToken;
const controller = require('../controllers/auth');

module.exports = (router) => {
    router.post('/auth/login', controller.login);
    router.post('/auth/register', controller.register);
}