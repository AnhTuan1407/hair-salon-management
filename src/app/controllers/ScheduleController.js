const { where } = require('sequelize');
const db = require('../models/index');
const initialModels = require('../models/initial-models');
const models = initialModels(db);
const { Op } = require("sequelize");


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

    //[GET] /api/schedules/staff/:id/:date
    async findScheduleByStaffId(req, res, next) {
        try {
            const { id, date } = req.params;

            // Xác định ngày bắt đầu và kết thúc của tuần
            const currentDate = new Date(date);
            const dayOfWeek = currentDate.getDay();
            const startOfWeek = new Date(date);
            startOfWeek.setDate(currentDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);

            const nextWeek = new Date(endOfWeek);
            nextWeek.setDate(endOfWeek.getDate() + 1);
            const previousWeek = new Date(startOfWeek);
            previousWeek.setDate(startOfWeek.getDate() - 6);

            let weekMap = new Map();
            for (let i = 2; i < 9; i++) {
                const day = new Date(startOfWeek);
                day.setDate(startOfWeek.getDate() + (i - 2));
                if (i == 8) {
                    weekMap.set("Chủ nhật", day.getDate());
                } else {
                    weekMap.set("Thứ " + (i), day.getDate());
                }
            }

            const weekArray = Array.from(weekMap, ([key, value]) => ({ key, value }));
            console.log(weekArray);

            const hours = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

            const scheduleFetch = await models.SCHEDULE.findAll({
                where: {
                    STAFF_ID: id,
                    WORK_DATE: {
                        [Op.between]: [startOfWeek, endOfWeek],
                    }
                }
            });

            const scheduleList = [];

            for (let item of scheduleFetch) {
                let shift = await models.SHIFT.findOne({
                    where: { SHIFT_ID: item.dataValues.SHIFT_ID },
                });

                let objSchedule = {
                    SCHEDULE_ID: item.dataValues.SCHEDULE_ID,
                    STAFF_ID: item.dataValues.STAFF_ID,
                    WORK_DATE: item.dataValues.WORK_DATE,
                    SHIFT: shift.dataValues.NAME,
                    START_TIME: shift.dataValues.START_TIME,
                    END_TIME: shift.dataValues.END_TIME,
                }

                scheduleList.push(objSchedule);
            }

            console.log('>>>>> Schedule list: ', scheduleList);


            res.render('schedule/detail', {
                title: 'Lịch trình nhân viên',
                scheduleList: scheduleList,
                nextWeek: nextWeek,
                previousWeek: previousWeek,
                startOfWeek: startOfWeek,
                endOfWeek: endOfWeek,
                weekArray: weekArray,
                hours: hours,
                staffId: id,
            });

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