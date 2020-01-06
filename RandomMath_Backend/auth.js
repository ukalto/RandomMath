const jwt = require('jsonwebtoken');
const config = require('./config');

function checkToken(req, res, next) {
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase

  
    if (token) {
        if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
        }
        jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
            if (err) {
            return res.json({
                success: false,
                message: 'Token is not valid'
            });
            } else {
            req.decoded = decoded;
            next();
            }
        });
        } else {
        return res.json({
            success: false,
            message: 'Auth token is not supplied'
        });
        }
};

function createToken(username) {
    return jwt.sign({ username }, config.JWT_SECRET, { expiresIn: '24h' })
}

module.exports = {
    checkToken,
    createToken
};