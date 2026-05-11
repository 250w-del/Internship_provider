const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getDashboardStats, getAllStudents, deleteStudent,
    getAllCompanies, deleteCompany, getPendingInternships,
    approveInternship, rejectInternship, getAllApplications
} = require('../controllers/admin.controller');

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/students', getAllStudents);
router.delete('/students/:studentId', deleteStudent);
router.get('/companies', getAllCompanies);
router.delete('/companies/:companyId', deleteCompany);
router.get('/internships/pending', getPendingInternships);
router.put('/internships/:internshipId/approve', approveInternship);
router.put('/internships/:internshipId/reject', rejectInternship);
router.get('/applications', getAllApplications);

module.exports = router;
