const router = require('express').Router();
const { Timing } = require('../db/models');

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


module.exports = router
