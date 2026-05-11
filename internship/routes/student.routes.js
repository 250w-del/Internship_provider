const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getProfile, updateProfile, uploadCV,
    getAvailableInternships, applyForInternship, getMyApplications
} = require('../controllers/student.controller');

router.use(protect);
router.use(authorize('student'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/upload-cv', uploadCV);
router.get('/internships', getAvailableInternships);
router.post('/apply', applyForInternship);
router.get('/applications', getMyApplications);

module.exports = router;
