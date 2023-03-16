const router = require('express').Router();
const { User } = require('../db/models');


router.post('/register', async (req, res) => {
  // const { user_tg_id } = req.body
  try {
    const newUser = await User.create({...req.body})
    // console.log(newUser);
    res.status(200).json(newUser)
  } catch(err) {
    console.log(err);
  }
});

router.post('/settimezone', async (req, res) => {
  try {
    const updUser = await User.update({time_zone: req.body.time_zone}, {
      where: {
        user_tg_id: req.body.user_tg_id
      }
    })
    res.status(200).json(updUser)
  } catch(err) {
    console.log(err);
  }
})

router.get('/:tgId', async (req, res) => {
  console.log('get request');
  try {
    let user = await User.findAll({ 
      raw: true,
      where: {
        user_tg_id: req.params.tgId
      }
    })
    console.log('RESULT get request');
    res.json(user)
    console.log(user);
  } catch(err) {
    console.log(err);
  }
});

module.exports = router
