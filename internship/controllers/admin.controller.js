const StudentModel = require('../models/Student.model');
const CompanyModel = require('../models/Company.model');
const InternshipModel = require('../models/Internship.model');
const ApplicationModel = require('../models/Application.model');

const getDashboardStats = async (req, res) => {
    try {
        const students = await StudentModel.getAll(1, 100);
        const companies = await CompanyModel.getAll(1, 100);
        const internships = await InternshipModel.getStats();
        const applications = await ApplicationModel.getStats();
        const recentPlacements = await ApplicationModel.getRecentPlacements(5);

        res.json({
            success: true,
            stats: {
                students: students.total,
                companies: companies.total,
                internships,
                applications,
                recentPlacements
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllStudents = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const result = await StudentModel.getAll(page, limit);
        res.json({ success: true, ...result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        await StudentModel.delete(studentId);
        res.json({ success: true, message: 'Student deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllCompanies = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const result = await CompanyModel.getAll(page, limit);
        res.json({ success: true, ...result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteCompany = async (req, res) => {
    try {
        const { companyId } = req.params;
        await CompanyModel.delete(companyId);
        res.json({ success: true, message: 'Company deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getPendingInternships = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const result = await InternshipModel.getPending(page, limit);
        res.json({ success: true, ...result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const approveInternship = async (req, res) => {
    try {
        const { internshipId } = req.params;
        await InternshipModel.updateStatus(internshipId, 'approved');
        res.json({ success: true, message: 'Internship approved' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const rejectInternship = async (req, res) => {
    try {
        const { internshipId } = req.params;
        await InternshipModel.updateStatus(internshipId, 'rejected');
        res.json({ success: true, message: 'Internship rejected' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllApplications = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const result = await ApplicationModel.findByStudent(null, page, limit);
        res.json({ success: true, applications: [] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getDashboardStats, getAllStudents, deleteStudent,
    getAllCompanies, deleteCompany, getPendingInternships,
    approveInternship, rejectInternship, getAllApplications
};
