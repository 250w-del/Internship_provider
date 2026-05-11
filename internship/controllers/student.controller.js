const StudentModel = require('../models/Student.model');
const InternshipModel = require('../models/Internship.model');
const ApplicationModel = require('../models/Application.model');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: './uploads/cvs/',
    filename: (req, file, cb) => {
        cb(null, `student_${req.userId}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5000000 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf|doc|docx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) return cb(null, true);
        cb(new Error('Only PDF and Word documents are allowed'));
    }
}).single('cv');

const getProfile = async (req, res) => {
    try {
        const student = await StudentModel.findById(req.userId);
        res.json({ success: true, student });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { full_name, phone, trade, level, school } = req.body;
        await StudentModel.update(req.userId, { full_name, phone, trade, level, school });
        const updatedStudent = await StudentModel.findById(req.userId);
        res.json({ success: true, student: updatedStudent });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const uploadCV = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) return res.status(400).json({ success: false, message: err.message });
        if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
        await StudentModel.updateCV(req.userId, req.file.filename);
        res.json({ success: true, message: 'CV uploaded successfully', filename: req.file.filename });
    });
};

const getAvailableInternships = async (req, res) => {
    try {
        const student = await StudentModel.findById(req.userId);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await InternshipModel.getAllAvailable(student.trade, student.level, page, limit);
        res.json({ success: true, ...result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const applyForInternship = async (req, res) => {
    try {
        const { internship_id, notes } = req.body;

        const existing = await ApplicationModel.checkExisting(req.userId, internship_id);
        if (existing) {
            return res.status(400).json({ success: false, message: 'Already applied for this internship' });
        }

        const internship = await InternshipModel.findById(internship_id);
        if (!internship || internship.status !== 'approved') {
            return res.status(400).json({ success: false, message: 'Internship not available' });
        }

        const applicationId = await ApplicationModel.create({
            student_id: req.userId,
            internship_id,
            notes
        });

        res.json({ success: true, message: 'Application submitted successfully', application_id: applicationId });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getMyApplications = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await ApplicationModel.findByStudent(req.userId, page, limit);
        res.json({ success: true, ...result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getProfile, updateProfile, uploadCV, getAvailableInternships, applyForInternship, getMyApplications };
