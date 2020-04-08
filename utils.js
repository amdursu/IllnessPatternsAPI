const jwt = require('jsonwebtoken');

module.exports = {
    validateToken: (req, res, next) => {
        const authorizationHeaader = req.headers.authorization;
        let result;

        if (authorizationHeaader) {
            const token = req.headers.authorization.split(' ')[1]; // Bearer <token>
            const options = {
                expiresIn: process.env.JWT_EXPIRES_IN,
                issuer: process.env.JWT_ISSUER
            };

            try {
                result = jwt.verify(token, process.env.JWT_SECRET, options);
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