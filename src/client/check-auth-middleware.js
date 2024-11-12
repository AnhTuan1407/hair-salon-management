const jwt = require('jsonwebtoken');

function checkAuth(req, res, next) {
    const token = req.cookies ? req.cookies.tokenUser : undefined;
    if (token) {
        try {
            const decoded = jwt.verify(token, 'secret_key');
            res.locals.user = decoded;
            res.locals.isLoggedIn = true;
        } catch (error) {
            res.locals.isLoggedIn = false;
        }
    } else {
        res.locals.isLoggedIn = false;
    }
    next();
}

module.exports = checkAuth;
