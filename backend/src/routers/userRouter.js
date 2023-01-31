const router = require('express').Router();
const { User } = require('../db/models');

router.get('/', async (req, res) => {
  console.log('get request');
  try {
    let users = await User.findAll({ raw: true})
    res.json(users)
    console.log(users);
  } catch(err) {
    console.log(err);
  }
});

router.post('/register', async (req, res) => {
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
