const jwt = require('jsonwebtoken');
const StudentModel = require('../models/Student.model');
const CompanyModel = require('../models/Company.model');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role === 'student') {
            req.user = await StudentModel.findById(decoded.id);
            req.userRole = 'student';
        } else if (decoded.role === 'company') {
            req.user = await CompanyModel.findById(decoded.id);
            req.userRole = 'company';
        } else if (decoded.role === 'admin') {
            // Admin logs in via company account with is_admin=true
            req.user = await CompanyModel.findById(decoded.id);
            req.userRole = 'admin';
        }

        if (!req.user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.userRole)) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }
        next();
    };
};

module.exports = { protect, authorize };
