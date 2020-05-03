const jwt = require('jsonwebtoken');
const jwtConfig = require('./config').jwtConfig;

module.exports = {
    validateToken: (req, res, next) => {
        const authorizationHeader = req.headers.authorization;
        
        let result;

        if (authorizationHeader) {
            const token = req.headers.authorization.split(' ')[1]; // Bearer <token>
            const options = {
                expiresIn: jwtConfig.expiresIn,
                issuer: jwtConfig.jwtIssuer
            };

            try {
                result = jwt.verify(token, jwtConfig.jwtSecret, options);
                req.decoded = result;
                next();
            } catch (err) {
                res.status(401).send(err);
            }
        } else {
            result = {
                error: `Authentication error. Token required.`,
                status: 401
            };
            res.status(401).send(result);
        }
    }
};