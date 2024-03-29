const router = require('express').Router();
const { User } = require('../db/models');


router.post('/register', async (req, res) => {
  try {
    const newUser = await User.create({...req.body})
   // returns false if the user was already created before
    res.status(200).json(newUser._options.isNewRecord)
  } catch(err) {
    console.log(err);
    res.status(500)
  }
});

router.post('/settimezone', async (req, res) => {
  try {
    const updUser = await User.update({time_zone: req.body.time_zone}, {
      where: {
        user_tg_id: req.body.user_tg_id
      }
    })
    console.log(updUser);
    res.status(200).json(updUser)
  } catch(err) {
    console.log(err);
    res.status(500)
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
    res.status(200).json(user)
    console.log(user);
  } catch(err) {
    console.log(err);
    res.status(500)
  }
});

module.exports = router
