const express = require('express');
const router = express.Router();
const scheduleController = require('../app/controllers/ScheduleController');

router.get('/findAll', scheduleController.showAllSchedules);
router.get('/division', scheduleController.showDivisionForm);
router.post('/division', scheduleController.doDivision);
router.get('/staff/:id/:date', scheduleController.findScheduleByStaffId);

module.exports = router;