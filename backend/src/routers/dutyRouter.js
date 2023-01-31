const router = require('express').Router();
const { Duty } = require('../db/models');

//get duties
router.get('/:id', async (req, res) => {
  console.log(req.params);
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

router.post('/:id', async (req, res) => {
  console.log('получили запрос');

  // const { user_tg_id } = req.body
  try {
    const newDuty = await Duty.create({...req.body})
    console.log(newDuty);
    res.status(200).json(newDuty)
  } catch(err) {
    console.log(err);
  }
});

router.delete('/', async (req, res) => {
  console.log('POST request');
  console.log(req.body);
  // const { user_tg_id } = req.body
  try {
    const newUser = await User.create({...req.body})
    console.log(newUser);
    res.status(200).json(newUser)
  } catch(err) {
    console.log(err);
  }
});



module.exports = router
