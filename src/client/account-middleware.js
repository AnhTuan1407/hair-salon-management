const db = require('../app/models/index');
const initialModelSqlServer = require('../app/models/initial-models');
const models = initialModelSqlServer(db);
const jwt = require('jsonwebtoken');

module.exports.checkNotLoggedIn = async (req, res, next) => {
    const token = req.cookies.tokenUser;

    if (token) {
        req.flash("error", `Bạn đã đăng nhập rồi!`);
        return res.redirect("/api/site/home");
    }

    next();
}

module.exports.checkEditPermission = async (req, res, next) => {
    const token = req.cookies.tokenUser;

    try {
        const decoded = jwt.verify(token, 'secret_key');
        const id = decoded.idPerson;

        if (decoded.role == "Admin") {
            next();
        } else {
            const idUrl = req.params.id;

            if (idUrl == id) {
                next();
            } else {
                return res.status(500).json({ message: "Bạn không có quyền truy cập!" });
            }
        }
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}