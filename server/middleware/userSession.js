const jwt = require('jsonwebtoken');
const { tokenBlackList } = require('../util/tokenBlackList');

module.exports = () => (req, res, next) => {
    const userToken = req.headers['x-authorization'];
    
    if (userToken) {
        try {
            if (tokenBlackList.has(userToken)) {
                throw new Error('The token has already been used. Please sign in again')
            }

            const decodedToken = jwt.verify(userToken, process.env.JWT_SECRET, (err, decodedToken) => {
                if (err) {
                    throw new Error('The token is invalid. Please sign in again');
                }

                return decodedToken;
            });

            req.user = decodedToken;
            req.userToken = userToken;
        } catch (error) {
            error.statusCode = 401;
            return next(error);
        }
    }

    next();
}