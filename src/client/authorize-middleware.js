const jwt = require('jsonwebtoken');

function authorize(roles = []) {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        // Kiểm tra xem cookie có tồn tại không
        if (!req.cookies || !req.cookies.tokenUser) {
            return res.status(401).json({ message: 'Không tìm thấy token!' });
        }

        const token = req.cookies.tokenUser;

        try {
            const decoded = jwt.verify(token, 'secret_key');
            if (!roles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Bạn không có quyền truy cập!' });
            }

            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Token không hợp lệ!' });
        }
    };
}

module.exports = authorize;
