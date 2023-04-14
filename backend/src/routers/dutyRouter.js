const router = require('express').Router();
const { Duty } = require('../db/models');

router.post('/', async (req, res) => {
  try {
    const newDuty = await Duty.create({...req.body})
    console.log(newDuty);
    res.status(200).json(newDuty)
  } catch(err) {
    console.log(err)
    res.status(500)
  }
});

//get duties by user id
router.get('/get/:id', async (req, res) => {
  try {
    let duties = await Duty.findAll({ 
        raw: true,
        where: {
          user_id: req.params.id
        }
      })
    res.status(200).json(duties)
  } catch(err) {
    console.log(err)
    res.status(500)
  }
});

//get one duty by id
router.get('/getOne/:id', async (req, res) => {
  try {
    let duty = await Duty.findAll({ // TODO заменить на один и убрать везде 
        raw: true,
        where: {
          id: req.params.id
        }
      })
    console.log(duty)
    res.status(200).json(duty)
  } catch(err) {
    console.log(err)
    res.status(500)
  }
});

//delete 
router.delete('/delete/:id', async(req, res) => {
  console.log('будем удалять #' + req.params.id);
  console.log(req.params);
  try {
    let result = await Duty.destroy({
      where: {
        id: req.params.id
      }
    })
    if (result > 0) {
      res.status(200)
    } else {
      res.status(400)
    }

  } catch(err) {
    console.log(err)
    res.status(500)
  }
})

module.exports = router
