const router = require('express').Router();
const { User } = require('../db/models');

router.get('/', async (req, res) => {
  let users = await User.findAll({ raw: true})
  res.json(users)
  console.log(users);
});

module.exports = router
