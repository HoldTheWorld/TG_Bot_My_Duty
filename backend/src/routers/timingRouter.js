const router = require('express').Router();
const { Timing, Duty } = require('../db/models');
const db = require('../db/models/index')


router.post('/start', async (req, res) => {
  console.log('hello from TIMINGS');
  console.log('получили POST запрос TIMINGS');

  try {
    const newTiming = await Timing.create({...req.body})
    console.log(newTiming);
    res.status(200).json(newTiming)
  } catch(err) {
    console.log(err);
  }
});
// https://sequelize.org/docs/v6/other-topics/sub-queries/
//check for not finished tasks by user id 
router.get('/check/:id' , async(req, res) => {
  console.log('проверяем незавершенные задачи ' );
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
              WHERE user_id = 1 )
            AND "Timings".finish IS NULL;
    `, {
      raw: false })
      res.json(result[0])
    // console.log(result[0]);


  //  console.log(req.body);
  //  const result = await Timing.findOne({
  //   where: {
  //     duty_id: {
  //       [Op.in]: req.body,
  //     },
  //     finish: {
  //       [Op.not]: null, 
  //     }
  //   }
  //  })
  } catch(err) {
    console.log(err);
  }
})


module.exports = router
