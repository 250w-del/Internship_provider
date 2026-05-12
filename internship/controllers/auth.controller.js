const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const StudentModel = require('../models/Student.model');
const CompanyModel = require('../models/Company.model');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

const registerStudent = async (req, res) => {
    try {
        const { full_name, email, phone, trade, level, school, password } = req.body;

        if (!full_name || !email || !trade || !level || !password) {
            return res.status(400).json({ success: false, message: 'Please fill all required fields' });
        }

        const existingStudent = await StudentModel.findByEmail(email);
        if (existingStudent) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const studentId = await StudentModel.create({
            full_name, email, phone, trade, level, school, password: hashedPassword
        });

        const token = generateToken(studentId, 'student');
        const student = await StudentModel.findById(studentId);

        res.status(201).json({ success: true, token, user: student, role: 'student' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const registerCompany = async (req, res) => {
    try {
        const { company_name, email, phone, location, description, password } = req.body;

        if (!company_name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please fill all required fields' });
        }

        const existingCompany = await CompanyModel.findByEmail(email);
        if (existingCompany) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const companyId = await CompanyModel.create({
            company_name, email, phone, location, description, password: hashedPassword
        });

        const token = generateToken(companyId, 'company');
        const company = await CompanyModel.findById(companyId);

        res.status(201).json({ success: true, token, user: company, role: 'company' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Login: student logs in as student, company/admin logs in as company
const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ success: false, message: 'Email, password and role are required' });
        }

        let user = null;
        let userRole = null;
        let actualRole = role;

        if (role === 'student') {
            user = await StudentModel.findByEmail(email);
            userRole = 'student';
        } else if (role === 'company') {
            user = await CompanyModel.findByEmail(email);
            userRole = 'company';
            // If this company is the admin account, set role to admin
            if (user && user.is_admin) {
                actualRole = 'admin';
            }
        }

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const idField = role === 'student' ? 'student_id' : 'company_id';
        const token = generateToken(user[idField], actualRole);

        delete user.password;

        res.json({ success: true, token, user, role: actualRole });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { registerStudent, registerCompany, login };
