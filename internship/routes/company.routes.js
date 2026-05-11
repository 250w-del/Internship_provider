const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getProfile, updateProfile, postInternship,
    getMyInternships, getApplicationsForInternship,
    updateApplicationStatus, deleteInternship
} = require('../controllers/company.controller');

router.use(protect);
router.use(authorize('company'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/internships', postInternship);
router.get('/internships', getMyInternships);
router.get('/internships/:internshipId/applications', getApplicationsForInternship);
router.put('/applications/:applicationId/status', updateApplicationStatus);
router.delete('/internships/:internshipId', deleteInternship);

module.exports = router;
