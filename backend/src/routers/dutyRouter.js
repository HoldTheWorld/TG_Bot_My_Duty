const router = require('express').Router();
const { Duty } = require('../db/models');



router.post('/', async (req, res) => {
  console.log('hello from DUTY');
  console.log('получили POST запрос');
  console.log(req.body);

  // const { user_tg_id } = req.body
  try {
    const newDuty = await Duty.create({...req.body})
    console.log(newDuty);
    res.status(200).json(newDuty)
  } catch(err) {
    console.log(err);
  }
});

//get duties
router.get('/get/:id', async (req, res) => {
  console.log('hello from DUTY');
  console.log('получили GET запрос');

  try {
    let duties = await Duty.findAll({ 
        raw: true,
        where: {
          user_id: req.params.id
        }
      })
    console.log(duties);
    res.json(duties)
  } catch(err) {
    console.log(err);
  }
});


module.exports = router
