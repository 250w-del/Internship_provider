const CompanyModel = require('../models/Company.model');
const InternshipModel = require('../models/Internship.model');
const ApplicationModel = require('../models/Application.model');

const getProfile = async (req, res) => {
    try {
        const company = await CompanyModel.findById(req.userId);
        res.json({ success: true, company });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { company_name, phone, location, description } = req.body;
        await CompanyModel.update(req.userId, {
            company_name: company_name || undefined,
            phone: phone || undefined,
            location: location || undefined,
            description: description || undefined
        });
        const updatedCompany = await CompanyModel.findById(req.userId);
        res.json({ success: true, company: updatedCompany });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const postInternship = async (req, res) => {
    try {
        const { title, description, requirements, trade, level_required, location, duration, deadline } = req.body;

        if (!title || !trade || !deadline) {
            return res.status(400).json({ success: false, message: 'Title, trade and deadline are required' });
        }

        const internshipId = await InternshipModel.create({
            company_id: req.userId,
            title,
            description: description || null,
            requirements: requirements || null,
            trade,
            level_required: level_required || 'Any',
            location: location || null,
            duration: duration || null,
            deadline,
            status: 'pending'
        });

        const internship = await InternshipModel.findById(internshipId);
        res.status(201).json({ success: true, internship });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getMyInternships = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await InternshipModel.findByCompany(req.userId, page, limit);
        res.json({ success: true, ...result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getApplicationsForInternship = async (req, res) => {
    try {
        const { internshipId } = req.params;
        const internship = await InternshipModel.findById(internshipId);
        
        if (!internship || internship.company_id !== req.userId) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await ApplicationModel.findByInternship(internshipId, page, limit);
        res.json({ success: true, ...result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;
        
        const result = await ApplicationModel.updateStatus(applicationId, status);
        if (result === 0) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }
        
        res.json({ success: true, message: `Application ${status}` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteInternship = async (req, res) => {
    try {
        const { internshipId } = req.params;
        const internship = await InternshipModel.findById(internshipId);
        
        if (!internship || internship.company_id !== req.userId) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }
        
        await InternshipModel.delete(internshipId);
        res.json({ success: true, message: 'Internship deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getProfile, updateProfile, postInternship, getMyInternships, getApplicationsForInternship, updateApplicationStatus, deleteInternship };