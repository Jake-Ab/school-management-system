const express = require('express');
const router = express.Router();
const academicController = require('../controllers/academicController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.post('/enroll', academicController.enrollStudent);
router.post('/grade', academicController.recordGrade);
router.get('/report/:id', academicController.getStudentReport); // Requires student's internal DB id
router.get('/report/:id/pdf', academicController.downloadStudentReportPDF);
router.get('/enrollments', academicController.getAllEnrollments);

module.exports = router;