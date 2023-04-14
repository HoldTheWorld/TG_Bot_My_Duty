const router = require('express').Router();
const { Timing, Duty } = require('../db/models');
const db = require('../db/models/index')


router.post('/start', async (req, res) => {
  try {
    const newTiming = await Timing.create({...req.body})
    console.log(newTiming);
    res.status(200).json(newTiming)
  } catch(err) {
    console.log(err);
    res.status(500)
  }
});

router.post('/finish', async (req, res) => {
  try {
    const updTiming = await Timing.update({
      finish: req.body.finish
      },
      {
        where: {
          id: req.body.id
        }
      })

    if (updTiming[0] == 1) {
      res.status(200).json(updTiming)
    } else {
      res.status(400).json(updTiming)
    }
  } catch(err) {
    console.log(err);
    res.status(500)
  }
});

//check for not finished tasks by user id 
router.get('/checkact/:id' , async(req, res) => {
  try {
    const result = await db.sequelize.query(`
    SELECT 
    "Timings".id as TimingId,
    "Duties".id as DutyId,
    "Duties".user_id as Userid,
    "Duties".duty_name as DutyName,
    "Timings".start as DutyStart,
    "Timings".finish as DutyFinish
     from "Timings"
      JOIN "Duties" ON 
        "Duties".id = "Timings".duty_id
            WHERE "Timings".duty_id IN (
            SELECT id from "Duties" 
              WHERE user_id = ${req.params.id} )
            AND "Timings".finish IS NULL;
    `, {
      raw: false })
      res.status(200).json(result[0])
  } catch(err) {
    console.log(err);
    res.status(500)
  }
})
//search for duty and timing data by duty id 
router.get('/gettiming/:id' , async(req, res) => {
  try {
    const result = await db.sequelize.query(`
    SELECT 
      "Timings".id as TimingId,
      "Duties".id as DutyId,
      "Duties".user_id as Userid,
      "Duties".duty_name as DutyName,
      "Timings".start as DutyStart,
      "Timings".finish as DutyFinish
      from "Timings"
        JOIN "Duties" ON 
          "Duties".id = "Timings".duty_id
        JOIN "Users" ON
          "Users".id = "Duties".user_id
              WHERE "Users".id = ${req.params.id};
    `, {
      raw: false })
      res.status(200).json(result[0])
  } catch(err) {
    console.log(err);
    res.status(500)
  }
})



module.exports = router
