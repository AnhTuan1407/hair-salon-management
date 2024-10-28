const { where } = require('sequelize');
const db = require('../models/index');
const initialModels = require('../models/initial-models');
const models = initialModels(db);

class ScheduleController {

    //[GET] /api/schedules/findAll
    async showAllSchedules(req, res, next) {
        try {
            const schedules = await models.SCHEDULE.findAll({});
            res.status(200).json(schedules);
        } catch (error) {
            res.status(500).json({ message: "Có lỗi xảy ra!" });
        }
    }

    //[GET] /api/schedules/staff/:id
    async findScheduleByStaffId(req, res, next) {
        try {
            const schedule = await models.SCHEDULE.findOne({
                where: { STAFF_ID: req.params.id },
            })

            res.json(schedule);
        } catch (error) {
            res.status(500).json({ message: "Có lỗi xảy ra!" });
        }
    }

    //[GET] /api/schedules/division
    async showDivisionForm(req, res, next) {
        const staffList = await models.STAFF.findAll({});
        let staffNameList = [];
        for (let staff of staffList) {
            staffNameList.push(staff.dataValues.NAME);
        }
        console.log(staffNameList);


        const shiftList = await models.SHIFT.findAll({});

        res.render('schedule/create', {
            title: "Chia lịch làm việc",
            staffNameList: JSON.stringify(staffNameList),
            shiftList: shiftList,
        });
    }

    //[POST] /api/schedules/division
    async doDivision(req, res, next) {
        try {
            const { staffList, workDate, shiftId } = req.body;
            let staffNameList = staffList.split(',').map(name => name.trim());

            for (let item of staffNameList) {

                if (item != "") {
                    let staff = await models.STAFF.findOne({
                        where: { NAME: item },
                    });

                    if (staff.dataValues.STAFF_ID) {
                        let schedule = await models.SCHEDULE.create({
                            STAFF_ID: staff.dataValues.STAFF_ID,
                            WORK_DATE: workDate,
                            SHIFT_ID: shiftId,
                        })
                    }
                }
            }
            res.status(200).json({ message: "Đã thêm lịch trình mới!" });
        } catch (error) {
            res.status(500).json({ message: "Có lỗi xảy ra!" });
        }
    }
}

module.exports = new ScheduleController();