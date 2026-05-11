const express = require('express');
const router = express.Router();
const { registerStudent, registerCompany, login } = require('../controllers/auth.controller');

router.post('/register/student', registerStudent);
router.post('/register/company', registerCompany);
router.post('/login', login);

module.exports = router;
